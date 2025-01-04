'use client'

import React, { useState, useEffect, useOptimistic, startTransition } from 'react'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Droppable } from './Droppable'
import { updateOfferStatus } from '@/lib/actions/offers'
import { Offer, OfferStatus } from '@prisma/client'
import toast from 'react-hot-toast'
import { Column } from '@/lib/types/board'

const initialColumns: Column[] = [
    {
        id: OfferStatus.OPEN,
        title: 'Open',
        offers: []
    },
    {
        id: OfferStatus.SENDED,
        title: 'Sended',
        offers: []
    },
    {
        id: OfferStatus.PROCESSING,
        title: 'Processing',
        offers: []
    }
]

const Board = ({ offers }: { offers: Column[] }) => {
    const [columns, setColumns] = useState<Column[]>(initialColumns)
    const [optimisticColumns, setOptimisticColumns] = useOptimistic(
        columns,
        (state, newColumns: Column[]) => newColumns
    )

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 10}})
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
                    toast.error('Error updating offer status')
                    setOptimisticColumns(columns)
                }
            })
        }
    }

    return (
        <DndContext id="board" sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
            <div className="grid grid-cols-3 gap-4 w-full h-full">
                {optimisticColumns.map((column) => (
                    <Droppable key={column.id} id={column.id} column={column} />
                ))}
            </div>
        </DndContext>
    )
}

export default Board;