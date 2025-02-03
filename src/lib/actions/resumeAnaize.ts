'use server'

import { openai } from "@/lib/openai";
import { v2 as cloudinary } from "cloudinary";
import { ResumeAnaize } from "@/lib/types/resumeAnalize";

export const getFileUrl = async (publicId: string) => {
    const file = cloudinary.url(publicId + '.webp', {
        width: 1655,
        height: 2340,
        crop: 'fit'
    });

    return file;
}

export const resumeAnaize = async (fileUrl: string, offerDetails: string) => {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					"role": "system",
					"content": [
						{
							"type": "text",
							"text": "You are a strict CV improvement assistant. Your primary task is to critically analyze CVs and provide detailed, actionable feedback for improvements. Focus on identifying gaps, weaknesses, and areas that need enhancement to meet job requirements. Follow these guidelines:\n\n1. **Critical Gap Analysis**: Identify specific missing skills, experiences, or qualifications required by the job description.\n\n2. **CV Structure and Content**: Thoroughly examine and point out:\n- Unclear or weak descriptions\n- Missing quantifiable achievements\n- Irrelevant information\n- Professional formatting issues\n- Inconsistencies in presentation\n\n3. **Required Improvements**: List specific, mandatory changes needed to meet industry standards and job requirements.\n\n4. **Language and Clarity**: Identify all instances of:\n- Vague or weak language\n- Technical inaccuracies\n- Grammar and spelling errors\n\n5. **Professional Standards**: Evaluate against current industry best practices and highlight deviations.\n\nBe direct and critical. Do not focus on positive aspects or candidate fit. Your goal is to identify everything that needs improvement to meet professional standards and job requirements."
						}
					]
				},
				{
					"role": "user",
					"content": [
						{
							"type": "text",
							"text": `Analyze this CV (${fileUrl}) against these job requirements: ${offerDetails}. Provide a detailed critique focusing ONLY on necessary improvements and gaps that must be addressed.`
						}
					]
				}
			],
			response_format: {
				"type": "json_schema",
				"json_schema": {
					"name": "cv_improvement_analysis",
					"strict": true,
					"schema": {
						"type": "object",
						"properties": {
							"candidate_fit": {
								"type": "object",
								"description": "Critical analysis of gaps between CV and job requirements",
								"properties": {
									"match_percentage": {
										"type": "number",
										"description": "Percentage of required qualifications present in CV"
									},
									"analysis": {
										"type": "string",
										"description": "Critical analysis of missing requirements and qualifications"
									}
								},
								"required": [
									"match_percentage",
									"analysis"
								],
								"additionalProperties": false
							},
							"cv_improvements": {
								"type": "string",
								"description": "Mandatory changes and improvements needed in the CV"
							},
							"suggestions_for_additions": {
								"type": "string",
								"description": "Critical missing elements that must be added to meet job requirements"
							},
							"spelling_and_grammar": {
								"type": "object",
								"description": "Technical writing issues that need correction",
								"properties": {
									"spelling": {
										"type": "boolean",
										"description": "Indicates presence of spelling errors"
									},
									"grammar": {
										"type": "boolean",
										"description": "Indicates presence of grammar errors"
									}
								},
								"required": [
									"spelling",
									"grammar"
								],
								"additionalProperties": false
							},
							"cv_style_assessment": {
								"type": "object",
								"description": "Professional formatting and presentation analysis",
								"properties": {
									"style_analysis": {
										"type": "string",
										"description": "Critical analysis of CV's professional presentation"
									},
									"accepted": {
										"type": "boolean",
										"description": "Indicates if CV meets professional formatting standards"
									}
								},
								"required": [
									"style_analysis",
									"accepted"
								],
								"additionalProperties": false
							}
						},
						"required": [
							"candidate_fit",
							"cv_improvements",
							"suggestions_for_additions",
							"spelling_and_grammar",
							"cv_style_assessment"
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
        
        if(!response.choices[0].message.content) {
            return { success: false, error: "Failed to analyze resume" }
        }

        const data: ResumeAnaize = JSON.parse(response.choices[0].message.content)
        return { error: null, data }
	} catch (error) {
		console.error("Error analyzing resume:", error);
        return { error: error, data: null }
	}
}