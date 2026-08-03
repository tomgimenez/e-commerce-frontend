import { Button } from "@/components/ui/button";
import { 
  Minus, 
  Plus, 
  Trash2, 
} from "lucide-react";
import { Link } from "react-router";
import { useCart } from "@/shop/hooks/useCart";
import { Breadcrumbs } from "@/shop/components/Breadcrumbs";
import { OrderSummary } from "@/shop/components/order/OrderSummary";
import type { Book } from "@/interfaces/book.interface";
import { currencyFormatter } from "@/lib/currency-formatter";

export const CartPage = () => {

  const { cart, removeItem, updateItem } = useCart();
  const cartItems = cart?.items || [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  ) || 0;

  return (
    <>

      <Breadcrumbs
        items={[
          { label: 'Your Cart' }
        ]} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content */}
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
                        {(item.product as Book).attributes.author}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-primary font-semibold">
                          ${currencyFormatter(item.unitPrice)}
                        </span>
                        {item.unitPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${currencyFormatter(item.unitPrice)}
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
                            data-testid='minus-button'
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
                            data-testid='plus-button'
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
                        {currencyFormatter(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                )
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-end text-lg text-foreground">
                    <span>Subtotal: {currencyFormatter(subtotal)}</span>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Link to={`/checkout/shipping`}>
                    <Button>
                      Continue to Shipping
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <OrderSummary />

      </div>


    </>
  );
}
