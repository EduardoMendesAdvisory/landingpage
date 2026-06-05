import { Metadata } from "next";
import { AssessmentWizard } from "@/features/assessment/components/AssessmentWizard";

export const metadata: Metadata = {
  title: "Free Preliminary AI Assessment | Eduardo Mendes Advisory",
  description:
    "Get your personalised preliminary AI assessment in under 2 minutes. Identify potential savings, risks and next steps for your project.",
};

export default function AssessmentPage() {
  return <AssessmentWizard mode="free" />;
}
