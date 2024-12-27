'use client'

import { OfferStatus as OfferStatusType } from '@prisma/client'
import Notes from './Notes'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useActionState, useEffect, startTransition, useState } from 'react'
import { updateOfferStatus } from '@/lib/actions/singleOffer'
import { toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { OfferWithNotes } from '@/lib/types/offer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const Offer = ({ offer }: { offer: OfferWithNotes }) => {
    return (
        <div className='grid grid-cols-[66%_33%] h-full w-full gap-4'>
            <MainInfo offer={offer} />
            <div className='border-l border-neutral-800 pl-4'>
                <ColumnInfo offer={offer} />
            </div>
        </div>
    )
}

const MainInfo = ({ offer }: { offer: OfferWithNotes }) => {
    const { company, position, description, requirements, notes } = offer
    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-2'>
                <OfferItem name='Company' value={company} />
                <OfferItem name='Position' value={position} />
            </div>
            <OfferItem name='Description' value={description} />
            <OfferItem name='Requirements' value={requirements || ''} />
            <Notes notes={notes} offerId={offer.id} />
        </div>
    )
}

const ColumnInfo = ({ offer }: { offer: OfferWithNotes }) => {
    const { source, status, expiresAt, dateAdded, resumeId } = offer
    return (
        <div className='flex flex-col gap-2'>
            {/* TODO: Configure source to show source name */}
            <OfferStatus status={status} offerId={offer.id} />
            <OfferItem name='Source' value={source.slice(5, 20)} />
            <OfferItem name='Expires At' value={expiresAt.toLocaleDateString()} />
            <OfferItem name='Date Added' value={dateAdded.toLocaleDateString()} />
            <OfferItem name='Resume' value={resumeId} />
        </div>
    )
}

const OfferItem = ({ name, value }: { name: string, value: string | number | null }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editedValue, setEditedValue] = useState(value)

    const handleSave = () => {
        setIsEditing(false)
    }

    return (
        <div className='flex flex-col' onClick={() => setIsEditing(true)}>
            <span className='text-neutral-500 text-sm'>{name}</span>
            {isEditing ? (
                <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                    <Input value={editedValue} onChange={(e) => setEditedValue(e.target.value)} className='bg-transparent border-none text-white' />
                    <div className="flex">
                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            ) : (
                <p>{value}</p>
            )}
        </div>
    )
}

const OfferStatus = ({ status, offerId }: { status: OfferStatusType, offerId: number }) => {
    const [state, dispatch, pending] = useActionState(updateOfferStatus, {
        status: status,
        success: false,
        error: null
    })

    console.log(state)

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
            <SelectTrigger className='bg-neutral-900 border-none focus:ring-offset-0'>
                {pending ? 
                    <div className='flex items-center gap-2'>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        Updating...
                    </div>
                    : state.status.charAt(0).toUpperCase() + state.status.slice(1).toLowerCase()
                }
            </SelectTrigger>
            <SelectContent className='bg-neutral-900 border-none text-white'>
                <SelectItem value='OPEN'>Open</SelectItem>
                <SelectItem value='SENDED'>Sended</SelectItem>
                <SelectItem value='PROCESSING'>Processing</SelectItem>
                <SelectItem value='FINISHED'>Finished</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default Offer;