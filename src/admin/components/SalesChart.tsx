import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", sales: 4200, orders: 180 },
  { name: "Feb", sales: 3800, orders: 160 },
  { name: "Mar", sales: 5100, orders: 220 },
  { name: "Apr", sales: 4600, orders: 200 },
  { name: "May", sales: 5400, orders: 240 },
  { name: "Jun", sales: 6200, orders: 280 },
  { name: "Jul", sales: 5800, orders: 260 },
  { name: "Aug", sales: 7100, orders: 320 },
  { name: "Sep", sales: 6800, orders: 300 },
  { name: "Oct", sales: 7400, orders: 340 },
  { name: "Nov", sales: 8200, orders: 380 },
  { name: "Dec", sales: 9100, orders: 420 },
]

export const SalesChart = () => {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Sales Overview</h3>
            <p className="text-sm text-muted-foreground">Monthly revenue for the past year</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <span className="text-muted-foreground">Orders</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted-foreground)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--muted-foreground)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)"
                }}
                // formatter={(value: number, name: string) => [
                //   name === "sales" ? `$${value.toLocaleString()}` : value,
                //   name === "sales" ? "Revenue" : "Orders"
                // ]}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
