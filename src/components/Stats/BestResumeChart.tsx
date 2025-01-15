import { FileStats } from "@/lib/types/stats"

interface BestResumeChartProps {
    stats: FileStats[]
}

const BestResumeChart = ({stats}: BestResumeChartProps) => {
    
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <p className="text-2xl font-bold text-gray-600">No available yet</p>
            <p className="text-gray-600">We are working on it!</p>
            <div className="hidden">
                {stats.length > 0 && stats[0].file.fileUrl}
            </div>
        </div>
    )
}

export default BestResumeChart