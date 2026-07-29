import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router";
import { ProductCard } from "../ProductCard";
import type { Book } from "@/interfaces/book.interface";

interface FeaturedProductsProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly products?: Book[];
}

export function FeaturedProducts({ title, subtitle, products }: FeaturedProductsProps) {

  return (
    <section className="py-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <Link
          to="/search"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {products?.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex border-border bg-background/80 text-foreground hover:bg-background hover:text-primary" />
        <CarouselNext className="hidden sm:flex border-border bg-background/80 text-foreground hover:bg-background hover:text-primary" />
      </Carousel>
    </section>
  );
}
