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
        // Fetch the content from the URL
        const response = await fetch(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return { success: false, error: `Failed to fetch the URL: ${response.statusText}` }
        }

        const htmlContent = await response.text();

        // Use GPT to extract information from the fetched HTML content
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "You are a job offer data extractor. Extract all relevant data from the job posting HTML content provided, including the job title, company name, location, description, requirements. Return the information in structured JSON format, preserving the exact wording from the original job posting without any paraphrasing or summarization. If the content is not a job offer or if the job posting cannot be parsed, return an empty object {}."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": `Extract job offer details from this HTML content: ${htmlContent.substring(0, 100000)}`
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
                            "description": "The requirements for the job in HTML format, on website it could be a list of requirements or a single requirement. Return the requirements in HTML format."
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
            temperature: 0.5,
            max_completion_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          });
          
          if(!gptResponse.choices[0].message.content) {
            return { success: false, error: "Failed to get offer data" }
          }
          const data = JSON.parse(gptResponse.choices[0].message.content)
          await setLastGptUsage(userId)
          return { success: true, data }
    } catch (error) {
        console.error("Error scraping offer data:", error);
        return { success: false, error: "Error scraping offer data" }
    }
}