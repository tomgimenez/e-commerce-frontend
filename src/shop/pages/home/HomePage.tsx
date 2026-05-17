import { useState } from "react";
import { Filter } from "lucide-react";

import { CustomPagination } from "@/components/custom/CustomPagination"
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "@/shop/components/FilterSidebar";
// import { CustomJumbotron } from "@/shop/components/CustomJumbotron"
import { ProductsGrid } from "@/shop/components/ProductsGrid"
import { useBooks } from "@/shop/hooks/useBooks";

export const HomePage = () => {

  const { data } = useBooks();

  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      {/* <CustomJumbotron title="" /> */}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>

      {/* Filters */}
      <div className={`${showFilters ? "fixed inset-0 z-50 bg-background p-4" : "hidden"} lg:static lg:bg-transparent lg:p-0 lg:block`}>
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFilters(false)}
          >
            Close
          </Button>
        </div>

        <FilterSidebar />
      </div>


      <section className="flex-1">
        <ProductsGrid products={data?.products || []} />
        {
          data?.pages && 
            <div className="mt-8">
              <CustomPagination totalPages={data.pages} />
            </div>
        }
      </section>

      
    </>
  )
}
