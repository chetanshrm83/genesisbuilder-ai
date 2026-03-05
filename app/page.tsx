import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 rounded-full bg-indigo-500/20 px-4 py-2 text-sm text-indigo-200">AI Startup Co-pilot</p>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">Turn Your Ideas Into Launch-Ready Startups</h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300">
          IdeaForge AI helps founders generate startup ideas, validate positioning, create go-to-market assets, and export complete business plans.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/auth" className="rounded-lg bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600">
            Start Building
          </Link>
          <Link href="/pricing" className="rounded-lg border border-slate-600 px-6 py-3 font-semibold text-slate-100 hover:bg-slate-800">
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
