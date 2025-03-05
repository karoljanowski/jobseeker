"use server"

import { openai } from "@/lib/openai"
import { ScraperResponse } from "@/lib/types/scraper"
import { prisma } from "../prisma"

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
        // Fetch the content from the URL with a shorter timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        console.log(`Attempting to fetch: ${link}`);
        
        const response = await fetch(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache'
            },
            signal: controller.signal,
            redirect: 'follow',
            cache: 'no-store',
            next: { revalidate: 0 }
        });
        
        clearTimeout(timeoutId);
        
        console.log(`Fetch response status: ${response.status}`);

        if (!response.ok) {
            return { success: false, error: `Failed to fetch the URL: ${response.status} ${response.statusText}` }
        }

        // Get only a portion of the HTML to avoid processing too much data
        let htmlContent = await response.text();
        console.log(`Fetched HTML length: ${htmlContent.length}`);
        
        // Trim the HTML to a reasonable size
        const maxHtmlLength = 40000; // Reduce size to avoid timeouts
        if (htmlContent.length > maxHtmlLength) {
            // Try to find the main content area
            const bodyStartIndex = htmlContent.indexOf('<body');
            const bodyEndIndex = htmlContent.lastIndexOf('</body>');
            
            if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
                htmlContent = htmlContent.substring(bodyStartIndex, bodyEndIndex + 7);
            } else {
                htmlContent = htmlContent.substring(0, maxHtmlLength);
            }
            
            console.log(`Trimmed HTML to length: ${htmlContent.length}`);
        }
        
        if (!htmlContent || htmlContent.length < 100) {
            return { success: false, error: "Retrieved HTML content is too small or empty" }
        }

        // Use a more focused prompt with a smaller content size
        console.log('Sending request to GPT');
        const startTime = Date.now();
        
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "You are a job offer data extractor. Extract only the following information from the HTML content:\n1. Company name\n2. Job position/title\n3. Location\n4. Expiration date (if available)\n5. Job requirements\n6. Job description\n\nExtract only what you can find in the HTML. Do not make up or infer missing information. Use empty strings for fields you cannot find."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Extract job offer details from this HTML: ${htmlContent}`
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
          
          const endTime = Date.now();
          console.log(`GPT processing time: ${endTime - startTime}ms`);
          
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
    } catch (error: any) {
        console.error("Error scraping offer data:", error);
        
        // Provide more specific error messages
        if (error.name === 'AbortError') {
            return { success: false, error: "Request timed out while fetching the job posting" }
        }
        
        if (error.message && error.message.includes('CORS')) {
            return { success: false, error: "CORS policy prevented accessing the job posting" }
        }
        
        if (error.message && error.message.includes('timeout')) {
            return { success: false, error: "Operation timed out - the job posting may be too large to process" }
        }
        
        return { success: false, error: `Error scraping offer data: ${error.message || 'Unknown error'}` }
    }
}