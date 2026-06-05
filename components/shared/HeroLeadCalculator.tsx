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

      <UploadQuoteButton size="hero" />
    </div>
  );
}
