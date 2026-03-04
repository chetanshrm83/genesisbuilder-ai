"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase-browser";
import { getAccessToken } from "@/lib/auth-token";

type Competitor = { competitor: string; strength: string; weakness: string; opportunity: string };
type IdeaOutput = {
  startupIdea: string;
  brandName: string;
  domainSuggestions: string[];
  targetCustomer: string;
  problemSolved: string;
  revenueModel: string;
  pricingStrategy: string;
  marketingPlan: string;
  landingPageCopy: { headline: string; subheadline: string; cta: string };
  productDescription: string;
  marketingPosts: string[];
  competitorAnalysis: Competitor[];
  launchChecklist: string[];
  estimatedMonthlyRevenuePotential: string;
};

type IdeaRecord = { id: string; output: IdeaOutput; created_at: string };

const blankForm = { skills: "", interests: "", budget: "", availableTime: "" };

export default function DashboardPage() {
  const [form, setForm] = useState(blankForm);
  const [userEmail, setUserEmail] = useState("");
  const [ideas, setIdeas] = useState<IdeaRecord[]>([]);
  const [selected, setSelected] = useState<IdeaRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editableDescription, setEditableDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth");
        return;
      }
      setUserEmail(data.user.email ?? "");
      const token = await getAccessToken();
      const result = await fetch("/api/ideas", { headers: { Authorization: `Bearer ${token}` } });
      const payload = await result.json();
      if (payload.ideas) setIdeas(payload.ideas);
    };

    void init();
  }, [router]);

  async function generateIdea(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const token = await getAccessToken();
    const response = await fetch("/api/generate-idea", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not generate startup plan.");
      return;
    }

    const idea = payload.idea as IdeaRecord;
    setIdeas((current) => [idea, ...current]);
    setSelected(idea);
    setEditableDescription(idea.output.productDescription);
  }

  async function saveDescription() {
    if (!selected) return;
    const token = await getAccessToken();
    const response = await fetch(`/api/plans/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productDescription: editableDescription })
    });

    if (!response.ok) {
      alert("Unable to save plan changes.");
      return;
    }

    const updated = { ...selected, output: { ...selected.output, productDescription: editableDescription } };
    setSelected(updated);
    setIdeas((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setEditingDescription(false);
  }

  async function exportPlan() {
    if (!selected) return;
    const token = await getAccessToken();
    const response = await fetch("/api/export-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ideaId: selected.id })
    });

    if (!response.ok) {
      const payload = await response.json();
      alert(payload.error ?? "Unable to export plan.");
      return;
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ideaforge-plan-${selected.id}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <main className="pb-10">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl font-bold">Startup Dashboard</h1>
        <p className="mt-1 text-slate-300">Signed in as {userEmail}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <form onSubmit={generateIdea} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Generate a startup plan</h2>
            {Object.entries(form).map(([key, value]) => (
              <input
                key={key}
                value={value}
                required
                onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                className="w-full rounded-md border border-slate-700 bg-white px-3 py-2"
              />
            ))}
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button disabled={loading} className="rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
              {loading ? "Generating..." : "Generate Startup"}
            </button>
          </form>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-3 text-xl font-semibold">Saved ideas</h2>
            <div className="max-h-[420px] space-y-2 overflow-auto">
              {ideas.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => {
                    setSelected(idea);
                    setEditableDescription(idea.output.productDescription);
                    setEditingDescription(false);
                  }}
                  className="w-full rounded-md border border-slate-700 p-3 text-left hover:bg-slate-800"
                >
                  <p className="font-semibold">{idea.output.brandName}</p>
                  <p className="text-xs text-slate-400">{new Date(idea.created_at).toLocaleString()}</p>
                </button>
              ))}
              {!ideas.length ? <p className="text-slate-400">No plans yet.</p> : null}
            </div>
          </div>
        </div>

        {selected ? (
          <article className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold">{selected.output.brandName}</h3>
                <p className="text-slate-300">{selected.output.startupIdea}</p>
              </div>
              <button onClick={exportPlan} className="rounded-md bg-indigo-500 px-4 py-2 font-semibold hover:bg-indigo-600">
                Export Business Plan
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <p><strong>Domain ideas:</strong> {selected.output.domainSuggestions.join(", ")}</p>
              <p><strong>Revenue model:</strong> {selected.output.revenueModel}</p>
              <p><strong>Pricing:</strong> {selected.output.pricingStrategy}</p>
              <p><strong>Revenue potential:</strong> {selected.output.estimatedMonthlyRevenuePotential}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Product Description</h4>
              {editingDescription ? (
                <>
                  <textarea
                    value={editableDescription}
                    onChange={(e) => setEditableDescription(e.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-md border border-slate-700 bg-white p-3"
                  />
                  <div className="mt-2 flex gap-2">
                    <button onClick={saveDescription} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold">Save</button>
                    <button onClick={() => setEditingDescription(false)} className="rounded-md border border-slate-700 px-3 py-2 text-sm">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-2 text-slate-300">{selected.output.productDescription}</p>
                  <button onClick={() => setEditingDescription(true)} className="mt-2 rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">
                    Edit plan
                  </button>
                </>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Landing Page Copy</h4>
              <p className="mt-2 text-slate-300"><strong>{selected.output.landingPageCopy.headline}</strong> — {selected.output.landingPageCopy.subheadline}</p>
              <p className="text-slate-300">CTA: {selected.output.landingPageCopy.cta}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Marketing Plan</h4>
              <p className="mt-2 text-slate-300">{selected.output.marketingPlan}</p>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-200">
                {selected.output.marketingPosts.map((post, idx) => (
                  <li key={`${selected.id}-post-${idx}`}>{post}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold">Competitor Analysis</h4>
              <div className="mt-2 space-y-3">
                {selected.output.competitorAnalysis.map((c, idx) => (
                  <div key={`${selected.id}-comp-${idx}`} className="rounded-md border border-slate-700 p-3">
                    <p className="font-semibold">{c.competitor}</p>
                    <p className="text-sm text-slate-300">Strength: {c.strength}</p>
                    <p className="text-sm text-slate-300">Weakness: {c.weakness}</p>
                    <p className="text-sm text-slate-300">Opportunity: {c.opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
