'use client'
import ResumeSelect from "./ResumeSelect"
import { startTransition, useActionState } from "react"
import { updateOfferFile } from "@/lib/actions/singleOffer"
import { File as FileType } from "@prisma/client"
import { useEffect } from "react"
import toast from "react-hot-toast"

interface ResumeItemProps {
    offerId: number
    selectedFile: FileType | null
}

const ResumeItem = ({ offerId, selectedFile }: ResumeItemProps) => {
    const [state, dispatch, pending] = useActionState(updateOfferFile, { selectedFile: selectedFile, success: false, error: null })

    const handleSelect = (file: FileType) => {
        startTransition(() => {
            dispatch({ offerId: offerId, file: file })
        })
    }

    useEffect(() => {
        if (state.success) {
            toast.success('Resume updated')
        } else if (state.error) {
            toast.error('Error updating resume')
        }
    }, [state])

    return (
        <ResumeSelect selectedFile={state.selectedFile} handleSelect={handleSelect} pending={pending} />
    )
}

export default ResumeItem