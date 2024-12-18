import AddOffer from '@/components/Board/AddOffer/AddOffer';
import Board from '@/components/Board/Board';
import { getOffers } from '../../lib/actions/offers';
import { Suspense } from 'react';
import Offer from '@/components/Board/Offer';
import { BookmarkCheckIcon } from 'lucide-react';

const DashboardPage = async () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BookmarkCheckIcon className="w-5 h-5" />
                    Board
                </h1>
                <AddOffer/>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <BoardWrapper />
            </Suspense>
            <Offer/>
        </div>
    );
}

const BoardWrapper = async () => {
    const offers = await getOffers()
    return <Board offers={offers} />
}

export default DashboardPage;