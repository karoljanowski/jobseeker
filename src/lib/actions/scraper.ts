"use server"

import { openai } from "@/lib/openai"
import { load } from "cheerio"
import { ScraperResponse } from "@/lib/types/scraper"
import { prisma } from "../prisma"
import axios from 'axios'

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

export const getCleanHTMLFromLink = async (link: string) => {
    try {
        const response = await axios.get(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        if (response.status !== 200) {
            console.error("Failed to fetch content from link:", response.status, response.statusText);
            return { success: false, error: "Failed to get content from link" };
        }

        const $ = load(response.data);

        // Remove unwanted elements
        $('script, style, iframe, form, header, footer, nav, aside, button, input, select, a, img, video, audio').remove();

        // Get the cleaned HTML
        const cleanHTML = $.html();

        return { success: true, data: cleanHTML };
    } catch (error) {
        console.error("Error fetching and cleaning HTML from link:", error instanceof Error ? error.message : "Unknown error");
        return { success: false, error: "Failed to get content from link" };
    }
}

// export const getFullHTMLFromLink = async (link: string) => {
//     try {
//         const browser = await puppeteer.launch({
//             args: ['--no-sandbox', '--disable-setuid-sandbox'],
//         });
//         const page = await browser.newPage();
//         await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
//         await page.goto(link, { waitUntil: 'networkidle2' });

//         const html = await page.content();
//         await browser.close();

//         return { success: true, data: html };
//     } catch (error) {
//         console.error("Error fetching full HTML from link using Puppeteer:", error instanceof Error ? error.message : "Unknown error");
//         return { success: false, error: "Failed to get full content from link" };
//     }
// }

export const scrapOfferData = async (html: string, userId: number): Promise<ScraperResponse> => {
    if (!html) {
        return { success: false, error: "Failed to get content from link" }
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "Extract relevant data from provided HTML content. Structure your response in JSON format. If HTML is not an offer, return an empty object."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": html
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
                            "description": "The date when the job offer expires, in ISO format."
                        },
                        "requirements": {
                            "type": "string",
                            "description": "The requirements for the job in HTML format."
                        },
                        "description": {
                            "type": "string",
                            "description": "The job description in HTML format."
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
            temperature: 1,
            max_completion_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          });
          if(!response.choices[0].message.content) {
            return { success: false, error: "Failed to get offer data" }
          }
          const data = JSON.parse(response.choices[0].message.content)
          await setLastGptUsage(userId)
          return { success: true, data }
    } catch {
        return { success: false, error: "Error scraping offer data" }
    }


}