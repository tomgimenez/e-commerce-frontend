import { Library, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg text-center">

        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Library className="w-12 h-12 text-primary" />
        </div>

        {/* Content */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-serif text-balance">
          Our shelves are being stocked
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">
          The LoreVault is preparing a collection of enchanted tomes and
          legendary tales. Leave your email and we&apos;ll let you know the
          moment our doors open.
        </p>

        {/* Notify form */}
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-9 bg-card border-border"
              aria-label="Email address"
            />
          </div>
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Notify Me
          </Button>
        </form>

        {/* Footer note */}
        <p className="text-sm text-muted-foreground mt-10 pt-8 border-t border-border">
          Questions?{" "}
          <Link to="/help" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
