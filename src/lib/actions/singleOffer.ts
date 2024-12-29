'use server'

import { prisma } from "@/lib/prisma"
import { OfferStatus, File } from "@prisma/client"


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
        console.error(error)
        return { selectedFile: prevState.selectedFile, success: false, error: 'Failed to update offer file' }
    }
}

export const updateOfferTags = async (prevState: { tags: string[], success: boolean, error: string | null }, data: { offerId: number, tags: string[] }) => {
    try {
        await prisma.offer.update({ where: { id: data.offerId }, data: { tags: data.tags } })
        return { tags: data.tags, success: true, error: null }
    } catch (error) {
        return { tags: prevState.tags, success: false, error: 'Failed to update offer tags' }
    }
}

export const updateOfferField = async (prevState: { value: string, success: boolean, error: string | null }, data: { offerId: number, field: string, value: string }) => {
    try {
        await prisma.offer.update({ where: { id: data.offerId }, data: { [data.field]: data.value } })
        return { value: data.value, success: true, error: null }
    } catch (error) {
        console.error(error)
        return { value: prevState.value, success: false, error: 'Failed to update offer field' }
    }
}