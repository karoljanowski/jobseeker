import { Offer, Note } from "@prisma/client"

export type AddOfferForm = {
    success: boolean,
    errors: {
        company?: string[],
        position?: string[],
        description?: string[],
        expiresAt?: string[],
        priority?: string[],
        source?: string[],
        location?: string[],
        resumeId?: string[],
        other?: string
    } | null
}

export type DeleteOfferForm = {
    success: boolean,
    error: string | null
}

export type OfferWithNotes = Offer & {
    notes: Note[]
}

export type OfferFrom = Omit<Offer, 'id' | 'dateAdded' | 'dateUpdated' | 'userId' | 'status' | 'user' | 'userId' | 'resume' | 'notes' | 'tags'>