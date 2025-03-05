"use server"

import { openai } from "@/lib/openai"
import { ScraperResponse } from "@/lib/types/scraper"
import { prisma } from "../prisma"
import puppeteer from 'puppeteer'

export const setLastGptUsage = async (userId: number) => {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            lastGptUsage: new Date()
        }
    })
}

export const getLastGptUsage = async (userId: number) => {
    try {   
        const lastGptUsage = await prisma.user.findUnique({
            where: {
                id: userId
        },
        select: {
                lastGptUsage: true
            }
        })
        return { success: true, lastGptUsage: lastGptUsage?.lastGptUsage }
    } catch {
        return { success: false, error: "Error getting last GPT usage" }
    }
}

export const scrapOfferData = async (link: string, userId: number): Promise<ScraperResponse> => {
    if (!link) {
        return { success: false, error: "No link provided" }
    }

    try {
        // Launch a headless browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        try {
            // Create a new page
            const page = await browser.newPage();
            
            // Set viewport size
            await page.setViewport({ width: 1280, height: 800 });
            
            // Set user agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            // Navigate to the URL with a timeout
            await page.goto(link, { 
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            // Wait for the content to load (using setTimeout instead of waitForTimeout)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Get the page content
            const content = await page.content();
            
            console.log(`Successfully fetched page content, length: ${content.length}`);
            
            // Extract main content to reduce size
            let mainContent = content;
            
            // Try to extract just the main content area if the page is too large
            if (content.length > 100000) {
                // Try to find and extract the main content area
                const mainContentElement = await page.evaluate(() => {
                    // Common selectors for main content
                    const selectors = [
                        'main',
                        'article',
                        '.job-description',
                        '.job-details',
                        '#job-description',
                        '.job-content',
                        '.job-offer',
                        '.offer-details'
                    ];
                    
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            return element.outerHTML;
                        }
                    }
                    
                    // If no specific content area found, return the body content
                    return document.body.outerHTML;
                });
                
                if (mainContentElement) {
                    mainContent = mainContentElement;
                }
            }
            
            // Trim content if still too large
            const maxContentLength = 50000;
            if (mainContent.length > maxContentLength) {
                mainContent = mainContent.substring(0, maxContentLength);
            }
            
            // Close the browser
            await browser.close();
            
            // Use GPT to extract information from the fetched content
            const gptResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        "role": "system",
                        "content": [
                            {
                                "type": "text",
                                "text": "You are a job offer data extractor. Extract the following information from the HTML content provided:\n1. Company name\n2. Job position/title\n3. Location (city or remote status)\n4. Expiration date (if available)\n5. Job requirements\n6. Job description\n\nExtract this information directly from the HTML content without making assumptions or adding information that isn't present. If you can't find certain information, use empty strings for those fields. If the content is not a job posting or cannot be parsed properly, return an empty object {}."
                            }
                        ]
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": `Extract job offer details from this HTML content: ${mainContent}`
                            }
                        ]
                    }
                ],
                response_format: {
                    "type": "json_schema",
                    "json_schema": {
                        "name": "job_offer",
                        "strict": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                            "company": {
                                "type": "string",
                                "description": "The name of the company offering the job."
                            },
                            "position": {
                                "type": "string",
                                "description": "The title or position of the job."
                            },
                            "location": {
                                "type": "string",
                                "description": "The city or if it is remote."
                            },
                            "expiresAt": {
                                "type": "string",
                                "description": "The date when the job offer expires, in ISO format. Use empty string if not found."
                            },
                            "requirements": {
                                "type": "string",
                                "description": "The requirements for the job in HTML format. Use empty string if not found."
                            },
                            "description": {
                                "type": "string",
                                "description": "The job description in HTML format. Use empty string if not found."
                            }
                        },
                        "required": [
                            "company",
                            "position",
                            "location",
                            "expiresAt",
                            "requirements",
                            "description"
                        ],
                        "additionalProperties": false
                    }
                  }
                },
                temperature: 0.2,
                max_completion_tokens: 1000,
                top_p: 1
              });
              
              if(!gptResponse.choices[0].message.content) {
                return { success: false, error: "Failed to get offer data" }
              }
              
              try {
                const data = JSON.parse(gptResponse.choices[0].message.content);
                
                // Validate that we have at least some basic data
                if (!data.company && !data.position) {
                  return { success: false, error: "Could not extract meaningful job data from the page" }
                }
                
                await setLastGptUsage(userId);
                return { success: true, data };
              } catch (parseError) {
                console.error("Error parsing GPT response:", parseError, gptResponse.choices[0].message.content);
                return { success: false, error: "Error parsing job data" }
              }
        } finally {
            // Ensure browser is closed even if an error occurs
            if (browser) {
                await browser.close();
                console.log('Browser closed');
            }
        }
    } catch (error: unknown) {
        console.error("Error scraping offer data:", error);
        
        return { success: false, error: `Error scraping offer data: ${error}` }
    }
}