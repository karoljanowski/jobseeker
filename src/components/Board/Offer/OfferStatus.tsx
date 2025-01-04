import { useActionState, useEffect, startTransition } from 'react'
import { updateOfferStatus } from '@/lib/actions/singleOffer'
import { OfferStatus as OfferStatusType } from '@prisma/client'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'


const OfferStatus = ({ status, offerId }: { status: OfferStatusType, offerId: number }) => {
    const [state, dispatch, pending] = useActionState(updateOfferStatus, {
        status: status,
        success: false,
        error: null
    })

    const handleChange = (value: OfferStatusType) => {
        const data = {
            id: offerId,
            status: value
        }

        startTransition(() => {
            dispatch(data)
        })
    }

    useEffect(() => {
        if(state.success){
            toast.success('Offer status updated')
        }
    }, [state.success])

    return (
        <Select value={state.status} onValueChange={handleChange}>
            <SelectTrigger className='bg-neutral-900 hover:bg-neutral-800 transition-colors border-none focus:ring-offset-0'>
                {pending ? 
                    <div className='flex items-center gap-2'>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Updating...
                    </div>
                    : state.status.charAt(0).toUpperCase() + state.status.slice(1).toLowerCase()
                }
            </SelectTrigger>
            <SelectContent className='bg-neutral-900 border-none text-white'>
                <SelectItem className="cursor-pointer hover:bg-neutral-800 transition-colors" value='OPEN'>Open</SelectItem>
                <SelectItem className="cursor-pointer hover:bg-neutral-800 transition-colors" value='SENDED'>Sended</SelectItem>
                <SelectItem className="cursor-pointer hover:bg-neutral-800 transition-colors" value='PROCESSING'>Processing</SelectItem>
                <SelectItem className="cursor-pointer hover:bg-neutral-800 transition-colors" value='FINISHED'>Finished</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default OfferStatus