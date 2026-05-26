import { useState } from "react";
import { Link } from "react-router";
import { SaveAll, X } from "lucide-react";
import { useForm } from 'react-hook-form';

import { AdminTitle } from "@/admin/components/AdminTitle"
import { Button } from "@/components/ui/button";
import type { ProductSchema, Product } from "@/interfaces/product.interface";
import { BasicInformationSection } from "./BasicInformationSection";
import { CategoriesSection } from "./CategoriesSection";
import { TagsSection } from "./TagsSection";
import { ImagesSection } from "./ImagesSection";

type Props =
  | { mode: 'create'; title: string; subtitle: string; isPending: boolean; onSubmit: (data: Partial<Product> & { files?: File[] }) => Promise<void> }
  | { mode: 'edit'; title: string; subtitle: string; product: Product; isPending: boolean; onSubmit: (data: Partial<Product> & { files?: File[] }) => Promise<void> }

export interface FormInputs extends Product {
  files?: File[];
}

export const ProductForm = (props: Props) => {
  
  const { mode, title, subtitle, isPending, onSubmit } = props;
  
  const isEdit = mode === 'edit';
  const product = isEdit ? props.product : undefined;
  const [selectedSchema, setSelectedSchema] = useState<ProductSchema | null>(
    isEdit ? (product?.productType?.schema ?? null) : null
  );
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control
  } = useForm<FormInputs>({
    defaultValues: isEdit ? props.product : undefined
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <AdminTitle title={title} subtitle={subtitle} />
          <div className="flex justify-end mb-10 gap-4">
            <Button variant="outline" type="button">
              <Link to="/admin/products" className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Link>
            </Button>

            <Button type="submit" disabled={isPending}>
              <SaveAll className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <BasicInformationSection register={register} errors={errors} isEdit={isEdit} product={product} selectedSchema={selectedSchema} onSchemaChange={setSelectedSchema} />

              {selectedSchema && (
                <>
                  {/* Categories */}
                  <CategoriesSection control={control} getValues={getValues} setValue={setValue} />

                  {/* Tags */}
                  <TagsSection control={control} setValue={setValue} getValues={getValues} />
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Images */}
              {selectedSchema && (
                <ImagesSection setValue={setValue} getValues={getValues} control={control} isEdit={isEdit} images={product?.images} />
              )}
            </div>

          </div>
        </div>
      </form>
    </>
  )
}
