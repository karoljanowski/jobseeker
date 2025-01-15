'use client'

import { BriefcaseIcon, CheckCircle, SaveIcon, SendIcon, Users2 } from "lucide-react"
import { OffersBreakdownStats } from "@/lib/types/stats"

interface OffersBreakdownProps {
    stats: OffersBreakdownStats
}

const OffersBreakdown = ({ stats }: OffersBreakdownProps) => {
    const data = [
        { status: 'Saved', offers: stats.savedOffers, icon: <SaveIcon className="w-4 h-4 text-red-400" />, color: 'bg-red-500/10' },
        { status: 'Sent', offers: stats.sentOffers, icon: <SendIcon className="w-4 h-4 text-blue-400" />, color: 'bg-blue-500/10' },
        { status: 'Interview', offers: stats.interviewOffers, icon: <Users2 className="w-4 h-4 text-green-400" />, color: 'bg-green-500/10' },
        { status: 'Finished', offers: stats.finishedOffers, icon: <CheckCircle className="w-4 h-4 text-yellow-400" />, color: 'bg-yellow-500/10' },
    ]
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 grid-rows-2 w-full">
            <div className="col-span-2 flex items-center justify-center gap-2 bg-gray-800 rounded-md p-4">
                <div className="rounded-full p-2 flex items-center justify-center bg-purple-500/20" >
                    <BriefcaseIcon className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-2xl leading-none font-bold">Total offers</span>
                <span className="text-2xl leading-none font-bold">{stats.totalOffers}</span>
            </div>
            {data.map((item) => (
                <div key={item.status} className="bg-gray-900 rounded-md p-4">
                    <span className="text-lg text-gray-300 font-bold">{item.status}</span>
                    <div className="flex items-center gap-2 mt-2">
                        <div className={`rounded-full p-2 flex items-center justify-center ${item.color}`} >
                            {item.icon}
                        </div>
                        <span className="text-3xl font-bold">{item.offers}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OffersBreakdown