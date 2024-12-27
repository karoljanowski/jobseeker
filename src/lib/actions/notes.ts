'use server'

import { prisma } from "@/lib/prisma"

import { Note } from "@prisma/client"

export const addNote = async (prevState: { notes: Note[], success: boolean, error: string | null }, data: { content: string, offerId: number }) => {
    try {
        const newNote = await prisma.note.create({
            data: {
                content: data.content,
                offerId: data.offerId
            }
        })
        return { notes: [newNote, ...prevState.notes], success: true, error: null }
    } catch (error) {
        return { notes: prevState.notes, success: false, error: 'Failed to add note' }
    }
}