"use server"

import { openai } from "@/lib/openai"
import { OfferWithNotes } from "@/lib/types/offer"

type ResumeAnaizeState = {
    success: boolean
    error: string | null
    response: string | null
}

export const resumeAnaize = async (prevState: ResumeAnaizeState, offer: OfferWithNotes) => {
    try {
        
        const { company, position, description, requirements, file } = offer

        if (!file) {
            return {
                success: false,
                error: "No resume file provided",
                response: null
            }
        }

        const resume = await fetch(file.fileUrl)
        if (!resume.ok) {
            return {
                success: false,
                error: "Failed to fetch resume file",
                response: null
            }
        }

        const resumeBlob = await resume.blob()
        const formData = new FormData()
        formData.append('file', new File([resumeBlob], 'resume.pdf', { type: resumeBlob.type }))

        const uploadResponse = await openai.files.create({
            file: formData.get('file') as File,
            purpose: 'assistants'
        })

        const fileId = uploadResponse.id

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a resume assistant, you will analyze the resume and give a score from 0 to 100 for the resume.
                    You will also provide specific suggestions for improvement and highlight areas where the resume aligns well with the job requirements.`
                },
                {
                    role: "user",
                    content: `Please analyze the following resume: ${fileId} in the context of the job description: ${description} and the job requirements: ${requirements}.
                    I am applying for a ${position} position at ${company}.`
                }
            ],
        })

        await openai.files.del(fileId)

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