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