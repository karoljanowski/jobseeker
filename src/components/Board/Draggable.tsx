'use client'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card'
import { Offer } from '@prisma/client'
import { Button } from '../ui/button'
import { Trash2Icon, ClockIcon, Loader2 } from 'lucide-react'
import { deleteOffer } from '@/lib/actions/offers'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export function Draggable({ id, offer }: { id: number, offer: Offer }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const handleClick = () => {
    router.push(`?offer=${offer.id}`)
  }

  return (
    <motion.div
        layout
        animate={isDeleting ? {
          opacity: 0,
          scale: 0.8,
          transition: { duration: 0.2 }
        } : {
          opacity: 1,
          scale: 1
        }}
    >
        <Card onClick={handleClick} ref={setNodeRef} style={style} className="border-none bg-neutral-900 text-white cursor-move rounded-lg" {...listeners} {...attributes}>
            <CardHeader>
                <CardTitle className="flex justify-between items-start">
                    <span>{offer.company}</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {offer.dateAdded.toLocaleDateString()}
                    </span>
                </CardTitle>
                <CardDescription>
                    {offer.position}
                </CardDescription>
            </CardHeader>
        </Card>
    </motion.div>
  )
}

