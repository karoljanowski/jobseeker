import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import { StatsResponse } from "@/lib/types/stats"

interface StatsCardProps<T> {
    title: string
    icon: React.ReactNode
    description: string
    children: (data: T) => React.ReactNode
    getData: (userId: number) => Promise<StatsResponse<T>>
    userId: number
}

const StatsCard = <T,>({ title, icon, description, children, getData, userId }: StatsCardProps<T>) => {
    return (
        <Card className="bg-gray-950/80 border-none flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex items-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <StatsCardData userId={userId} getData={getData}>
                        {children}
                    </StatsCardData>
                </Suspense>
            </CardContent>
        </Card>
    )
}

interface StatsCardDataProps<T> {
    children: (data: T) => React.ReactNode
    getData: (userId: number) => Promise<StatsResponse<T>>
    userId: number
}

const StatsCardData = async <T,>({ children, getData, userId }: StatsCardDataProps<T>) => {
    const stats = await getData(userId)
    if (!stats.success || !stats.data) {
        return <div>Failed to fetch stats</div>
    } 
    
    return children(stats.data)
}

export default StatsCard