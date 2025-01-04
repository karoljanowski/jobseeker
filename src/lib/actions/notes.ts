'use server'

import { prisma } from "@/lib/prisma"

export const addNote = async (data: { content: string, offerId: number }) => {
    if(data.content.length === 0){
        return { success: false, error: 'Note cannot be empty' }
    }
    
    try {
        const newNote = await prisma.note.create({
            data: {
                content: data.content,
                offerId: data.offerId
            }
        })
        return { success: true, error: null, newNote: newNote }
    } catch (error) {
        return { success: false, error: 'Failed to add note' }
    }
}

export const deleteNote = async (noteId: string) => {
    try {
        await prisma.note.delete({
            where: { id: noteId }
        })
        return { 
            success: true, 
            error: null 
        }
    } catch (error) {
        return { success: false, error: 'Failed to delete note' }
    }
}

export const editNote = async (data: { id: string, content: string }) => {
    try {
        const updatedNote = await prisma.note.update({
            where: { id: data.id },
            data: { content: data.content }
        })
        return {
            updatedNote,
            success: true, 
            error: null 
        }
    } catch (error) {
        return { success: false, error: 'Failed to update note' }
    }
}
