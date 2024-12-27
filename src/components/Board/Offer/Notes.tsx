'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addNote } from "@/lib/actions/notes"
import { Loader2, PlusIcon } from "lucide-react"
import { startTransition, useActionState, useState, useEffect, Dispatch, SetStateAction } from "react"
import { toast } from "react-hot-toast"
import { Note as NoteType } from "@prisma/client"


interface NotesProps {
    notes: NoteType[]
    offerId: number
}

const Notes = ({ notes, offerId }: NotesProps) => {
    const [state, dispatch, pending] = useActionState(addNote, {
        notes: notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        success: false,
        error: null
    })

    useEffect(() => {
        if(state.success){
            toast.success('Note added')
        }
    }, [state.success, state.notes])

    return (
        <div>
            <span className='text-neutral-500 text-sm'>Notes</span>
            <NewNote offerId={offerId} dispatch={dispatch} pending={pending} />
            <div className='flex flex-col gap-2 mt-2'>
                {state.notes.map((note, index) => (
                    <Note key={index} note={note} />
                ))}
            </div>
        </div>
    )
}

interface NewNoteProps {
    offerId: number
    dispatch: (data: { content: string, offerId: number }) => void
    pending: boolean
}

const NewNote = ({ offerId, dispatch, pending }: NewNoteProps) => {
    const [content, setContent] = useState('')

    const handleSubmit = () => {

        startTransition(() => {
            dispatch({ content, offerId })
            setContent('')
        })
    }

    return (
        <div className='flex items-center gap-2'>
            <Input 
                value={content}
                onChange={(e) => setContent(e.target.value)} 
                className='w-full bg-neutral-900 border-none focus-visible:ring-offset-0' 
                placeholder='Add a new note' 
            />
            <Button onClick={handleSubmit} disabled={pending} variant='secondary'>
                {pending ? <Loader2 className='animate-spin w-4 h-4' /> : <PlusIcon className='w-4 h-4' />}
            </Button>
        </div>
    )
}

const Note = ({ note }: { note: NoteType }) => {
    return (
        <div className='flex flex-col'>
            <span className='text-neutral-500 text-sm'>{note.createdAt.toLocaleString()}</span>
            <p>{note.content}</p>
        </div>
    )
}

export default Notes