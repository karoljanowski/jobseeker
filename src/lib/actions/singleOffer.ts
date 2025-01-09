'use server'

import { prisma } from "@/lib/prisma"
import { OfferStatus, File } from "@prisma/client"
import { DeleteOfferFormType } from "../types/offer"


export async function getOffer(id: number) {
    try {
        const offer = await prisma.offer.findUnique({
            where: {
                id: id
            },
            include: {
                notes: true,
                file: true
            }
        })
        return offer
    } catch (error) {
        console.error(error)
        return null
    }
}

export const updateOfferStatus = async (prevState: { status: OfferStatus, success: boolean, error: string | null }, data: { id: number, status: OfferStatus }) => {
    try {
        await prisma.offer.update({
            where: { id: data.id },
            data: { status: data.status }
        })
        return { status: data.status, success: true, error: null }
    } catch (error) {
        console.error("Update offer status error:", error);
        return { status: prevState.status, success: false, error: 'Failed to update offer status' }
    }
}

export const updateOfferFile = async (prevState: { selectedFile: File | null, success: boolean, error: string | null }, data: { offerId: number, file: File }) => {
    if(!data.file) {
        return { selectedFile: prevState.selectedFile, success: false, error: 'No file selected' }
    }

    try {
        await prisma.offer.update({
            where: { id: data.offerId },
            data: { fileId: data.file.id }
        })
        return { selectedFile: data.file ? data.file : null, success: true, error: null }
    } catch (error) {
        console.error("Update offer file error:", error);
        return { selectedFile: prevState.selectedFile, success: false, error: 'Failed to update offer file' }
    }
}

export const updateOfferTags = async (prevState: { tags: string[], success: boolean, error: string | null }, data: { offerId: number, tags: string[] }) => {
    try {
        await prisma.offer.update({ where: { id: data.offerId }, data: { tags: data.tags } })
        return { tags: data.tags, success: true, error: null }
    } catch (error) {
        console.error("Update offer tags error:", error);
        return { tags: prevState.tags, success: false, error: 'Failed to update offer tags' }
    }
}

export const updateOfferField = async (prevState: { value: string, success: boolean, error: string | null }, data: { offerId: number, field: string, value: string }) => {
    try {
        await prisma.offer.update({ where: { id: data.offerId }, data: { [data.field]: data.value } })
        return { value: data.value, success: true, error: null }
    } catch (error) {
        console.error("Update offer field error:", error);
        return { value: prevState.value, success: false, error: 'Failed to update offer field' }
    }
}

export const updateOfferDate = async (prevState: { date: Date, success: boolean, error: string | null }, data: { offerId: number, field: string, value: Date }) => {
    try {
        await prisma.offer.update({ where: { id: data.offerId }, data: { [data.field]: data.value } })
        return { date: data.value, success: true, error: null }
    } catch (error) {
        console.error("Update offer date error:", error);
        return { date: prevState.date, success: false, error: 'Failed to update offer date' }
    }
}

export const updateOfferColor = async (prevState: { color: string, success: boolean, error: string | null }, data: { offerId: number, color: string }) => {
    try {
        await prisma.offer.update({ where: { id: data.offerId }, data: { accentColor: data.color } })
        return { color: data.color, success: true, error: null }
    } catch (error) {
        console.error("Update offer color error:", error);
        return { color: prevState.color, success: false, error: 'Failed to update offer color' }
    }
}

export const deleteOffer = async (prevState: DeleteOfferFormType, data: { offerId: number }) => {
    try {   
        await prisma.note.deleteMany({
            where: {
                offerId: data.offerId
            }
        })
        await prisma.offer.delete({
            where: {
                id: data.offerId
            }
        })
        return { success: true, error: null }
    } catch (error) {
        console.error("Delete offer error:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Error deleting offer' }
    }
}