import { openai } from "@/lib/openai"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, InfoIcon } from "lucide-react"
import { resumeAnaize } from "@/lib/actions/resumeAnaize"
import { OfferWithNotes } from "@/lib/types/offer"
import { startTransition, useActionState, useEffect } from "react"
import toast from "react-hot-toast"

const CheckAI = ({ offer }: { offer: OfferWithNotes }) => {
    const [state, dispatch, pending] = useActionState(resumeAnaize, {success: false, error: null})

    const handleCheck = () => {
        startTransition(() => {
            dispatch(offer)
        })
    }

    useEffect(() => {
        if(state.success){
            toast.success('Resume analyzed')
            console.log(state.response)
        }
    }, [state.success, state.response])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700"><Sparkles className="w-4 h-4" />Click to check CV with AI</Button>
            </DialogTrigger>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                <InfoIcon className="w-4 h-4" />
                <p className="leading-none">AI will analyze your resume and offer suggestions for improvement.</p>
            </div>
            <DialogContent className="bg-neutral-950 border-neutral-900 w-full max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Check AI</DialogTitle>
                    <DialogDescription>AI will analyze your resume and offer suggestions for improvement.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <Button onClick={handleCheck}>Check</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CheckAI