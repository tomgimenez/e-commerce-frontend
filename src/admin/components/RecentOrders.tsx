import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const orders = [
  {
    id: "ORD-7821",
    customer: "Gandalf Grey",
    email: "gandalf@middleearth.com",
    product: "The Fellowship of the Ring",
    amount: "$24.99",
    status: "completed",
    date: "2 hours ago"
  },
  {
    id: "ORD-7820",
    customer: "Harry Potter",
    email: "harry@hogwarts.edu",
    product: "The Silmarillion",
    amount: "$32.99",
    status: "processing",
    date: "4 hours ago"
  },
  {
    id: "ORD-7819",
    customer: "Frodo Baggins",
    email: "frodo@shire.com",
    product: "A Game of Thrones",
    amount: "$29.99",
    status: "completed",
    date: "6 hours ago"
  },
  {
    id: "ORD-7818",
    customer: "Hermione Granger",
    email: "hermione@hogwarts.edu",
    product: "The Name of the Wind",
    amount: "$27.99",
    status: "pending",
    date: "8 hours ago"
  },
  {
    id: "ORD-7817",
    customer: "Aragorn Elessar",
    email: "aragorn@gondor.gov",
    product: "The Way of Kings",
    amount: "$34.99",
    status: "completed",
    date: "12 hours ago"
  },
]

const statusStyles = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export const RecentOrders = () => {
  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
        <p className="text-sm text-muted-foreground">Latest transactions from your store</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground">Order</TableHead>
              <TableHead className="text-muted-foreground">Customer</TableHead>
              <TableHead className="text-muted-foreground hidden md:table-cell">Product</TableHead>
              <TableHead className="text-muted-foreground">Amount</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground hidden sm:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{order.product}</TableCell>
                <TableCell className="font-medium text-foreground">{order.amount}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "capitalize",
                      statusStyles[order.status as keyof typeof statusStyles]
                    )}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
