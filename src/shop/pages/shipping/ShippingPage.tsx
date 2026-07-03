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
import { ShippingMethod } from "@/shop/components/shipping-method/ShippingMethod";
import { Link } from "react-router";

export const ShippingPage = () => {
  
  const { addresses, createAddress, isLoading } = useAddress();

  const defaultAddress = addresses.find((a) => a.is_default);
  
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
          <ShippingMethod />

          <div className="flex gap-4 justify-between">
            <Link to="/cart">
              <Button variant="outline" >
                Back to Cart
              </Button>
            </Link>

            <Link to={`/checkout/payment`}>
              <Button >
                Continue to Payment
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <OrderSummary />

      </div>
      
    </>


  )
}