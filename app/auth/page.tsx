"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Navbar } from "@/components/Navbar";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const supabase = createClient();

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (token) {
      await fetch("/api/profile/init", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    }

    router.push("/dashboard");
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto mt-12 max-w-md px-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="text-2xl font-bold">{mode === "signup" ? "Create your IdeaForge account" : "Welcome back"}</h1>
          <p className="mt-2 text-slate-300">Generate startup strategies and launch assets in minutes.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md border border-slate-700 bg-white px-3 py-2" />
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full rounded-md border border-slate-700 bg-white px-3 py-2" />
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button className="w-full rounded-md bg-brand-500 py-2 font-semibold text-white hover:bg-brand-600">{mode === "signup" ? "Sign up" : "Login"}</button>
          </form>
          <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="mt-4 text-sm text-indigo-300 hover:text-indigo-200">
            {mode === "signup" ? "Already have an account? Login" : "Need an account? Sign up"}
          </button>
        </div>
      </section>
    </main>
  );
}
