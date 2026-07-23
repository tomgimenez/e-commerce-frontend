import { useState } from "react"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Type,
  ToggleLeft,
  GripVertical,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link } from "react-router"

type FieldType = "text" | "boolean"

type SchemaField = {
  key: string
  name: string
  type: FieldType
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

let fieldCounter = 0
function newField(): SchemaField {
  fieldCounter += 1
  return { key: `field-${fieldCounter}`, name: "", type: "text" }
}

export default function ProductTypesFormPage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugEdited, setSlugEdited] = useState(false)
  const [fields, setFields] = useState<SchemaField[]>([newField()])

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugEdited) {
      setSlug(slugify(value))
    }
  }

  const updateField = (key: string, patch: Partial<SchemaField>) => {
    setFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, ...patch } : f))
    )
  }

  const removeField = (key: string) => {
    setFields((prev) => prev.filter((f) => f.key !== key))
  }

  const addField = () => {
    setFields((prev) => [...prev, newField()])
  }

  const validFields = fields.filter((f) => f.name.trim() !== "")
  const canSave = name.trim() !== "" && slug.trim() !== ""

  const handleSave = () => {
    // Build the schema record as it would be persisted (jsonb).
    const schema: Record<string, { type: FieldType }> = {}
    validFields.forEach((f) => {
      schema[slugify(f.name).replace(/-/g, "_")] = { type: f.type }
    })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
        >
          <Link to="/admin/product-types">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to product types</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">New Product Type</h1>
          <p className="text-muted-foreground">
            Define a product type and the custom fields it supports
          </p>
        </div>
      </div>

      {/* Basic details */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-medium text-foreground">Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Physical Book"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="physical-book"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value))
                setSlugEdited(true)
              }}
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier used in code. Auto-generated from the name.
            </p>
          </div>
        </div>
      </div>

      {/* Custom fields */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Custom Fields</h2>
            <p className="text-sm text-muted-foreground">
              Add as many fields as you need. Each field can be text or a toggle.
            </p>
          </div>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              No custom fields yet. Add one to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field) => (
              <div
                key={field.key}
                className="flex items-end gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground mb-2.5 shrink-0 hidden sm:block" />
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${field.key}-name`} className="text-xs">
                    Field name
                  </Label>
                  <Input
                    id={`${field.key}-name`}
                    placeholder="e.g. isbn"
                    value={field.name}
                    onChange={(e) => updateField(field.key, { name: e.target.value })}
                  />
                </div>
                <div className="w-36 space-y-2">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={field.type}
                    /* onValueChange={(value: FieldType) =>
                      updateField(field.key, { type: value })
                    } */
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <span className="flex items-center gap-2">
                          <Type className="h-4 w-4 text-primary" />
                          Text
                        </span>
                      </SelectItem>
                      <SelectItem value="boolean">
                        <span className="flex items-center gap-2">
                          <ToggleLeft className="h-4 w-4 text-primary" />
                          Boolean
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeField(field.key)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove field</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          onClick={addField}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost">
          <Link to="/admin/product-types">Cancel</Link>
        </Button>
        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Create Product Type
        </Button>
      </div>
    </div>
  )
}
