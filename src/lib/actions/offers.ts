'use server'

import { prisma } from '@/lib/prisma'
import { AddOfferFormType, OfferFrom } from '@/lib/types/offer'
import { OfferStatus } from '@prisma/client'
import { z } from 'zod'
import { getUserId } from '../auth/authActions'

export const getOffers = async () => {
    const userId = await getUserId()
    if (!userId) {
        return []
    }
    const offers = await prisma.offer.findMany({
        where: {
            userId: userId
        }
    })    
    const columns = [
        {
            id: OfferStatus.SAVED,
            title: 'Saved',
            offers: offers.filter(offer => offer.status === OfferStatus.SAVED)
        },
        {
            id: OfferStatus.SENT,
            title: 'Sent',
            offers: offers.filter(offer => offer.status === OfferStatus.SENT)
        },
        {
            id: OfferStatus.INTERVIEW,
            title: 'Interview',
            offers: offers.filter(offer => offer.status === OfferStatus.INTERVIEW)
        },
        {
            id: OfferStatus.FINISHED,
            title: 'Finished',
            offers: offers.filter(offer => offer.status === OfferStatus.FINISHED)
        }
    ]

    return columns
}

const addOfferSchema = z.object({
    company: z.string().refine(value => value.length > 0, { message: 'Company is required' }),
    position: z.string().refine(value => value.length > 0, { message: 'Position is required' }),
    expiresAt: z.date().refine(value => value.getTime() > Date.now(), { message: 'Expires at must be in the future' }),
    source: z.string().refine(value => value.length > 0, { message: 'Source is required' }),
    location: z.string().refine(value => value.length > 0, { message: 'Location is required' }),
    file: z.object({
        id: z.number()
    }).nullable().optional(),
    requirements: z.string().optional(),
    description: z.string().optional(),
})

export const addOffer = async (prevState: AddOfferFormType, offer: OfferFrom) => {
    const userId = await getUserId()
    if (!userId) {
        return { success: false, errors: { other: 'Unauthorized' } }
    }
    const parsedOffer = addOfferSchema.safeParse(offer)

    if(!parsedOffer.success){
        return { success: false, errors: parsedOffer.error.flatten().fieldErrors }
    }
    const { company, position, description, expiresAt, source, location, file, requirements } = parsedOffer.data
    try {
        await prisma.offer.create({
            data: {
                company,
                position,
                description,
                requirements,
                expiresAt,
                source,
                location,
                fileId: file?.id,
                userId: userId
            }
        })
        return { success: true, errors: null }
    } catch (error) {
        console.error("Add offer error:", error);
        return { success: false, errors: { other: 'Error adding offer' } }
    }
}

const updateOfferStatusSchema = z.object({
    offerId: z.number().refine(value => value > 0, { message: 'Offer id is required' }),
    newStatus: z.nativeEnum(OfferStatus)
})

export const updateOfferStatus = async (offerId: number, newStatus: OfferStatus) => {
    const parsedOffer = updateOfferStatusSchema.safeParse({ offerId, newStatus })
    if(!parsedOffer.success){
        return { success: false, errors: parsedOffer.error.flatten().fieldErrors }
    }

    try {
        await prisma.offer.update({
            where: {  
                id: offerId
            },
            data: { 
                status: newStatus,
                ...(newStatus !== OfferStatus.FINISHED ? { finishedStatus: 'NOT_FINISHED' } : {})
            }
        })
        return { success: true, errors: null }
    } catch (error) {   
        console.error("Update offer status error:", error);
        return { success: false, errors: null }
    }
}