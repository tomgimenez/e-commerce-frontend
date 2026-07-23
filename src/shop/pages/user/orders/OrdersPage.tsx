import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

type OrderStatus = "processing" | "shipped" | "delivered" | "pending" | "cancelled";

interface OrderItem {
  title: string;
  author: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  trackingNumber?: string;
  items: OrderItem[];
}

const orders: Order[] = [
  {
    id: "LV-7821",
    date: "December 15, 2024",
    status: "delivered",
    total: 74.97,
    trackingNumber: "TRK-889201",
    items: [
      {
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        price: 18.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=200&h=300&fit=crop",
      },
      {
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        price: 19.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop",
      },
    ],
  },
  {
    id: "LV-7802",
    date: "December 8, 2024",
    status: "shipped",
    total: 52.98,
    trackingNumber: "TRK-889145",
    items: [
      {
        title: "A Game of Thrones",
        author: "George R.R. Martin",
        price: 22.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
      },
      {
        title: "Mistborn: The Final Empire",
        author: "Brandon Sanderson",
        price: 17.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&h=300&fit=crop",
      },
    ],
  },
  {
    id: "LV-7788",
    date: "November 28, 2024",
    status: "processing",
    total: 29.99,
    items: [
      {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        price: 16.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop",
      },
    ],
  },
  {
    id: "LV-7754",
    date: "November 12, 2024",
    status: "cancelled",
    total: 15.99,
    items: [
      {
        title: "Circe",
        author: "Madeline Miller",
        price: 15.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1610882099717-7d3cf1c1c739?w=200&h=300&fit=crop",
      },
    ],
  },
];

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: typeof Package; className: string }
> = {
  processing: {
    label: "Processing",
    icon: Clock,
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export default function OrdersPage() {
  const [statusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(orders[0]?.id ?? null);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
      <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              My Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your enchanted purchases
            </p>
          </div>
          <Select value={statusFilter} /* onValueChange={setStatusFilter} */>
            <SelectTrigger className="w-full sm:w-48 bg-card border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders list */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              No orders found
            </h2>
            <p className="text-muted-foreground mb-6">
              You have no orders with this status yet.
            </p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse the collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              const isExpanded = expandedId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  {/* Order header */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : order.id)
                    }
                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-left hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.date} · {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-15 sm:pl-0">
                      <Badge
                        variant="outline"
                        className={cn("gap-1.5 font-medium", config.className)}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </Badge>
                      <span className="font-semibold text-foreground">
                        ${order.total.toFixed(2)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-border p-5 space-y-4">
                      {order.items.map((item) => (
                        <div key={item.title} className="flex items-center gap-4">
                          <div className="h-20 w-14 bg-secondary rounded-md overflow-hidden shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.author}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                        {order.trackingNumber ? (
                          <p className="text-sm text-muted-foreground">
                            Tracking:{" "}
                            <span className="text-foreground font-medium">
                              {order.trackingNumber}
                            </span>
                          </p>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No tracking available yet
                          </span>
                        )}
                        <div className="flex gap-2">
                          {(order.status === "shipped" ||
                            order.status === "delivered") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border"
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Track Order
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Buy Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>
  );
}
