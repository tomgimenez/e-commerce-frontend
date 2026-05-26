import { useState } from "react";
import { useWatch, type Control, type UseFormGetValues, type UseFormSetValue } from "react-hook-form";
import type { FormInputs } from "./ProductForm";
import type { ProductImage } from "@/interfaces/product.interface";

interface Props {
  control: Control<FormInputs>;
  images?: ProductImage[] | undefined;
  getValues: UseFormGetValues<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
}

export const useFileUpload = ({control, images, getValues, setValue}: Props) => {

  const [dragActive, setDragActive] = useState(false);

  const selectedFiles = useWatch({control, name: 'files'}) ?? [];
  const existentImages = useWatch({ control, name: 'images' }) ?? images ?? [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    
    if (!files) return;

    const currentFiles = getValues('files') || [];
    setValue('files', [...currentFiles, ...Array.from(files)]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const currentFiles = getValues('files') || [];
    setValue('files', [...currentFiles, ...Array.from(files)]);
  };

  return {
    dragActive,
    selectedFiles,
    existentImages,
    handleDrag,
    handleDrop,
    handleFileChange
  };
}
