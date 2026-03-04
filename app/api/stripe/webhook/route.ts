import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json({ error: `Webhook Error: ${(error as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    const service = createServiceClient();
    const customer = await stripe.customers.retrieve(customerId);
    const userId = typeof customer === "object" && !("deleted" in customer) ? customer.metadata.userId : undefined;

    if (userId) {
      await service
        .from("profiles")
        .upsert({ id: userId, plan: "pro", stripe_customer_id: customerId, stripe_subscription_id: subscriptionId });
    }
  }

  return NextResponse.json({ received: true });
}
