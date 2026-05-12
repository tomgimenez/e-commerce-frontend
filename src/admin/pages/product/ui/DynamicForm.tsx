import type { ProductSchema } from "@/interfaces/product.interface";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ProductUI } from "@/interfaces/product.interface";
import { DynamicInput } from "./DynamicInput";

interface FormInputs extends ProductUI {
  files?: File[];
}

interface Props {
  schema: ProductSchema;
  attributes: Record<string, unknown>;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}

export const DynamicForm = ({ attributes, schema, register, errors }: Props) => {
  return (
    <>
      {Object.entries(schema).map(([key, field]) => (
        <DynamicInput
          key={key}
          fieldKey={key}
          field={field}
          value={attributes[key]}
          register={register}
          errors={errors}
        />
      ))}
    </>
  );
};