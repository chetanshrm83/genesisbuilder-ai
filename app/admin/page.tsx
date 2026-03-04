"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { getAccessToken } from "@/lib/auth-token";

type Metrics = {
  users: number;
  totalGenerations: number;
  proSubscriptions: number;
  estimatedMonthlyRevenue: number;
};

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const token = await getAccessToken();
      const response = await fetch("/api/admin/metrics", { headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Unable to load admin metrics");
        return;
      }
      setMetrics(payload);
    };

    void run();
  }, []);

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-10">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {error ? <p className="mt-3 text-red-400">{error}</p> : null}
        {metrics ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card label="Users" value={metrics.users} />
            <Card label="Total Generations" value={metrics.totalGenerations} />
            <Card label="Pro Subscriptions" value={metrics.proSubscriptions} />
            <Card label="Estimated MRR" value={`$${metrics.estimatedMonthlyRevenue}`} />
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
