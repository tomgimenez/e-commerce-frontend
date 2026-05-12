import { useRef, type KeyboardEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { Eye, MoreHorizontal, Pencil, PlusIcon, Search, Trash2 } from "lucide-react"

import { AdminTitle } from "@/admin/components/AdminTitle"
import { useAdminProducts } from "@/admin/hooks/useAdminProducts"
import { CustomLoading } from "@/components/custom/CustomLoading"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { currencyFormatter } from "@/lib/currency-formatter"
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Book } from "@/interfaces/book.interface";

export const AdminProductsPage = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useAdminProducts() || [];

  const books = data?.products as unknown as Book[];

  const inputRef = useRef<HTMLInputElement>(null);
  const query = searchParams.get('query') || '';

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const query = inputRef.current?.value;
    const newSearchParams = new URLSearchParams();

    if (!query) {
      newSearchParams.delete('query');
    } else {
      newSearchParams.set('query', query);
    }

    setSearchParams(newSearchParams);
  }

  if (isLoading) return <CustomLoading />;

  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle title="Products" subtitle="Manage your book inventory" />

        <Link to="/admin/products/new">
          <Button>
            <PlusIcon />
            Add product
          </Button>
        </Link>
      </div>

      <div className="flex-1 max-w-md pl-12 lg:pl-0 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            className="pl-9 bg-muted/50 border-transparent focus:border-primary"
            defaultValue={query}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Categories</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Stock</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Sales</TableHead>
                <TableHead className="text-muted-foreground w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        <img src={book.images[0].url} alt={book.slug} />
                      </div>
                      <div>
                        <Link to={`/admin/products/${book.id}`} className="hover:underline">
                          <p className="font-medium text-foreground">{book.title}</p>
                        </Link>
                        <p className="text-sm text-muted-foreground">{book.attributes.author}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{book.categories.map(cat => cat.name).join(', ')}</TableCell>
                  <TableCell className="font-medium text-foreground">{currencyFormatter(book.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={cn(
                      "font-medium",
                      book.stock === 0 && "text-red-500",
                      book.stock > 0 && book.stock <= 50 && "text-yellow-500",
                      book.stock > 50 && "text-foreground"
                    )}>
                      {book.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={book.isActive ?
                        "bg-green-500/10 text-green-500 border-green-500/20" :
                        "bg-red-500/10 text-red-500 border-red-500/20"
                       }
                    >
                      {book.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">{/* {product.sales} */}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>

                        <Link to={`/admin/products/${book.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
        
      {/* Pagination */}
      <CustomPagination totalPages={data?.pages || 0} />
    </>
  )
}
