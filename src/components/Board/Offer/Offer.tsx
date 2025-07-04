import Notes from './Notes'
import { OfferWithNotes } from '@/lib/types/offer'
import OfferItem from './OfferItem'
import OfferStatuses from './OfferStatuses/OfferStatuses'
import ResumeItem from './ResumeItem'
import CheckAI from './CheckAI'
import Source from './Source'
import Tags from './Tags'
import OfferDateItem from './OfferDateItem'
import OfferDelete from './OfferDelete'
import ColorPicker from './ColorPicker'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import MediaQuery from 'react-responsive'
import { Dispatch, SetStateAction } from 'react'

const Offer = ({ offer, setOffer }: { offer: OfferWithNotes, setOffer: Dispatch<SetStateAction<OfferWithNotes | null>> }) => {
    return (
        <>
            <MediaQuery minWidth={1200}>
                    <div className='grid grid-cols-[66%_33%] h-full w-full gap-4'>
                        <MainInfo offer={offer} />
                    <div className='border-l border-gray-800 pl-4'>
                        <ColumnInfo offer={offer} setOffer={setOffer} />
                    </div>
                </div>
            </MediaQuery>
            <MediaQuery maxWidth={1200}>
                <Tabs defaultValue="main" className='w-full'>
                    <TabsList className='grid w-full grid-cols-2 mb-6'>
                        <TabsTrigger value="main">Main Info</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="main">
                        <MainInfo offer={offer} />
                    </TabsContent>
                    <TabsContent value="settings">
                        <ColumnInfo offer={offer} setOffer={setOffer} />
                    </TabsContent>
                </Tabs>
            </MediaQuery>
        </>
    )
}

const MainInfo = ({ offer }: { offer: OfferWithNotes }) => {
    const { id, company, position, description, requirements, notes } = offer
    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-2 gap-2'>
                <OfferItem name='Company' value={company} offerId={id} field='company' />
                <OfferItem name='Position' value={position} offerId={id} field='position' />
            </div>
            <OfferItem name='Description' value={description || ''} editor={true} offerId={id} field='description' />
            <OfferItem name='Requirements' value={requirements || ''} editor={true} offerId={id} field='requirements' />
            <Notes notes={notes} offerId={offer.id} />
        </div>
    )
}

const ColumnInfo = ({ offer, setOffer }: { offer: OfferWithNotes, setOffer: Dispatch<SetStateAction<OfferWithNotes | null>> }) => {
    const { source, expiresAt, dateAdded, file, tags, location } = offer
    return (
        <div className='flex flex-col gap-2'>
            <div className="flex items-end gap-2">
                <OfferStatuses offer={offer} />
                <OfferDelete offerId={offer.id} />
            </div>
            <div className="flex gap-2 *:flex-1">
                <OfferDateItem name='Expires At' value={expiresAt} offerId={offer.id} field='expiresAt' />
                <OfferDateItem name='Date Added' value={dateAdded} offerId={offer.id} field='dateAdded' />
            </div>
            <ColorPicker offerId={offer.id} value={offer.accentColor} />
            <div className='flex gap-2 *:flex-1'>
                <Source source={source} />
                <OfferItem name='Location' value={location} offerId={offer.id} field='location' />
            </div>
            <Tags tags={tags} offerId={offer.id} />
            <div className='flex flex-col gap-1'>
                <span className='text-gray-400 text-sm'>Resume</span>
                <ResumeItem selectedFile={file ? file : null} offerId={offer.id} setOffer={setOffer} offer={offer} />
            </div>
            <CheckAI offer={offer} />
        </div>
    )
}

export default Offer;