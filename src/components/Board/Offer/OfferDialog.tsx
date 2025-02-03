'use client'
    
import { useSearchParams, useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { useState, useEffect, useCallback } from 'react'
import { getOffer } from '@/lib/actions/singleOffer'
import Offer from './Offer'
import { Loader2 } from 'lucide-react'
import { OfferWithNotesFiles } from '@/lib/types/offer'

const OfferDialog = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const offerId = searchParams?.get('offer')
    const [offer, setOffer] = useState<OfferWithNotesFiles | null>(null)

    const getData = useCallback(async () => {
        setLoading(true)
        const offer = await getOffer(Number(offerId))
        if(offer){
            setOffer(offer)
        }
        setLoading(false)
    }, [offerId])

    useEffect(() => {
        if(offerId){
            setOpen(true)
            getData()
        } else {
            setOpen(false)
        }
    }, [offerId, getData])

    const handleClose = () => {
        setOpen(false)
        router.push('/dashboard')
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='bg-gray-900 border-gray-800 max-w-[1400px] overflow-y-auto h-[90dvh] max-h-[800px] flex flex-col focus-visible:outline-none'>
                <DialogHeader>
                    <DialogTitle>Offer Details</DialogTitle>
                </DialogHeader>
                <div className='flex h-full justify-center w-full'>
                    {
                        !loading && offer ? <Offer offer={offer} /> : 
                        <div className='flex h-full justify-center items-center'>
                            <Loader2 className='animate-spin w-5 h-5' />
                        </div>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OfferDialog