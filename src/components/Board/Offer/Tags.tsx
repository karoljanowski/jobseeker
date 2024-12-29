'use client'

import { Input } from "@/components/ui/input";
import { updateOfferTags } from "@/lib/actions/singleOffer";
import { Loader2, X } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";

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
            <span className='text-neutral-500 text-sm'>Tags</span>
            <div className='flex flex-wrap gap-2'>
                {state.tags.map((tag) => <Tag key={tag} tag={tag} onRemove={handleRemoveTag} />)}
                <AddTag onAdd={handleAddTag} pending={pending} />
            </div>
        </div>
    )
}

const Tag = ({ tag, onRemove }: { tag: string, onRemove: (tag: string) => void }) => {
    return (
        <div className='bg-neutral-800 px-3 py-1 rounded-lg w-fit text-sm relative group'>
            {tag}
            <X className='w-4 h-4 p-0.5 cursor-pointer absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity' onClick={() => onRemove(tag)} />
        </div>
    )
}

const AddTag = ({ onAdd, pending }: { onAdd: (tag: string) => void, pending: boolean }) => {
    const [tag, setTag] = useState('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };

    const handleAdd = () => {
        onAdd(tag)
        setTag('')
    }

    return (
        <div>
            {pending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Input className='bg-transparent border-dashed border-neutral-800 text-white px-2 py-1 h-auto w-32 focus-visible:ring-offset-0 focus-visible:border-white' value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={handleKeyDown} placeholder='+ Add tag' />}
        </div>
    )
}

export default Tags;