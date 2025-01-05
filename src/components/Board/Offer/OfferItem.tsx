'use client'
import { useEffect, useState, useActionState, startTransition, useRef } from "react"
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
}


const OfferItem = ({ offerId, field, name, value, editor = false }: OfferItemProps) => {
    const [state, dispatch, pending] = useActionState(updateOfferField, { value: value.toString(), success: false, error: null })
    const [isEditing, setIsEditing] = useState(false)
    const [editedValue, setEditedValue] = useState(value)
    const itemRef = useRef<HTMLDivElement>(null)

    const handleSave = () => {
        startTransition(() => {
            dispatch({ offerId: offerId, field: field, value: editedValue.toString() })
        })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedValue(state.value)
    }

    useEffect(() => {
        if (state.success) {
            toast.success('Offer updated')
            setIsEditing(false)
        } else if (state.error) {
            toast.error(state.error)
            setIsEditing(true)
        }
    }, [state])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
                handleCancel()
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
      }, [])

    return (
        <div 
            className='flex flex-col editor' 
            onClick={() => setIsEditing(true)}
            ref={itemRef}
        >
            <span className='text-neutral-500 text-sm'>{name}</span>
            {isEditing ? (
                <div className='flex items-start flex-col gap-2 w-full'>
                    {editor ? (
                        <Editor content={editedValue.toString()} onUpdate={setEditedValue} onCancel={handleCancel} onSave={handleSave} disabled={pending} />
                    ) : (
                        <div className='flex flex-col gap-2 w-full'>
                            <Input 
                                value={editedValue} 
                                onChange={(e) => setEditedValue(e.target.value)} 
                                className='bg-neutral-900 w-full border-none text-white h-8' 
                            />
                            <div className="flex items-center gap-2">
                                <Button variant="secondary" disabled={pending} className='h-7' onClick={handleSave}>Save</Button>
                                <Button variant="ghost" disabled={pending} className='h-7 hover:bg-red-500 hover:text-white' onClick={(e) => {e.stopPropagation(); handleCancel()}}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: state.value }} />
            )}
        </div>
    )
}

export default OfferItem