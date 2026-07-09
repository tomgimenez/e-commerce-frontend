import { Clock, Package, Home } from "lucide-react";
import { CheckoutStatus } from "./Layout";

export default function CheckoutPendingPage() {
  return (
    <CheckoutStatus
      icon={Clock}
      iconColor="text-amber-500"
      iconBg="bg-amber-500/10"
      title="Payment Pending"
      subtitle="We're waiting for your payment to be confirmed"
      description="Your order has been placed, but the payment is still being processed. This is common with bank transfers and cash payments. We'll send you an email as soon as your payment is confirmed and your order ships."
      details={[
        { label: "Order number", value: "#LV-2847" },
        { label: "Payment method", value: "Bank transfer" },
        { label: "Status", value: "Awaiting payment" },
      ]}
      primaryAction={{ label: "View Order Status", href: "/orders", icon: Package }}
      secondaryAction={{ label: "Back to Home", href: "/", icon: Home }}
    />
  );
}
