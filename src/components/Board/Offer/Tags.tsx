'use client'

import { Input } from "@/components/ui/input";
import { updateOfferTags } from "@/lib/actions/singleOffer";
import { Loader2, X, Plus } from "lucide-react";
import { startTransition, useActionState, useState, useRef } from "react";


const Tags = ({ tags, offerId }: { tags: string[], offerId: number }) => {
    const [state, formAction, pending] = useActionState(updateOfferTags, { tags: tags, success: false, error: null })
    

    const handleAddTag = (tag: string) => {
        startTransition(() => {
            formAction({ offerId: offerId, tags: [...state.tags, tag] })
        })
    }

    const handleRemoveTag = (tag: string) => {
        startTransition(() => {
            formAction({ offerId: offerId, tags: state.tags.filter((t) => t !== tag) })
        })
    }

    return (
        <div className='flex flex-col gap-2'>
            <span className='text-gray-400 text-sm'>Tags</span>
            <div className='flex flex-wrap items-center gap-2'>
                {state.tags.map((tag) => <Tag key={tag} tag={tag} onRemove={handleRemoveTag} />)}
                <AddTag onAdd={handleAddTag} pending={pending} />
            </div>
        </div>
    )
}

const Tag = ({ tag, onRemove }: { tag: string, onRemove: (tag: string) => void }) => {
    return (
        <div className='bg-gray-700 px-3 py-1 rounded-lg inline-flex items-center text-sm relative group'>
            <span className='pr-1'>{tag}</span>
            <X className='w-4 h-4 p-0.5 cursor-pointer absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity' onClick={() => onRemove(tag)} />
        </div>
    )
}

const AddTag = ({ onAdd, pending }: { onAdd: (tag: string) => void, pending: boolean }) => {
    const [tag, setTag] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const spanRef = useRef<HTMLSpanElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value)
        if (spanRef.current && inputRef.current) {
            spanRef.current.textContent = e.target.value
            inputRef.current.style.width = `${Math.max(90, spanRef.current.scrollWidth + 8)}px`
        }
    }

    const handleAdd = () => {
        onAdd(tag)
        setTag('')
        if (inputRef.current) {
            inputRef.current.style.width = '90px'
        }
    }

    return (
        <div>
            {pending ? <Loader2 className='w-4 h-4 animate-spin' /> : 
            <div className='flex items-center gap-2 relative'>
                <Input 
                    ref={inputRef}
                    className='bg-transparent border-dashed border-gray-600 text-white px-2 py-1 h-auto w-[90px] focus-visible:ring-offset-0 focus-visible:border-white' 
                    value={tag} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown} 
                    placeholder='+ Add tag' 
                />
                <span ref={spanRef} className="opacity-0 absolute -z-10"></span>
                {tag.length > 0 && <Plus className='w-5 h-5 p-0.5 cursor-pointer bg-purple-700 rounded-full absolute -right-6 top-0 bottom-0 my-auto' onClick={handleAdd} />}
            </div>
            }
        </div>
    )
}

export default Tags;