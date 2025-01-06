import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon } from "lucide-react"

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
                <StatsCard />
                <StatsCard />
                <StatsCard />
                <StatsCard />
                <StatsCard />
            </div>
        </div>
    )
}

const StatsCard = () => {
    return (
        <Card className="bg-gray-950 border-none">
            <CardHeader>
                <CardTitle>
                    <BarChartIcon className="w-5 h-5" />
                    CARD TITLE
                </CardTitle>
            </CardHeader>
            <CardContent>

            </CardContent>
        </Card>
    )
}

export default Stats