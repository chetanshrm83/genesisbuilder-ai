import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { getUserFromRequest } from "@/lib/api-auth";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user || !user.email || !env.adminEmails.includes(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServiceClient();

  const [{ count: userCount }, { count: ideaCount }, { count: proCount }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("ideas").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro")
  ]);

  const monthlyRevenue = (proCount ?? 0) * 19;
  return NextResponse.json({
    users: userCount ?? 0,
    totalGenerations: ideaCount ?? 0,
    proSubscriptions: proCount ?? 0,
    estimatedMonthlyRevenue: monthlyRevenue
  });
}
