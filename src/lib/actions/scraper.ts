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
                            "text": "Extract relevant data from provided HTML content. Structure your response in JSON format."
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
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": "{\n  \"company\": \"Sii Polska\",\n  \"position\": \"Bioinformatics Engineer - pharmaceutical industry\",\n  \"location\": \"Warsaw, Gdansk, Wroclaw, Poznan, Krakow, Lodz, Lublin, Katowice, Rzeszów, Częstochowa, Piła, Bydgoszcz, Białystok, Gliwice, Szczecin, Torun\",\n  \"expiresAt\": \"2025-02-15T00:00:00Z\",\n  \"requirements\": \"<ul>\\n<li>Over 4 years of professional experience in R and Python programming, preferably in bioinformatics projects</li>\\n<li>Knowledge of Bash and Linux, as well as relational databases and containerization</li>\\n<li>Good coding practices of Test Driven Development (simultaneous work with other team members on the same code base, code review, and feedback system)</li>\\n<li>Cooperative skills with teams from different backgrounds, e.g. tech - non-tech, backend - frontend</li>\\n<li>Communicate freely in Polish and English</li>\\n<li>Residing in Poland required</li>\\n</ul>\\n<p><strong>Nice-to-have requirements</strong></p>\\n<ul><li>Biological (or related) educational background</li></ul>\",\n  \"description\": \"<p>Join our team working on projects of one of the largest pharmaceutical companies in the world and have a real impact on the lives and health of more than 15 million patients!</p>\\n<p>Take part in building a custom portal that will enable scientists to integrate the next generation of scientific insights.</p>\\n<p><strong>Your tasks</strong></p>\\n<ul>\\n<li>Developing science pipelines using R and Python technologies</li>\\n<li>Designing algorithms in close collaboration with stakeholders or adopting and creating stakeholder algorithms</li>\\n<li>Providing code reviews for other team members</li>\\n<li>Participating in cross-team, internal, or business meetings, gathering requirements from stakeholders and other teams</li>\\n<li>Performing analysis related to genomics or other biological data</li>\\n</ul>\"\n}"
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