"use server"

import { openai } from "@/lib/openai"
import { OfferWithNotes } from "@/lib/types/offer"
import { cloudinary } from "../cloudinary"

export const resumeAnaize = async (offer: OfferWithNotes) => {
    try {
        
        const { company, position, description, requirements, file } = offer

        if (!file) {
            return {
                success: false,
                error: "No resume file provided",
                response: null
            }
        }

        const resumeURL = cloudinary.url(file.publicId + '.png', {
            width: 1920,
            height: 1080,
            crop: 'fit'
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a professional recruiter and career advisor. Your task is to analyze the provided job description, job requirements, and resume in detail. 
                    You should:
                    1. Identify key skills, qualifications, and experiences required for the job.
                    2. Evaluate how well the resume matches the job requirements.
                    3. Highlight strengths in the resume that align with the job description.
                    4. Identify gaps or weaknesses and provide specific suggestions for improvement.
                    5. Recommend how to tailor the resume and cover letter to increase the chances of getting an interview.
                    6. Offer advice on emphasizing relevant experiences, skills, and achievements.
                    7. Suggest specific keywords to include in the resume to pass Applicant Tracking Systems (ATS).
                    Your analysis should be structured, clear, and actionable.
                    You should return the analysis in HTML format ready to be displayed in a web page wihout <style> or <html> <body> tags. Only content.`
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Please analyze my resume in the context of the job description: ${description} and the job requirements: ${requirements}. I am applying for a ${position} position at ${company}.`
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: resumeURL
                            }
                        }
                    ]
                }
            ],
            temperature: 0.1,
            max_completion_tokens: 4096,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        })
        

        return {
            success: true,
            response: response.choices[0].message.content,
            error: null
        }
    } catch (error) {
        console.error("Resume analysis error:", error)
        return {
            success: false,
            error: "An unknown error occurred",
            response: null
        }
    }
}