import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Book } from "@/interfaces/book.interface";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

interface ProductCardProps {
  product: Book ;
}

export const ProductCard = ({ product }: ProductCardProps) => {

  const [isWishlisted, setIsWishlisted] = useState(false);
  const originalPrice = product.price + 6; // Mock original price for discount calculation

  const discount = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {/* {product.isNew && (
          <Badge className="bg-accent text-accent-foreground text-[10px] font-medium">
            New
          </Badge>
        )} */}
        {product.attributes.isBestseller && (
          <Badge className="bg-primary text-primary-foreground text-[10px] font-medium">
            Bestseller
          </Badge>
        )}
        {discount > 0 && (
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground text-[10px] font-medium"
          >
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-all hover:bg-secondary"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isWishlisted
              ? "fill-primary text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-3/4 bg-secondary overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.images[0].url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          {product.categories[0].name}
        </span>

        {/* Title */}
        <h3 className="font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          <Link to={`/product/${product.id}`}>
            {product.title}
          </Link>
        </h3>

        {/* Author */}
        <p className="text-sm text-muted-foreground mb-2">{product.attributes.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price & Button */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
