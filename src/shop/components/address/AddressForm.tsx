import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import argentinaProvinces from "@/data/argentina-provinces.json";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { AddressPayload } from "@/shop/api/address.api";

interface AddressFormProps {
  onSubmit: (data: AddressPayload) => void;
  onCancel?: () => void;
  initialValues?: Partial<AddressPayload>;
  submitLabel?: string;
}

export const AddressForm = ({
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = "Save",
}: AddressFormProps) => {
  const [stateSearchInput, setStateSearchInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressPayload>({
    defaultValues: {
      country: "Argentina",
      state: "",
      ...initialValues,
    },
  });

  const selectedState = watch("state");

  const filteredStates =
    argentinaProvinces?.filter(
      (cat) =>
        cat.name.toLowerCase().includes(stateSearchInput.toLowerCase()) &&
        (!selectedState || selectedState !== cat.name)
    ) ?? [];

  const handleSubmitInternal = (data: AddressPayload) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitInternal)}>
      <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Address Name</Label>
          <Input
            id="name"
            placeholder="Home, Work, etc."
            {...register("name", { required: "Address name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Street</Label>
          <Input
            id="street"
            placeholder="Main Street"
            {...register("street", { required: "Street is required" })}
          />
          {errors.street && (
            <p className="text-sm text-destructive">{errors.street.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Number</Label>
          <Input
            id="number"
            placeholder="123"
            {...register("number", { required: "Number is required" })}
          />
          {errors.number && (
            <p className="text-sm text-destructive">{errors.number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Buenos Aires"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            placeholder="C1424"
            {...register("zip_code", { required: "ZIP code is required" })}
          />
          {errors.zip_code && (
            <p className="text-sm text-destructive">{errors.zip_code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor">Floor (optional)</Label>
          <Input id="floor" placeholder="e.g. 3" {...register("floor")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apartment">Apartment (optional)</Label>
          <Input id="apartment" placeholder="e.g. A" {...register("apartment")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="between_streets">Between streets (optional)</Label>
          <Input
            id="between_streets"
            placeholder="e.g. 1st Ave and 2nd St"
            {...register("between_streets")}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Input
            id="notes"
            placeholder="Additional directions or notes"
            {...register("notes")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Combobox
            value={selectedState}
            onValueChange={(value) => {
              setValue("state", value || "");
              setStateSearchInput(value || "");
            }}
          >
            <ComboboxInput
              id="state"
              placeholder="Select a province..."
              {...register("state", { required: "State is required" })}
              onChange={(e) => setStateSearchInput(e.target.value)}
            />
            <ComboboxContent>
              <ComboboxList>
                {filteredStates.map((province) => (
                  <ComboboxItem key={province.id} value={province.name}>
                    {province.name}
                  </ComboboxItem>
                ))}
                <ComboboxEmpty>No province found.</ComboboxEmpty>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value="Argentina"
            disabled
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && (
            <p className="text-sm text-destructive">{errors.country.message}</p>
          )}
        </div>

        <div className="space-y-4 sm:col-span-2 flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};