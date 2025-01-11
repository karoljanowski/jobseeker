'use client'
import { useDroppable } from '@dnd-kit/core'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card'
import { Draggable } from './Draggable'
import { Column } from '@/lib/types/board'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef } from 'react'

export function Droppable({ id, column }: { id: string; column: Column }) {
    const { setNodeRef, active, isOver } = useDroppable({
        id: id,
    })
    const columnRef = useRef<HTMLDivElement>(null)
    
    const isActive = active && !column.offers.some(offer => offer.id === active.id);

    return (
        <div ref={setNodeRef}>
            <Card ref={columnRef} className="bg-gray-950/40 border-none h-full flex flex-col xl:min-h-[80dvh]">
                <CardHeader className="px-5 pt-5 pb-1 flex flex-row items-start justify-between space-y-0">
                    <CardTitle>{column.title}</CardTitle>
                    <CardDescription className="mt-0">
                        {column.offers.length > 0 && <div className="text-sm text-gray-400">{column.offers.length} offer{column.offers.length > 1 ? 's' : ''}</div>}
                    </CardDescription>
                </CardHeader>
                <AnimatePresence mode='popLayout'>
                    <CardContent className='p-3 flex-1 relative'>
                            {!isActive && (
                                <motion.div className="flex flex-col gap-2" key="offers" exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                                    {column.offers.map((offer) => (
                                        <Draggable key={offer.id} id={offer.id} offer={offer} />
                                    ))}
                                </motion.div>
                            )}

                            {isActive && (
                                <motion.div className="h-full" key="dropHere" exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                                    <DropHere columnRef={columnRef} title={column.title} isOver={isOver} />
                                </motion.div>
                            )}
                    </CardContent>
                </AnimatePresence>
            </Card>
        </div>
    )
}

const DropHere = ({ columnRef, title, isOver }: { columnRef: React.RefObject<HTMLDivElement | null>, title: string, isOver: boolean }) => {
    const cardRef = useRef<HTMLDivElement>(null)

    const calculatePosition = () => {
        const bodyHeight = document.body.offsetHeight
        const columnHeight = columnRef.current?.offsetHeight
        const scrollY = window.scrollY
        const top = columnHeight ? scrollY - (bodyHeight - columnHeight) : 0

        const viewPortHeight = window.innerHeight
        const cardHeight = cardRef.current?.offsetHeight
        const space = cardHeight ? (viewPortHeight - cardHeight) / 2 : 0

        const position = top + space
        if(position < 0) {
            return 0 + 'px'
        }
        return position + 'px'
    }

    return (
        <div ref={cardRef} className="p-6 h-[70dvh] absolute left-0 w-full" style={{ top: calculatePosition() }}>
            <div className={cn("border-4 border-dashed rounded-lg p-2 h-full flex items-center justify-center transition-all", isOver ? "border-gray-500" : "border-gray-700")}>
                <div className="text-gray-400 text-xl text-center flex flex-col">
                    <span>Drop here to mark as</span>
                    <span className="font-bold text-2xl uppercase">{title}</span>
                </div>
            </div>
        </div>
    )
}

