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
import { getLastGptUsage, scrapOfferData } from "@/lib/actions/scraper";
import { getUserId } from "@/lib/auth/authActions";

type LoadingState = 'false' | 'html' | 'gpt' | 'start'

const GetFromLink = ({setForm} : {setForm: Dispatch<SetStateAction<OfferFrom>>}) => {
    const [link, setLink] = useState('')
    const [opened, setOpened] = useState(false)
    const [loading, setLoading] = useState<LoadingState>('false')

    const handleGetFromLink = async () => {
        setLoading('start');

        const userId = await getUserId()
        if (!userId) {
            toast.error('User not found')
            setLoading('false')
            return
        }

        const lastGptUsage = await getLastGptUsage(userId)
        if (lastGptUsage?.success && lastGptUsage.lastGptUsage && 
            new Date().getTime() - new Date(lastGptUsage.lastGptUsage).getTime() < 30000) {
            toast.error('Wait 30 seconds before using the AI again.')
            setLoading('false')
            return
        }
        // html
        setLoading('html')
        const response = await fetch(`/api/scraper`, {
            method: 'POST',
            body: JSON.stringify({ link })
        })

        if (!response.ok) {
            toast.error(response.statusText);
            setLoading('false'); 
            return;
        }
        const htmlContent = await response.json();

        // gpt
        setLoading('gpt')
        const gptResponse = await fetch(`/api/ai`, {
            method: 'POST',
            body: JSON.stringify({ prompt: htmlContent.html, userId })
        })

        if (!gptResponse.ok) {
            toast.error(gptResponse.statusText);
            setLoading('false'); 
            return;
        }

        const gptData = await gptResponse.json();
    
        if (gptData?.success && gptData.data) {
            setForm((prevForm) => ({
                ...prevForm,
                company: gptData.data?.company || prevForm.company,
                position: gptData.data?.position || prevForm.position,
                location: gptData.data?.location || prevForm.location,
                source: link,
                description: gptData.data?.description || prevForm.description,
                requirements: gptData.data?.requirements || prevForm.requirements,
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
                        {loading === 'html' 
                            ? <><Loader2 className='w-5 h-5 animate-spin'/> Getting HTML</>
                            : loading === 'gpt'
                                ? <><Loader2 className='w-5 h-5 animate-spin'/> Getting offer details</>
                                : loading === 'start'
                                    ? 'Getting some data...'
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