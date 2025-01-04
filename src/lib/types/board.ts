import { Offer } from "@prisma/client"

export type Column = {
    id: string
    title: string
    offers: Offer[]
}