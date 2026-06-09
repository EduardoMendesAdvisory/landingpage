import { createClient } from "@/lib/supabase/server";
import { normaliseStage } from "@/lib/buildiq/project-stages";

export type ClientProjectSummary = {
  project_name: string;
  project_stage: string | null;
  project_status: string;
  budget_range: string | null;
  location: string | null;
  confidence_score: number | null;
};

export type ClientContext = {
  firstName: string;
  fullName: string;
  client: {
    id: string;
    client_status: string;
    activated_at: string;
  } | null;
  project: ClientProjectSummary | null;
  /** True when the client has a completed assessment on file. */
  assessmentSubmitted: boolean;
};

function formatProjectType(type: string | null): string {
  if (!type) return "Your Build Project";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatNameFromEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const local = email.split("@")[0]?.trim();
  if (!local) return null;

  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function resolveClientNames(input: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}): { firstName: string; fullName: string } {
  const profileFirst = input.first_name?.trim();
  const profileLast = input.last_name?.trim();

  if (profileFirst) {
    const fullName = [profileFirst, profileLast].filter(Boolean).join(" ");
    return { firstName: profileFirst, fullName };
  }

  const fromEmail = formatNameFromEmail(input.email);
  if (fromEmail) {
    const firstName = fromEmail.split(" ")[0] ?? fromEmail;
    return { firstName, fullName: fromEmail };
  }

  return { firstName: "there", fullName: "there" };
}

export async function getClientContext(userId: string): Promise<ClientContext> {
  const supabase = await createClient();

  const [profileResult, clientResult, userResult] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("clients")
      .select("id, client_status, activated_at, lead_id")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase.from("users").select("email").eq("id", userId).single(),
  ]);

  const profile = profileResult.data as {
    first_name: string | null;
    last_name: string | null;
  } | null;

  const email = (userResult.data as { email: string } | null)?.email ?? null;
  const { firstName, fullName } = resolveClientNames({
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    email,
  });

  const clientRow = clientResult.data as {
    id: string;
    client_status: string;
    activated_at: string;
    lead_id: string | null;
  } | null;

  if (!clientRow) {
    return { firstName, fullName, client: null, project: null, assessmentSubmitted: false };
  }

  const client = {
    id: clientRow.id,
    client_status: clientRow.client_status,
    activated_at: clientRow.activated_at,
  };

  let assessmentSubmitted = false;
  if (clientRow.lead_id) {
    const [{ data: assessment }, { data: lead }] = await Promise.all([
      supabase
        .from("assessments")
        .select("id")
        .eq("lead_id", clientRow.lead_id)
        .eq("is_current", true)
        .maybeSingle(),
      supabase
        .from("leads")
        .select("lead_status")
        .eq("id", clientRow.lead_id)
        .maybeSingle(),
    ]);

    const completedLeadStatuses = [
      "assessment_completed",
      "preliminary_assessment_completed",
      "qualified",
      "client_approved",
      "call_booked",
      "call_completed",
      "converted",
    ];

    assessmentSubmitted =
      Boolean(assessment) ||
      completedLeadStatuses.includes(
        (lead as { lead_status: string } | null)?.lead_status ?? ""
      );
  }

  // Active clients always have assessment submitted (required before portal access)
  if (clientRow.client_status === "active") {
    assessmentSubmitted = true;
  }

  const projectResult = await supabase
    .from("projects")
    .select(
      "project_name, project_status, project_stage, budget_range, location, confidence_score"
    )
    .eq("client_id", client.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const projectRow = projectResult.data as {
    project_name: string;
    project_status: string;
    project_stage: string | null;
    budget_range: string | null;
    location: string | null;
    confidence_score: number | null;
  } | null;

  if (projectRow) {
    return {
      firstName,
      fullName,
      client,
      project: {
        project_name: projectRow.project_name,
        project_stage: normaliseStage(projectRow.project_stage),
        project_status: projectRow.project_status,
        budget_range: projectRow.budget_range,
        location: projectRow.location,
        confidence_score: projectRow.confidence_score,
      },
      assessmentSubmitted,
    };
  }

  if (!clientRow.lead_id) {
    return { firstName, fullName, client, project: null, assessmentSubmitted };
  }

  const [leadResult, assessmentResult] = await Promise.all([
    supabase
      .from("leads")
      .select("project_type, project_stage, budget_range, location, suburb, state")
      .eq("id", clientRow.lead_id)
      .maybeSingle(),
    supabase
      .from("assessments")
      .select(
        "project_type, project_stage, budget_range, state, suburb, assessment_score"
      )
      .eq("lead_id", clientRow.lead_id)
      .eq("is_current", true)
      .maybeSingle(),
  ]);

  const lead = leadResult.data as {
    project_type: string | null;
    project_stage: string | null;
    budget_range: string | null;
    location: string | null;
    suburb: string | null;
    state: string | null;
  } | null;

  const assessment = assessmentResult.data as {
    project_type: string | null;
    project_stage: string | null;
    budget_range: string | null;
    state: string | null;
    suburb: string | null;
    assessment_score: number | null;
  } | null;

  const source = assessment ?? lead;
  if (!source) {
    return { firstName, fullName, client, project: null, assessmentSubmitted };
  }

  const location =
    [assessment?.suburb ?? lead?.suburb, assessment?.state ?? lead?.state]
      .filter(Boolean)
      .join(", ") ||
    lead?.location ||
    null;

  return {
    firstName,
    fullName,
    client,
    project: {
      project_name: formatProjectType(source.project_type),
      // For clients without a project row yet, derive stage from assessment
      project_stage: normaliseStage(source.project_stage) ?? "project_assessment",
      project_status: "planning",
      budget_range: source.budget_range,
      location,
      confidence_score: assessment?.assessment_score ?? null,
    },
    assessmentSubmitted: assessmentSubmitted || Boolean(assessment),
  };
}
