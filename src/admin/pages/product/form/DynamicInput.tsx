import type { ProductSchema } from "@/interfaces/product.interface";
import type { UseFormRegister, FieldErrors, FieldError, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { FormInputs } from "./ProductForm";

interface DynamicInputProps {
  fieldKey: string;
  field: ProductSchema[string];
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}

export const DynamicInput = ({ 
  fieldKey, 
  field,  
  register, 
  errors 
}: DynamicInputProps) => {

  const attributeErrors = errors.attributes as Record<string, FieldError | undefined> | undefined;
  const fieldError = attributeErrors?.[fieldKey];

  switch (field.type) {
    case 'boolean':
      return (
        <div key={fieldKey}>
          <label className="block text-sm font-medium mb-2">{field.label}</label>
          <input
            type="checkbox"
            {...register(`attributes.${fieldKey}` as Path<FormInputs>, { required: !!field.required })}
            className="w-4 h-4 rounded border-gray-300"
          />
          {fieldError && (
            <p className="text-red-500 text-sm mt-1">{`${field.label} is required`}</p>
          )}
        </div>
      );

    case 'number':
      return (
        <div key={fieldKey}>
          <label className="block text-sm font-medium mb-2">{field.label}</label>
          <input
            type="number"
            {...register(`attributes.${fieldKey}` as Path<FormInputs>, { required: !!field.required })}
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
              { 'border-red-500': fieldError }
            )}
          />
          {fieldError && (
            <p className="text-red-500 text-sm mt-1">{`${field.label} is required`}</p>
          )}
        </div>
      );

    case 'string':
    default:
      return (
        <div key={fieldKey}>
          <label className="block text-sm font-medium mb-2">{field.label}</label>
          <input
            placeholder={field.label}
            type="text"
            {...register(`attributes.${fieldKey}` as Path<FormInputs>, { required: !!field.required })}
            className={cn(
              "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
              { 'border-red-500': fieldError }
            )}
          />
          {fieldError && (
            <p className="text-red-500 text-sm mt-1">{`${field.label} is required`}</p>
          )}
        </div>
      );
  }
};