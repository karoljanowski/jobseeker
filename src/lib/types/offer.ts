import { Offer, Note, File } from "@prisma/client"

export type AddOfferFormType = {
    success: boolean,
    errors: {
        company?: string[],
        position?: string[],
        description?: string[],
        expiresAt?: string[],
        priority?: string[],
        source?: string[],
        location?: string[],
        fileId?: string[],
        other?: string
    } | null
}

export type DeleteOfferFormType = {
    success: boolean,
    error: string | null
}

export type OfferWithNotes = Offer & {
    notes: Note[]
    file: File | null
}

export type OfferFrom = Omit<Offer, 'id' | 'dateAdded' | 'dateUpdated' | 'userId' | 'status' | 'user' | 'userId' | 'resume' | 'notes' | 'tags'>