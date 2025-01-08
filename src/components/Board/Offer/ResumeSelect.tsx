'use client'
import { File as FileType } from "@prisma/client"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileIcon } from "lucide-react"
import { useState, useEffect } from "react"
import Files from "@/components/Files/Files"
import { getFiles } from "@/lib/actions/files"

interface ResumeItemProps {
    selectedFile: FileType | null
    handleSelect: (file: FileType) => void
    pending?: boolean
}

const ResumeItem = ({ selectedFile, handleSelect, pending=false }: ResumeItemProps) => {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<FileType[]>([])

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

    const onSelect = (file: FileType) => {
        handleSelect(file)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {pending ? <div>Loading...</div> : selectedFile ?
                     <div className='flex items-center gap-2'><FileIcon className='w-4 h-4' />{selectedFile.publicId}</div> 
                     : <div className='flex items-center gap-2'><FileIcon className='w-4 h-4' />Select resume</div>}
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-gray-900 border-gray-800 w-full max-w-[1000px] max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Select resume</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    <Files files={files} onSelect={onSelect} dialogMode={true} />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ResumeItem