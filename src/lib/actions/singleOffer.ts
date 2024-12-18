'use server'

import { prisma } from "@/lib/prisma"

export async function getOffer(id: number) {
    try {
        const offer = await prisma.offer.findUnique({
            where: {
                id: id
            }
        })
        return offer
    } catch (error) {
        console.error(error)
        return null
    }
}