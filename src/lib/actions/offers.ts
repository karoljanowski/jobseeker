'use server'

import { prisma } from '@/lib/prisma'
import { AddOfferForm, DeleteOfferForm, OfferFrom } from '@/lib/types/offer'
import { Offer, OfferStatus } from '@prisma/client'
import { z } from 'zod'
import { getUserId } from './auth'

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
            id: OfferStatus.OPEN,
            title: 'Open',
            offers: offers.filter(offer => offer.status === OfferStatus.OPEN)
        },
        {
            id: OfferStatus.SENDED,
            title: 'Sended',
            offers: offers.filter(offer => offer.status === OfferStatus.SENDED)
        },
        {
            id: OfferStatus.PROCESSING,
            title: 'Processing',
            offers: offers.filter(offer => offer.status === OfferStatus.PROCESSING)
        }
    ]

    return columns
}

export const deleteOffer = async (prevState: DeleteOfferForm, offerId: number) => {
    try {   
        await prisma.offer.delete({
            where: {
                id: offerId
            }
        })
        return { success: true, error: null }
    } catch (error) {
        return { success: false, error: 'Error deleting offer' }
    }
}

const addOfferSchema = z.object({
    company: z.string().refine(value => value.length > 0, { message: 'Company is required' }),
    position: z.string().refine(value => value.length > 0, { message: 'Position is required' }),
    description: z.string().refine(value => value.length > 0, { message: 'Description is required' }),
    expiresAt: z.date().refine(value => value.getTime() > Date.now(), { message: 'Expires at must be in the future' }),
    source: z.string().refine(value => value.length > 0, { message: 'Source is required' }),
    location: z.string().refine(value => value.length > 0, { message: 'Location is required' }),
    resumeId: z.number().nullable(),
    requirements: z.string().nullable()
})

export const addOffer = async (prevState: AddOfferForm, offer: OfferFrom) => {
    const userId = await getUserId()
    if (!userId) {
        return { success: false, errors: { other: 'Unauthorized' } }
    }
    const parsedOffer = addOfferSchema.safeParse(offer)

    if(!parsedOffer.success){
        return { success: false, errors: parsedOffer.error.flatten().fieldErrors }
    }
    const { company, position, description, expiresAt, source, location, resumeId } = parsedOffer.data
    try {
        await prisma.offer.create({
            data: {
                company,
                position,
                description,
                expiresAt,
                source,
                location,
                resumeId,
                userId: userId
            }
        })
        return { success: true, errors: null }
    } catch (error) {
        console.error(error)
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
            data: { status: newStatus }
        })
        return { success: true, errors: null }
    } catch (error) {   
        return { success: false, errors: null }
    }
}