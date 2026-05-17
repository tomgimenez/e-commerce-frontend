import { Button } from "@/components/ui/button";
import { Plus, Tag, X } from "lucide-react";
import { useRef } from "react";
import { useWatch, type Control, type UseFormGetValues, type UseFormSetValue } from "react-hook-form";
import type { FormInputs } from "./ProductForm";

interface Props {
  control: Control<FormInputs>;
  getValues: UseFormGetValues<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
}

export const TagsSection = ({control, getValues, setValue}: Props) => {

  const inputTagRef = useRef<HTMLInputElement>(null);

  const selectedTags = useWatch({control, name:'tags'}) ?? [];

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

  return (
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
  )
}
