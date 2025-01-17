'use client'
import { SearchIcon } from "lucide-react";
import { SetStateAction, useState } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dispatch } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { OfferFrom } from "@/lib/types/offer";
import { getHTMLFromLink, scrapOfferData } from "@/lib/actions/scraper";

type LoadingState = 'false' | 'first' | 'second'

const GetFromLink = ({setForm} : {setForm: Dispatch<SetStateAction<OfferFrom>>}) => {
    const [link, setLink] = useState('')
    const [opened, setOpened] = useState(false)
    const [loading, setLoading] = useState<LoadingState>('false')

    const handleGetFromLink = async () => {
        setLoading('first');
    
        const htmlContent = await getHTMLFromLink(link);
        if (!htmlContent?.success || !htmlContent.data) {
            toast.error(htmlContent?.error);
            setLoading('false'); 
            return;
        }
    
        setLoading('second');
        const linkData = await scrapOfferData(htmlContent.data);
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
        <Dialog open={opened} onOpenChange={setOpened}>
            <DialogTrigger asChild>
                <Button disabled={loading !== 'false'} variant='default'>Get details from link <SearchIcon className='w-4 h-4' /></Button>
            </DialogTrigger>
            <DialogContent className='bg-gray-950 border-gray-900'>
                <DialogHeader>
                    <DialogTitle>Get details from link</DialogTitle>
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
    )
}

export default GetFromLink