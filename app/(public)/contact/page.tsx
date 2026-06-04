import { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck2, Lock, Paperclip } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Eduardo Mendes Advisory.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#f5f4f1]">
      <section className="bg-white overflow-hidden border-b border-[#ece8e1] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[620px] items-center">
          <div className="py-16 md:py-20 max-w-xl">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">Let&apos;s Talk</p>

            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] text-[#111A24] mb-5">
              Let&apos;s Build
              <br />
              Your Project Right.
            </h1>

            <p className="text-[#4b5564] text-sm md:text-base max-w-md mb-10 leading-relaxed">
              Have a question or need independent advice? Get in touch and we&apos;ll get back to you promptly.
            </p>

            <p className="text-[#b67c2c] text-3xl leading-none mb-3" style={{ fontFamily: "cursive" }}>
              Eduardo Mendes
            </p>
            <p className="text-[#111A24] text-sm font-semibold">Owner Builder Advisor</p>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[620px] w-full">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/img.contct2.png"
              alt="Contact Eduardo Mendes Advisory"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-[#111A24]/10" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="bg-white border border-[#e7e1d8] rounded-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111A24] mb-3">Send Us a Message</h2>
              <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto" />
            </div>

            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-sm font-semibold text-[#111A24]">Full Name *</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-[#111A24]">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com.au"
                    className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-sm font-semibold text-[#111A24]">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="0412 345 678"
                    className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="projectType" className="text-sm font-semibold text-[#111A24]">Project Type *</label>
                  <select
                    id="projectType"
                    defaultValue=""
                    className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="new-build">New Build</option>
                    <option value="renovation">Renovation</option>
                    <option value="owner-builder">Owner Builder</option>
                    <option value="site-inspection">Site Inspection</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="helpWith" className="text-sm font-semibold text-[#111A24]">What can we help you with? *</label>
                <select
                  id="helpWith"
                  defaultValue=""
                  className="w-full h-11 rounded-lg border border-[#d8d2c7] px-3 text-sm text-[#111A24] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="quote-review">Quote & Contract Review</option>
                  <option value="pre-construction">Pre-Construction Advisory</option>
                  <option value="site-visits">Site Visits & Inspections</option>
                  <option value="general-advice">General Advice</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="projectDetails" className="text-sm font-semibold text-[#111A24]">Tell us about your project</label>
                <textarea
                  id="projectDetails"
                  rows={4}
                  placeholder="Include as much detail as you can about your project, where you are up to and how we can help."
                  className="w-full rounded-lg border border-[#d8d2c7] p-3 text-sm text-[#111A24] placeholder:text-[#8a8f98] resize-none focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between pt-2">
                <div className="text-sm text-[#4b5564] flex items-center gap-2">
                  <Paperclip size={16} className="text-[#111A24]" />
                  <div>
                    <strong className="text-[#111A24] block">Attach files (optional)</strong>
                    <p>Plans, quotes, contracts (Max 10MB each)</p>
                    <label htmlFor="contact-attachments" className="inline-flex items-center mt-1 text-[#b67c2c] font-semibold cursor-pointer hover:text-[#9f6c27] transition-colors">
                      Upload files
                    </label>
                    <input
                      id="contact-attachments"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                      className="sr-only"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-8 py-3 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors"
                >
                  Send Message
                </button>
              </div>

              <p className="text-xs text-[#6b7280] pt-2 flex items-center justify-center gap-2">
                <Lock size={13} className="text-[#111A24]" />
                Your information is secure and confidential.
              </p>
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-[#e7e1d8] rounded-xl p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#111A24] mb-3">Other Ways to Reach Us</h2>
                <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto" />
              </div>

              <div className="space-y-6">
                <div className="border-l border-[#b67c2c] pl-4">
                  <p className="text-xl font-bold text-[#111A24] leading-tight">Call</p>
                  <p className="text-xl font-bold text-[#111A24] leading-tight mt-1">0419 112 555</p>
                  <p className="text-sm text-[#4b5564] mt-2">Mon - Fri, 7:00am - 6:00pm</p>
                </div>

                <div className="border-t border-[#ece8e1] pt-6 border-l border-[#b67c2c] pl-4">
                  <p className="text-xl font-bold text-[#111A24] leading-tight">Email</p>
                  <p className="text-base font-semibold text-[#111A24] leading-tight mt-1 break-all">eduardo@eduardomendes.com.au</p>
                  <p className="text-sm text-[#4b5564] mt-2">We aim to reply within 24 hours</p>
                </div>

                <div className="border-t border-[#ece8e1] pt-6 border-l border-[#b67c2c] pl-4">
                  <p className="text-xl font-bold text-[#111A24] leading-tight">Service Areas</p>
                  <p className="text-base font-semibold text-[#111A24] leading-tight mt-1">Sunshine Coast, Brisbane & South East Queensland</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f3efe8] border border-[#e7e1d8] rounded-xl p-6">
              <p className="text-2xl font-bold text-[#111A24] leading-tight mb-2">Prefer to talk?</p>
              <p className="text-base text-[#4b5564] leading-relaxed mb-4">
                Book a free 15 minute call at a time that suits you.
              </p>
              <Link
                href="/book-call"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-5 border-[#b67c2c] text-[#b67c2c] hover:bg-[#b67c2c] hover:text-white"
                )}
              >
                <CalendarCheck2 size={16} />
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 px-4 border-y border-[#ece8e1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24] mb-3">Why Homeowners Contact Me</h2>
            <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            {[
              "Independent advice you can trust",
              "Straight answers and honest feedback",
              "Clear guidance at every stage",
              "Protect your budget and avoid costly mistakes",
              "Over 30 years of hands-on construction experience",
            ].map((item) => (
              <div key={item} className="border border-[#e7e1d8] rounded-lg px-4 py-4 text-sm text-[#111A24] font-semibold leading-snug bg-white">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0e1722] py-8 px-4 mb-8">
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden grid lg:grid-cols-[300px_1fr]">
          <div className="relative min-h-[220px]">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/edu%203.png"
              alt="Eduardo Mendes"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="relative px-6 md:px-10 py-10 text-white bg-[#071424]">
            <p className="text-[#b67c2c] text-4xl leading-none mb-4">“</p>
            <p className="text-2xl md:text-3xl leading-tight font-medium max-w-2xl mb-6">
              Every great build starts with the right advice.
              <br />
              Send me a message and let&apos;s talk about your project.
            </p>
            <p className="text-[#b67c2c] text-3xl leading-none" style={{ fontFamily: "cursive" }}>
              Eduardo Mendes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
