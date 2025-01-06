'use client'
    
import { useSearchParams, useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { useState, useEffect } from 'react'
import { getOffer } from '@/lib/actions/singleOffer'
import { toast } from 'react-hot-toast'
import Offer from './Offer'
import { Loader, Loader2 } from 'lucide-react'
import { OfferWithNotes } from '@/lib/types/offer'

const OfferDialog = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()
    const offerId = searchParams?.get('offer')
    const [offer, setOffer] = useState<OfferWithNotes | null>(null)

    const getData = async () => {
        setLoading(true)
        const offer = await getOffer(Number(offerId))
        if(offer){
            setOffer(offer)
        }
        setLoading(false)
    }

    useEffect(() => {
        if(offerId){
            setOpen(true)
            getData()
        } else {
            setOpen(false)
        }
    }, [offerId])

    const handleClose = () => {
        setOpen(false)
        router.push('/dashboard')
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='bg-gray-900 border-gray-800 w-full max-w-[1400px] overflow-y-auto h-[90vh] max-h-[800px] flex flex-col focus-visible:outline-none'>
                <DialogHeader>
                    <DialogTitle>Offer Details</DialogTitle>
                </DialogHeader>
                <div className='flex h-full justify-center items-center'>
                    {
                        !loading && offer ? <Offer offer={offer} /> : <Loader2 className='animate-spin w-5 h-5' />
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OfferDialog