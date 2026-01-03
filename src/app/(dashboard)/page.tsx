import { getDashboardStats } from '@/lib/services/analytics'
import { StatCard } from '@/components/analytics/stat-card'
import { PayoutSummary } from '@/components/analytics/payout-summary'
import { Banknote, TrendingUp, ShoppingBag, AlertCircle, DollarSign, PieChart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const data = await getDashboardStats()

    if (!data) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Failed to load analytics data.
            </div>
        )
    }

    const { stats, partnerPayouts } = data

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Revenue"
                    value={`${stats.totalRevenue.toLocaleString()} PKR`}
                    icon={Banknote}
                    description="From delivered orders"
                />

                <StatCard
                    title="Net Profit"
                    value={`${stats.profit.toLocaleString()} PKR`}
                    icon={DollarSign}
                    trend={stats.profit >= 0 ? 'up' : 'down'}
                    trendValue={stats.roi.toFixed(1) + '% ROI'}
                />

                <StatCard
                    title="Total Expenses"
                    value={`${stats.totalExpenses.toLocaleString()} PKR`}
                    icon={TrendingUp}
                    description="Excluding fixed costs"
                />

                <StatCard
                    title="Delivered Orders"
                    value={stats.deliveredOrders.toString()}
                    icon={ShoppingBag}
                    description={`Total orders: ${stats.totalOrders}`}
                />

                <StatCard
                    title="Return Rate"
                    value={`${stats.returnRate.toFixed(1)}%`}
                    icon={AlertCircle}
                    trend={stats.returnRate > 5 ? 'down' : 'neutral'}
                    description={`${stats.returnedOrders} returned`}
                />

                <StatCard
                    title="Fixed Costs"
                    value={`${stats.totalFixedCosts.toLocaleString()} PKR`}
                    icon={PieChart}
                    description="Cost of goods sold"
                />
            </div>

            <PayoutSummary payouts={partnerPayouts} />
        </div>
    )
}
