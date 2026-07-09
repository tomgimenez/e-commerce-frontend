import { CheckCircle, Package, ShoppingCart } from "lucide-react";
import { CheckoutStatus } from "./Layout";

export default function CheckoutSuccessPage() {
  return (
    <CheckoutStatus
      icon={CheckCircle}
      iconColor="text-green-500"
      iconBg="bg-green-500/10"
      title="Payment Approved!"
      subtitle="Your order has been confirmed"
      description="Thank you for your purchase. Your payment was processed successfully and your enchanted tomes are being prepared for shipment. A confirmation email with your receipt is on its way."
      details={[
        { label: "Order number", value: "#LV-2847" },
        { label: "Payment method", value: "Mercado Pago" },
        { label: "Total paid", value: "$54.97" },
      ]}
      primaryAction={{ label: "Track Order", href: "/orders", icon: Package }}
      secondaryAction={{
        label: "Continue Shopping",
        href: "/",
        icon: ShoppingCart,
      }}
    />
  );
}
