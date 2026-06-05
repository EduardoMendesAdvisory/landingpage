import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ShieldCheck,
  Check,
  Lock,
  MessageCircle,
  Star,
  Phone,
  CreditCard,
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

  // Split inclusions into two columns
  const mid = Math.ceil(inclusions.length / 2);
  const col1 = inclusions.slice(0, mid);
  const col2 = inclusions.slice(mid);

  return (
    <div className="min-h-screen bg-white">

      {/* ?? Hero header (dark navy with house image) ??????????????? */}
      <div className="relative bg-navy overflow-hidden min-h-[280px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%202.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/98 via-navy/90 to-navy/70" />

        <div className="relative z-10 px-6 pt-6 pb-10">
          <div className="max-w-5xl mx-auto">
            {/* Logo + contact bar */}
            <div className="flex items-start justify-between mb-8">
              <Link href="/">
                <img
                  src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                  alt="Eduardo Mendes Advisory"
                  className="h-9 w-auto"
                />
              </Link>
              <div className="hidden sm:flex items-center gap-2 text-white/60 text-xs">
                <MessageCircle size={13} />
                <span>Need help?{" "}
                  <a href="tel:0419112555" className="text-white hover:underline">
                    0419 112 555
                  </a>
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="max-w-xl">
              <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Star size={12} className="fill-amber" />
                Exclusive Recommendation
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Your Recommended Service
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-6">
                Based on our conversation, I recommend the service below to give you the best outcome for your project.
              </p>

              {/* Eduardo avatar row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber/20 border-2 border-amber/40 overflow-hidden shrink-0">
                    <img
                      src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/eduardo%20mendes%20photo.png"
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
            </div>
          </div>
        </div>
      </div>

      {/* ?? Body ??????????????????????????????????????????????????? */}
      <main className="px-4 py-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ?? Left: service details ????????????????????????????? */}
          <div className="space-y-6">

            {/* Recommended label */}
            <div className="inline-flex items-center gap-1.5 bg-amber/10 border border-amber/20 rounded-full px-3 py-1">
              <Check size={12} className="text-amber" />
              <span className="text-xs font-semibold text-amber uppercase tracking-wider">Recommended For You</span>
            </div>

            {/* Service name */}
            <div>
              <h2 className="text-3xl font-bold text-navy mb-2">{service.name}</h2>
              {service.tagline && (
                <p className="text-base text-gray-500 font-medium">{service.tagline}</p>
              )}
              {service.description && (
                <p className="text-gray-600 mt-3 leading-relaxed">{service.description}</p>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* What's included */}
            {inclusions.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-navy mb-4">What&apos;s Included</h3>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {[...col1, ...col2].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <Check size={15} className="text-amber shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intro call note */}
            <div className="flex items-start gap-3 bg-amber/5 border border-amber/20 rounded-xl px-4 py-3">
              <Phone size={16} className="text-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-navy">Includes a free 15-minute intro call</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  with Eduardo to ensure we&apos;re aligned on your goals.
                </p>
              </div>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: ShieldCheck, label: "Secure Payment",       desc: "Your payment is processed securely by Stripe." },
                { icon: Lock,        label: "100% Confidential",    desc: "Your information is never shared with third parties." },
                { icon: MessageCircle, label: "Need Help?",         desc: "Reply to this email or call 0419 112 555" },
              ].map((item) => (
                <div key={item.label} className="flex gap-2.5">
                  <item.icon size={16} className="text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-navy">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ?? Right: payment summary card ??????????????????????? */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
              <h3 className="text-base font-bold text-navy mb-5">Service Summary</h3>

              {/* Service icon + name */}
              <div className="flex flex-col items-center text-center border-b border-gray-100 pb-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center mb-3">
                  <ShieldCheck size={28} className="text-amber" />
                </div>
                <p className="font-bold text-navy">{service.name}</p>
                {service.tagline && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{service.tagline}</p>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Investment</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-navy">{formatPrice(service.price ?? 0)}</span>
                  <span className="text-sm text-gray-400">{service.currency ?? "AUD"}</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">One-time payment  GST included</p>
              </div>

              {/* Key benefits */}
              <div className="space-y-2 mb-5">
                {[
                  "Expert guidance from Eduardo Mendes",
                  "Practical recommendations tailored to your project",
                  "Protect your time, money and peace of mind",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2">
                    <Check size={13} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 leading-tight">{benefit}</p>
                  </div>
                ))}
              </div>

              {/* Payment logos */}
              <div className="flex items-center gap-2 mb-4">
                {/* Visa */}
                <div className="h-7 px-2 bg-blue-600 rounded flex items-center text-white text-xs font-bold">VISA</div>
                {/* Mastercard */}
                <div className="h-7 w-10 rounded flex items-center justify-center overflow-hidden bg-gray-100">
                  <span className="text-xs font-bold text-gray-700">MC</span>
                </div>
                {/* Apple Pay */}
                <div className="h-7 px-2 bg-black rounded flex items-center text-white text-[10px] font-semibold">Apple Pay</div>
                {/* Google Pay */}
                <div className="h-7 px-2 bg-gray-100 rounded flex items-center text-gray-700 text-[10px] font-semibold">G Pay</div>
              </div>

              {/* CTA */}
              <a
                href={`/api/stripe/checkout?service=${slug}`}
                className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy/90 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                <Lock size={14} />
                Secure Checkout
              </a>

              <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
                <CreditCard size={11} />
                Powered by <span className="font-semibold text-indigo-600">Stripe</span>
              </p>
            </div>

            {/* Trust card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-700">Trusted by Owner Builders</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Hundreds of owner builders across Australia trust Eduardo Mendes for expert guidance.
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} size={12} className={n < 5 ? "fill-amber text-amber" : "fill-amber/40 text-amber/40"} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">4.9  120+ Google Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ?? Footer ????????????????????????????????????????????????? */}
      <footer className="bg-navy py-8 px-6 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-amber shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-semibold">Trusted by Owner Builders</p>
                <p className="text-white/50 text-xs mt-0.5">Hundreds of owner builders across Australia trust Eduardo Mendes for expert guidance.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} size={16} className={n < 5 ? "fill-amber text-amber" : "fill-amber/40 text-amber/40"} />
                ))}
              </div>
              <p className="text-white font-bold text-xl">4.9</p>
              <p className="text-white/50 text-xs">120+ Google Reviews</p>
            </div>
            <div className="flex sm:justify-end">
              <div>
                <p className="text-amber font-bold text-lg" style={{ fontFamily: "serif" }}>Eduardo Mendes</p>
                <p className="text-white/50 text-xs">Owner Builder Advisor</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 text-center text-white/30 text-xs">
             {new Date().getFullYear()} Eduardo Mendes Owner Builder Advisory. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
