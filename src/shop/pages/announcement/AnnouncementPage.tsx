import { Link, useParams } from "react-router";
import { 
  CheckCircle, 
  Mail, 
  Package, 
  Bell, 
  Gift, 
  AlertCircle,
  ArrowRight,
  Home,
  ShoppingCart,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const announcements = {
  "registration-success": {
    icon: CheckCircle,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    title: "Welcome to The LoreVault Market!",
    subtitle: "Your account has been created successfully",
    description: "You're now part of our community of fantasy book lovers. Start exploring our collection of enchanted tomes and discover your next magical adventure.",
    primaryAction: { label: "Start Shopping", href: "/", icon: ShoppingCart },
    secondaryAction: { label: "Complete Profile", href: "/profile", icon: User },
  },
  "email-verified": {
    icon: Mail,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Email Verified!",
    subtitle: "Your email address has been confirmed",
    description: "Thank you for verifying your email. You now have full access to all features including order tracking, wishlists, and exclusive member offers.",
    primaryAction: { label: "Go to Dashboard", href: "/account", icon: User },
    secondaryAction: { label: "Browse Books", href: "/", icon: Home },
  },
  "order-confirmed": {
    icon: Package,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Order Confirmed!",
    subtitle: "Your order has been placed successfully",
    description: "We've received your order and it's being prepared for shipment. You'll receive an email with tracking information once your books are on their way.",
    primaryAction: { label: "Track Order", href: "/orders", icon: Package },
    secondaryAction: { label: "Continue Shopping", href: "/", icon: ShoppingCart },
  },
  "newsletter-subscribed": {
    icon: Bell,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "You're Subscribed!",
    subtitle: "Welcome to our newsletter",
    description: "Get ready for exclusive deals, new releases, and curated recommendations delivered straight to your inbox. Your first exclusive offer is on its way!",
    primaryAction: { label: "Explore Offers", href: "/offers", icon: Gift },
    secondaryAction: { label: "Back to Home", href: "/", icon: Home },
  },
  "password-reset": {
    icon: CheckCircle,
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    title: "Password Updated!",
    subtitle: "Your password has been changed successfully",
    description: "Your account is now secured with your new password. If you didn't make this change, please contact our support team immediately.",
    primaryAction: { label: "Sign In", href: "/login", icon: User },
    secondaryAction: { label: "Contact Support", href: "/help", icon: AlertCircle },
  },
  "wishlist-shared": {
    icon: Gift,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
    title: "Wishlist Shared!",
    subtitle: "Your wishlist has been sent",
    description: "Your curated collection of fantasy books has been shared. Now your friends and family know exactly which magical tomes you're dreaming of!",
    primaryAction: { label: "View Wishlist", href: "/wishlist", icon: Gift },
    secondaryAction: { label: "Keep Browsing", href: "/", icon: Home },
  },
};

type AnnouncementType = keyof typeof announcements;

export default function AnnouncementPage() {
  const params = useParams();
  console.log(params)
  const type = params.type as string;
  
  const announcement = announcements[type as AnnouncementType];
  
  if (!announcement) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The announcement you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = announcement.icon;
  const PrimaryIcon = announcement.primaryAction.icon;
  const SecondaryIcon = announcement.secondaryAction.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center shadow-xl">
          {/* Icon */}
          <div className={`w-24 h-24 rounded-full ${announcement.iconBg} flex items-center justify-center mx-auto mb-8`}>
            <Icon className={`w-12 h-12 ${announcement.iconColor}`} />
          </div>

          {/* Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-serif">
            {announcement.title}
          </h1>
          <p className="text-lg text-primary font-medium mb-4">
            {announcement.subtitle}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {announcement.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={announcement.primaryAction.href}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <PrimaryIcon className="w-4 h-4 mr-2" />
                {announcement.primaryAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={announcement.secondaryAction.href}>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary"
              >
                <SecondaryIcon className="w-4 h-4 mr-2" />
                {announcement.secondaryAction.label}
              </Button>
            </Link>
          </div>

          {/* Decorative elements */}
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
