import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getShippingMethods } from "@/shop/api/shipping-methods.api";
import { useCheckoutStore } from "@/shop/store/checkout.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const ShippingMethod = () => {

  const { shippingMethodId, setShippingMethodId } = useCheckoutStore();

  const { data: shippingMethods } = useQuery({
    queryKey: ['shipping-methods',],
    queryFn: getShippingMethods,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!shippingMethods?.length) return;
    setShippingMethodId(shippingMethods[0].id);
  }, [shippingMethods, setShippingMethodId]);
  
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-4">
        <h2 className="text-xl font-semibold text-foreground mb-6">
            Shipping Method
        </h2>
        <RadioGroup
            value={shippingMethodId}
            onValueChange={setShippingMethodId}
            className="space-y-3"
        >
          {shippingMethods?.map((shippingMethod) => (
            <label
            key={String(shippingMethod.id)}
            htmlFor={String(shippingMethod.id)}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                shippingMethodId === shippingMethod.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            >
            <div className="flex items-center gap-3">
                <RadioGroupItem value={shippingMethod.id} id={String(shippingMethod.id)} />
                <div>
                <p className="font-medium text-foreground">
                    {shippingMethod.name}
                </p>
                <p className="text-sm text-muted-foreground">
                    {shippingMethod.description}
                </p>
                </div>
            </div>
            <span className="font-medium text-foreground">{shippingMethod.price === 0 ? "Free" : `$ ${shippingMethod.price}`}</span>
            </label>
          ))}
        </RadioGroup>
        </div>
  )
}
