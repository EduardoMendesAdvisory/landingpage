import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Project Assessment | Eduardo Mendes Advisory",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      {children}
    </div>
  );
}
