'use server'

import { prisma } from "@/lib/prisma"
import { OfferStatus } from "@prisma/client"

export async function getOffer(id: number) {
    try {
        const offer = await prisma.offer.findUnique({
            where: {
                id: id
            },
            include: {
                notes: true
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