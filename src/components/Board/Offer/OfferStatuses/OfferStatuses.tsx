'use client'
import { OfferWithNotes } from "@/lib/types/offer"
import OfferStatus from "./OfferStatus"
import { startTransition, useActionState, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { updateOfferStatus } from "@/lib/actions/singleOffer"
import { OfferStatus as OfferStatusType, FinishedStatus as FinishedStatusType } from "@prisma/client"
import FinishedDialog from "./FinishedDialog"

const statuses = ['SAVED', 'SENT', 'INTERVIEW', 'FINISHED'] as const
const finishedStatuses = ['NOT_FINISHED', 'NO_RESPONSE', 'HR_REJECTED', 'TECHNICAL_REJECTED', 'HOME_ASSIGNMENT_REJECTED', 'FINAL_REJECTED', 'OFFER_DECLINED', 'OFFER_ACCEPTED'] as const

const OfferStatuses = ({ offer }: { offer: OfferWithNotes }) => {
    const [isFinishedDialogOpen, setIsFinishedDialogOpen] = useState(true)
    const [isFinishedDisabled, setIsFinishedDisabled] = useState(offer.status !== 'FINISHED')

    const [state, dispatch, pending] = useActionState(updateOfferStatus, {
        status: offer.status,
        finishedStatus: offer.finishedStatus,
        success: false,
        error: null
    })

    const handleChange = (value: OfferStatusType | FinishedStatusType, changingFinishedStatus: boolean) => {
        const shouldOpenFinishedStatusDialog = value === 'FINISHED' && changingFinishedStatus === false

        if(shouldOpenFinishedStatusDialog){
            setIsFinishedDialogOpen(true)
            return
        }
        const shouldResetFinishedStatus = state.status === 'FINISHED' && !changingFinishedStatus && value !== 'FINISHED'
        const dataToUpdate = changingFinishedStatus ? { id: offer.id, status: 'FINISHED' as OfferStatusType, finishedStatus: value as FinishedStatusType } : { id: offer.id, status: value as OfferStatusType }

        if(shouldResetFinishedStatus){
            dataToUpdate.finishedStatus = 'NOT_FINISHED'
        }

        startTransition(() => {
            dispatch(dataToUpdate)
        })
    }

    const handleFinishedStatusConfirm = (value: FinishedStatusType) => {
        setIsFinishedDialogOpen(false)
        handleChange(value, true)
    }

    useEffect(() => {
        if(state.success){
            toast.success('Offer status updated')
        }else if(state.error){
            toast.error(state.error)
        }
    }, [state])

    useEffect(() => {
        setIsFinishedDisabled(state.status !== 'FINISHED')
    }, [state])

    return (
        <>
            <OfferStatus 
                status={state.status} 
                statuses={statuses} 
                finishedStatus={false} 
                handleChange={handleChange} 
                pending={pending}
            />
            <OfferStatus 
                status={state.finishedStatus} 
                statuses={finishedStatuses} 
                finishedStatus={true} 
                isDisabled={isFinishedDisabled} 
                handleChange={handleChange} 
                pending={pending}
            />
            <FinishedDialog isOpen={isFinishedDialogOpen} onClose={() => setIsFinishedDialogOpen(false)} onConfirm={handleFinishedStatusConfirm} statuses={finishedStatuses} />
        </>
    )
}

export default OfferStatuses