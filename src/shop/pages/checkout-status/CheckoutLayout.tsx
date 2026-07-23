import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface CheckoutStatusProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
  primaryAction: StatusAction;
  secondaryAction: StatusAction;
  details?: { label: string; value: string }[];
}

export function CheckoutLayout({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  details,
}: CheckoutStatusProps) {
  const PrimaryIcon = primaryAction.icon;
  const SecondaryIcon = secondaryAction.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center shadow-xl">
          {/* Icon */}
          <div
            className={`w-24 h-24 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-8`}
          >
            <Icon className={`w-12 h-12 ${iconColor}`} />
          </div>

          {/* Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-serif text-balance">
            {title}
          </h1>
          <p className="text-lg text-primary font-medium mb-4">{subtitle}</p>
          <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">
            {description}
          </p>

          {/* Optional details */}
          {details && details.length > 0 && (
            <div className="bg-secondary/40 border border-border rounded-xl p-4 mb-8 text-left">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  <span className="text-muted-foreground">{detail.label}</span>
                  <span className="font-medium text-foreground">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={primaryAction.href}>
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <PrimaryIcon className="w-4 h-4 mr-2" />
                {primaryAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={secondaryAction.href}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary"
              >
                <SecondaryIcon className="w-4 h-4 mr-2" />
                {secondaryAction.label}
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-10 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link to="/help" className="text-primary hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-primary/50" />
          <div className="w-2 h-2 rounded-full bg-primary/30" />
        </div>
      </div>
    </div>
  );
}
