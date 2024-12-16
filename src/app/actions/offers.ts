'use server'

import { prisma } from '@/lib/prisma'
import { AddOfferErrors, DeleteOfferErrors } from '@/lib/types'
import { Offer, OfferStatus } from '@prisma/client'
import { z } from 'zod'

export const getOffers = async () => {
    const offers = await prisma.offer.findMany()    
    const columns = [
        {
            id: OfferStatus.TODO,
            title: 'To Do',
            offers: offers.filter(offer => offer.status === OfferStatus.TODO)
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

export const deleteOffer = async (prevState: DeleteOfferErrors, offerId: number) => {
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
    priority: z.number().min(1).refine(value => value > 0, { message: 'Priority must be greater than 0' }),
    source: z.string().refine(value => value.length > 0, { message: 'Source is required' }),
    location: z.string().refine(value => value.length > 0, { message: 'Location is required' }),
    resumeId: z.number().nullable(),
    notes: z.string().nullable(),
    requirements: z.string().nullable()
})

export const addOffer = async (prevState: AddOfferErrors, offer: z.infer<typeof addOfferSchema>) => {
    const parsedOffer = addOfferSchema.safeParse(offer)

    if(!parsedOffer.success){
        return { success: false, errors: parsedOffer.error.flatten().fieldErrors }
    }
    const { company, position, description, expiresAt, priority, source, location, resumeId } = parsedOffer.data
    try {
        await prisma.offer.create({
            data: {
                company,
                position,
                description,
                expiresAt,
                priority,
                source,
                location,
                resumeId,
                status: OfferStatus.TODO,
                userId: 1
            }
        })
        return { success: true, errors: null }
    } catch (error) {
        return { success: false, errors: null }
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