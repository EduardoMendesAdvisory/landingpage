import { cn } from "@/lib/utils";
import type {
  LeadStatus,
  ProjectStatus,
  ProposalStatus,
  BuildcheckStatus,
} from "@/types/enums";

type Status =
  | LeadStatus
  | ProjectStatus
  | ProposalStatus
  | BuildcheckStatus
  | string;

interface StatusBadgeProps {
  status: Status;
  label?: string;
  className?: string;
}

const statusColours: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  assessment_completed: "bg-purple-50 text-purple-700 border-purple-200",
  call_booked: "bg-yellow-50 text-yellow-700 border-yellow-200",
  call_completed: "bg-orange-50 text-orange-700 border-orange-200",
  qualified: "bg-green-50 text-green-700 border-green-200",
  not_qualified: "bg-red-50 text-red-700 border-red-200",
  client_approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-50 text-gray-500 border-gray-200",
  planning: "bg-blue-50 text-blue-700 border-blue-200",
  pre_construction: "bg-yellow-50 text-yellow-700 border-yellow-200",
  in_construction: "bg-orange-50 text-orange-700 border-orange-200",
  on_hold: "bg-gray-50 text-gray-600 border-gray-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  draft: "bg-gray-50 text-gray-600 border-gray-200",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  viewed: "bg-purple-50 text-purple-700 border-purple-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-orange-50 text-orange-700 border-orange-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  reviewing: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-50 text-gray-500 border-gray-200",
};

function toLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const colour =
    statusColours[status] ?? "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colour,
        className
      )}
    >
      {label ?? toLabel(status)}
    </span>
  );
}
