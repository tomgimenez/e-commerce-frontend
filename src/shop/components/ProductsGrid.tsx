import { ProductCard } from "./ProductCard"
import type { Book } from "@/interfaces/book.interface"

interface Props {
  products: Book[]
}

export const ProductsGrid = ({ products }: Props) => {

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
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
