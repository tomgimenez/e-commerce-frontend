import { useState } from "react";
import { X } from "lucide-react";

import { useCategories } from "@/admin/hooks/useCategories";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { useWatch, type Control, type UseFormGetValues, type UseFormSetValue } from "react-hook-form";
import type { FormInputs } from "./ProductForm";
import type { Category, ProductSchema } from "@/interfaces/product.interface";

interface Props {
  control: Control<FormInputs>;
  getValues: UseFormGetValues<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  selectedSchema: ProductSchema | null;
}

export const CategoriesSection = ({control, getValues, setValue, selectedSchema}: Props) => {

  const { data: categories } = useCategories();
  const [categorySearchInput, setCategorySearchInput] = useState('');

  const selectedCategories = useWatch({control, name: 'categories'}) ?? [];

  const addCategory = (category: Category) => {
    const currentCategories = getValues('categories') || [];
    const categoryExists = currentCategories.some(cat => cat.id === category.id);
    if (!categoryExists) {
      setValue('categories', [...currentCategories, category]);
    }
    console.log(getValues('categories'))
    setCategorySearchInput('');
  };

  const removeCategory = (categoryId: string) => {
    const currentCategories = getValues('categories') || [];
    setValue('categories', currentCategories.filter(cat => cat.id !== categoryId));
  };

  const filteredCategories = categories?.filter(cat => 
    cat.name.toLowerCase().includes(categorySearchInput.toLowerCase()) &&
    !selectedCategories.some(selected => selected.id === cat.id)
  ) ?? [];

  return (
    selectedSchema && (
      <div className="rounded-xl shadow-lg border p-6 animate-in fade-in">
        <h2 className="text-xl font-semibold mb-6">
          Categories
        </h2>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category: Category) => (
              <span
                key={category.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <Combobox value="" onValueChange={(value) => {
            const category = categories?.find(cat => cat.id === value);
            if (category) {
              addCategory(category);
            }
          }}>
            <ComboboxInput
              placeholder="Search and add categories..."
              onChange={(e) => setCategorySearchInput(e.target.value)}
              showTrigger
              showClear
            />
            <ComboboxContent>
              <ComboboxList>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <ComboboxItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </ComboboxItem>
                  ))
                ) : null}
                <ComboboxEmpty>
                  No categories found
                </ComboboxEmpty>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

    )
  )
}
