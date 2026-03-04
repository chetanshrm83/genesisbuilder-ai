import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("profiles").upsert(
    { id: user.id, email: user.email },
    { onConflict: "id", ignoreDuplicates: false }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
