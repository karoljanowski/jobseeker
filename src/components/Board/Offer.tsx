'use client'
    
import { useSearchParams, useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useState, useEffect } from 'react'
import { Offer as OfferType } from '@prisma/client'
import { getOffer } from '@/app/actions/singleOffer'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const Offer = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const offerId = searchParams?.get('offer')
    const [offer, setOffer] = useState<OfferType | null>(null)

    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            const offer = await getOffer(Number(offerId))
            if(offer){
                setOffer(offer)
            }else{
                router.push('/dashboard')
                toast.error('Offer not found')
                setOpen(false)
            }
            setLoading(false)
        }

        if(offerId){
            setOpen(true)
            getData()
        }
    }, [offerId])

    useEffect(() => {
        if(!open){
            router.push('/dashboard')
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-neutral-950 border-none rounded-xl w-full min-w-[1200px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>
                        Offer Details
                    </DialogTitle>
                </DialogHeader>
                {offer && (
                    <div className='grid grid-cols-[3fr_1fr] gap-4'>
                        <Left offer={offer} />
                        <RightInfo offer={offer} />
                    </div>
                )}  
            </DialogContent>
        </Dialog>
    )
}

const Left = ({ offer }: { offer: OfferType }) => {
    return (
        <div className='flex flex-col gap-2'>
            <Card className='bg-neutral-900 border-none'>
                <CardHeader>
                    <CardTitle>
                        Description
                    </CardTitle>
                </CardHeader>
                <CardContent >
                    {offer.description}
                </CardContent>
            </Card> 
            <Card className='bg-neutral-900 border-none'>
                <CardHeader>
                    <CardTitle>
                        Requirements
                    </CardTitle>
                </CardHeader>
                <CardContent >
                    {offer.requirements}
                </CardContent>
            </Card> 
            <Card className='bg-neutral-900 border-none'>
                <CardHeader>
                    <CardTitle>
                        Notes
                    </CardTitle>
                </CardHeader>
                <CardContent >
                    {offer.notes}
                </CardContent>
            </Card> 
        </div>
    )
}

const RightInfo = ({ offer }: { offer: OfferType }) => {
    return (
        <div className='flex flex-col gap-2 border-l border-neutral-800 pl-4'>
            <RightItem title='Company' value={offer.company} />
            <RightItem title='Position' value={offer.position} />
            <RightItem title='Source' value={offer.source} />
            <RightItem title='Location' value={offer.location} />
            <RightItem title='Date Added' value={offer.dateAdded.toLocaleDateString()} />
            <RightItem title='Expires At' value={offer.expiresAt.toLocaleDateString()} />
        </div>
    )
}

const RightItem = ({ title, value }: { title: string, value: string }) => {
    return (
        <div className='flex flex-col'>
            <span className='text-xs text-neutral-500'>
                {title}
            </span>
            {value}
        </div>
    )
}

export default Offer;