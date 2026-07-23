import { XCircle, RefreshCw, ShoppingCart } from "lucide-react";
import { CheckoutLayout } from "./CheckoutLayout";

export const CheckoutFailurePage = () => {
  return (
    <CheckoutLayout
      icon={XCircle}
      iconColor="text-destructive"
      iconBg="bg-destructive/10"
      title="Payment Rejected"
      subtitle="We couldn't process your payment"
      description="Unfortunately, your payment was declined. This can happen due to insufficient funds, incorrect card details, or a temporary issue with your provider. No charges were made — please try again with a different payment method."
      details={[
        { label: "Order number", value: "#LV-2847" },
        { label: "Payment method", value: "Mercado Pago" },
        { label: "Status", value: "Declined" },
      ]}
      primaryAction={{ label: "Try Again", href: "/checkout", icon: RefreshCw }}
      secondaryAction={{
        label: "Back to Store",
        href: "/",
        icon: ShoppingCart,
      }}
    />
  );
}
