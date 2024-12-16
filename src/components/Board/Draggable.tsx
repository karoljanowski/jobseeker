'use client'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card'
import { Offer } from '@prisma/client'
import { Button } from '../ui/button'
import { Trash2Icon, ClockIcon, Loader2 } from 'lucide-react'
import { deleteOffer } from '@/app/actions/offers'
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
        <Card onClick={handleClick} ref={setNodeRef} style={style} className="bg-neutral-900 border-none text-white cursor-move" {...listeners} {...attributes}>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
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
            <CardFooter>
                <DeleteOffer id={id} setIsDeleting={setIsDeleting} />
            </CardFooter>
        </Card>
    </motion.div>
  )
}

const DeleteOffer = ({ id, setIsDeleting }: { id: number, setIsDeleting: (isDeleting: boolean) => void }) => {
  const router = useRouter()
  const [state, dispatch, isPending] = useActionState(deleteOffer, {
    success: false,
    error: null
  })

  useEffect(() => {
    if(state.success){
      toast.success('Offer deleted successfully')
    }else if(state.error){
      toast.error(state.error)
    }
  }, [state.success, state.error])

  const handleDelete = () => {
    startTransition(() => {
      setIsDeleting(true)
      dispatch(id)
      router.refresh()
    })
  }

  return (
    <button onClick={handleDelete}>
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2Icon className="w-4 h-4 text-red-950 hover:text-red-500 transition-colors cursor-pointer" />}
    </button>
  )
}

