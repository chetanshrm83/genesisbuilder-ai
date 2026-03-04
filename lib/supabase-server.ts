import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function createAnonClient() {
  return createClient(env.supabaseUrl, env.supabaseAnonKey);
}

export function createServiceClient() {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
}
