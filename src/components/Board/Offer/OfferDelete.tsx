import { Button } from "@/components/ui/button"
import { deleteOffer } from "@/lib/actions/singleOffer"
import { Loader2Icon, TrashIcon } from "lucide-react"
import { useActionState, useEffect } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { startTransition } from "react"

const OfferDelete = ({ offerId }: { offerId: number }) => {
    const router = useRouter()
    const [state, dispatch, pending] = useActionState(deleteOffer, { success: false, error: null })

    const handleDelete = () => {
        startTransition(() => {
            dispatch({offerId})
        })
    }
    
    useEffect(() => {
        if(state.success){
            toast.success('Offer deleted')
            router.refresh()
            router.push('/dashboard')
        }else if(state.error){
            toast.error(state.error)
        }
    }, [state, router])

    return (
        <Button variant="ghost" onClick={handleDelete} size="icon" className="hover:bg-red-500 hover:text-white min-w-8">
            {pending ? <Loader2Icon className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
        </Button>
    )
}

export default OfferDelete