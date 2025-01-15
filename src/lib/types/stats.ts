import { FinishedStatus, File } from "@prisma/client"

export interface OffersBreakdownStats {
    savedOffers: number
    sentOffers: number
    interviewOffers: number
    finishedOffers: number
    totalOffers: number
}

export interface ApplicationResponseStats {
    sentWithoutResponse: number
    sentWithResponse: number
}

export interface FinishedStatusStats {
    finishedStatus: FinishedStatus
    _count: {
        finishedStatus: number
    }
}

export interface FileStats {
    count: number
    file: File
}

export interface StatsResponse<T> {
    success: boolean
    data?: T
    error?: string
} 