import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { day: "Mon", visitors: 1240, conversions: 62 },
  { day: "Tue", visitors: 1580, conversions: 84 },
  { day: "Wed", visitors: 1420, conversions: 71 },
  { day: "Thu", visitors: 1890, conversions: 103 },
  { day: "Fri", visitors: 2340, conversions: 142 },
  { day: "Sat", visitors: 2780, conversions: 178 },
  { day: "Sun", visitors: 2210, conversions: 121 },
]

const chartConfig = {
  visitors: { label: "Visitors", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-4)" },
} satisfies ChartConfig

export function VisitorsChart() {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Weekly Traffic</h3>
        <p className="text-sm text-muted-foreground">Visitors and conversions this week</p>
      </div>
      <div className="p-6">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
