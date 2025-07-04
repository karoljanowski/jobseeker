'use client'

import React, { useState, useEffect, useOptimistic, startTransition } from 'react'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Droppable } from './Droppable'
import { updateOfferStatus } from '@/lib/actions/offers'
import { OfferStatus } from '@prisma/client'
import toast from 'react-hot-toast'
import { Column } from '@/lib/types/board'
import { useRouter } from 'next/navigation'

const initialColumns: Column[] = [
    {
        id: OfferStatus.SAVED,
        title: 'Saved',
        offers: []
    },
    {
        id: OfferStatus.SENT,
        title: 'Sent',
        offers: []
    },
    {
        id: OfferStatus.INTERVIEW,
        title: 'Interview',
        offers: []
    },
    {
        id: OfferStatus.FINISHED,
        title: 'Finished',
        offers: []
    }
]

const Board = ({ offers }: { offers: Column[] }) => {
    const router = useRouter()
    const [columns, setColumns] = useState<Column[]>(initialColumns)
    const [optimisticColumns, setOptimisticColumns] = useOptimistic(
        columns,
        (state, newColumns: Column[]) => newColumns
    )

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 10}}),
    )

    useEffect(() => {
        setColumns(offers)
    }, [offers])

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        
        if (over && active.id !== over.id) {
            const prevColumns = optimisticColumns
            const activeColumn = prevColumns.find(col => col.offers.some(offer => offer.id === active.id))
            const overColumn = prevColumns.find(col => col.id === over.id)
            
            if (!activeColumn || !overColumn) return
            if(activeColumn.id === overColumn.id) return
            
            const activeOffer = activeColumn.offers.find(offer => offer.id === active.id)

            if (!activeOffer) return

            if (over && over.id === OfferStatus.FINISHED) {
                handleDragToFinished(activeOffer.id)
                return
            }

            const updatedColumns = prevColumns.map(col => {
                if (col.id === overColumn.id) {
                    return {
                        ...col,
                        offers: [...col.offers, activeOffer]
                    };
                }
                if (col.id === activeColumn.id) {
                    return {
                        ...col,
                        offers: col.offers.filter(offer => offer.id !== active.id)
                    };
                }
                return col
            })
            startTransition(async () => {
                setOptimisticColumns(updatedColumns)
                    
                try {
                    const state = await updateOfferStatus(activeOffer.id, overColumn.id as OfferStatus)
                    if(state.success){
                        toast.success('Offer status updated successfully')
                        setColumns(updatedColumns)
                    } else {
                        toast.error('Error updating offer status')
                    }
                } catch (error) {
                    toast.error('Error updating offer status: ' + error)
                    setOptimisticColumns(columns)
                }
            })
        }
    }

    const handleDragToFinished = (id: number) => {
        router.push(`/dashboard?offer=${id}&finishedDialog=true`)
    }

    return (
        <DndContext id="board" sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
            <div className="grid grid-rows-auto xl:grid-cols-4 xl:grid-rows-1 gap-4 w-full h-full">
                {optimisticColumns.map((column) => (
                    <Droppable key={column.id} id={column.id} column={column} />
                ))}
            </div>
        </DndContext>
    )
}

export default Board;