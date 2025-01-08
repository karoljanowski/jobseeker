'use client'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Offer } from '@prisma/client'
import { ClockIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Draggable({ id, offer }: { id: number, offer: Offer }) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'translate3d(0px, 0px, 0px)',
    transition: transform ? undefined : 'all 0.2s ease-in-out',
    backgroundColor: offer.accentColor,
  }

  const handleClick = () => {
    router.push(`?offer=${offer.id}`)
  }

  return (
    <Card onClick={handleClick} ref={setNodeRef} style={style} className="bg-gray-900 text-white cursor-move rounded-lg border-none hover:brightness-150" {...listeners} {...attributes}>
        <CardHeader>
            <CardTitle className="flex justify-between items-start">
                <span>{offer.company}</span>
                <span className="text-xs text-gray-300 flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {offer.expiresAt.toLocaleDateString()}
                </span>
            </CardTitle>
            <CardDescription>
                {offer.position}
                <div className="flex items-center gap-1 mt-2">
                    {offer.tags.map((tag) => (
                        <span key={tag} className="bg-gray-900 text-gray-200 px-2 py-1 rounded-md text-xs">{tag}</span>
                    ))}
                </div>
            </CardDescription>
        </CardHeader>
    </Card>
  )
}

