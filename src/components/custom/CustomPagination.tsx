import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router";

interface Props {
  totalPages: number;
}

export const CustomPagination = ({ totalPages }: Props) => {

  const [ searchParams, setSearchParams ] = useSearchParams();

  const queryPage = searchParams.get('page') ?? 1;
  const currentPage = isNaN(+queryPage) ? 1 : +queryPage;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  }


  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Button
        key="previous"
        variant="outline"
        size="icon"
        className="border-border text-muted-foreground hover:border-primary hover:text-primary"
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {
        Array.from({ length: totalPages }).map((_, index) => (
        <Button
          key={index}
          variant={ +currentPage === index + 1 ? 'default' : 'outline' }
          size="icon"
          className={
            currentPage === index + 1
            ? "bg-primary font-bold text-primary-foreground hover:bg-primary/90 font-cinzel"
            : "border-border text-muted-foreground hover:border-primary hover:text-primary font-cinzel" 
          }
          aria-label={"Page " + (index + 1)}
          aria-current="page"
          onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))
      }

      <Button
        key="next"
        variant="outline"
        size="icon"
        className="border-border text-muted-foreground hover:border-primary hover:text-primary"
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}