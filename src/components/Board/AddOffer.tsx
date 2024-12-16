'use client'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ChevronDownIcon, FileIcon, Loader2, PlusIcon } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { addOffer } from '@/app/actions/offers'
import { useRouter } from 'next/navigation'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { Offer } from '@prisma/client'
import { AddOfferErrors } from '@/lib/types'
import toast from 'react-hot-toast'

type OfferFrom = Omit<Offer, 'id' | 'dateAdded' | 'dateUpdated' | 'userId' | 'status' | 'user' | 'userId' | 'resume' >

const initialForm: OfferFrom = {
    company: '',
    position: '',
    description: '',
    expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: 1,
    source: '',
    resumeId: null,
    location: '',
    notes: '',
    requirements: '',
}

const AddOffer = () => {
    const [form, setForm] = useState<OfferFrom>(initialForm)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [state, dispatch, isPending] = useActionState(addOffer, {success: false, errors: null})

    const handleAddOffer = () => {
        startTransition(() => {
            dispatch(form)
            router.refresh()
        })
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, expiresAt: new Date(e.target.value) })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (value: string) => {
        setForm({ ...form, priority: parseInt(value) })
    }

    useEffect(() => {
        if(state.success){
            toast.success('Offer added successfully')
            setOpen(false)
        }else if(state.errors){
            toast.error('Error adding offer')
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="">
                    <PlusIcon className="w-4 h-4" />
                    Add new
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-neutral-950 border-neutral-900 w-full max-w-[1000px] overflow-y-auto max-h-[90vh]'>
                <DialogHeader>
                    <DialogTitle>Add new offer</DialogTitle>
                    <DialogDescription>Add a new offer to the board</DialogDescription>
                </DialogHeader>
                <AddOfferForm form={form} errors={state.errors} handleDateChange={handleDateChange} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className='h-8' variant="destructive">Cancel</Button>
                    </DialogClose>
                    <Button disabled={isPending} onClick={handleAddOffer} className='h-8' variant="secondary">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface AddOfferFormProps {
    form: OfferFrom
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleSelectChange: (value: string) => void,
    handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    errors: AddOfferErrors['errors']
}

const AddOfferForm = ({ form, handleInputChange, handleSelectChange, handleDateChange, errors }: AddOfferFormProps) => {
    return (
        <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='company'>Company</Label>
                <Input 
                    value={form.company} 
                    name='company' 
                    onChange={handleInputChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='for example: Google' 
                />
                {errors?.company && <p className='text-red-500 text-xs'>{errors.company.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='position'>Position</Label>
                <Input 
                    value={form.position} 
                    name='position' 
                    onChange={handleInputChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='for example: Software Engineer' 
                />
                {errors?.position && <p className='text-red-500 text-xs'>{errors.position.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='source'>Source</Label>
                <Input 
                    value={form.source} 
                    name='source' 
                    onChange={handleInputChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='for example: LinkedIn' 
                />
                {errors?.source && <p className='text-red-500 text-xs'>{errors.source.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='location'>Location</Label>
                <Input 
                    value={form.location} 
                    name='location' 
                    onChange={handleInputChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='for example: Remote' 
                />
                {errors?.location && <p className='text-red-500 text-xs'>{errors.location.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='expiresAt'>Expires at</Label>
                <Input 
                    type='date' 
                    name='expiresAt' 
                    value={form.expiresAt.toISOString().split('T')[0]} 
                    onChange={handleDateChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='Expires at' 
                />
                {errors?.expiresAt && <p className='text-red-500 text-xs'>{errors.expiresAt.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='priority'>Priority</Label>
                <Select onValueChange={handleSelectChange} value={form.priority.toString()}>
                    <SelectTrigger className='bg-neutral-950 border-neutral-900'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-neutral-950 border-neutral-900 text-white'>
                        <SelectItem value='1'>Low</SelectItem>
                        <SelectItem value='2'>Medium</SelectItem>
                        <SelectItem value='3'>High</SelectItem>
                    </SelectContent>
                </Select>
                {errors?.priority && <p className='text-red-500 text-xs'>{errors.priority.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2 col-span-2'>
                <Label htmlFor='requirements'>Requirements</Label>
                <Textarea 
                    value={form.requirements || ''} 
                    name='requirements' 
                    onChange={handleInputChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='for example: - 3 years work with JavaScript - knowledge of React - knowledge of Next.js' 
                />
            </div>
            <div className='flex flex-col gap-2 col-span-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea 
                    value={form.description} 
                    name='description' 
                    onChange={handleInputChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='for example: we are looking for a software engineer with 3 years of experience...' 
                />
                {errors?.description && <p className='text-red-500 text-xs'>{errors.description.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='resume'>Resume</Label>
                <ResumeSelect />
            </div>
            <div className='flex flex-col gap-2 col-span-2'>
                <Label htmlFor='notes'>Notes</Label>
                <Textarea 
                    value={form.notes || ''} 
                    name='notes' 
                    onChange={handleInputChange} 
                    className='bg-neutral-950 border-neutral-900' 
                    placeholder='for example: interview was on 12/12/2024 at 10:00' 
                />
            </div>

        </div>
    )
}

const ResumeSelect = () => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='bg-neutral-950 border-neutral-900'>Select resume <FileIcon className='w-4 h-4' /></Button>
            </DialogTrigger>
            <DialogContent className='bg-neutral-950 border-neutral-900 w-full max-w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Select resume</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddOffer;
