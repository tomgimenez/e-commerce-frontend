import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { useSearchParams } from "react-router"
import { useState } from "react"
import type { ProductUI } from "@/interfaces/product.interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Book } from "@/interfaces/book.interface"

interface Props {
  products: ProductUI[]
}

const productsMock = [
  {
    id: "1",
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    price: 18.99,
    originalPrice: 24.99,
    rating: 5,
    reviews: 2847,
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
    isBestseller: true,
  },
  {
    id: "2",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    price: 14.99,
    rating: 5,
    reviews: 5621,
    image: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400&h=600&fit=crop",
    category: "Young Adult Fantasy",
    isBestseller: true,
  },
  {
    id: "3",
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    price: 22.99,
    originalPrice: 29.99,
    rating: 4,
    reviews: 3156,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    category: "Dark Fantasy",
  },
  {
    id: "4",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    price: 16.99,
    rating: 5,
    reviews: 1892,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
    isNew: true,
  },
  {
    id: "5",
    title: "The Way of Kings",
    author: "Brandon Sanderson",
    price: 19.99,
    originalPrice: 26.99,
    rating: 5,
    reviews: 2103,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    category: "High Fantasy",
  },
  {
    id: "6",
    title: "The Lies of Locke Lamora",
    author: "Scott Lynch",
    price: 15.99,
    rating: 4,
    reviews: 987,
    image: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&h=600&fit=crop",
    category: "Sword & Sorcery",
    isNew: true,
  },
  {
    id: "7",
    title: "Mistborn: The Final Empire",
    author: "Brandon Sanderson",
    price: 17.99,
    originalPrice: 22.99,
    rating: 5,
    reviews: 2456,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
    isBestseller: true,
  },
  {
    id: "8",
    title: "The Blade Itself",
    author: "Joe Abercrombie",
    price: 14.99,
    rating: 4,
    reviews: 1234,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    category: "Dark Fantasy",
  },
  {
    id: "9",
    title: "Gardens of the Moon",
    author: "Steven Erikson",
    price: 21.99,
    originalPrice: 28.99,
    rating: 4,
    reviews: 876,
    image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
    category: "Epic Fantasy",
  },
  {
    id: "10",
    title: "The Priory of the Orange Tree",
    author: "Samantha Shannon",
    price: 19.99,
    rating: 4,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    category: "High Fantasy",
    isNew: true,
  },
  {
    id: "11",
    title: "The Fifth Season",
    author: "N.K. Jemisin",
    price: 16.99,
    originalPrice: 21.99,
    rating: 5,
    reviews: 1893,
    image: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=400&h=600&fit=crop",
    category: "Dark Fantasy",
    isBestseller: true,
  },
  {
    id: "12",
    title: "Circe",
    author: "Madeline Miller",
    price: 15.99,
    rating: 5,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1610882099717-7d3cf1c1c739?w=400&h=600&fit=crop",
    category: "Mythic Fantasy",
  },
];

export const ProductsGrid = ({ products }: Props) => {

  const [ searchParams, setSearchParams ] = useSearchParams();

  const viewMode = searchParams.get('viewMode') ?? 'grid';

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    searchParams.set('viewMode', mode);
    setSearchParams(searchParams);
  }

  // TODO : TEMPORAL
  const [sortBy] = useState("featured");

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Enchanted Collection
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {productsMock.length} mystical tomes
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Select value={sortBy} /* onValueChange={setSortBy} */>
            <SelectTrigger className="w-45 bg-secondary border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>
        
        <div className="hidden md:flex border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('grid')}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>

        </div>
        </div>


      </div>

      {/* Grid */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
      }>
        {products.map((product) => (
          <ProductCard key={product.id} product={product as Book} />
        ))}
      </div>

    </>
  )
}
