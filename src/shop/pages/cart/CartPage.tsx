import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Minus, 
  Plus, 
  Trash2, 
  CreditCard, 
  Truck, 
  ShieldCheck
} from "lucide-react";
import { Link } from "react-router";
import { useCart } from "@/shop/hooks/useCart";
import { Breadcrumbs } from "@/shop/components/Breadcrumbs";

export const CartPage = () => {

  const { cart, removeItem, updateItem } = useCart();
  const cartItems = cart?.items || [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-background">

      <Breadcrumbs
        items={[
          { label: 'Cart' }
        ]} />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Cart Step */}
          <div className="bg-card border border-border rounded-xl p-6 w-full">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Your Cart ({cartItems.length} items)
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Your cart is empty
                </p>
                <Link to="/">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-secondary/50 rounded-lg"
                  >
                    <Link to={`/product/${item.id}`}>
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                          {item.product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-primary font-semibold">
                          ${item.unitPrice}
                        </span>
                        {item.unitPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.unitPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            disabled={item.quantity <= 1}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateItem({...item, quantity: item.quantity - 1})}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateItem({...item, quantity: item.quantity + 1})}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                )
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-end text-lg text-foreground">
                    <span>Subtotal: ${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button>
                    Continue to Shipping
                  </Button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Order Summary Sidebar */}
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
                    ${(item.unitPrice * item.quantity).toFixed(2)}
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
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div> 
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>*/}
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
      </div>
    </div>
  );
}
