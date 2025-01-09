import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, InfoIcon, Loader2 } from "lucide-react"
import { resumeAnaize } from "@/lib/actions/resumeAnaize"
import { OfferWithNotes } from "@/lib/types/offer"
import { startTransition, useActionState, useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

const CheckAI = ({ offer }: { offer: OfferWithNotes }) => {
    const [open, setOpen] = useState(false)
    const [state, dispatch, pending] = useActionState(resumeAnaize, {success: false, error: null, response: ''})

    const handleCheck = useCallback(() => {
        startTransition(() => {
            dispatch(offer)
        })
    }, [dispatch, offer])

    useEffect(() => {
        if(state.success){
            toast.success('Resume analyzed')
        }
    }, [state])

    useEffect(() => {
        if(open){
            handleCheck()
        }
    }, [open, handleCheck])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={true}>
                <Button disabled={true} variant='default'><Sparkles className="w-4 h-4" />Click to check CV with AI</Button>
            </DialogTrigger>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <InfoIcon className="w-4 h-4" />
                <p className="leading-none">This option is unavailable for now.</p>
            </div>
            <DialogContent className="bg-gray-950 border-gray-900 w-full max-w-[1000px]">
                {!pending && state.response ? <Response response={state.response} /> : <ResponseLoader />}
            </DialogContent>
        </Dialog>
    )
}

const ResponseLoader = () => {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
                <Sparkles className="w-4 h-4" /> AI is analyzing your resume...
            </p>
            <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
            </div>
        </div>
    )
}
const Response = ({ response }: { response: string }) => {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">{response}</p>
        </div>
    )
}

export default CheckAI
