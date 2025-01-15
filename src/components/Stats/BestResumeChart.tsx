import { FileStats } from "@/lib/types/stats"

interface BestResumeChartProps {
    stats: FileStats[]
}

const BestResumeChart = ({stats}: BestResumeChartProps) => {
    
    return (
        <div className="w-full flex justify-center items-center">
            <h1 className="text-2xl font-bold text-gray-600">No available yet</h1>
            <div className="hidden">
                {stats[0].file.fileUrl}
            </div>
        </div>
    )
}

export default BestResumeChart