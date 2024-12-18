import { Offer } from "@prisma/client"

export type AddOfferErrors = {
    success: boolean,
    errors: {
        company?: string[],
        position?: string[],
        description?: string[],
        expiresAt?: string[],
        priority?: string[],
        source?: string[],
        location?: string[],
        resumeId?: string[]
    } | null    
}

export type DeleteOfferErrors = {
    success: boolean,
    error: string | null
}

export type OfferFrom = Omit<Offer, 'id' | 'dateAdded' | 'dateUpdated' | 'userId' | 'status' | 'user' | 'userId' | 'resume'>