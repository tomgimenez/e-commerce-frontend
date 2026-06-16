import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export const ShippingPage = () => {

  const [shippingMethod, setShippingMethod] = useState("standard");
  return (
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
        <Button variant="outline" >
          Back to Cart
        </Button>
        <Button >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}