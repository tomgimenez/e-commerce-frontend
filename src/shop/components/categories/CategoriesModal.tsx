import { memo } from "react"
import { useSearchParams } from "react-router"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Category } from "@/interfaces/product.interface"

interface Props {
  open: boolean;
  allCategories: Category[];
  selectedCategories: string[];
  handleClose: () => void;
  handleCategoryChange: (categorySlug: string) => void;
}

export const CategoriesModal = memo(({open, allCategories, selectedCategories, handleClose, handleCategoryChange}: Props) => {
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">All Categories</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3 py-2">
            {allCategories.map((category) => (
              <div key={`modal-${category.id}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`modal-${category.id}`}
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => handleCategoryChange(category.slug)}
                  className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`modal-${category.id}`}
                  className="flex-1 text-sm text-secondary-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              searchParams.delete('categories');
              setSearchParams(searchParams);
            }}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})
