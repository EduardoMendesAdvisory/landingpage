import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WIZARD_INPUT_CLASS =
  "h-11 w-full rounded-lg border border-[#e7e1d8] bg-white px-3 text-sm text-[#111A24] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25 focus:border-[#b67c2c] transition-colors";

export function StepHeader({
  overline,
  title,
  description,
}: {
  overline: string;
  title: string;
  description: string;
}) {
  return (
    <div className="pb-6 border-b border-[#ece8e1]">
      <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
        {overline}
      </p>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111A24] leading-tight mb-2">
        {title}
      </h2>
      <p className="text-sm text-[#4b5564] leading-relaxed">{description}</p>
    </div>
  );
}

export function StepSection({
  title,
  hint,
  children,
  last,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("py-6", !last && "border-b border-[#ece8e1]")}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">
        {title}
      </p>
      <div className="w-8 h-[2px] bg-[#b67c2c] mb-3" />
      {hint && <p className="text-xs text-[#6b7280] mb-4 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}

export function StepFootnote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-[#6b7280] leading-relaxed border-t border-[#ece8e1] pt-5">
      {children}
    </p>
  );
}

export function optionButtonClass(selected: boolean, className?: string) {
  return cn(
    "relative transition-all",
    "border rounded-lg bg-white",
    selected
      ? "border-[#b67c2c] ring-1 ring-[#b67c2c]/30"
      : "border-[#e7e1d8] hover:border-[#cfc7ba] hover:bg-[#faf9f7]",
    className
  );
}

export function OptionCheck({ selected }: { selected: boolean }) {
  if (!selected) return null;
  return (
    <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#b67c2c] flex items-center justify-center">
      <Check size={11} strokeWidth={3} className="text-white" />
    </span>
  );
}

export const WIZARD_PRIMARY_BTN_CLASS =
  "inline-flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm";

export const WIZARD_SIDEBAR_BTN_CLASS =
  "inline-flex items-center justify-center gap-1.5 w-full bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-xs";
