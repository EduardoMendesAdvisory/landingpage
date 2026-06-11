"use client";

import { useLeadPipeline } from "@/components/advisor/LeadPipelineSection";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function LeadStatusBadge() {
  const { status } = useLeadPipeline();
  return <StatusBadge status={status} />;
}
