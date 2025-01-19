'use client'
import { InfoIcon, SearchIcon } from "lucide-react";
import { SetStateAction, useState } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dispatch } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { OfferFrom } from "@/lib/types/offer";
import { getHTMLFromLink, getLastGptUsage, scrapOfferData } from "@/lib/actions/scraper";
import { getUserId } from "@/lib/actions/auth";

type LoadingState = 'false' | 'first' | 'second'

const GetFromLink = ({setForm} : {setForm: Dispatch<SetStateAction<OfferFrom>>}) => {
    const [link, setLink] = useState('')
    const [opened, setOpened] = useState(false)
    const [loading, setLoading] = useState<LoadingState>('false')

    const handleGetFromLink = async () => {
        setLoading('first');

        const userId = await getUserId()
        if (!userId) {
            toast.error('User not found')
            setLoading('false')
            return
        }


        const lastGptUsage = await getLastGptUsage(userId)
        if (lastGptUsage?.success && lastGptUsage.lastGptUsage && 
            new Date(lastGptUsage.lastGptUsage).getTime() + 600000 > new Date().getTime()) {
            toast.error('Wait 10 minutes before using the AI again.')
            setLoading('false')
            return
        }
    
        const htmlContent = await getHTMLFromLink(link);
        if (!htmlContent?.success || !htmlContent.data) {
            toast.error(htmlContent?.error);
            setLoading('false'); 
            return;
        }
    
        setLoading('second');
        const linkData = await scrapOfferData(htmlContent.data, userId);
        if (!linkData?.success) {
            toast.error(linkData?.error);
            setLoading('false'); 
            return;
        }
    
        if (linkData?.success && linkData.data) {
            setForm((prevForm) => ({
                ...prevForm,
                company: linkData.data?.company || prevForm.company,
                position: linkData.data?.position || prevForm.position,
                location: linkData.data?.location || prevForm.location,
                source: link,
                description: linkData.data?.description || prevForm.description,
                requirements: linkData.data?.requirements || prevForm.requirements,
            }));
            setLoading('false');
            setOpened(false);
            toast.success('Details fetched successfully!');
        }
    };
    
    return (
        <div className='flex flex-col gap-2'>
            <Dialog open={opened} onOpenChange={setOpened}>
                <DialogTrigger asChild>
                    <Button disabled={loading !== 'false'} variant='default'>Get offer details from link with AI <SearchIcon className='w-4 h-4' /></Button>
            </DialogTrigger>
            <DialogContent className='bg-gray-950 border-gray-900'>
                <DialogHeader>
                    <DialogTitle>Get offer details from link with AI</DialogTitle>
                </DialogHeader>
                <Input type='url' name='get-from-link' onChange={(e) => setLink(e.target.value)} className='bg-gray-950 border-gray-900' placeholder='for example: https://www.google.com' />
                <Button disabled={loading !== 'false'} variant='secondary' onClick={handleGetFromLink}>
                    {loading === 'first' 
                        ? <><Loader2 className='w-5 h-5 animate-spin'/> Getting page content</>
                        : loading === 'second' 
                        ? <><Loader2 className='w-5 h-4 animate-spin'/> Getting offer details</>
                        : 'Get offer details'}
                    </Button>
                </DialogContent>
            </Dialog>
            <p className='text-sm text-gray-500 flex items-center gap-2 text-center justify-center'>
                <InfoIcon className='w-4 h-4' />
                Remember to check if data is correct.
            </p>
        </div>
    )
}

export default GetFromLink