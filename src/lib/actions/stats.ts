'use server'

import { prisma } from "@/lib/prisma"
import { getUserId } from "./auth"
import { OfferStatus } from "@prisma/client"

export const getOfferStats = async () => {
    const userId = await getUserId()
    if (!userId) {
        return {
            success: false,
            error: "Unauthorized"
        }
    }
    try {
        const [savedOffers, sentOffers, interviewOffers, finishedOffers] = await Promise.all([
            prisma.offer.count({
                where: {
                    userId: userId,
                    status: OfferStatus.SAVED
                },
            }),
            prisma.offer.count({
                where: {
                    userId: userId,
                    status: OfferStatus.SENT
                },
            }),
            prisma.offer.count({
                where: {
                    userId: userId,
                    status: OfferStatus.INTERVIEW
                },
            }),
            prisma.offer.count({
                where: {
                    userId: userId,
                    status: OfferStatus.FINISHED
                },
            })
        ])

        return { 
            success: true,
            data: {
                savedOffers,
                sentOffers,
                interviewOffers,
                finishedOffers,
                totalOffers: savedOffers + sentOffers + interviewOffers + finishedOffers
            }
        }
    } catch (error) {
        return { success: false, error: error }
    }
}