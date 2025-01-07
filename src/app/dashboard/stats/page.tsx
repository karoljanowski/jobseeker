import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon, ChartPieIcon } from "lucide-react"

const Stats = () => {
    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="flex flex-col mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5" />
                    Stats
                </h1>
                <p className="text-sm text-gray-400">
                    Your stats
                </p>
            </div>
            <div className="grid grid-cols-4 grid-rows-2 gap-2">
                <StatsCard 
                    title="OFFER DISTRIBUTION" 
                    icon={<ChartPieIcon className="w-5 h-5" />} 
                    children={<div>test</div>} 
                />
            </div>
        </div>
    )
}

const StatsCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => {
    return (
        <Card className="bg-gray-700 border-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

export default Stats