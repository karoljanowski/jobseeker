'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { FinishedStatus } from '@prisma/client'
import { useState } from 'react'

interface FinishedDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (value: FinishedStatus) => void
    statuses: readonly FinishedStatus[]
}

const FinishedDialog = ({ isOpen, onClose, onConfirm, statuses }: FinishedDialogProps) => {
    const [selectedStatus, setSelectedStatus] = useState<FinishedStatus | null>(null)
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='bg-gray-900 text-white border-none'>
                <DialogHeader>
                    <DialogTitle>Finished Status</DialogTitle>
                    <DialogDescription>Select how offer was finished</DialogDescription>
                </DialogHeader>
                <Select onValueChange={(value) => setSelectedStatus(value as FinishedStatus)}>
                    <SelectTrigger className="bg-gray-800 hover:bg-gray-700 transition-colors border-none focus:ring-offset-0 focus:ring-0">
                        <SelectValue placeholder='Select a status' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-none text-white'>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status} className='cursor-pointer hover:bg-gray-700 transition-colors'>{status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1).toLowerCase()}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button onClick={() => onConfirm(selectedStatus as FinishedStatus)}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FinishedDialog