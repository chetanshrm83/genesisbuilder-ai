import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { ideaToPdfBuffer } from "@/lib/pdf";
import { getUserFromRequest } from "@/lib/api-auth";

export async function POST(request: Request) {
  const { ideaId } = await request.json();
  const user = await getUserFromRequest(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  if ((profile?.plan ?? "free") !== "pro") {
    return NextResponse.json({ error: "Upgrade to Pro to export plans." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("ideas")
    .select("output")
    .eq("id", ideaId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const pdfBuffer = await ideaToPdfBuffer(data.output);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=ideaforge-${ideaId}.pdf`
    }
  });
}
