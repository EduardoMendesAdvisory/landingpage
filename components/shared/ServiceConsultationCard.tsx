import { BookConsultationLink } from "@/components/shared/BookConsultationLink";

interface ServiceConsultationCardProps {
  service: string;
}

export function ServiceConsultationCard({ service }: ServiceConsultationCardProps) {
  return (
    <div className="bg-light-bg rounded-2xl p-6">
      <p className="text-sm font-semibold text-navy mb-2">Next Step</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        Book a free 15-minute consultation with Eduardo to discuss your project and
        find the best way forward.
      </p>
      <BookConsultationLink service={service} className="w-full px-5 py-3 text-xs sm:text-sm" />
      <p className="text-xs text-muted-foreground mt-3 text-center">
        No obligation. Completely free.
      </p>
    </div>
  );
}
