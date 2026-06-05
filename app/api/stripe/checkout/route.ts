import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceSlug = searchParams.get("service");

  if (!serviceSlug) {
    return NextResponse.json({ error: "Service slug required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Fetch service
  const { data: service, error } = await admin
    .from("services")
    .select("id, slug, name, price, currency")
    .eq("slug", serviceSlug)
    .eq("is_active", true)
    .single();

  if (error || !service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // If Stripe key is not configured, redirect to a placeholder success page
  if (!stripeSecretKey) {
    const successUrl = `${siteUrl}/assessment/paid?service=${serviceSlug}&demo=true`;
    return NextResponse.redirect(successUrl);
  }

  // Dynamically import Stripe to avoid build errors when key is not set
  try {
    const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-05-27.dahlia" });

    const priceInCents = Math.round((service.price ?? 0) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: (service.currency ?? "AUD").toLowerCase(),
            product_data: {
              name: service.name,
              description: `Eduardo Mendes Owner Builder Advisory  |  ${service.name}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/assessment/paid?service=${serviceSlug}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/recommended-service/${serviceSlug}`,
      metadata: {
        service_id: service.id,
        service_slug: service.slug,
      },
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }

    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  } catch (err) {
    console.error("[stripe/checkout] Error:", err);
    return NextResponse.json({ error: "Payment setup failed. Please try again." }, { status: 500 });
  }
}
