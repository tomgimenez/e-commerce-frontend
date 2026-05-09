import { AdminTitle } from "@/admin/components/AdminTitle";
import { RecentOrders } from "@/admin/components/RecentOrders";
import { SalesChart } from "@/admin/components/SalesChart";
import { StatsCard } from "@/admin/components/StatsCard";
import { TopProducts } from "@/admin/components/TopProducts";
import { Users, DollarSign, ShoppingCart, Package } from "lucide-react";

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <AdminTitle title="Dashboard" subtitle="Welcome back! Here&apos;s what&apos;s happening with your store." />
    

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
          title="Orders"
          value="1,284"
          change="+8.2%"
          changeType="positive"
          icon={ShoppingCart}
          description="from last month"
        />
        <StatsCard
          title="Products"
          value="847"
          change="+23"
          changeType="positive"
          icon={Package}
          description="new this month"
        />
        <StatsCard
          title="Customers"
          value="12,492"
          change="+4.1%"
          changeType="positive"
          icon={Users}
          description="from last month"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart />
        <TopProducts />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  )
}
