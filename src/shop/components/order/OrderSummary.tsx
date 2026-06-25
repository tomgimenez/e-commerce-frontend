import { Separator } from "@/components/ui/separator"
import { getShippingMethods } from "@/shop/api/shipping-methods.api";
import { useCart } from "@/shop/hooks/useCart";
import { useCheckoutStore } from "@/shop/store/checkout.store";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, ShieldCheck, Truck } from "lucide-react"

export const OrderSummary = () => {

  const { cart } = useCart();
  const cartItems = cart?.items || [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  ) || 0;

  const { data: shippingMethods } = useQuery({
    queryKey: ['shipping-methods',],
    queryFn: getShippingMethods,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { shippingMethodId } = useCheckoutStore();
  const selectedShippingMethod = shippingMethods?.find(s => s.id === shippingMethodId);
  const shippingCost = selectedShippingMethod?.price || 0;
  const tax = Math.round(subtotal * 0.12 * 100) / 100;
  const total = subtotal + shippingCost + tax;

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
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (8%)</span>
            <span className="text-foreground">$ {tax}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-semibold">
          <span className="text-foreground">Total</span>
            <span className="text-primary">$ {total}</span>
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