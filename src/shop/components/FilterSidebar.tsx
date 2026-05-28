import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const currentPrice = searchParams.get('price') || 'any';

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
                  <RadioGroupItem value="0-10" id="price1"
                    onClick={() => handlePriceChange('0-10')}
                  />
                  <Label htmlFor="price1" className="text-sm cursor-pointer">$0 - $10</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-15" id="price2"
                    onClick={() => handlePriceChange('10-15')}
                  />
                  <Label htmlFor="price2" className="text-sm cursor-pointer">$10 - $15</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="15-20" id="price3"
                    onClick={() => handlePriceChange('15-20')}
                  />
                  <Label htmlFor="price3" className="text-sm cursor-pointer">$15 - $20</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20+" id="price4"
                    onClick={() => handlePriceChange('20+')}
                  />
                  <Label htmlFor="price4" className="text-sm cursor-pointer">$20+</Label>
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
