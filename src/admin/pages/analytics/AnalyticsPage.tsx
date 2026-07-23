import { StatsCard } from "@/admin/components/StatsCard"
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { RevenueChart } from "./RevenueChart"
import { VisitorsChart } from "./VisitorsChart"
import { CategoryChart } from "./CategoryChart"
import { TopProducts } from "./TopProducts"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Track your store&apos;s performance and customer insights.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value="$74,892"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          description="from last month"
        />
        <StatsCard
          title="Conversion Rate"
          value="5.8%"
          change="+0.6%"
          changeType="positive"
          icon={TrendingUp}
          description="from last month"
        />
        <StatsCard
          title="Avg. Order Value"
          value="$58.30"
          change="+3.2%"
          changeType="positive"
          icon={ShoppingCart}
          description="from last month"
        />
        <StatsCard
          title="New Customers"
          value="1,429"
          change="-2.1%"
          changeType="negative"
          icon={Users}
          description="from last month"
        />
      </div>

      {/* Revenue Chart - full width */}
      <RevenueChart />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <VisitorsChart />
        <CategoryChart />
      </div>

      {/* Top Products */}
      <TopProducts />
    </div>
  )
}
