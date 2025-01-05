import Notes from './Notes'
import { OfferWithNotes } from '@/lib/types/offer'
import OfferItem from './OfferItem'
import OfferStatus from './OfferStatus'
import ResumeSelect from './ResumeSelect'
import CheckAI from './CheckAI'
import Source from './Source'
import Tags from './Tags'
import OfferDateItem from './OfferDateItem'

const Offer = ({ offer }: { offer: OfferWithNotes }) => {
    return (
        <div className='grid grid-cols-[66%_33%] h-full w-full gap-4'>
            <MainInfo offer={offer} />
            <div className='border-l border-neutral-800 pl-4'>
                <ColumnInfo offer={offer} />
            </div>
        </div>
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

const ColumnInfo = ({ offer }: { offer: OfferWithNotes }) => {
    const { source, status, expiresAt, dateAdded, file, tags } = offer
    return (
        <div className='flex flex-col gap-2'>
            <OfferStatus status={status} offerId={offer.id} />
            <Source source={source} />
            <OfferDateItem name='Expires At' value={expiresAt} offerId={offer.id} field='expiresAt' />
            <OfferDateItem name='Date Added' value={dateAdded} offerId={offer.id} field='dateAdded' />
            <Tags tags={tags} offerId={offer.id} />
            <ResumeSelect selectedFile={file ? file : null} offerId={offer.id} />
            <CheckAI offer={offer} />
        </div>
    )
}

export default Offer;