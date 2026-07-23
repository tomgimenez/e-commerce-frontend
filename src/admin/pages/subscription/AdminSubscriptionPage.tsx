import { useState } from "react"
import {
  CreditCard,
  Check,
  Zap,
  Crown,
  Rocket,
  Download,
  AlertTriangle,
  Calendar,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    price: 29,
    description: "For new shops finding their footing.",
    features: [
      "Up to 100 products",
      "2 staff accounts",
      "Basic analytics",
      "Standard support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: Crown,
    price: 79,
    description: "For growing stores that need more power.",
    features: [
      "Up to 2,000 products",
      "10 staff accounts",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Rocket,
    price: 199,
    description: "For high-volume, established marketplaces.",
    features: [
      "Unlimited products",
      "Unlimited staff accounts",
      "Full analytics suite",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
]

const invoices = [
  { id: "INV-2026-007", date: "Jul 1, 2026", amount: 79, status: "Paid" },
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: 79, status: "Paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: 79, status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: 29, status: "Paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: 29, status: "Paid" },
]

export default function AdminSubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("professional")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your store&apos;s plan, billing, and payment method.
        </p>
      </div>

      {/* Current plan summary */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Professional Plan</h2>
                <Badge className="bg-green-500/15 text-green-500 hover:bg-green-500/15">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                $79/month · Renews on August 1, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-border">
              <Calendar className="h-4 w-4 mr-2" />
              Billing History
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  Cancel Plan
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-foreground">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Cancel subscription?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Your store will remain active until the end of the current billing
                    period (August 1, 2026). After that, your storefront will be
                    suspended until you resubscribe.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border">Keep Plan</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Confirm Cancellation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Usage */}
        <div className="grid gap-6 sm:grid-cols-2 mt-6 pt-6 border-t border-border">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Products</span>
              <span className="text-foreground font-medium">248 / 2,000</span>
            </div>
            <Progress value={12.4} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Staff accounts</span>
              <span className="text-foreground font-medium">4 / 10</span>
            </div>
            <Progress value={40} className="h-2" />
          </div>
        </div>
      </div>

      {/* Available plans */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isCurrent = plan.id === currentPlan
            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border p-6 flex flex-col ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                {isCurrent && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary">
                    Current
                  </Badge>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-secondary-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setCurrentPlan(plan.id)}
                  disabled={isCurrent}
                  variant={isCurrent ? "outline" : "default"}
                  className={
                    isCurrent
                      ? "border-border"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }
                >
                  {isCurrent
                    ? "Current Plan"
                    : plan.price > plans.find((p) => p.id === currentPlan)!.price
                    ? "Upgrade"
                    : "Downgrade"}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment method + billing history */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment method */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-foreground mb-4">Payment Method</h2>
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
              <p className="text-xs text-muted-foreground">Expires 09/2028</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 border-border">
            Update Payment Method
          </Button>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Next charge of $79 on Aug 1, 2026
          </div>
        </div>

        {/* Billing history */}
        <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Billing History</h2>
          <div className="divide-y divide-border">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-medium text-foreground">
                    ${invoice.amount.toFixed(2)}
                  </span>
                  <Badge className="bg-green-500/15 text-green-500 hover:bg-green-500/15">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download invoice</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
