import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Breadcrumbs } from "@/shop/components/Breadcrumbs";
import { OrderSummary } from "@/shop/components/order/OrderSummary";
import { MapPin, PlusIcon, Star } from "lucide-react";
import { useState } from "react";
import { useAddress } from "@/shop/hooks/useAddress";
import type { AddressPayload } from "@/shop/api/address.api";
import { CustomLoading } from "@/components/custom/CustomLoading";
import { AddressForm } from "@/shop/components/address/AddressForm";

export const ShippingPage = () => {
  
  const [shippingMethod, setShippingMethod] = useState("standard");
  const { addresses, createAddress, isLoading } = useAddress();

  const defaultAddress = addresses.find((a) => a.is_default) ?? addresses[0];
  
  const defaultAddressId = isLoading
  ? null
  : (defaultAddress?.id ?? addresses[0]?.id ?? 'new');

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const resolvedAddressId = selectedAddressId ?? defaultAddressId;

  const handleNewAddress = (data: AddressPayload) => {
    createAddress(data, {
      onSuccess: () => setSelectedAddressId(defaultAddress?.id ?? addresses[0]?.id ?? null),
    });
  };

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

            {/* Saved addresses + add new option (wait until addresses are loaded to avoid UI jump) */}
            {!isLoading && resolvedAddressId !== null ? (
              <RadioGroup
                value={resolvedAddressId}
                onValueChange={setSelectedAddressId}
                className="space-y-3"
              >
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      resolvedAddressId === address.id
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
                    resolvedAddressId === "new"
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
            ) : (
              <div className="py-4">
                <CustomLoading />
              </div>
            )}

            {/* New address form, shown only when "Add a new address" is selected */}
            {resolvedAddressId === "new" && (
              <AddressForm onSubmit={handleNewAddress} submitLabel="Save" />
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
                htmlFor="free"
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
              htmlFor="standard"
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
              htmlFor="express"
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