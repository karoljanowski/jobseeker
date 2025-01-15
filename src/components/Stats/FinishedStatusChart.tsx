'use client'

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Bar, BarChart, YAxis, XAxis, LabelList } from "recharts"
import { FinishedStatusStats } from "@/lib/types/stats"
import NoData from "./NoData"

interface FinishedStatusChartProps {
    stats: FinishedStatusStats[]
}

const chartConfig = {
    finishedStatus: {
        label: 'Finished Status',
    },
    NO_RESPONSE: {
        label: 'No Response',
        color: 'hsl(var(--chart-1))'
    },
    HR_REJECTED: {
        label: 'HR Rejected',
        color: 'hsl(var(--chart-1))'
    },
    TECHNICAL_REJECTED: {
        label: 'Technical Rejected',
        color: 'hsl(var(--chart-1))'
    },
    HOME_ASSIGNMENT_REJECTED: {
        label: 'Home Assignment Rejected',
        color: 'hsl(var(--chart-1))'
    },
    FINAL_REJECTED: {
        label: 'Final Rejected',
        color: 'hsl(var(--chart-1))'
    },
    OFFER_DECLINED: {
        label: 'Offer Declined',
        color: 'hsl(var(--chart-1))'
    },
    OFFER_ACCEPTED: {
        label: 'Offer Accepted',
        color: 'hsl(var(--chart-1))'
    }
} satisfies ChartConfig

const FinishedStatusChart = ({ stats }: FinishedStatusChartProps) => {
    const chartData = stats.map((stat) => ({
        finishedStatus: stat.finishedStatus, offers: stat._count.finishedStatus, fill: `var(--color-${stat.finishedStatus})`
    }))

    if (chartData.length === 0) {
        return <NoData />
    }

    return (
        <ChartContainer config={chartConfig} style={{ height: chartData.length * 50 }} className="w-full -mt-2">
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{ right: 16 }}
                maxBarSize={40}
            >
                <YAxis dataKey="finishedStatus" type="category" tickLine={false} axisLine={false} tickMargin={10} hide />
                <XAxis dataKey="offers" type="number" hide />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" className="bg-black border-none" />}
                />
                <Bar dataKey="offers" layout="vertical" radius={4} fill="var(--color-finishedStatus)" >
                    <LabelList
                        dataKey="finishedStatus"
                        position="insideLeft"
                        offset={8}
                        stroke="white"
                        fontSize={14}
                        formatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' ')}
                    />
                    <LabelList
                        dataKey="offers"
                        position="right"
                        offset={8}
                        stroke="white"
                        fontSize={12}
                    />
                </Bar>  
            </BarChart>
        </ChartContainer>
    )
}

export default FinishedStatusChart