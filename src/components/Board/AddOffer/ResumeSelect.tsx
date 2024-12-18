import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileIcon } from "lucide-react"

const ResumeSelect = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='bg-neutral-950 border-neutral-900'>Select resume <FileIcon className='w-4 h-4' /></Button>
            </DialogTrigger>
            <DialogContent className='bg-neutral-950 border-neutral-900 w-full max-w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Select resume</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ResumeSelect