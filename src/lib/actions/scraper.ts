"use server"

import { openai } from "@/lib/openai"
import { load } from "cheerio"
import { ScraperResponse } from "@/lib/types/scraper"

export const getHTMLFromLink = async (link: string) => {
    try {
        const response = await fetch(link)
        if (!response.ok) {
            return { success: false, error: "Failed to get content from link" }
        }
        const html = await response.text()

        const $ = load(html)
        $("script").remove()
        $("style").remove()
        $("iframe").remove()
        $("form").remove()
        $("header").remove()
        $("footer").remove()
        $("nav").remove()
        $("aside").remove()
        $("button").remove()
        $("input").remove()
        $("select").remove()
        $("a").remove()
        $("img").remove()
        $("video").remove()
        $("audio").remove()
        const cleanText = $('body').text().replace(/\s+/g, ' ').trim()
        return { success: true, data: cleanText }
    } catch (error) {
        console.error("Error getting HTML from link:", error);
        return { success: false, error: "Error getting HTML from link" }
    }
}

export const scrapOfferData = async (html: string): Promise<ScraperResponse> => {
    console.log("HTML:", html)

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
          return { success: true, data }
    } catch (error) {
        console.error("Error scraping offer data:", error);
        return { success: false, error: "Error scraping offer data" }
    }


}