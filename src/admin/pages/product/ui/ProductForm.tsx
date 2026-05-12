import { Link } from "react-router";
import { Plus, SaveAll, Tag, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from 'react-hook-form';

import { AdminTitle } from "@/admin/components/AdminTitle"
import { Button } from "@/components/ui/button";
import type { ProductUI } from "@/interfaces/product.interface";
import { cn } from "@/lib/utils";
import { DynamicForm } from "./DynamicForm";

interface Props {
  title: string;
  subtitle: string;
  product: ProductUI;
  isPending: boolean;

  onSubmit: (productLike: Partial<ProductUI> & { files?: File[] }) => Promise<void>;
}

export interface FormInputs extends ProductUI {
  files?: File[];
}

export const ProductForm = ({title, subtitle, product, isPending, onSubmit}: Props) => {

  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch
  } = useForm<FormInputs>({
    defaultValues: product
  });

  const inputTagRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedTags = watch('tags');
  const selectedStock = watch('stock');
  const selectedFiles = watch('files');

  const addTag = () => {
    const newTag = inputTagRef.current!.value;
    if (newTag === '') return;
    const tagSet = new Set( getValues('tags') );
    tagSet.add(newTag);
    setValue('tags', Array.from(tagSet));
  };

  const removeTag = (tag: string) => {
    const tagSet = new Set( getValues('tags') );
    tagSet.delete(tag);
    setValue('tags', Array.from(tagSet));
  };

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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center">
          <AdminTitle title={title} subtitle={subtitle} />
          <div className="flex justify-end mb-10 gap-4">
            <Button variant="outline">
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
              <div className="rounded-xl shadow-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Product Information
                </h2>

                <div className="space-y-6">
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
                    { errors.title && <p className="text-red-500">El titulo es requerido</p>}
                  </div>

                  {/* DYNAMIC FIELDS */}
                  <DynamicForm
                    attributes={product.attributes}
                    schema={product.productType.schema}
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
                      { errors.price && <p className="text-red-500">El precio es requerido</p>}
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
                        placeholder="Stock del producto"
                      />
                       { errors.stock && <p className="text-red-500">El stock es requerido</p>}
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
                      Gender
                    </label>
                    <select
                      // {...register('gender')}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    >
                      <option value="men">Hombre</option>
                      <option value="women">Mujer</option>
                      <option value="unisex">Unisex</option>
                      <option value="kids">Niño</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      {...register('description', {required: true})}
                      rows={5}
                      className={
                        cn("w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                          {
                            'border-red-500': errors.description
                          }
                        )}
                      placeholder="Description"
                    />
                    { errors.description && <p className="text-red-500">La descripcion es requerida</p>}
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="rounded-xl shadow-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Categories
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {/* {selectedSizes.map((size) => (
                      <span
                        key={size}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))} */}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="text-sm mr-2">
                      Add categories:
                    </span>
                    {/* {availableSizes.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => addSize(size)}
                        disabled={selectedSizes.includes(size)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedSizes.includes(size)
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer'
                        }`}
                      >
                        {size}
                      </button>
                    ))} */}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-xl shadow-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Tags
                </h2>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center">
                    <input
                      ref={inputTagRef}
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
                          e.preventDefault();
                          addTag();
                          inputTagRef.current!.value = '';
                        }
                      }}

                      placeholder="Add tag..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <Button
                      onClick={addTag}
                      className="px-4 py-5 rounded-lg "
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Images */}
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
                    {product.images.map((image, index) => (
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

              {/* Product Status */}
              <div className="rounded-xl shadow-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Product Status
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg">
                    <span className="text-sm font-medium">
                      Status
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg">
                    <span className="text-sm font-medium">
                      Stock
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        selectedStock > 5
                          ? 'bg-green-100 text-green-800'
                          : selectedStock > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedStock > 5
                        ? 'In stock'
                        : selectedStock > 0
                        ? 'Low stock'
                        : 'Out of stock'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg">
                    <span className="text-sm font-medium">
                      Images
                    </span>
                    <span className="text-sm text-slate-600">
                      {product.images.length} imqges
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg">
                    <span className="text-sm font-medium">
                      Tallas disponibles
                    </span>
                    <span className="text-sm">
                      {/* {selectedSizes.length} */} tallas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
