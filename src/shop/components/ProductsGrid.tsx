import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { useSearchParams } from "react-router"
// import { useState } from "react"
import type { ProductUI } from "@/interfaces/product.interface"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Book } from "@/interfaces/book.interface"

interface Props {
  products: ProductUI[]
}

export const ProductsGrid = ({ products }: Props) => {

  const [ searchParams, setSearchParams ] = useSearchParams();

  const viewMode = searchParams.get('viewMode') ?? 'grid';

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    searchParams.set('viewMode', mode);
    setSearchParams(searchParams);
  }

  // const [sortBy] = useState("featured");

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Enchanted Collection
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {products.length} mystical tomes
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {/* <Select value={sortBy} onValueChange={setSortBy}>
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
          </Select> */}
        
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
          <ProductCard key={product.id} product={product as unknown as Book} />
        ))}
      </div>

    </>
  )
}
