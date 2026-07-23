import { useState } from "react"
import { Search, MoreHorizontal, Eye, Truck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const orders = [
  {
    id: "ORD-7821",
    customer: "Gandalf Grey",
    email: "gandalf@middleearth.com",
    items: 3,
    total: "$74.97",
    status: "completed",
    paymentStatus: "paid",
    date: "Dec 15, 2024"
  },
  {
    id: "ORD-7820",
    customer: "Harry Potter",
    email: "harry@hogwarts.edu",
    items: 2,
    total: "$52.98",
    status: "processing",
    paymentStatus: "paid",
    date: "Dec 15, 2024"
  },
  {
    id: "ORD-7819",
    customer: "Frodo Baggins",
    email: "frodo@shire.com",
    items: 1,
    total: "$29.99",
    status: "shipped",
    paymentStatus: "paid",
    date: "Dec 14, 2024"
  },
  {
    id: "ORD-7818",
    customer: "Hermione Granger",
    email: "hermione@hogwarts.edu",
    items: 4,
    total: "$119.96",
    status: "pending",
    paymentStatus: "pending",
    date: "Dec 14, 2024"
  },
  {
    id: "ORD-7817",
    customer: "Aragorn Elessar",
    email: "aragorn@gondor.gov",
    items: 2,
    total: "$62.98",
    status: "completed",
    paymentStatus: "paid",
    date: "Dec 13, 2024"
  },
  {
    id: "ORD-7816",
    customer: "Legolas Greenleaf",
    email: "legolas@mirkwood.com",
    items: 1,
    total: "$34.99",
    status: "cancelled",
    paymentStatus: "refunded",
    date: "Dec 13, 2024"
  },
  {
    id: "ORD-7815",
    customer: "Ron Weasley",
    email: "ron@hogwarts.edu",
    items: 3,
    total: "$84.97",
    status: "shipped",
    paymentStatus: "paid",
    date: "Dec 12, 2024"
  },
  {
    id: "ORD-7814",
    customer: "Samwise Gamgee",
    email: "sam@shire.com",
    items: 2,
    total: "$47.98",
    status: "completed",
    paymentStatus: "paid",
    date: "Dec 12, 2024"
  },
]

const statusStyles = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

const paymentStyles = {
  paid: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  refunded: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-transparent focus:border-primary"
          />
        </div>
        <Select value={statusFilter} /* onValueChange={setStatusFilter} */>
          <SelectTrigger className="w-full sm:w-45 bg-muted/50 border-transparent">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Order</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Items</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Payment</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-muted-foreground w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground hidden sm:block">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{order.items}</TableCell>
                  <TableCell className="font-medium text-foreground">{order.total}</TableCell>
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
                  <TableCell className="hidden lg:table-cell">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize",
                        paymentStyles[order.paymentStatus as keyof typeof paymentStyles]
                      )}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{order.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="h-4 w-4 mr-2" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
