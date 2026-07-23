"use client"

import { useState } from "react"
import { ArrowLeft, Save, Info, Boxes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link } from "react-router"

// Root categories available as possible parents.
const rootCategories = [
  { id: "1", name: "Epic Fantasy" },
  { id: "2", name: "Dark Fantasy" },
  { id: "3", name: "Urban Fantasy" },
  { id: "4", name: "Sword & Sorcery" },
]

// Product types that can be associated with a root category.
const productTypes = [
  { id: "pt-1", name: "Physical Book" },
  { id: "pt-2", name: "E-Book" },
  { id: "pt-3", name: "Audiobook" },
  { id: "pt-4", name: "Collectible" },
]

const NO_PARENT = "none"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function CategoryFormPage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [parentId, setParentId] = useState<string>(NO_PARENT)
  const [productType, setProductType] = useState<string>("")

  const isRoot = parentId === NO_PARENT

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugEdited) {
      setSlug(slugify(value))
    }
  }

  const canSubmit =
    name.trim() !== "" && slug.trim() !== "" && (!isRoot || productType !== "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      parentId: isRoot ? null : parentId,
      // Only root categories carry a product type; subcategories inherit it.
      productType: isRoot ? productType : null,
    }
    console.log("[v0] Creating category:", payload)
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/categories"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">New Category</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a category. Root categories require an associated product type.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-medium text-foreground">Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Epic Fantasy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value)
                  setSlugEdited(true)
                }}
                placeholder="epic-fantasy"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger id="parent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PARENT}>
                    None (root category)
                  </SelectItem>
                  {rootCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Product Type - only for root categories */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Product Type</h2>
          </div>
          {isRoot ? (
            <div className="space-y-2">
              <Label htmlFor="productType">
                Associated product type <span className="text-destructive">*</span>
              </Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Select a product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((pt) => (
                    <SelectItem key={pt.id} value={pt.name}>
                      {pt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Every root category must define the product type of the items it
                contains.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Subcategories inherit the product type from their parent root
                category, so there is nothing to configure here.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline">
            <Link to="/admin/categories">Cancel</Link>
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Create Category
          </Button>
        </div>
      </form>
    </div>
  )
}
