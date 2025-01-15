'use client'

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Pie, PieChart, LabelList, Label } from "recharts"
import { useMediaQuery } from "react-responsive"
import { ApplicationResponseStats } from "@/lib/types/stats"
import NoData from "./NoData"

interface ApplicationsAndResponsesProps {
    stats: ApplicationResponseStats
}

const ApplicationsAndResponses = ({ stats }: ApplicationsAndResponsesProps) => {
    const isSmallMobile = useMediaQuery({ maxWidth: 390 })
    const chartData = [
        { status: 'sentWithoutResponse', offers: stats.sentWithoutResponse, fill: 'var(--color-sentWithoutResponse)' },
        { status: 'sentWithResponse', offers: stats.sentWithResponse, fill: 'var(--color-sentWithResponse)' },
    ]

    const chartConfig = {
        offers: {
            label: 'Offers',
        },
        sentWithoutResponse: {
            label: `No response`,
            color: 'hsl(var(--chart-1))'
        },
        sentWithResponse: {
            label: `Response`,
            color: 'hsl(var(--chart-2))'
        }
    } satisfies ChartConfig

    if (stats.sentWithoutResponse === 0 && stats.sentWithResponse === 0) {
        return <NoData />
    }

    return (
        <ChartContainer config={chartConfig} className="h-[400px] -mb-[150px] -mt-[80px] md:-mt-[40px] w-full">
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="offers"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={isSmallMobile ? 60 : 90}
                    startAngle={180}
                    endAngle={0}
                    isAnimationActive={false}
                    cornerRadius={10}
                    paddingAngle={2}
                >
                    <LabelList
                        dataKey="offers"
                        position="insideLeft"
                        offset={8}
                        stroke="white"
                        fontSize={16}
                    />
                    <Label
                    content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) - 20}
                                    className="fill-gray-200 text-2xl font-bold"
                                >
                                    {stats.sentWithoutResponse + stats.sentWithResponse}
                                </tspan>
                                <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) - 4}
                                    className="fill-gray-300"
                                >
                                    Applications
                                </tspan>
                            </text>
                        )
                        }
                    }}
                    />
                </Pie>
                <ChartTooltip
                content={<ChartTooltipContent indicator="line" className="bg-black border-none" />}
                />
                <ChartLegend className="text-base -mt-[190px]" content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
        </ChartContainer>
    )
}

export default ApplicationsAndResponses