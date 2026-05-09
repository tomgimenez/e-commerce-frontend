// import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

export const FilterSidebar = () => {

  const categories = [
    { id: "epic-fantasy", label: "Epic Fantasy", count: 124 },
    { id: "dark-fantasy", label: "Dark Fantasy", count: 87 },
    { id: "urban-fantasy", label: "Urban Fantasy", count: 56 },
    { id: "high-fantasy", label: "High Fantasy", count: 93 },
    { id: "sword-sorcery", label: "Sword & Sorcery", count: 45 },
    { id: "mythic-fantasy", label: "Mythic Fantasy", count: 38 },
    { id: "young-adult", label: "Young Adult Fantasy", count: 112 },
  ];

  const [ searchParams, setSearchParams ] = useSearchParams();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  const currentPrice = searchParams.get('price') || 'any';
  const selectedCategories = searchParams.get('categories')?.split(',') || [];

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
     ? selectedCategories.filter(c => c !== categoryId)
     : [...selectedCategories, categoryId]


    searchParams.set('page', '1');
    if (newCategories.length === 0)
      searchParams.delete('categories')
    else
      searchParams.set('categories', newCategories.join(','));
    setSearchParams(searchParams);
  }

  const handlePriceChange = (price: string) => {
    searchParams.set('page', '1');
    searchParams.set('price', price);
    setSearchParams(searchParams);
  }

  return (
    <aside className="w-64 shrink-0">
      <div className="sticky top-20 space-y-6 pr-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
            Filters
          </h2>
        </div>

        {/* Categories */}
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
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                  className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={category.id}
                  className="flex-1 text-sm text-secondary-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  {category.label}
                </Label>
                <span className="text-xs text-muted-foreground">
                  ({category.count})
                </span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />
        

        {/* Price Range */}
        <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            Price Range
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isPriceOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">

              {/* Price Range */}
              <div className="space-y-4">
                <RadioGroup defaultValue="" className="space-y-3" value={currentPrice}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="priceAny" 
                      onClick={() => handlePriceChange('any')}
                    />
                    <Label htmlFor="priceAny" className="text-sm cursor-pointer">Any price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0-50" id="price1"
                      onClick={() => handlePriceChange('0-50')}
                    />
                    <Label htmlFor="price1" className="text-sm cursor-pointer">$0 - $50</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50-100" id="price2"
                      onClick={() => handlePriceChange('50-100')}
                    />
                    <Label htmlFor="price2" className="text-sm cursor-pointer">$50 - $100</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="100-200" id="price3"
                      onClick={() => handlePriceChange('100-200')}
                    />
                    <Label htmlFor="price3" className="text-sm cursor-pointer">$100 - $200</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="200+" id="price4"
                      onClick={() => handlePriceChange('200+')}
                    />
                    <Label htmlFor="price4" className="text-sm cursor-pointer">$200+</Label>
                  </div>
                </RadioGroup>
              </div>

          </CollapsibleContent>
        </Collapsible>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setSearchParams({ page: '1', price: 'any' });
          }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Clear all filters
        </button>
      </div>
    </aside>
  );
};
