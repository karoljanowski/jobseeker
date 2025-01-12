import { OfferStatus as OfferStatusType, FinishedStatus as FinishedStatusType } from '@prisma/client'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface OfferStatusProps {
    status: OfferStatusType | FinishedStatusType;
    statuses: readonly string[];
    finishedStatus: boolean;
    isDisabled?: boolean;
    handleChange: (value: OfferStatusType | FinishedStatusType, isFinished: boolean) => void;
    pending: boolean;
}

const OfferStatus = ({ status, statuses, finishedStatus=false, isDisabled=false, handleChange, pending }: OfferStatusProps) => {
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

export default OfferStatus