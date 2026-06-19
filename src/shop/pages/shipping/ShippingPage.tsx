import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import argentinaProvinces from "@/data/argentina-provinces.json";
import type { Address } from "@/interfaces/address.interface";
import { Breadcrumbs } from "@/shop/components/Breadcrumbs";
import { OrderSummary } from "@/shop/components/order/OrderSummary";
import { MapPin, PlusIcon, Star } from "lucide-react";
import { useState } from "react";

// Mock saved addresses for the current user. In a real app these would come
// from the database scoped to the authenticated user.

export const ShippingPage = () => {
  
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [stateSearchInput, setStateSearchInput] = useState("");
  const savedAddresses: Address[] = [];
  const selectedStates: Record<string, string>[] = [];

  const filteredStates = argentinaProvinces?.filter(cat => 
    cat.name.toLowerCase().includes(stateSearchInput.toLowerCase()) &&
    !selectedStates.some(selected => selected.id === cat.id)
  ) ?? [];

  // Address selection: either one of the saved addresses or "new" to enter one.
  const defaultAddress = savedAddresses.find((a) => a.is_default) ?? savedAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses.length > 0 ? defaultAddress.id : "new"
  );
    
  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Shipping' }
        ]} />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Shipping Address */}
          <div className="bg-card border border-border rounded-xl p-6 mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Shipping Address
            </h2>

            {/* Saved addresses + add new option */}
            <RadioGroup
              value={selectedAddressId}
              onValueChange={setSelectedAddressId}
              className="space-y-3"
            >
              {savedAddresses.map((address) => (
                <label
                  key={address.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAddressId === address.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem
                    value={address.id}
                    id={address.id}
                    className="mt-1"
                  />
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">
                        {address.name}
                      </p>
                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Star className="h-3 w-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {address.street} {address.number}, {address.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.state}, {address.zip_code}, {address.country}
                    </p>
                  </div>
                </label>
              ))}

              {/* Add new address option */}
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedAddressId === "new"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="new" id="new-address" />
                <PlusIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">
                  Add a new address
                </span>
              </label>
            </RadioGroup>

            {/* New address form, shown only when "Add a new address" is selected */}
            {selectedAddressId === "new" && (
              <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="addrName">Address Name</Label>
                  <Input id="addrName" placeholder="Home, Work, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input id="street" placeholder="Main Street" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Number</Label>
                  <Input id="number" placeholder="123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Buenos Aires" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="C1424" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Combobox value="" onValueChange={() => {}}>
                    <ComboboxInput
                      id="state"
                      placeholder="Select a province..."
                      onChange={(e) => setStateSearchInput(e.target.value)}
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        {filteredStates.map((province) => (
                          <ComboboxItem key={province.id} value={province.id}>
                            {province.name}
                          </ComboboxItem>
                        ))}
                        <ComboboxEmpty>No province found.</ComboboxEmpty>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value="Argentina" disabled />
                </div>
                <div className="space-y-4 sm:col-span-2 flex justify-end">
                  <Button>Save</Button>
                </div>
              </div>
            )}
          </div>

          {/* Shipping Method */}
          <div className="bg-card border border-border rounded-xl p-6 mb-4">
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

        {/* Order Summary Sidebar */}
        <OrderSummary />

      </div>
      
    </>


  )
}