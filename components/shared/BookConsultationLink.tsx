"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { getConsultationUrl } from "@/lib/services-catalog";

interface BookConsultationLinkProps {
  service: string;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_LABEL = "Book Free 15-Min Consultation";

export function BookConsultationLink({
  service,
  className,
  children = DEFAULT_LABEL,
}: BookConsultationLinkProps) {
  return (
    <Link
      href={getConsultationUrl(service)}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold",
        "px-7 py-3.5 rounded-lg text-sm uppercase tracking-[0.14em]",
        "transition-colors cursor-pointer",
        className
      )}
    >
      <Calendar size={15} className="shrink-0" />
      {children}
    </Link>
  );
}
