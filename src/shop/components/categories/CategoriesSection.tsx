import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { useCategories } from "@/hooks/useCategories";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CategoriesModal } from "./CategoriesModal";

export const CategoriesSection = () => {

  const { data: categories } = useCategories();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const selectedCategories = useMemo(
    () => searchParams.get('categories')?.split(',') || [],
    [searchParams]
  );

  const handleCategoryChange = useCallback((categorySlug: string) => {
    const newCategories = selectedCategories.includes(categorySlug)
     ? selectedCategories.filter(c => c !== categorySlug)
     : [...selectedCategories, categorySlug]

    searchParams.set('page', '1');
    if (newCategories.length === 0)
      searchParams.delete('categories')
    else
      searchParams.set('categories', newCategories.join(','));
    setSearchParams(searchParams);
  }, [selectedCategories, searchParams, setSearchParams])

  return (
    <>
      <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
          Categories
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isCategoriesOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          {categories?.slice(0, 4).map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => handleCategoryChange(category.slug)}
                className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={category.id}
                className="flex-1 text-sm text-secondary-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                {category.name}
              </Label>
            </div>
          ))}

          <button
            onClick={useCallback(() => setIsCategoriesModalOpen(true), [])}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            Show more
          </button>
        </CollapsibleContent>
      </Collapsible>

      {
        categories && <CategoriesModal
          open={isCategoriesModalOpen}
          allCategories={categories}
          selectedCategories={selectedCategories}
          handleClose={() => setIsCategoriesModalOpen(false)}
          handleCategoryChange={handleCategoryChange}
        />
      }
    </>
  )
}