import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { month: "Jan", revenue: 4200, orders: 180 },
  { month: "Feb", revenue: 3800, orders: 160 },
  { month: "Mar", revenue: 5100, orders: 220 },
  { month: "Apr", revenue: 4600, orders: 200 },
  { month: "May", revenue: 5400, orders: 240 },
  { month: "Jun", revenue: 6200, orders: 280 },
  { month: "Jul", revenue: 5800, orders: 260 },
  { month: "Aug", revenue: 7100, orders: 320 },
  { month: "Sep", revenue: 6800, orders: 300 },
  { month: "Oct", revenue: 7400, orders: 340 },
  { month: "Nov", revenue: 8200, orders: 380 },
  { month: "Dec", revenue: 9100, orders: 420 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Revenue &amp; Orders</h3>
        <p className="text-sm text-muted-foreground">Monthly performance over the past year</p>
      </div>
      <div className="p-6">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill="url(#fillRevenue)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="var(--color-orders)"
              strokeWidth={2}
              fill="url(#fillOrders)"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
