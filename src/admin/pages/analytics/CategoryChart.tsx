import { Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { category: "Epic Fantasy", sales: 3200, fill: "var(--color-epic)" },
  { category: "Dark Fantasy", sales: 2400, fill: "var(--color-dark)" },
  { category: "High Fantasy", sales: 1800, fill: "var(--color-high)" },
  { category: "Young Adult", sales: 1500, fill: "var(--color-ya)" },
  { category: "Mythic", sales: 900, fill: "var(--color-mythic)" },
]

const chartConfig = {
  sales: { label: "Sales" },
  epic: { label: "Epic Fantasy", color: "var(--chart-1)" },
  dark: { label: "Dark Fantasy", color: "var(--chart-2)" },
  high: { label: "High Fantasy", color: "var(--chart-3)" },
  ya: { label: "Young Adult", color: "var(--chart-4)" },
  mythic: { label: "Mythic", color: "var(--chart-5)" },
} satisfies ChartConfig

export function CategoryChart() {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Sales by Category</h3>
        <p className="text-sm text-muted-foreground">Distribution across genres</p>
      </div>
      <div className="p-6">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="sales" hideLabel />} />
            <Pie data={data} dataKey="sales" nameKey="category" innerRadius={60} strokeWidth={2} />
            <ChartLegend content={<ChartLegendContent nameKey="category" />} className="flex-wrap gap-2" />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  )
}
