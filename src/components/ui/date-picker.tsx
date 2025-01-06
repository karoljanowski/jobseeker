"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({date, setDate, pending = false}: {date: Date, setDate: (date: Date) => void, pending?: boolean}) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={pending} variant='secondary'>
          {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing date...</> : 
          <>
            <CalendarIcon /> 
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </>}

        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-gray-900 border-gray-900" side="top" align="start" sideOffset={4}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date: Date | undefined) => date && setDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
