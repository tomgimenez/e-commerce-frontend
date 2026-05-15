import { cn } from "@/lib/utils";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { DynamicForm } from "../ui/DynamicForm";
import type { FormInputs } from "./ProductForm";
import { useProductTypes } from "@/admin/hooks/useProductTypes";
import type { ProductSchema, ProductUI } from "@/interfaces/product.interface";

interface Props {
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  isEdit?: boolean;
  product?: ProductUI;
  selectedSchema: ProductSchema | null;
  onSchemaChange: (schema: ProductSchema | null) => void;
}

export const BasicInformationSection = ({register, errors, isEdit, product, selectedSchema, onSchemaChange}: Props) => {
  
  const { data: productTypes } = useProductTypes();

  return (
    <div className="rounded-xl shadow-lg border p-6">
      <h2 className="text-xl font-semibold mb-6">
        Product Information
      </h2>

      <div className="space-y-6">
        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Product Type
          </label>
          {
            isEdit ? (
              <div className="w-full px-4 py-3 border rounded-lg bg-muted text-muted-foreground">
                {product && product.productType?.name}
              </div>
            ) : (
              <>
                <select
                  {...register('productType', { required: true })}
                  onChange={(e) => {
                    const selected = productTypes?.find(t => t.id === e.target.value);
                    onSchemaChange(selected?.schema ?? null);
                  }}
                  className={
                    cn("w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent", {
                      'border-red-500': errors.productType
                    })
                  }
                >
                  <option className="text-accent" value="">Select a type...</option>
                  {productTypes?.map((type) => (
                    <option key={type.id} value={type.id} className="text-accent">
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.productType && (
                  <p className="text-red-500">Product type is required</p>
                )}
              </>
            )
          }
        </div>

          {
            selectedSchema && (
              <div className="animate-in fade-in">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register('title', {required: true})}
                    className={
                      cn("w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
                        {
                          'border-red-500': errors.title
                        }
                      )}
                    placeholder="Title"
                  />
                  { errors.title && <p className="text-red-500">Title is required</p>}
                </div>

                {/* DYNAMIC FIELDS */}
                <DynamicForm
                  schema={selectedSchema}
                  register={register}
                  errors={errors}
                />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Price ($)
            </label>
            <input
              type="number"
              {...register('price', {
                required: true,
                min: 1
              })}
              className={
              cn("w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
                {
                  'border-red-500': errors.price
                }
              )}
              placeholder="Price"
            />
            { errors.price && <p className="text-red-500">Price is required</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Stock
            </label>
            <input
              type="number"
              {...register('stock', {
                required: true,
                min: 0
              })}
              className={
              cn("w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
                {
                  'border-red-500': errors.stock
                }
              )}
              placeholder="Stock"
            />
              { errors.stock && <p className="text-red-500">Stock is required</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Slug
          </label>
          <input
            type="text"
            {...register('slug', {
              required: true,
              validate: (value) => !/\s/.test(value) || 'El slug no puede contener espacios en blanco'
            })}
            className={
              cn("w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
                {
                  'border-red-500': errors.slug
                }
              )}
            placeholder="Slug"
          />
            { errors.slug && <p className="text-red-500">{errors.slug.message || 'El slug es requerido'}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            {...register('description', {required: true})}
            rows={5}
            className={
              cn("w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
                {
                  'border-red-500': errors.description
                }
              )}
            placeholder="Description"
          />
          { errors.description && <p className="text-red-500">Description is required</p>}
        </div>
      </div>
      )
          }

      </div>
    </div>
  )
}
