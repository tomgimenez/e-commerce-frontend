import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

const slides = [
  {
    id: 1,
    image: "/hero/epic-fantasy.jpg",
    tag: "New Arrivals",
    title: "Journey Into Middle-earth",
    description:
      "Rediscover the timeless epic. The complete Lord of the Rings collection is now in stock.",
    cta: "Shop the Collection",
    href: "/search",
  },
  {
    id: 2,
    image: "/hero/magic-library.jpg",
    tag: "Featured",
    title: "Unlock the Wizarding World",
    description:
      "From Hogwarts to beyond, explore the magical tales that shaped a generation.",
    cta: "Explore Magic",
    href: "/search",
  },
  {
    id: 3,
    image: "/hero/dragon-castle.jpg",
    tag: "Limited Offer",
    title: "Where Dragons Reign",
    description:
      "Dive into worlds of fire and ice. Up to 25% off select epic fantasy sagas.",
    cta: "View Offers",
    href: "/search",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = () => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border">
      <div className="relative h-95 sm:h-110 md:h-130">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={index !== current}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/70 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-xl">
                  <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    {slide.tag}
                  </span>
                  <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground text-balance sm:text-4xl md:text-5xl">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
                    {slide.description}
                  </p>
                  <Button
                    
                    size="lg"
                    className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link to={slide.href}>{slide.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <Button
        variant="outline"
        size="icon"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border-border bg-background/60 text-foreground backdrop-blur hover:bg-background hover:text-primary"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border-border bg-background/60 text-foreground backdrop-blur hover:bg-background hover:text-primary"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
