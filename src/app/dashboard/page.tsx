import AddOffer from '@/components/Board/Offer/AddOffer/AddOffer';
import { Suspense } from 'react';
import OfferDialog from '@/components/Board/Offer/OfferDialog';
import { BookmarkCheckIcon } from 'lucide-react';
import Loader from '@/components/Loader';
import { getOffers } from '@/lib/actions/offers';
import Board from '@/components/Board/Board';

export const dynamic = 'force-dynamic'

const DashboardPage = () => {
    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BookmarkCheckIcon className="w-5 h-5" />
                        Board
                    </h1>
                    <p className="text-sm text-gray-400">
                        Manage your offers
                    </p>
                </div>
                <AddOffer/>
            </div>
            <Suspense fallback={<Loader />}>
                <BoardWrapper />
            </Suspense>
            <OfferDialog />
        </div>
    );
}

const BoardWrapper = async () => {
    const offers = await getOffers()
    return <Board offers={offers} />
}

export default DashboardPage;