'use client'
import { useDroppable } from '@dnd-kit/core'

export function Droppable({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: id,
  })

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  )
}

