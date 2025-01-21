import ApplicationsAndResponses from "@/components/Stats/ApplicationsAndResponses"
import BestResumeChart from "@/components/Stats/BestResumeChart"
import FinishedStatusChart from "@/components/Stats/FinishedStatusChart"
import OffersBreakdown from "@/components/Stats/OffersBreakdown"
import StatsCard from "@/components/Stats/StatsCard"
import { getUserId } from "@/lib/auth/authActions"
import { getOffersBreakdown, getApplicationsAndResponses, getFinishedStatusChart, getBestResume } from "@/lib/actions/stats"
import { BarChartIcon, ChartBarBigIcon, ChartPieIcon, ChartBarIcon, FileBarChartIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { OffersBreakdownStats, ApplicationResponseStats, FinishedStatusStats, FileStats } from "@/lib/types/stats"

export const dynamic = 'force-dynamic'

const Stats = async () => {
    const userId = await getUserId()
    if (!userId) {
        return redirect('/login')
    }

    return (
        <div className="flex flex-col gap-2 h-full">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5" />
                    Stats
                </h1>
                <p className="text-sm text-gray-400">
                    Get insights about your applications
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 h-full mt-3">
                <StatsCard<OffersBreakdownStats> 
                    userId={userId} 
                    title="Offers Breakdown" 
                    icon={<ChartBarBigIcon className="h-4 w-4" />} 
                    description="See the current status of your job applications represented in numbers and stages." 
                    getData={getOffersBreakdown}
                >
                    {(data) => <OffersBreakdown stats={data} />}
                </StatsCard>
                <StatsCard<ApplicationResponseStats>
                    userId={userId} 
                    title="Sent Applications and Responses" 
                    icon={<ChartPieIcon className="h-4 w-4" />} 
                    description="Track how many of your sent applications received responses and how many are still unanswered." 
                    getData={getApplicationsAndResponses}
                >
                    {(data) => <ApplicationsAndResponses stats={data} />}
                </StatsCard>
                <StatsCard<FinishedStatusStats[]>
                    userId={userId} 
                    title="Finished Applications" 
                    icon={<ChartBarIcon className="h-4 w-4" />} 
                    description="Discover the most common reasons behind completed applications, whether successful or not." 
                    getData={getFinishedStatusChart}
                >
                    {(data) => <FinishedStatusChart stats={data} />}
                </StatsCard>
                <StatsCard<FileStats[]>
                    userId={userId} 
                    title="Best Resumes" 
                    icon={<FileBarChartIcon className="h-4 w-4" />} 
                    description="Identify which of your resumes received the highest number of responses." 
                    getData={getBestResume}
                >
                    {(data) => <BestResumeChart stats={data} />}
                </StatsCard>
            </div>

        </div>

    )
}

export default Stats