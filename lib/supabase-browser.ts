import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function createClient() {
  return createSupabaseClient(env.supabaseUrl, env.supabaseAnonKey);
}
