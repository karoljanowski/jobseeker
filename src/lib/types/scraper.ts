export type ScraperResponse = {
    success: boolean
    error?: string
    data?: {
        company: string
        position: string
        location: string
        expiresAt: string
        description: string
        requirements: string
    }
}