import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { getUserFromRequest } from "@/lib/api-auth";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("ideas")
    .select("id, output, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ideas: data });
}
