import type { Database } from "@/types/database.types";

export type LeadStatus = Database["public"]["Enums"]["lead_status"];

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "assessment_started",
  "preliminary_assessment_completed",
  "assessment_completed",
  "call_booked",
  "call_completed",
  "qualified",
  "not_qualified",
  "client_approved",
  "converted",
  "lost",
  "closed",
];
