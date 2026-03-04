"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return (
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-xl font-bold text-white">
        IdeaForge AI
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/pricing" className="text-slate-300 hover:text-white">
          Pricing
        </Link>
        {email ? (
          <>
            <Link href="/dashboard" className="text-slate-300 hover:text-white">
              Dashboard
            </Link>
            <Link href="/admin" className="rounded-md border border-slate-700 px-3 py-2 text-slate-100 hover:bg-slate-900">
              Admin
            </Link>
          </>
        ) : (
          <Link href="/auth" className="rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
            Sign up / Login
          </Link>
        )}
      </div>
    </nav>
  );
}
