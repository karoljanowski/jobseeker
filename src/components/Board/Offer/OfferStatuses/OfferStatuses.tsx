'use client'
import { OfferWithNotes } from "@/lib/types/offer"
import OfferStatus from "./OfferStatus"
import { startTransition, useActionState, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { updateOfferStatus } from "@/lib/actions/singleOffer"
import { OfferStatus as OfferStatusType, FinishedStatus as FinishedStatusType } from "@prisma/client"

const statuses = ['SAVED', 'SENT', 'INTERVIEW', 'FINISHED']
const finishedStatuses = ['NOT_FINISHED', 'NO_RESPONSE', 'HR_REJECTED', 'TECHNICAL_REJECTED', 'HOME_ASSIGNMENT_REJECTED', 'FINAL_REJECTED', 'OFFER_DECLINED', 'OFFER_ACCEPTED']

const OfferStatuses = ({ offer }: { offer: OfferWithNotes }) => {
    const [isFinishedDisabled, setIsFinishedDisabled] = useState(offer.status !== 'FINISHED')
    const [status, setStatus] = useState(offer.status)
    const [finishedStatus, setFinishedStatus] = useState(offer.finishedStatus)

    const [state, dispatch, pending] = useActionState(updateOfferStatus, {
        status: status,
        success: false,
        error: null
    })

    const handleChange = (value: OfferStatusType | FinishedStatusType, finishedStatus: boolean) => {
        if(finishedStatus){
            setFinishedStatus(value as FinishedStatusType)
        }else{
            setStatus(value as OfferStatusType)
            handleComebackFromFinished(status, value)
        }

        const data = {
            id: offer.id,
            status: value,
            finishedStatus: finishedStatus
        }

        startTransition(() => {
            dispatch(data)
        })
    }

    const handleComebackFromFinished = (status: OfferStatusType, value: OfferStatusType | FinishedStatusType) => {
        if(status === 'FINISHED' && value !== 'FINISHED'){
            setFinishedStatus('NOT_FINISHED')

            const data = {
                id: offer.id,
                status: 'NOT_FINISHED' as FinishedStatusType,
                finishedStatus: true
            }

            startTransition(() => {
                dispatch(data)
            })
        }
    }

    useEffect(() => {
        if(state.success){
            toast.success('Offer status updated')
        }else if(state.error){
            toast.error(state.error)
        }
    }, [state])

    useEffect(() => {
        setIsFinishedDisabled(status !== 'FINISHED')
    }, [status])

    return (
        <>
            <OfferStatus status={status} statuses={statuses} finishedStatus={false} handleChange={handleChange} />
            <OfferStatus status={finishedStatus} statuses={finishedStatuses} finishedStatus={true} isDisabled={isFinishedDisabled} handleChange={handleChange} />
        </>
    )
}

export default OfferStatuses