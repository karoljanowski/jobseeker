'use client'
import { startTransition, useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileIcon } from "lucide-react"
import Files from "@/components/Files/Files"
import { getFiles } from "@/lib/actions/files"
import { updateOfferFile } from "@/lib/actions/singleOffer"
import { toast } from "react-hot-toast"
import { File as FileType } from "@prisma/client"

const ResumeSelect = ({ selectedFile, offerId }: { selectedFile: FileType | null, offerId: number }) => {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<FileType[]>([])
    const [state, formAction, pending] = useActionState(updateOfferFile, { selectedFile: selectedFile, success: false, error: null })

    useEffect(() => {
        const fetchFiles = async () => {
            const files = await getFiles()
            if (files.success && files.files) {
                setFiles(files.files)
            }
        }
        if (open) {
            fetchFiles()
        }
    }, [open])

    useEffect(() => {
        if(state.success) {
            toast.success('Resume selected')
        }else if(state.error) {
            toast.error(state.error)
        }
    }, [state.success, state.error, state.selectedFile])

    const handleSelect = (file: FileType) => {
        startTransition(() => {
            const data = { offerId, file: file }
            formAction(data)
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <span className='text-gray-400 text-sm'>Resume</span>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {pending ? <div>Loading...</div> : state.selectedFile ?
                     <div className='flex items-center gap-2'><FileIcon className='w-4 h-4' />{state.selectedFile.publicId}</div> 
                     : <div className='flex items-center gap-2'><FileIcon className='w-4 h-4' />Select resume</div>}
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-gray-900 border-gray-800 w-full max-w-[1000px] max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Select resume</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    <Files files={files} onSelect={handleSelect} dialogMode={true} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ResumeSelect