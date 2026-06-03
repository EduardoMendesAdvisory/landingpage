"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const LAND_TYPES = [
  { value: "vacant_land", label: "Vacant Land" },
  { value: "existing_property", label: "Existing Property" },
  { value: "rented_land", label: "Rented / Leased" },
  { value: "not_sure", label: "Not Sure Yet" },
] as const;

const STATES = [
  "NSW", "VIC", "QLD", "SA", "WA", "ACT", "TAS", "NT",
] as const;

interface StepLocationData {
  landType: string;
  suburb: string;
  state: string;
  postcode: string;
}

interface StepLocationProps {
  value: StepLocationData;
  onChange: (data: Partial<StepLocationData>) => void;
}

export function StepLocation({ value, onChange }: StepLocationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-navy">
          Where is your project located?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Location helps us understand local regulations and market conditions.
        </p>
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">State / Territory</Label>
        <div className="flex flex-wrap gap-2">
          {STATES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ state: s })}
              className={cn(
                "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                value.state === s
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white hover:border-navy/40"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Suburb + Postcode */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="suburb">Suburb</Label>
          <Input
            id="suburb"
            value={value.suburb}
            onChange={(e) => onChange({ suburb: e.target.value })}
            placeholder="e.g. Surry Hills"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            value={value.postcode}
            maxLength={4}
            onChange={(e) => onChange({ postcode: e.target.value.replace(/\D/g, "") })}
            placeholder="e.g. 2010"
            className="h-10"
          />
        </div>
      </div>

      {/* Land type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          What best describes your land / property situation?
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {LAND_TYPES.map((lt) => (
            <button
              key={lt.value}
              type="button"
              onClick={() => onChange({ landType: lt.value })}
              className={cn(
                "px-3 py-2.5 rounded-lg border-2 text-sm text-left transition-all",
                value.landType === lt.value
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white hover:border-navy/40"
              )}
            >
              {lt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
