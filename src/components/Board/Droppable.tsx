'use client'
import { useDroppable } from '@dnd-kit/core'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card'
import { Draggable } from './Draggable'
import { Column } from '@/lib/types/board'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

export function Droppable({ id, column }: { id: string; column: Column }) {
    const { setNodeRef, active, isOver } = useDroppable({
        id: id,
    })
    
    const isActive = active && !column.offers.some(offer => offer.id === active.id);

    return (
        <div ref={setNodeRef}>
            <Card className="bg-gray-950/40 border-none h-full flex flex-col">
                <CardHeader className="px-5 pt-5 pb-1 flex flex-row items-start justify-between space-y-0">
                    <CardTitle>{column.title}</CardTitle>
                    <CardDescription className="mt-0">
                        {column.offers.length > 0 && <div className="text-sm text-gray-400">{column.offers.length} offer{column.offers.length > 1 ? 's' : ''}</div>}
                    </CardDescription>
                </CardHeader>
                <AnimatePresence mode='popLayout'>
                    <CardContent className='p-3 flex-1'>
                            {!isActive && (
                                <motion.div className="flex flex-col gap-2" key="offers" exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                                    {column.offers.map((offer) => (
                                        <Draggable key={offer.id} id={offer.id} offer={offer} />
                                    ))}
                                </motion.div>
                            )}

                            {isActive && (
                                <motion.div className="h-full" key="dropHere" exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                                    <DropHere title={column.title} isOver={isOver} />
                                </motion.div>
                            )}
                    </CardContent>
                </AnimatePresence>
            </Card>
        </div>
    )
}

const DropHere = ({ title, isOver }: { title: string, isOver: boolean }) => {
    return (
        <div className="p-3 h-full">
            <div className={cn("border-4 border-dashed rounded-lg p-2 h-full flex items-center justify-center transition-all", isOver ? "border-gray-500" : "border-gray-700")}>
                <div className="text-gray-400 text-xl text-center flex flex-col">
                    <span>Drop here to mark as</span>
                    <span className="font-bold text-2xl uppercase">{title}</span>
                </div>
            </div>
        </div>
    )
}

