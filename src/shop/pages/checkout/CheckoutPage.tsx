import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronRight, 
  Minus, 
  Plus, 
  Trash2, 
  CreditCard, 
  Truck, 
  ShieldCheck,
  Lock
} from "lucide-react";
import { Link } from "react-router";
import { useCart } from "@/shop/hooks/useCart";

export const CheckoutPage = () => {

  const { cart, removeItem, updateItem } = useCart();
  const cartItems = cart?.items || [];

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<"cart" | "shipping" | "payment">("cart");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  ) || 0;

  const shippingCost = shippingMethod === "express" ? 9.99 : shippingMethod === "standard" ? 4.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Checkout</span>
        </nav>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { key: "cart", label: "Cart" },
            { key: "shipping", label: "Shipping" },
            { key: "payment", label: "Payment" },
          ].map((s, index) => (
            <div key={s.key} className="flex items-center gap-4">
              <button
                onClick={() => setStep(s.key as typeof step)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  step === s.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 text-sm font-medium">
                  {index + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {index < 2 && (
                <div className="hidden sm:block h-px w-12 bg-border" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cart Step */}
            {step === "cart" && (
              <div className="bg-card border border-border rounded-xl p-6">
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
                    ))}

                    <div className="flex justify-end pt-4">
                      <Button onClick={() => setStep("shipping")}>
                        Continue to Shipping
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Shipping Step */}
            {step === "shipping" && (
              <div className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Shipping Address
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" placeholder="123 Main Street" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="(555) 123-4567" />
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Shipping Method
                  </h2>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={setShippingMethod}
                    className="space-y-3"
                  >
                    <label
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        shippingMethod === "free"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="free" id="free" />
                        <div>
                          <p className="font-medium text-foreground">
                            Free Shipping
                          </p>
                          <p className="text-sm text-muted-foreground">
                            7-10 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-foreground">Free</span>
                    </label>
                    <label
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        shippingMethod === "standard"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <div>
                          <p className="font-medium text-foreground">
                            Standard Shipping
                          </p>
                          <p className="text-sm text-muted-foreground">
                            3-5 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-foreground">$4.99</span>
                    </label>
                    <label
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        shippingMethod === "express"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <div>
                          <p className="font-medium text-foreground">
                            Express Shipping
                          </p>
                          <p className="text-sm text-muted-foreground">
                            1-2 business days
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-foreground">$9.99</span>
                    </label>
                  </RadioGroup>
                </div>

                <div className="flex gap-4 justify-between">
                  <Button variant="outline" onClick={() => setStep("cart")}>
                    Back to Cart
                  </Button>
                  <Button onClick={() => setStep("payment")}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="space-y-6">
                {/* Payment Method */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Payment Method
                  </h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        Credit / Debit Card
                      </span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value="paypal" id="paypal" />
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                      </svg>
                      <span className="font-medium text-foreground">PayPal</span>
                    </label>
                  </RadioGroup>
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Card Details
                    </h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 justify-between">
                  <Button variant="outline" onClick={() => setStep("shipping")}>
                    Back to Shipping
                  </Button>
                  <Button className="gap-2">
                    <Lock className="h-4 w-4" />
                    Place Order - ${total.toFixed(2)}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              {/* Mini Cart */}
              <div className="space-y-3 mb-6">
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
                <div className="flex justify-between">
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
        </div>
      </main>
    </div>
  );
}
