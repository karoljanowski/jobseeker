import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, InfoIcon, Loader2 } from "lucide-react"
import { resumeAnaize } from "@/lib/actions/resumeAnaize"
import { OfferWithNotes } from "@/lib/types/offer"
import { startTransition, useActionState, useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

const CheckAI = ({ offer }: { offer: OfferWithNotes }) => {
    const [open, setOpen] = useState(false)
    const [response, setResponse] = useState<string>('')
    const [loading, setLoading] = useState(true)

    const handleCheck = useCallback(async () => {
        setLoading(true)
        const response = await fetch(`/api/analize`, {
            method: 'POST',
            body: JSON.stringify({ offer })
        })

        if (!response.ok) {
            toast.error(response.statusText);
            setLoading(false)
            return;
        }

        const data = await response.json();
        setResponse(data.response)
        setLoading(false)
    }, [offer])

    useEffect(() => {
        if(open){
            handleCheck()
        }
    }, [open, handleCheck])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={false}>
                <Button disabled={false} variant='default'><Sparkles className="w-4 h-4" />Click to check CV with AI</Button>
            </DialogTrigger>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <InfoIcon className="w-4 h-4" />
                <p className="leading-none">This option is unavailable for now.</p>
            </div>
            <DialogContent className="bg-gray-950 border-gray-900 w-full max-w-[1000px] max-h-[80vh] overflow-y-auto">
                {loading ? <ResponseLoader /> : <Response response={response} />}
            </DialogContent>
        </Dialog>
    )
}

const ResponseLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 py-10">
            <p className="text-white flex items-center gap-2 text-xl font-bold">
                <Sparkles className="w-6 h-6" /> AI is analyzing your resume...
            </p>
            <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        </div>
    )
}
const Response = ({ response }: { response: string }) => {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-white text-xl font-bold">AI analysis</p>
            <p className="text-white editor" dangerouslySetInnerHTML={{ __html: response }} />
        </div>
    )
}

export default CheckAI
