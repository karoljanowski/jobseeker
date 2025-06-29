import { Label } from "@/components/ui/label"
import { OfferFrom } from "@/lib/types/offer"
import { Dispatch, SetStateAction } from "react"
import GetFromLink from "./GetFromLink"
import { AddOfferFormType } from "@/lib/types/offer"
import LabelInput from "@/components/ui/labelInput"
import Editor from "@/components/Editor"
import { DatePicker } from "@/components/ui/date-picker"
import ResumeSelect from "../ResumeSelect"
import { File as FileType } from "@prisma/client"

interface AddOfferFormProps {
    form: OfferFrom
    setForm: Dispatch<SetStateAction<OfferFrom>>
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleDateChange: (date: Date) => void,
    handleEditorChange: (content: string, name: string) => void
    handleSelect: (file: FileType) => void
    errors: AddOfferFormType['errors']
}

const AddOfferForm = ({ form, setForm, handleInputChange, handleDateChange, handleEditorChange, handleSelect, errors }: AddOfferFormProps) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col md:col-span-2 border-b border-gray-800 pb-4'>
                <GetFromLink setForm={setForm} />
            </div>
            <LabelInput label='Company' placeholder='for example: Google' type='text' required name='company' value={form.company} onChange={handleInputChange} errors={errors?.company} />
            <LabelInput label='Position' placeholder='for example: Software Engineer' type='text' required name='position' value={form.position} onChange={handleInputChange} errors={errors?.position} />
            <LabelInput label='Source' placeholder='for example: LinkedIn or link to offer' type='text' required name='source' value={form.source} onChange={handleInputChange} errors={errors?.source} />
            <LabelInput label='Location' placeholder='for example: Remote' type='text' required name='location' value={form.location} onChange={handleInputChange} errors={errors?.location} />
            <div className='flex flex-col gap-2'>
                <Label htmlFor='expiresAt'>Expires at</Label>
                <DatePicker date={form.expiresAt} setDate={handleDateChange} />
                {errors?.expiresAt && <p className='text-red-500 text-xs'>{errors.expiresAt.join(', ')}</p>}
            </div>
            <div className='flex flex-col gap-2'>
                <Label htmlFor='file'>Resume</Label>
                <ResumeSelect selectedFile={form.file} handleSelect={handleSelect}/>
            </div>
            <div className='flex flex-col gap-2 md:col-span-2'>
                <Label htmlFor='requirements'>Requirements</Label>
                <Editor 
                    content={form.requirements || ''} 
                    onUpdate={(content) => handleEditorChange(content, 'requirements')} 
                    placeholder='for example: - 3 years work with JavaScript - knowledge of React - knowledge of Next.js' 
                />
            </div>
            <div className='flex flex-col gap-2 md:col-span-2'>
                <Label htmlFor='description'>Description</Label>
                <Editor 
                    content={form.description || ''} 
                    onUpdate={(content) => handleEditorChange(content, 'description')} 
                    placeholder='for example: we are looking for a software engineer with 3 years of experience...' />
            </div>
        </div>
    )
}

export default AddOfferForm