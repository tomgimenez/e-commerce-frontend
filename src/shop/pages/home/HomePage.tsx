import { CustomPagination } from "@/components/custom/CustomPagination"
import { Chatbot } from "@/shop/components/chatbot/Chatbot";
import { ProductsGrid } from "@/shop/components/ProductsGrid"
import { useBooks } from "@/shop/hooks/useBooks";
import ComingSoonPage from "../announcement/ComingSoonPage";

export const HomePage = () => {

  const { data } = useBooks();

  return (
    <>
      {/* <CustomJumbotron title="" /> */}

      {/* <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>

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
      </div> */}
      <section className="flex-1">
        {data?.products && data?.products.length > 0 ? (
          <>
            <ProductsGrid products={data?.products || []} />
            {
              !!data?.pages && 
                <div className="mt-8">
                  <CustomPagination totalPages={data.pages} />
                </div>
            }
          </>
        ) : (
          <ComingSoonPage />
        )}
        <Chatbot />
      </section>

    </>
  )
}
