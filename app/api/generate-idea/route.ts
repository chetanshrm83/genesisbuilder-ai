import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { openai, buildIdeaPrompt } from "@/lib/openai";
import { getUserFromRequest } from "@/lib/api-auth";
import { normalizeIdeaOutput } from "@/lib/idea-output";

export async function POST(request: Request) {
  const input = await request.json();
  const user = await getUserFromRequest(request);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  const plan = profile?.plan ?? "free";

  if (plan !== "pro") {
    const { count } = await supabase
      .from("ideas")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString());

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: "Free tier limit reached (3 generations/day). Upgrade to Pro." }, { status: 403 });
    }
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: buildIdeaPrompt(input) }],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const raw = completion.choices[0]?.message.content;
  if (!raw) return NextResponse.json({ error: "AI did not return content." }, { status: 500 });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "AI output could not be parsed. Please retry." }, { status: 502 });
  }

  const output = normalizeIdeaOutput(parsed);

  const { data, error } = await supabase
    .from("ideas")
    .insert({ user_id: user.id, input, output })
    .select("id, output, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("saved_plans").insert({
    user_id: user.id,
    idea_id: data.id,
    title: output.brandName,
    content: output,
    checklist: (output.launchChecklist ?? []).map((step: string) => ({ step, completed: false }))
  });

  return NextResponse.json({ idea: data });
}
