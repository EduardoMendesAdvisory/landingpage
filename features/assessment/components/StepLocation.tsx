"use client";

import { MapPin, Mail, Check } from "lucide-react";
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
        <h2 className="text-2xl font-bold text-navy">Where is your project located?</h2>
        <p className="text-sm text-gray-500 mt-1.5">
          This helps us provide accurate benchmarks and local insights.
        </p>
      </div>

      {/* Suburb + Postcode */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Location</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="suburb" className="text-sm">Suburb</Label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="suburb"
                value={value.suburb}
                onChange={(e) => onChange({ suburb: e.target.value })}
                placeholder="e.g. Buderim"
                className="h-11 pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="postcode" className="text-sm">Postcode</Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="postcode"
                value={value.postcode}
                maxLength={4}
                onChange={(e) => onChange({ postcode: e.target.value.replace(/\D/g, "") })}
                placeholder="e.g. 4556"
                className="h-11 pl-9"
              />
            </div>
          </div>
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label className="text-sm">State</Label>
          <div className="flex flex-wrap gap-2">
            {STATES.map((s) => {
              const selected = value.state === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ state: s })}
                  className={cn(
                    "relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                    selected
                      ? "border-amber bg-amber/5 text-navy"
                      : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                  )}
                >
                  {selected && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber flex items-center justify-center">
                      <Check size={9} strokeWidth={3} className="text-white" />
                    </span>
                  )}
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Land type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          What best describes your land condition?
        </Label>
        <p className="text-xs text-gray-500">This helps us understand potential site costs and construction complexity.</p>
        <div className="grid grid-cols-2 gap-2">
          {LAND_TYPES.map((lt) => {
            const selected = value.landType === lt.value;
            return (
              <button
                key={lt.value}
                type="button"
                onClick={() => onChange({ landType: lt.value })}
                className={cn(
                  "relative px-3 py-3 rounded-xl border-2 text-sm text-left transition-all font-medium",
                  selected
                    ? "border-amber bg-amber/5 text-navy"
                    : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                )}
              >
                {selected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-white" />
                  </span>
                )}
                {lt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-blue-700">
        <span className="shrink-0 mt-0.5">ℹ</span>
        <span>You can update these details later if anything changes.</span>
      </div>
    </div>
  );
}
