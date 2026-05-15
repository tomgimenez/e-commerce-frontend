import { useState } from "react";
import { useWatch, type Control, type UseFormGetValues, type UseFormSetValue } from "react-hook-form";
import { Upload, X } from "lucide-react";

import type { FormInputs } from "./ProductForm";
import type { ProductSchema } from "@/interfaces/product.interface";

interface Props {
  control: Control<FormInputs>;
  getValues: UseFormGetValues<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  isEdit: boolean;
  images?: {
    name: string;
    url: string;
  }[] | undefined
  selectedSchema: ProductSchema | null;
}

export const ImagesSection = ({control, getValues, setValue, isEdit, images, selectedSchema}: Props) => {
  const [dragActive, setDragActive] = useState(false);

  const selectedFiles = useWatch({control, name: 'files'}) ?? [];

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
  
  return (
    selectedSchema && (
      <div className="rounded-xl shadow-lg border p-6">
        <h2 className="text-xl font-semibold mb-6">
          Images
        </h2>

        {/* Drag & Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-slate-400" />
            <div>
              <p className="text-lg font-medium text-slate-700">
                Drag images here
              </p>
              <p className="text-sm text-slate-500">
                or click to upload
              </p>
            </div>
            <p className="text-xs text-slate-400">
              PNG, JPG, WebP up to 10MB each
            </p>
          </div>
        </div>

        {/* Current Images */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium">
            Current Images
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {isEdit && images?.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                  <img
                    src={image.url}
                    alt="Product"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <X className="h-3 w-3" />
                </button>
                <p className="mt-1 text-xs text-slate-600 truncate">
                  {image.url}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Images to upLoad */}
        {
          selectedFiles && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-slate-700">
                Images to upload
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {
                  selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Product"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <X className="h-3 w-3" />
                    </button>
                    <p className="mt-1 text-xs text-slate-600 truncate">
                      {file.name}
                    </p>
                  </div>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    )
  )
}
