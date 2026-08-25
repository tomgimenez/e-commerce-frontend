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
import { Breadcrumbs, type BreadcrumbItem } from "@/shop/components/Breadcrumbs";
import { ProductCard } from "@/shop/components/ProductCard";
import type { Book } from "@/interfaces/book.interface";

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

  const relatedProducts: Book[] = [
    {
      id: '1',
      title: "The Fellowship of the Ring",
      price: 18.99,
      images: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
          key: 'key'
        }
      ],
      categories: [{ id: "c1", name: "Epic Fantasy", slug: "epic-fantasy" }],
      description: "In ancient times the Rings of Power were crafted by the Elven-smiths, and Sauron, the Dark Lord, forged the One Ring, filling it with his own power so that he could rule all others. But the One Ring was taken from him, and though he sought it throughout Middle-earth, it remained lost to him. After many ages it fell by chance into the hands of the hobbit Bilbo Baggins.",
      rating: 5,
      reviews: 2847,
      tags: ["fantasy", "classic", "adventure"],
      slug: "the-fellowship-of-the-ring",
      stock: 32,
      user: {
        id: "u1",
        email: "seller1@example.com",
        name: "Seller",
        lastname: "One",
        isActive: true,
        roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
      },
      productType: {
        id: "pt1",
        name: "Book",
        slug: "book",
        schema: {
          author: { type: "string", required: true, label: "Author" },
          publisher: { type: "string", required: true, label: "Publisher" },
          pages: { type: "string", required: true, label: "Pages" }
        }
      },
      isActive: true,
      createdAt: new Date("2025-01-01T00:00:00Z"),
      updatedAt: new Date("2025-05-01T00:00:00Z"),
      deletedAt: new Date("1970-01-01T00:00:00Z"),
      attributes: {
        author: "J.R.R. Tolkien",
        publisher: "Houghton Mifflin",
        isBestseller: true,
        pages: '423',
        language: 'eng',
        isbn: '123',
        publishYear: '1998'
      }
    },
    {
      id: '2',
      title: "Harry Potter and the Sorcerer's Stone",
      price: 14.99,
      images: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400&h=600&fit=crop",
          key: 'key'
        }
      ],
      categories: [{ id: "c2", name: "Young Adult Fantasy", slug: "young-adult-fantasy" }],
      description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news.",
      rating: 5,
      reviews: 5621,
      tags: ["fantasy", "young-adult", "magic"],
      slug: "harry-potter-and-the-sorcerers-stone",
      stock: 45,
      user: {
        id: "u1",
        email: "seller1@example.com",
        name: "Seller",
        lastname: "One",
        isActive: true,
        roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
      },
      productType: {
        id: "pt1",
        name: "Book",
        slug: "book",
        schema: {
          author: { type: "string", required: true, label: "Author" },
          publisher: { type: "string", required: true, label: "Publisher" },
          pages: { type: "string", required: true, label: "Pages" }
        }
      },
      isActive: true,
      createdAt: new Date("2025-01-02T00:00:00Z"),
      updatedAt: new Date("2025-05-02T00:00:00Z"),
      deletedAt: new Date("1970-01-01T00:00:00Z"),
      attributes: {
        publisher: "Scholastic",
        pages: '309',
        isBestseller: true,
        author: "J.K. Rowling",
        language: 'eng',
        isbn: '123',
        publishYear: '1998'
      }
    },
    {
      id: '3',
      title: "A Game of Thrones",
      price: 22.99,
      images: [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
          key: 'key'
        }
      ],
      categories: [{ id: "c3", name: "Dark Fantasy", slug: "dark-fantasy" }],
      description: "Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister and supernatural forces are massing beyond the kingdom's protective Wall.",
      rating: 4,
      reviews: 3156,
      tags: ["fantasy", "epic", "political"],
      slug: "a-game-of-thrones",
      stock: 28,
      user: {
        id: "u1",
        email: "seller1@example.com",
        name: "Seller",
        lastname: "One",
        isActive: true,
        roles: [{ id: "r1", name: "Admin", description: "Administrator role" }]
      },
      productType: {
        id: "pt1",
        name: "Book",
        slug: "book",
        schema: {
          author: { type: "string", required: true, label: "Author" },
          publisher: { type: "string", required: true, label: "Publisher" },
          pages: { type: "string", required: true, label: "Pages" }
        }
      },
      isActive: true,
      createdAt: new Date("2025-01-03T00:00:00Z"),
      updatedAt: new Date("2025-05-03T00:00:00Z"),
      deletedAt: new Date("1970-01-01T00:00:00Z"),
      attributes: {
        author: "George R.R. Martin",
        pages: '694',
        publisher: "Bantam",
        isBestseller: true,
        language: 'eng',
        isbn: '123',
        publishYear: '1998'
      }
    }
  ]

  const breadcrumbItems: BreadcrumbItem[] = [{ label: book.title }];

  if (book.categories.length)
    breadcrumbItems.unshift({ label: book.categories[0].name, to: '/' })

  return (
    <div className="min-h-screen bg-background">
      
      {/* Breadcrumb */}
      <Breadcrumbs
        items={breadcrumbItems}
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
        <div className="relative mx-auto w-4/5">
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
          {!!book.categories.length && (
            <span className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
              {book.categories[0].name}
            </span>
          )}

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
            {!!originalPrice && (
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
            <div>
              <p className="text-sm text-muted-foreground mb-1">Language</p>
              <p className="font-medium text-foreground">{book.attributes.language}</p>
            </div>
            {/* <div>
              <p className="text-sm text-muted-foreground mb-1">Publisher</p>
              <p className="font-medium text-foreground">{book.attributes.publisher}</p>
            </div> */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">ISBN</p>
              <p className="font-medium text-foreground">{book.attributes.isbn}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Year</p>
              <p className="font-medium text-foreground">{book.attributes.publishYear}</p>
            </div>
          </div>

        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="p-6 bg-card rounded-lg border border-border text-center">
            <p className="text-muted-foreground">Reviews coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            {book.categories.length > 0 ? `More from ${book.categories[0].name}` : 'More related products'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
