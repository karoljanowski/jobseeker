'use server'

import { prisma } from "@/lib/prisma"
import { getUserId } from "./auth"
import { OfferStatus } from "@prisma/client"

export const getStats = async () => {
    const userId = await getUserId()
    if (!userId) {
        return []
    }
    try {
        const openOffers = await prisma.offer.count({
            where: {
                userId: userId,
                status: OfferStatus.OPEN
            },
            // JAK CO TO NIE SKONCZONE
        })
        return { openOffers }
    } catch (error) {
        return { success: false, error: error }
    }
}