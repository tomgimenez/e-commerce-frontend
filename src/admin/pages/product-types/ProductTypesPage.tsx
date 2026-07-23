import { useState } from "react"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Type, ToggleLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Link } from "react-router"

type SchemaField = {
  name: string
  type: "text" | "boolean"
}

type ProductType = {
  id: string
  name: string
  slug: string
  schema: SchemaField[]
}

const initialProductTypes: ProductType[] = [
  {
    id: "a1f2c3d4-0001-4a1b-9c2d-1e2f3a4b5c6d",
    name: "Physical Book",
    slug: "physical-book",
    schema: [
      { name: "isbn", type: "text" },
      { name: "publisher", type: "text" },
      { name: "hardcover", type: "boolean" },
      { name: "signed_edition", type: "boolean" },
    ],
  },
  {
    id: "a1f2c3d4-0002-4a1b-9c2d-1e2f3a4b5c6d",
    name: "E-Book",
    slug: "e-book",
    schema: [
      { name: "file_format", type: "text" },
      { name: "drm_free", type: "boolean" },
    ],
  },
  {
    id: "a1f2c3d4-0003-4a1b-9c2d-1e2f3a4b5c6d",
    name: "Audiobook",
    slug: "audiobook",
    schema: [
      { name: "narrator", type: "text" },
      { name: "runtime", type: "text" },
      { name: "abridged", type: "boolean" },
    ],
  },
  {
    id: "a1f2c3d4-0004-4a1b-9c2d-1e2f3a4b5c6d",
    name: "Collector's Box Set",
    slug: "collectors-box-set",
    schema: [
      { name: "volumes", type: "text" },
      { name: "limited_edition", type: "boolean" },
      { name: "includes_map", type: "boolean" },
    ],
  },
  {
    id: "a1f2c3d4-0005-4a1b-9c2d-1e2f3a4b5c6d",
    name: "Merchandise",
    slug: "merchandise",
    schema: [],
  },
]

export default function ProductTypesPage() {
  const [search, setSearch] = useState("")
  const [productTypes, setProductTypes] = useState(initialProductTypes)
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null)

  const filtered = productTypes.filter((type) => {
    const query = search.toLowerCase()
    return (
      type.name.toLowerCase().includes(query) ||
      type.slug.toLowerCase().includes(query)
    )
  })

  const handleDelete = () => {
    if (!deleteTarget) return
    setProductTypes((prev) => prev.filter((t) => t.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Product Types</h1>
          <p className="text-muted-foreground">
            Define the custom fields available for each kind of product
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Link to="/admin/product-types/new" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Product Type
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search product types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-transparent focus:border-primary"
          />
        </div>
      </div>

      {/* Product Types Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground hidden sm:table-cell">Slug</TableHead>
                <TableHead className="text-muted-foreground">Custom Fields</TableHead>
                <TableHead className="text-muted-foreground w-12.5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((type) => (
                <TableRow key={type.id} className="hover:bg-muted/50">
                  <TableCell>
                    <p className="font-medium text-foreground">{type.name}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <code className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {type.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    {type.schema.length === 0 ? (
                      <span className="text-sm text-muted-foreground">No custom fields</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {type.schema.map((field) => (
                          <Badge
                            key={field.name}
                            variant="outline"
                            className="gap-1 border-border text-foreground font-normal"
                          >
                            {field.type === "text" ? (
                              <Type className="h-3 w-3 text-primary" />
                            ) : (
                              <ToggleLeft className="h-3 w-3 text-primary" />
                            )}
                            {field.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link to={`/admin/product-types/${type.id}`} className="flex items-center">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(type)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No product types found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {productTypes.length} product types
          </p>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{deleteTarget?.name}</span>? This action
              cannot be undone and may affect products using this type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
