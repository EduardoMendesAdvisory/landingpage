import { ArrowRight, Upload } from "lucide-react";
import { UploadQuoteButton } from "@/components/shared/UploadQuoteButton";

const HERO_ICON_URL =
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20icon%202.png";

export function HeroLeadCalculator() {
  return (
    <div className="w-full max-w-[760px] flex flex-col items-center gap-4">
      <img
        src={HERO_ICON_URL}
        alt="BuildCheck hero illustration"
        className="w-full max-w-[640px] h-auto object-contain"
      />

      <UploadQuoteButton className="w-full max-w-[640px] inline-flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-sm font-bold uppercase tracking-wider py-3 rounded-lg transition-colors">
        <Upload size={14} />
        Upload Your Quote
        <ArrowRight size={13} />
      </UploadQuoteButton>
    </div>
  );
}
