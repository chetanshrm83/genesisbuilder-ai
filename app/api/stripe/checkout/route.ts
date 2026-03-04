import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";
import { env } from "@/lib/env";
import { getUserFromRequest } from "@/lib/api-auth";

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const { data: existing } = await service.from("profiles").select("stripe_customer_id").eq("id", user.id).single();

  let customerId = existing?.stripe_customer_id as string | null;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    customerId = customer.id;
    await service.from("profiles").upsert({ id: user.id, stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: env.stripePriceId, quantity: 1 }],
    success_url: `${env.appUrl}/dashboard?upgrade=success`,
    cancel_url: `${env.appUrl}/pricing?upgrade=canceled`
  });

  return NextResponse.json({ url: session.url });
}
