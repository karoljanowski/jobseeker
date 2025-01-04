import Editor from "@/components/Editor"
import { Button } from "@/components/ui/button"
import { addNote, deleteNote, editNote } from "@/lib/actions/notes"
import { Note as NoteType } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useState, useRef, useEffect, useTransition } from "react"
import { toast } from "react-hot-toast"

interface NotesProps {
    offerId: number
    notes: NoteType[]
}

const Notes = ({ offerId, notes }: NotesProps) => {
    const [notesState, setNotesState] = useState(notes)

    const handleAddNote = (newNote: NoteType) => {
        setNotesState(prev => [newNote, ...prev])
    }

    const handleDeleteNote = (noteId: string) => {
        setNotesState(prev => prev.filter(note => note.id !== noteId))
    }

    const handleEditNote = (updatedNote: NoteType) => {
        setNotesState(prev => prev.map(note => 
            note.id === updatedNote.id ? updatedNote : note
        ))
    }

    return (
        <div className="flex flex-col gap-2 border-t border-neutral-800 pt-4">
            <span className="text-sm text-gray-500">Notes</span>
            <NewNote offerId={offerId} onNoteAdd={handleAddNote} />
            <div className="mt-4 flex flex-col gap-2">
                {notesState.map((note) => (
                    <Note 
                        key={note.id} 
                    note={note} 
                    onNoteDelete={handleDeleteNote}
                    onNoteEdit={handleEditNote}
                    />
                ))}
            </div>
        </div>
    )
}

const Note = ({ 
    note, 
    onNoteDelete, 
    onNoteEdit 
}: { 
    note: NoteType
    onNoteDelete: (id: string) => void
    onNoteEdit: (note: NoteType) => void 
}) => {
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(note.content)

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteNote(note.id)
            if (result.success) {
                onNoteDelete(note.id)
                toast.success('Note deleted')
            } else {
                toast.error(result.error || 'Failed to delete note')
            }
        })
    }

    const handleEdit = () => {
        startTransition(async () => {
            const result = await editNote({ id: note.id, content: editContent })
            if (result.success && result.updatedNote) {
                onNoteEdit(result.updatedNote)
                setIsEditing(false)
                toast.success('Note updated')
            } else {
                toast.error(result.error || 'Failed to update note')
            }
        })
    }

    if (isEditing) {
        return (
            <div className="flex flex-col">
                <Editor content={editContent} onUpdate={setEditContent} />
                <div className="flex gap-2 items-center mt-2">
                    <Button 
                        onClick={() => setIsEditing(false)} 
                        variant="destructive" 
                        className="h-8"
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEdit} 
                        variant="secondary" 
                        className="h-8"
                        disabled={isPending}
                    >
                        Save
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">

            <div className="flex text-sm text-gray-500 gap-2">
                <span>{note.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>{note.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
            </div>

            <div dangerouslySetInnerHTML={{ __html: note.content }} />

            <div className="flex gap-2 mt-2">
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-sm text-blue-500/70 hover:text-blue-500"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className="text-sm text-red-500/70 hover:text-red-500"
                        disabled={isPending}
                    >
                        {isPending ? <span className="flex items-center"><Loader2 className="w-3 h-3 animate-spin" /> Deleting...</span> : 'Delete'}
                    </button>
            </div>
        </div>
    )
}

const NewNote = ({ 
    offerId, 
    onNoteAdd 
}: { 
    offerId: number
    onNoteAdd: (note: NoteType) => void 
}) => {
    const [content, setContent] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isPending, startTransition] = useTransition()
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                setIsTyping(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleCancel = () => {
        setIsTyping(false)
        setContent('')
    }

    const handleSave = () => {
        startTransition(async () => {
            const result = await addNote({ content, offerId })
            if (result.success && result.newNote) {
                onNoteAdd(result.newNote)
                setContent('')
                setIsTyping(false)
                toast.success('Note added')
            } else {
                toast.error(result.error || 'Failed to add note')
            }
        })
    }

    return (
        <div>
            {isTyping ? 
                <div ref={editorRef} className="w-full">
                    <Editor content={content} onUpdate={setContent} />
                    <div className='flex items-center gap-2 mt-2'>
                        <Button 
                            onClick={handleCancel} 
                            variant='destructive' 
                            className='h-7' 
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            variant='secondary' 
                            className='h-7' 
                            disabled={isPending}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            :
                <div 
                    className="cursor-pointer border border-neutral-800 rounded-md p-2 w-full" 
                    onClick={() => setIsTyping(true)}
                >
                    <span className="text-sm text-gray-500">Click to add a note</span>
                </div>
            }
        </div>
    )
}

export default Notes