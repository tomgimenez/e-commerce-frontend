import { useState } from "react"
import { Search, MoreHorizontal, Eye, Mail, Ban, UserCheck } from "lucide-react"
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

const customers = [
  {
    id: "USR-1042",
    name: "Gandalf Grey",
    email: "gandalf@middleearth.com",
    orders: 12,
    spent: "$894.88",
    status: "active",
    joined: "Jan 3, 2024",
  },
  {
    id: "USR-1041",
    name: "Harry Potter",
    email: "harry@hogwarts.edu",
    orders: 8,
    spent: "$421.42",
    status: "active",
    joined: "Feb 14, 2024",
  },
  {
    id: "USR-1040",
    name: "Hermione Granger",
    email: "hermione@hogwarts.edu",
    orders: 21,
    spent: "$1,284.79",
    status: "active",
    joined: "Feb 14, 2024",
  },
  {
    id: "USR-1039",
    name: "Frodo Baggins",
    email: "frodo@shire.com",
    orders: 5,
    spent: "$189.95",
    status: "active",
    joined: "Mar 2, 2024",
  },
  {
    id: "USR-1038",
    name: "Aragorn Elessar",
    email: "aragorn@gondor.gov",
    orders: 3,
    spent: "$142.97",
    status: "inactive",
    joined: "Mar 21, 2024",
  },
  {
    id: "USR-1037",
    name: "Legolas Greenleaf",
    email: "legolas@mirkwood.com",
    orders: 1,
    spent: "$34.99",
    status: "disabled",
    joined: "Apr 8, 2024",
  },
  {
    id: "USR-1036",
    name: "Ron Weasley",
    email: "ron@hogwarts.edu",
    orders: 7,
    spent: "$312.43",
    status: "active",
    joined: "May 19, 2024",
  },
  {
    id: "USR-1035",
    name: "Samwise Gamgee",
    email: "sam@shire.com",
    orders: 9,
    spent: "$476.51",
    status: "active",
    joined: "Jun 1, 2024",
  },
]

const statusStyles = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  inactive: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  disabled: "bg-red-500/10 text-red-500 border-red-500/20",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter] = useState("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.id.toLowerCase().includes(search.toLowerCase()) ||
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
        <p className="text-muted-foreground">Manage your shop&apos;s registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{customers.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-semibold text-foreground mt-1">
            {customers.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Inactive</p>
          <p className="text-2xl font-semibold text-foreground mt-1">
            {customers.filter((c) => c.status === "inactive").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Disabled</p>
          <p className="text-2xl font-semibold text-foreground mt-1">
            {customers.filter((c) => c.status === "disabled").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Orders</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Total Spent</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Joined</TableHead>
                <TableHead className="text-muted-foreground w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{customer.orders}</TableCell>
                  <TableCell className="font-medium text-foreground hidden md:table-cell">{customer.spent}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        statusStyles[customer.status as keyof typeof statusStyles]
                      )}
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{customer.joined}</TableCell>
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
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {customer.status === "disabled" ? (
                          <DropdownMenuItem className="text-green-500 focus:text-green-500">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Enable Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Ban className="h-4 w-4 mr-2" />
                            Disable Account
                          </DropdownMenuItem>
                        )}
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
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
