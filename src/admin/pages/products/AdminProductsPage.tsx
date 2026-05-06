import { AdminTitle } from "@/admin/components/AdminTitle"
import { useAdminProducts } from "@/admin/hooks/useAdminProducts"
import { CustomLoading } from "@/components/custom/CustomLoading"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { currencyFormatter } from "@/lib/currency-formatter"
import { PencilIcon, PlusIcon } from "lucide-react"
import { Link } from "react-router"

export const AdminProductsPage = () => {

  const { data, isLoading } = useAdminProducts() || [];

  if (isLoading) return <CustomLoading />;

  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle title="Productos" subtitle="Aqui puedes ver y administrar tus productos" />

        <Link to="/admin/products/new">
          <Button>
            <PlusIcon />
            Nuevo producto
          </Button>
        </Link>
      </div>

      <Table className="bg-white p-10 shadow-xs border border-gray-200 mb-10">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Talles</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
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
      </Table>

      <CustomPagination totalPages={data?.pages || 0} />
    </>
  )
}
