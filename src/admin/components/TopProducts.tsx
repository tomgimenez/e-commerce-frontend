import { TrendingUp } from "lucide-react"

const products = [
  {
    id: 1,
    name: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    sales: 847,
    revenue: "$21,175",
    trend: "+12%"
  },
  {
    id: 2,
    name: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    sales: 723,
    revenue: "$18,075",
    trend: "+8%"
  },
  {
    id: 3,
    name: "A Game of Thrones",
    author: "George R.R. Martin",
    sales: 612,
    revenue: "$18,348",
    trend: "+15%"
  },
  {
    id: 4,
    name: "The Name of the Wind",
    author: "Patrick Rothfuss",
    sales: 498,
    revenue: "$13,944",
    trend: "+5%"
  },
  {
    id: 5,
    name: "The Way of Kings",
    author: "Brandon Sanderson",
    sales: 456,
    revenue: "$15,960",
    trend: "+22%"
  },
]

export const TopProducts = () => {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Top Selling Books</h3>
        <p className="text-sm text-muted-foreground">Best performers this month</p>
      </div>
      <div className="divide-y divide-border">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-sm font-medium text-muted-foreground">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.author}</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-medium text-foreground">{product.revenue}</p>
              <p className="text-sm text-muted-foreground">{product.sales} sales</p>
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{product.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
