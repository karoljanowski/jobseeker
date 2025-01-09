'use client'
import { useEffect, useActionState, startTransition } from "react"
import { updateOfferDate } from '@/lib/actions/singleOffer'
import { toast } from 'react-hot-toast'
import { DatePicker } from '@/components/ui/date-picker'

interface OfferDateItemProps {
    offerId: number
    field: string
    name: string
    value: Date
}


const OfferDateItem = ({ offerId, field, name, value }: OfferDateItemProps) => {
    const [state, dispatch, pending] = useActionState(updateOfferDate, { date: value, success: false, error: null })

    const handleSave = (date: Date) => {
        startTransition(() => {
            dispatch({ offerId: offerId, field: field, value: date })
        })
    }

    useEffect(() => {
        if (state.success) {
            toast.success('Offer updated')
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <div className='flex flex-col gap-1'>
            <span className='text-gray-400 text-sm'>{name}</span>
            <DatePicker date={state.date} setDate={handleSave} pending={pending} />
        </div>
    )
}

export default OfferDateItem