import { CheckCircle, Package, ShoppingCart } from "lucide-react";
import { CheckoutLayout } from "./CheckoutLayout";
import { CustomLoading } from "@/components/custom/CustomLoading";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrder } from "@/shop/api/order.api";

export const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const orderId = searchParams.get('external_reference');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(Number(orderId)),
    enabled: !!orderId,
    retry: false,
  });

  useEffect(() => {
    if (order?.status === 'paid') {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  }, [order, queryClient]);

  // if (!orderId) return navigate('/');
  if (isLoading) return <CustomLoading />;
  // if (order?.status !== 'paid') return navigate('/checkout/failure');
  
  return (
    <CheckoutLayout
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
