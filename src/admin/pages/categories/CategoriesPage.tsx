import { useState } from "react"
import { 
  FolderTree, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  Pencil,
  Trash2,
  MoreHorizontal,
  Boxes
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Link } from "react-router"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  productCount: number
  // Only root categories have an associated product type.
  productType?: string
  children?: Category[]
}

const initialCategories: Category[] = [
  { 
    id: "1", 
    name: "Epic Fantasy", 
    slug: "epic-fantasy", 
    parentId: null, 
    productCount: 45,
    productType: "Physical Book",
    children: [
      { id: "1-1", name: "High Fantasy", slug: "high-fantasy", parentId: "1", productCount: 28 },
      { id: "1-2", name: "Heroic Fantasy", slug: "heroic-fantasy", parentId: "1", productCount: 17 },
    ]
  },
  { 
    id: "2", 
    name: "Dark Fantasy", 
    slug: "dark-fantasy", 
    parentId: null, 
    productCount: 32,
    productType: "Physical Book",
    children: [
      { id: "2-1", name: "Grimdark", slug: "grimdark", parentId: "2", productCount: 18 },
      { id: "2-2", name: "Gothic Fantasy", slug: "gothic-fantasy", parentId: "2", productCount: 14 },
    ]
  },
  { 
    id: "3", 
    name: "Urban Fantasy", 
    slug: "urban-fantasy", 
    parentId: null, 
    productCount: 28,
    productType: "E-Book",
    children: []
  },
  { 
    id: "4", 
    name: "Sword & Sorcery", 
    slug: "sword-sorcery", 
    parentId: null, 
    productCount: 22,
    productType: "Physical Book",
    children: []
  },
  { 
    id: "5", 
    name: "Mythic Fantasy", 
    slug: "mythic-fantasy", 
    parentId: null, 
    productCount: 19,
    productType: "Audiobook",
    children: [
      { id: "5-1", name: "Arthurian", slug: "arthurian", parentId: "5", productCount: 8 },
      { id: "5-2", name: "Norse Mythology", slug: "norse-mythology", parentId: "5", productCount: 6 },
      { id: "5-3", name: "Greek Mythology", slug: "greek-mythology", parentId: "5", productCount: 5 },
    ]
  },
  { 
    id: "6", 
    name: "Young Adult Fantasy", 
    slug: "young-adult-fantasy", 
    parentId: null, 
    productCount: 38,
    productType: "E-Book",
    children: [
      { id: "6-1", name: "Coming of Age", slug: "coming-of-age", parentId: "6", productCount: 22 },
      { id: "6-2", name: "School Fantasy", slug: "school-fantasy", parentId: "6", productCount: 16 },
    ]
  },
]

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["1", "2", "5", "6"]))

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const handleDeleteCategory = (categoryId: string, parentId: string | null) => {
    if (parentId) {
      setCategories(prev => prev.map(cat => {
        if (cat.id === parentId) {
          return {
            ...cat,
            children: cat.children?.filter(c => c.id !== categoryId) || []
          }
        }
        return cat
      }))
    } else {
      setCategories(prev => prev.filter(c => c.id !== categoryId))
    }
  }

  const CategoryRow = ({ category, level = 0 }: { category: Category; level?: number }) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isRoot = category.parentId === null

    return (
      <>
        <div 
          className={cn(
            "flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors",
            level > 0 && "bg-muted/20"
          )}
          style={{ paddingLeft: `${1 + level * 1.5}rem` }}
        >
          {/* Expand/Collapse button */}
          <button
            onClick={() => hasChildren && toggleExpand(category.id)}
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded transition-colors",
              hasChildren ? "hover:bg-muted cursor-pointer" : "cursor-default"
            )}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <span className="w-4" />
            )}
          </button>

          {/* Category icon */}
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg",
            level === 0 ? "bg-primary/10" : "bg-muted"
          )}>
            <FolderTree className={cn(
              "h-4 w-4",
              level === 0 ? "text-primary" : "text-muted-foreground"
            )} />
          </div>

          {/* Category info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{category.name}</p>
            <p className="text-xs text-muted-foreground">/{category.slug}</p>
          </div>

          {/* Product Type (root categories only) */}
          <div className="hidden sm:flex items-center justify-center w-44">
            {isRoot ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                <Boxes className="h-3 w-3 text-primary" />
                {category.productType}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground/60">Inherited</span>
            )}
          </div>

          {/* Product count */}
          <div className="text-right w-20">
            <p className="text-sm font-medium text-foreground">{category.productCount}</p>
            <p className="text-xs text-muted-foreground">products</p>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to={`/admin/categories/${category.id}`} className="flex items-center">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteCategory(category.id, category.parentId)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && category.children?.map(child => (
          <CategoryRow key={child.id} category={child} level={level + 1} />
        ))}
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Button className="gap-2">
          <Link to="/admin/categories/new" className="flex items-center">
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="w-6" />
            <span className="w-8" />
            <span className="flex-1 text-sm font-medium text-muted-foreground">Category</span>
            <span className="hidden sm:block text-sm font-medium text-muted-foreground text-center w-44">Product Type</span>
            <span className="text-sm font-medium text-muted-foreground text-right w-20">Products</span>
            <span className="w-8" />
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {categories.map(category => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>

        {categories.length === 0 && (
          <div className="px-4 py-12 text-center">
            <FolderTree className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No categories yet</p>
            <p className="text-sm text-muted-foreground/70">Create your first category to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
