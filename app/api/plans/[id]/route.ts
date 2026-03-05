import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { getUserFromRequest } from "@/lib/api-auth";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productDescription } = await request.json();
  if (typeof productDescription !== "string" || productDescription.trim().length < 20) {
    return NextResponse.json({ error: "Description must be at least 20 chars." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: idea, error: fetchError } = await supabase
    .from("ideas")
    .select("output")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !idea) return NextResponse.json({ error: "Plan not found." }, { status: 404 });

  const output = { ...(idea.output as Record<string, unknown>), productDescription };

  const { error } = await supabase.from("ideas").update({ output }).eq("id", params.id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("saved_plans").update({ content: output }).eq("idea_id", params.id).eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
