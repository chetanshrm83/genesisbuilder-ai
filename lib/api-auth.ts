import { createAnonClient } from "@/lib/supabase-server";

export async function getUserFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return null;
  }

  const supabase = createAnonClient();
  const {
    data: { user }
  } = await supabase.auth.getUser(token);

  return user;
}
