import { useActionState, useEffect, startTransition, useState } from 'react'
import { updateOfferStatus } from '@/lib/actions/singleOffer'
import { OfferStatus as OfferStatusType, FinishedStatus as FinishedStatusType } from '@prisma/client'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface OfferStatusProps {
    status: OfferStatusType | FinishedStatusType
    statuses: string[]
    finishedStatus?: boolean
    isDisabled?: boolean
    pending?: boolean
    handleChange: (value: OfferStatusType | FinishedStatusType, finishedStatus: boolean) => void
}

const OfferStatus = ({ status, statuses, finishedStatus=false, isDisabled=false, pending=false, handleChange }: OfferStatusProps) => {
    console.log(isDisabled)

    return (
        <div className='flex flex-col gap-1 w-full'>
            <span className='text-sm text-gray-400'>{finishedStatus ? 'Finished Status' : 'Status'}</span>
            <Select disabled={isDisabled} value={status} onValueChange={(value) => handleChange(value as OfferStatusType | FinishedStatusType, finishedStatus)}>
                <SelectTrigger className='bg-gray-800 hover:bg-gray-700 transition-colors border-none focus:ring-offset-0 focus:ring-0'>
                    {pending ? 
                        <div className='flex items-center gap-2'>
                            <Loader2 className='w-4 h-4 animate-spin' />
                            Updating...
                        </div>
                        : status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1).toLowerCase()
                    }
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-none text-white'>
                    {statuses.map((status) => (
                        <SelectItem key={status} className="cursor-pointer hover:bg-gray-700 transition-colors" value={status}>
                            {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1).toLowerCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

// const FinishedStatusDialog = ({ open, setOpen, offerId, parentState }: { open: boolean, setOpen: (open: boolean) => void, offerId: number, parentState: any }) => {
//     const [state, dispatch, pending] = useActionState(updateOfferStatus, {
//         status: 'NOT_FINISHED',
//         success: false,
//         error: null
//     })

//     const handleChange = (value: FinishedStatusType) => {
//         state.status = value
//     }

//     const handleSave = () => {
//         startTransition(() => {
//             dispatch({ id: offerId, status: state.status, finishedStatus: true })
//         })
//         parentState.status = state.status
//         setOpen(false)
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className='bg-gray-800 text-white'>
//                 <DialogHeader>
//                     <DialogTitle>Finished Status</DialogTitle>
//                 </DialogHeader>
//                 <DialogDescription>
//                     <Select value={state.status} onValueChange={handleChange}>
//                         <SelectTrigger>
//                             <SelectValue placeholder='Select a finished status' />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {finishedStatuses.map((status) => (
//                                 <SelectItem key={status} value={status}>{status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1).toLowerCase()}</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                 </DialogDescription>
//                 <DialogFooter>
//                     <Button onClick={handleSave}>Save</Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }

export default OfferStatus