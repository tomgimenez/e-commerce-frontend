import { SearchX, Home, RotateCcw, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const suggestions = [
  "Check your spelling and try again",
  "Use more general keywords",
  "Try searching by author or series name",
  "Browse our categories instead",
];

const popularSearches = [
  { label: "Epic Fantasy", href: "/search?category=epic-fantasy" },
  { label: "Dark Fantasy", href: "/search?category=dark-fantasy" },
  { label: "Tolkien", href: "/search?query=tolkien" },
  { label: "Bestsellers", href: "/search?sort=bestseller" },
  { label: "New Arrivals", href: "/search?sort=new" },
];

export const NoResults = () => {
  return (
        <div className="flex items-center justify-center flex-col">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-8">
            <SearchX className="w-12 h-12 text-primary" />
          </div>

          {/* Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-serif text-balance">
            Oops, nothing found...
          </h1>
          <p className="text-lg text-primary font-medium mb-4">
            The vault holds no tomes matching your quest
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 text-pretty">
            We couldn&apos;t find any books that match your search. Perhaps the
            spell was miscast, or this tale has yet to arrive on our shelves.
          </p>

          {/* Suggestions */}
          <div className="bg-secondary/40 border border-border rounded-xl p-5 mb-8 text-left">
            <p className="text-sm font-medium text-foreground mb-3">
              A few things you can try:
            </p>
            <ul className="space-y-2">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Compass className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Popular searches */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3">Popular searches</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-secondary-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/search">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try another search
              </Button>
            </Link>
            <Link to="/">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to home
              </Button>
            </Link>
          </div>
        </div>
  )
}
