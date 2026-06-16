import { useState } from "react"
import { 
  FolderTree, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  Pencil,
  Trash2,
  MoreHorizontal,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  productCount: number
  children?: Category[]
}

const initialCategories: Category[] = [
  { 
    id: "1", 
    name: "Epic Fantasy", 
    slug: "epic-fantasy", 
    parentId: null, 
    productCount: 45,
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
    children: []
  },
  { 
    id: "4", 
    name: "Sword & Sorcery", 
    slug: "sword-sorcery", 
    parentId: null, 
    productCount: 22,
    children: []
  },
  { 
    id: "5", 
    name: "Mythic Fantasy", 
    slug: "mythic-fantasy", 
    parentId: null, 
    productCount: 19,
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
    children: [
      { id: "6-1", name: "Coming of Age", slug: "coming-of-age", parentId: "6", productCount: 22 },
      { id: "6-2", name: "School Fantasy", slug: "school-fantasy", parentId: "6", productCount: 16 },
    ]
  },
]

// Flatten categories for the parent selector
function flattenCategories(categories: Category[], level = 0): { category: Category; level: number }[] {
  const result: { category: Category; level: number }[] = []
  for (const cat of categories) {
    result.push({ category: cat, level })
    if (cat.children && cat.children.length > 0) {
      result.push(...flattenCategories(cat.children, level + 1))
    }
  }
  return result
}

// Get all root categories (for parent selector)
function getRootCategories(categories: Category[]): Category[] {
  return categories.filter(c => c.parentId === null)
}

export const CategoriesPage =() => {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["1", "2", "5", "6"]))
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    parentId: "" as string | null
  })

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

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return

    const newCat: Category = {
      id: `new-${Date.now()}`,
      name: newCategory.name.trim(),
      slug: generateSlug(newCategory.name),
      parentId: newCategory.parentId || null,
      productCount: 0,
      children: []
    }

    if (newCategory.parentId) {
      // Add as child
      setCategories(prev => prev.map(cat => {
        if (cat.id === newCategory.parentId) {
          return {
            ...cat,
            children: [...(cat.children || []), newCat]
          }
        }
        return cat
      }))
      // Expand parent
      setExpandedCategories(prev => new Set([...prev, newCategory.parentId as string]))
    } else {
      // Add as root
      setCategories(prev => [...prev, newCat])
    }

    setNewCategory({ name: "", parentId: "" })
    setShowAddForm(false)
  }

  const handleDeleteCategory = (categoryId: string, parentId: string | null) => {
    if (parentId) {
      // Remove from parent's children
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
      // Remove root category
      setCategories(prev => prev.filter(c => c.id !== categoryId))
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategory({ name: category.name, parentId: category.parentId })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategory.name.trim()) return

    const updateCategory = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === editingCategory.id) {
          return {
            ...cat,
            name: newCategory.name.trim(),
            slug: generateSlug(newCategory.name)
          }
        }
        if (cat.children) {
          return { ...cat, children: updateCategory(cat.children) }
        }
        return cat
      })
    }

    setCategories(updateCategory(categories))
    setEditingCategory(null)
    setNewCategory({ name: "", parentId: "" })
  }

  const CategoryRow = ({ category, level = 0 }: { category: Category; level?: number }) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)

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

          {/* Product count */}
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{category.productCount}</p>
            <p className="text-xs text-muted-foreground">products</p>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:bg-muted hover:text-foreground size-8 rounded-md cursor-pointer">
              <span className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
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

  const rootCategories = getRootCategories(categories)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Manage product categories and subcategories</p>
        </div>
        <Button 
          onClick={() => {
            setShowAddForm(true)
            setEditingCategory(null)
            setNewCategory({ name: "", parentId: "" })
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <span className="w-6" />
              <span className="w-8" />
              <span className="flex-1 text-sm font-medium text-muted-foreground">Category</span>
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

        {/* Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className={cn(
            "bg-card border border-border rounded-xl overflow-hidden transition-all",
            (showAddForm || editingCategory) ? "opacity-100" : "opacity-50"
          )}>
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-medium text-foreground">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              {(showAddForm || editingCategory) && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingCategory(null)
                    setNewCategory({ name: "", parentId: "" })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category Name</label>
                <Input
                  placeholder="Enter category name..."
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!showAddForm && !editingCategory}
                />
                {newCategory.name && (
                  <p className="text-xs text-muted-foreground">
                    Slug: /{generateSlug(newCategory.name)}
                  </p>
                )}
              </div>

              {!editingCategory && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Parent Category</label>
                  <select
                    value={newCategory.parentId || ""}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, parentId: e.target.value || null }))}
                    disabled={!showAddForm}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  >
                    <option value="">None (Root Category)</option>
                    {rootCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to create a root category
                  </p>
                </div>
              )}

              <Button 
                className="w-full"
                disabled={!newCategory.name.trim() || (!showAddForm && !editingCategory)}
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="mt-6 bg-card border border-border rounded-xl p-4">
            <h3 className="font-medium text-foreground mb-4">Category Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Root Categories</span>
                <span className="text-sm font-medium text-foreground">{rootCategories.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subcategories</span>
                <span className="text-sm font-medium text-foreground">
                  {categories.reduce((acc, cat) => acc + (cat.children?.length || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Products</span>
                <span className="text-sm font-medium text-foreground">
                  {flattenCategories(categories).reduce((acc, { category }) => acc + category.productCount, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
