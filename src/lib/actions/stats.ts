'use server'

import { prisma } from "@/lib/prisma"
import { FinishedStatus, OfferStatus, File as FileType } from "@prisma/client"
import { StatsResponse, OffersBreakdownStats, ApplicationResponseStats, FinishedStatusStats, FileStats } from "@/lib/types/stats"

export const getOffersBreakdown = async (userId: number): Promise<StatsResponse<OffersBreakdownStats>> => {
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
    } catch {
        return { success: false, error: 'Failed to fetch stats' }
    }
}

export const getApplicationsAndResponses = async (userId: number): Promise<StatsResponse<ApplicationResponseStats>> => {
    try{
        const sentWithoutResponse = await prisma.offer.count({
            where: {
                userId: userId,
                OR: [
                    {
                        status: {
                            in: [OfferStatus.SENT]
                        },
                        finishedStatus: {
                            in: [FinishedStatus.NOT_FINISHED]
                        }
                    },
                    {
                        status: {
                            in: [OfferStatus.FINISHED]
                        },
                        finishedStatus: {
                            in: [FinishedStatus.NO_RESPONSE]
                        }
                    }
                ]
            }
        })
    
        const sentWithResponse = await prisma.offer.count({
            where: {
                userId: userId,
                status: {
                    in: [OfferStatus.INTERVIEW, OfferStatus.FINISHED],
                },
                finishedStatus: {
                    not: FinishedStatus.NO_RESPONSE
                }
            }
        })

        return {
            success: true,
            data: {
                sentWithoutResponse,
                sentWithResponse
            }
        }
    } catch {
        return { success: false, error: 'Failed to fetch stats' }
    }
}

export const getFinishedStatusChart = async (userId: number): Promise<StatsResponse<FinishedStatusStats[]>> => {
    try {
        const finishedStatuses = await prisma.offer.groupBy({
            where: {
                userId: userId,
                status: OfferStatus.FINISHED,
                finishedStatus: {
                    not: FinishedStatus.NOT_FINISHED
                }
            },
            by: ['finishedStatus'],
            _count: {
                finishedStatus: true
            }
        })

        return {
            success: true,
            data: finishedStatuses
        }
    } catch {
        return { success: false, error: 'Failed to fetch stats' }
    }   
}

export const getBestResume = async (userId: number): Promise<StatsResponse<FileStats[]>> => {
    try {
        const responses = await prisma.offer.findMany({
            where: {
                userId: userId,
                status: {
                    in: [OfferStatus.INTERVIEW, OfferStatus.FINISHED],
                },
                finishedStatus: {
                    not: FinishedStatus.NO_RESPONSE
                }
            },
            include: {
                file: true
            },
        })

        const fileStats = responses.reduce((acc, offer) => {
            const fileId = offer.fileId
            if (!fileId) return acc
            
            acc[fileId] = acc[fileId] || {
                count: 0,
                file: offer.file
            }
            acc[fileId].count++
            return acc
        }, {} as Record<number, { count: number, file: FileType }>)

        // Convert to array and sort by count
        const sortedFiles = Object.values(fileStats)
            .sort((a, b) => b.count - a.count)

        return {
            success: true,
            data: sortedFiles
        }
    } catch {
        return { success: false, error: 'Failed to fetch stats' }
    }
}