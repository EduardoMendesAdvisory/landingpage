export type UserRole = "lead" | "client" | "admin";

export type LeadStatus =
  | "new"
  | "assessment_completed"
  | "call_booked"
  | "call_completed"
  | "qualified"
  | "not_qualified"
  | "client_approved"
  | "closed";

export type ProjectStatus =
  | "planning"
  | "pre_construction"
  | "in_construction"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProposalStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "approved"
  | "declined"
  | "expired"
  | "paid";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type BuildcheckStatus = "pending" | "reviewing" | "completed";

export type DocumentCategory =
  | "builder_quotes"
  | "contracts"
  | "plans"
  | "photos"
  | "reports"
  | "council_documents"
  | "other";

export type NotificationType =
  | "lead_created"
  | "assessment_completed"
  | "call_booked"
  | "proposal_sent"
  | "proposal_approved"
  | "payment_received"
  | "document_uploaded"
  | "message_received"
  | "meeting_booked";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  assessment_completed: "Assessment Complete",
  call_booked: "Call Booked",
  call_completed: "Call Completed",
  qualified: "Qualified",
  not_qualified: "Not Qualified",
  client_approved: "Client Approved",
  closed: "Closed",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  pre_construction: "Pre-Construction",
  in_construction: "In Construction",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  viewed: "Viewed",
  approved: "Approved",
  declined: "Declined",
  expired: "Expired",
  paid: "Paid",
};

export const BUILDCHECK_STATUS_LABELS: Record<BuildcheckStatus, string> = {
  pending: "Pending",
  reviewing: "Under Review",
  completed: "Completed",
};
