'use client'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import { Loader2, PlusIcon } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog'
import { addOffer } from '@/lib/actions/offers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { OfferFrom } from '@/lib/types/offer'
import AddOfferForm from './AddOfferForm'


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

    useEffect(() => {
        if(open){
            setForm(initialForm)
        }
    }, [open])

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
                <AddOfferForm form={form} setForm={setForm} errors={state.errors} handleDateChange={handleDateChange} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} />
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






export default AddOffer;
