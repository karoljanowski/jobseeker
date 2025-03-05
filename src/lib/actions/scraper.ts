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

export const scrapOfferData = async (htmlContent: string, userId: number): Promise<ScraperResponse> => {
    if (!htmlContent) {
        return { success: false, error: "No HTML content provided" }
    }

    try {

        // Use GPT to extract information from the fetched HTML content
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                "role": "system",
                "content": [
                  {
                    "type": "text",
                    "text": "You are a job offer data extractor. Extract the following information from the HTML content provided:\\n1. Company name\\n2. Job position/title\\n3. Location (city or remote status)\\n4. Expiration date (if available)\\n5. Job requirements\\n6. Job description\\n\\nExtract this information directly from the HTML content without making assumptions or adding information that isn't present. If you can't find certain information, use empty strings for those fields. If the content is not a job posting or cannot be parsed properly, return an empty object {}."
                  }
                ]
              },
              {
                "role": "user",
                "content": htmlContent
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
            temperature: 0.1,
            max_completion_tokens: 2048,
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
    } catch (error) {
        console.error("Error scraping offer data:", error);
        return { success: false, error: "Error scraping offer data" }
    }
}