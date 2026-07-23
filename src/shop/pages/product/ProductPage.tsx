import { useState } from "react";
import { Link, Navigate } from "react-router";
import { Star, ShoppingCart, Heart, Minus, Plus, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomLoading } from "@/components/custom/CustomLoading";
import { useBook } from "@/shop/hooks/useBook";
import { useCart } from "@/shop/hooks/useCart";
import { useCartStore } from "@/shop/store/cart.store";
import { Breadcrumbs } from "@/shop/components/Breadcrumbs";

export const ProductPage = () => {

  const { data: book, isLoading } = useBook();
  const { addItem } = useCart();
  const { openDrawer } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (isLoading) return <CustomLoading />;
  
  if (!book) return <Navigate to={'/'} />;

  const originalPrice = book.price + 6; // Mock original price for discount calculation

  const discount = originalPrice
    ? Math.round(((originalPrice - book.price) / originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          { label: book.categories[0].name, to: '/' },
          { label: book.title }
        ]}
      />

      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to collection
      </Link>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative">
          <div className="aspect-3/4 rounded-lg overflow-hidden bg-secondary">
            <img
              src={book.images[0].url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* {product.isNew && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )} */}
            {book.attributes.isBestseller && (
              <Badge className="bg-primary text-primary-foreground">Bestseller</Badge>
            )}
            {discount > 0 && (
              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                -{discount}%
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            {book.categories[0].name}
          </span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-lg text-muted-foreground mb-4">by {book.attributes.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(book.rating ?? 0)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              ({book.reviews.toLocaleString()} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">
              ${book.price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-8">
            {book.description}
          </p>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-secondary transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-secondary transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              onClick={() => addItem(
                {product: book, unitPrice: book.price, quantity: quantity},
                () => openDrawer({ title: book.title })
              )}
              >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 border-border"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "fill-primary text-primary" : ""
                }`}
              />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Orders over $35</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Secure Payment</p>
                <p className="text-xs text-muted-foreground">SSL Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="mb-16 flex-col">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="details">Book Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-card rounded-lg border border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pages</p>
              <p className="font-medium text-foreground">{book.attributes.pages}</p>
            </div>
            {/* <div>
              <p className="text-sm text-muted-foreground mb-1">Language</p>
              <p className="font-medium text-foreground">{book.language}</p>
            </div> */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Publisher</p>
              <p className="font-medium text-foreground">{book.attributes.publisher}</p>
            </div>
            {/* <div>
              <p className="text-sm text-muted-foreground mb-1">ISBN</p>
              <p className="font-medium text-foreground">{product.isbn}</p>
            </div> */}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="p-6 bg-card rounded-lg border border-border text-center">
            <p className="text-muted-foreground">Reviews coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {/* {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            More from {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} {...relatedProduct} />
            ))}
          </div>
        </section>
      )} */}
    </div>
  );
}
