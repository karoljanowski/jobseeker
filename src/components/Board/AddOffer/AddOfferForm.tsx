import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OfferFrom } from "@/lib/types/offer"
import { Dispatch, SetStateAction } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import ResumeSelect from "./ResumeSelect"
import GetFromLink from "./GetFromLink"
import { AddOfferErrors } from "@/lib/types/offer"
import LabelInput from "@/components/ui/labelInput"

interface AddOfferFormProps {
    form: OfferFrom
    setForm: Dispatch<SetStateAction<OfferFrom>>
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    errors: AddOfferErrors['errors']
}

const AddOfferForm = ({ form, setForm, handleInputChange, handleDateChange, errors }: AddOfferFormProps) => {
    return (
        <div className='grid grid-cols-2 gap-4'>
            <GetFromLink setForm={setForm} />
            <LabelInput label='Position' placeholder='for example: Software Engineer' type='text' required name='position' value={form.position} onChange={handleInputChange} errors={errors?.position} />
            <LabelInput label='Source' placeholder='for example: LinkedIn' type='text' required name='source' value={form.source} onChange={handleInputChange} errors={errors?.source} />
            <LabelInput label='Location' placeholder='for example: Remote' type='text' required name='location' value={form.location} onChange={handleInputChange} errors={errors?.location} />
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
                <Label htmlFor='resume'>Resume</Label>
                <ResumeSelect />
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
        </div>
    )
}

export default AddOfferForm