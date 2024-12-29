'use client'
import { useEffect, useState, useActionState, startTransition } from "react"
import { updateOfferField } from '@/lib/actions/singleOffer'
import { toast } from 'react-hot-toast'
import Editor from '@/components/Editor'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface OfferItemProps {
    offerId: number
    field: string
    name: string
    value: string | number
    editor?: boolean
    date?: boolean
}


const OfferItem = ({ offerId, field, name, value, editor = false, date = false }: OfferItemProps) => {
    const [state, dispatch, pending] = useActionState(updateOfferField, { value: value.toString(), success: false, error: null })
    const [isEditing, setIsEditing] = useState(false)
    const [editedValue, setEditedValue] = useState(value)

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        startTransition(() => {
            dispatch({ offerId: offerId, field: field, value: editedValue.toString() })
        })
        setIsEditing(false)
    }

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setIsEditing(false)
    }

    useEffect(() => {
        if (state.success) {
            toast.success('Offer updated')
        } else if (state.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <div 
            className='flex flex-col editor' 
            onClick={() => setIsEditing(true)}
        >
            <span className='text-neutral-500 text-sm'>{name}</span>
            {isEditing ? (
                <div className='flex items-start flex-col gap-2 w-full'>
                    {editor ? (
                        <Editor content={editedValue.toString()} onUpdate={setEditedValue} />
                    ) : (
                        <Input 
                            value={editedValue} 
                            onChange={(e) => setEditedValue(e.target.value)} 
                            className='bg-transparent border-none text-white' 
                        />
                    )}
                    <div className='flex items-center gap-2'>
                        <Button onClick={handleCancel} variant='destructive' className='h-8' disabled={pending}>Cancel</Button>
                        <Button onClick={handleSave} variant='secondary' className='h-8' disabled={pending}>Save</Button>
                    </div>
                </div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: state.value }} />
            )}
        </div>
    )
}

export default OfferItem