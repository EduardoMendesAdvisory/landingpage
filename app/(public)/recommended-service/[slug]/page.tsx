import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { FOOTER_BRAND_LOGO } from "@/lib/branding";
import { BUSINESS_EMAIL, BUSINESS_MAILTO } from "@/lib/site/contact";
import {
  ShieldCheck,
  Check,
  Lock,
  MessageCircle,
  Star,
  CreditCard,
  Calendar,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from("services")
    .select("name, tagline")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Recommended Service | Eduardo Mendes Advisory" };
  return {
    title: `${data.name} | Eduardo Mendes Advisory`,
    description: data.tagline ?? undefined,
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default async function RecommendedServicePage({ params }: PageProps) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: service, error } = await admin
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !service) notFound();

  const inclusions: string[] = Array.isArray(service.inclusions)
    ? (service.inclusions as unknown[]).filter((i): i is string => typeof i === "string")
    : [];

  const mid = Math.ceil(inclusions.length / 2);
  const col1 = inclusions.slice(0, mid);
  const col2 = inclusions.slice(mid);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f7]">
      {/* Hero */}
      <div className="relative bg-[#111A24] overflow-hidden min-h-[380px]">
        <div
          className="absolute inset-0 bg-cover bg-[center_right] sm:bg-right bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20desktop.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111A24]/70 via-[#111A24]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/40 via-transparent to-transparent" />

        <div className="relative z-10 px-6 py-8 sm:py-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_280px] gap-8 items-start">
            <div>
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
                <Star size={13} className="fill-[#b67c2c] text-[#b67c2c]" />
                Exclusive Recommendation
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-md">
                Your Recommended Service
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-6 max-w-lg">
                Based on our conversation, Eduardo recommends the service below to give you the best outcome for your
                project.
              </p>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#b67c2c]/20 border-2 border-[#b67c2c]/40 overflow-hidden shrink-0">
                  <img
                    src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/edu.png"
                    alt="Eduardo Mendes"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Eduardo Mendes</p>
                  <p className="text-white/50 text-xs">Owner Builder Advisor</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-4">
              <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5">
                <ShieldCheck size={18} className="text-[#b67c2c] shrink-0" />
                <div className="text-xs leading-tight">
                  <p className="text-white font-medium">Your information is secure</p>
                  <p className="text-white/40">We never share your data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <Link href="/">
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                alt="Eduardo Mendes Advisory"
                className="h-8 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 items-start">
          {/* Left: service details */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece8e1] p-6 sm:p-10 space-y-0">
            <div className="pb-6 border-b border-[#ece8e1]">
              <div className="inline-flex items-center gap-1.5 bg-[#faf9f7] border border-[#ece8e1] rounded-full px-3 py-1 mb-4">
                <Check size={12} className="text-[#b67c2c]" />
                <span className="text-xs font-semibold text-[#b67c2c] uppercase tracking-[0.12em]">
                  Recommended For You
                </span>
              </div>
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
                Service Overview
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111A24] leading-tight mb-2">{service.name}</h2>
              {service.tagline && (
                <p className="text-sm text-[#4b5564] font-medium mb-2">{service.tagline}</p>
              )}
              {service.description && (
                <p className="text-sm text-[#4b5564] leading-relaxed">{service.description}</p>
              )}
            </div>

            {inclusions.length > 0 && (
              <div className="py-6 border-b border-[#ece8e1]">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">
                  What&apos;s Included
                </p>
                <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {[...col1, ...col2].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <Check size={14} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <p className="text-sm text-[#4b5564] leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="py-6 border-b border-[#ece8e1]">
              <div className="flex items-start gap-3 rounded-xl border border-[#ece8e1] bg-[#faf9f7] px-4 py-3">
                <Calendar size={16} className="text-[#b67c2c] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#111A24]">Includes a free 15-minute intro call</p>
                  <p className="text-xs text-[#6b7280] mt-0.5 leading-relaxed">
                    with Eduardo to ensure we&apos;re aligned on your goals before work begins.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, label: "Secure Payment", desc: "Processed securely by Stripe." },
                  { icon: Lock, label: "100% Confidential", desc: "Your information is never shared." },
                  {
                    icon: MessageCircle,
                    label: "Need Help?",
                    desc: "Reply to your confirmation email anytime.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-2.5">
                    <item.icon size={16} className="text-[#b67c2c] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#111A24]">{item.label}</p>
                      <p className="text-[11px] text-[#6b7280] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: payment summary */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#ece8e1] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="bg-[#faf9f7] border-b border-[#ece8e1] px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b67c2c]">Service Summary</p>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex flex-col items-center text-center border-b border-[#ece8e1] pb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#faf9f7] border border-[#ece8e1] flex items-center justify-center mb-3">
                    <ShieldCheck size={26} className="text-[#b67c2c]" strokeWidth={1.8} />
                  </div>
                  <p className="font-bold text-[#111A24]">{service.name}</p>
                  {service.tagline && (
                    <p className="text-xs text-[#6b7280] mt-0.5 leading-relaxed">{service.tagline}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">Investment</p>
                  <div className="w-8 h-[2px] bg-[#b67c2c] mb-3" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-[#111A24]">{formatPrice(service.price ?? 0)}</span>
                    <span className="text-sm text-[#9ca3af]">{service.currency ?? "AUD"}</span>
                  </div>
                  <p className="text-xs text-[#9ca3af] mt-0.5">One-time payment. GST included.</p>
                </div>

                <div className="space-y-2">
                  {[
                    "Expert guidance from Eduardo Mendes",
                    "Recommendations tailored to your project",
                    "Protect your time, money and peace of mind",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2">
                      <Check size={13} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <p className="text-xs text-[#4b5564] leading-tight">{benefit}</p>
                    </div>
                  ))}
                </div>

                <a
                  href={`/api/stripe/checkout?service=${slug}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-sm font-semibold py-3.5 rounded-lg transition-colors uppercase tracking-[0.12em]"
                >
                  <Lock size={14} />
                  Secure Checkout
                </a>

                <p className="text-center text-[11px] text-[#9ca3af] flex items-center justify-center gap-1">
                  <CreditCard size={11} />
                  Powered by Stripe
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#ece8e1] bg-[#faf9f7] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
                <div>
                  <p className="text-xs font-semibold text-[#111A24]">Trusted advisory</p>
                  <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
                    Hundreds of owner builders across Australia trust Eduardo Mendes to protect their investment.
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={11}
                        className={n < 5 ? "fill-[#b67c2c] text-[#b67c2c]" : "fill-[#b67c2c]/30 text-[#b67c2c]/30"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#ece8e1] p-5">
              <p className="text-xs font-semibold text-[#111A24] mb-1">Need help?</p>
              <a
                href={BUSINESS_MAILTO}
                className="text-sm text-[#4b5564] hover:text-[#111A24] transition-colors"
              >
                {BUSINESS_EMAIL}
              </a>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-white border-t border-[#ece8e1] py-4 px-6 mt-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#9ca3af]">
          <div className="flex items-center gap-2">
            <Lock size={13} />
            <span className="font-medium text-[#4b5564]">Secure SSL encryption</span>
            <span>256-bit protection</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={13} />
            <span>
              Need help?{" "}
              <a href="/contact" className="text-[#111A24] hover:underline">
                Chat with our team
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img src={FOOTER_BRAND_LOGO} alt="Eduardo Mendes Advisory" className="h-6 w-auto" />
            <span>Owner Builder Advisor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
