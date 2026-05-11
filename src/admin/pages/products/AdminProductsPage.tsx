import { Link } from "react-router";
import { Eye, MoreHorizontal, Pencil, PlusIcon, Trash2 } from "lucide-react"

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


/* const statusStyles = {
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  low_stock: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  out_of_stock: "bg-red-500/10 text-red-500 border-red-500/20",
  draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

const statusLabels = {
  active: "Active",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
  draft: "Draft",
} */

export const AdminProductsPage = () => {

  const { data, isLoading } = useAdminProducts() || [];

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

      {/* <Table className="bg-white p-10 shadow-xs border border-gray-200 mb-10">
        <TableCaption>A list of your products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Talles</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data?.products.map((product) => 
              (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.images[0].url}
                      alt={product.slug}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="hover:underline"
                    >
                      {product.title}
                    </Link>
                  </TableCell>
                  <TableCell>{currencyFormatter(product.price)}</TableCell>
                  <TableCell>{product.gender}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.sizes.join(', ')}</TableCell>
                  <TableCell>
                    <Link to={`/admin/products/${product.id}`}>
                      <PencilIcon className="w-4 h-4 text-blue-500" /> 
                    </Link>
                  </TableCell>
                </TableRow>
              )
            )
          }
        </TableBody>
      </Table> */}

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground hidden md:table-cell">Category</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Stock</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Sales</TableHead>
                <TableHead className="text-muted-foreground w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        <img src={product.images[0].url} alt={product.slug} />
                      </div>
                      <div>
                        <Link to={`/admin/products/${product.id}`} className="hover:underline">
                          <p className="font-medium text-foreground">{product.title}</p>
                        </Link>
                        <p className="text-sm text-muted-foreground">{/* {product.author} */}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{/* {product.gender} */}</TableCell>
                  <TableCell className="font-medium text-foreground">{currencyFormatter(product.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={cn(
                      "font-medium",
                      product.stock === 0 && "text-red-500",
                      product.stock > 0 && product.stock <= 50 && "text-yellow-500",
                      product.stock > 50 && "text-foreground"
                    )}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      /* className={cn(
                        statusStyles[product.status as keyof typeof statusStyles]
                      )} */
                    >
                      {/* {statusLabels[product.status as keyof typeof statusLabels]} */}
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

                        <Link to={`/admin/products/${product.id}`}>
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
        {/* <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div> */}

      <CustomPagination totalPages={data?.pages || 0} />
    </>
  )
}
