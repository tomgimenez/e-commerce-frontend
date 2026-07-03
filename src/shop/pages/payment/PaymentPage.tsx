import { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Link } from "react-router";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/shop/components/Breadcrumbs";
import { OrderSummary } from "@/shop/components/order/OrderSummary";
import { useOrderSummary } from "@/shop/components/order/useOrderSummary";

export const PaymentPage = () => {

  const [paymentMethod, setPaymentMethod] = useState("card");
  const { total } = useOrderSummary();

  return (

    <>
      <Breadcrumbs
        items={[
          { label: 'Payment' }
        ]} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
            <Link to={'/checkout/shipping'}>
              <Button variant="outline" >
                Back to Shipping
              </Button>
            </Link>
            <Button className="gap-2">
              <Lock className="h-4 w-4" />
              Place Order - ${total.toFixed(2)}
            </Button>
          </div>

        </div>

        <OrderSummary />
        
      </div>
    </>
            
  )
}