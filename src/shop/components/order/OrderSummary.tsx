import { Separator } from "@/components/ui/separator"
import { CreditCard, ShieldCheck, Truck } from "lucide-react"
import { useOrderSummary } from "./useOrderSummary";

export const OrderSummary = () => {

  const { cartItems, shippingCost, subtotal, taxes, total } = useOrderSummary();

  return (
    <div className="lg:col-span-1">
      <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Order Summary
        </h2>

        {/* Mini Cart */}
        <div className="space-y-3">
          {cartItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.product.images[0].url}
                alt={item.product.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {item.product.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-foreground">
                ${(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
          {cartItems.length > 3 && (
            <p className="text-sm text-muted-foreground text-center">
              +{cartItems.length - 3} more items
            </p>
          )}
        </div>

        <Separator className="my-4" />

        {/* Pricing */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">$ {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground">
              {shippingCost === 0 ? "Free" : `$ ${shippingCost}`}
            </span>
          </div> 
          {taxes?.map(tax => (
            <div className="flex justify-between" key={tax.id}>
              <span className="text-muted-foreground">{tax.name} ({tax.rate * 100}%)</span>
            <span className="text-foreground">$ {Math.round(subtotal * tax.rate * 100) / 100}</span>
          </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-semibold">
          <span className="text-foreground">Total</span>
            <span className="text-primary">$ {total.toFixed(2)}</span>
            </div>
        </div>

        {/* Trust Badges */}  
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Secure SSL Encryption</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Truck className="h-5 w-5 text-primary" />
            <span>Free returns within 30 days</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CreditCard className="h-5 w-5 text-primary" />
            <span>All major cards accepted</span>
          </div>
        </div>
      </div>
    </div>
  )
}