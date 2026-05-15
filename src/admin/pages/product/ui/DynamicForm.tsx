import type { ProductSchema } from "@/interfaces/product.interface";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { DynamicInput } from "./DynamicInput";
import type { FormInputs } from "../form/ProductForm";

interface Props {
  schema: ProductSchema;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
}

export const DynamicForm = ({ schema, register, errors }: Props) => {

  return (
    <>
      {Object.entries(schema).map(([key, field]) => (
        <DynamicInput
          key={key}
          fieldKey={key}
          field={field}
          register={register}
          errors={errors}
        />
      ))}
    </>
  );

};