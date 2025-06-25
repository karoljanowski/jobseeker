'use client'
import ResumeSelect from "./ResumeSelect"
import { Dispatch, SetStateAction, startTransition, useActionState } from "react"
import { updateOfferFile } from "@/lib/actions/singleOffer"
import { File as FileType } from "@prisma/client"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { EyeIcon } from "lucide-react"
import { OfferWithNotes } from "@/lib/types/offer"

interface ResumeItemProps {
    offerId: number
    selectedFile: FileType | null
    setOffer: Dispatch<SetStateAction<OfferWithNotes | null>>
    offer: OfferWithNotes
}

const ResumeItem = ({ offerId, selectedFile, setOffer, offer }: ResumeItemProps) => {
    const [state, dispatch, pending] = useActionState(updateOfferFile, { selectedFile: selectedFile, success: false, error: null })

    const handleSelect = (file: FileType) => {
        startTransition(() => {
            dispatch({ offerId: offerId, file: file })
        })
    }

    useEffect(() => {
        if (state.success) {
            toast.success('Resume updated')
            setOffer({ ...offer, file: state.selectedFile })
        } else if (state.error) {
            toast.error('Error updating resume')
        }
    }, [state])

    return (
        <div className="flex items-center gap-2 w-full">
            <ResumeSelect selectedFile={state.selectedFile} handleSelect={handleSelect} pending={pending} />
            <Button disabled={!state.selectedFile} variant="secondary" size="icon" onClick={() => {
                if(state.selectedFile){
                    window.open(state.selectedFile.fileUrl, '_blank')
                }
            }}>
                <EyeIcon className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default ResumeItem