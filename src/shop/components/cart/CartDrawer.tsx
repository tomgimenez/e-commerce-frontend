import { CheckCircle2, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useCart } from "@/shop/hooks/useCart";
import { isBook } from "@/interfaces/product.guards";
import type { CartItem } from "@/interfaces/cart.interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lastAdded: { title: string; } | null;
}

export function CartDrawer({isOpen, onClose, lastAdded}: Props) {

  const { cart, removeItem, updateItem } = useCart();
  const totalCount = cart?.items.length || 0;

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity === 0)
      removeItem(item.id);
    else
      updateItem({...item, quantity: newQuantity});
  }

  return (
    <Drawer direction="right" open={isOpen} onClose={onClose}>
      <DrawerContent className="bg-card">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-foreground">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Your Cart
              {totalCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalCount} {totalCount === 1 ? "item" : "items"})
                </span>
              )}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Just added banner */}
        {lastAdded && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              <span className="font-medium">{lastAdded.title}</span> was added to
              your cart.
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart?.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {cart?.items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.product.categories[0].name}
                    </span>
                    <h4 className="text-sm font-medium leading-tight text-foreground line-clamp-2">
                      {item.product.title}
                    </h4>
                    { isBook(item.product) && (
                      <p className="text-xs text-muted-foreground">{item.product.attributes.author}</p>
                    ) }
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-border">
                        <Button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          variant="ghost"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground"
                          variant="ghost"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeItem(item.id)}
                    className="self-start text-muted-foreground hover:text-destructive"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove {item.product.title}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {totalCount > 0 && (
          <DrawerFooter className="border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold text-foreground">
                {/* ${subtotal.toFixed(2)} */}
              </span>
            </div>
            <Link to="/checkout">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Proceed to Checkout
              </Button>
            </Link>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary"
              >
                Continue Shopping
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
