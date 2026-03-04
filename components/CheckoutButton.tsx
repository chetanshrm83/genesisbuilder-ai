"use client";

import { useState } from "react";
import { getAccessToken } from "@/lib/auth-token";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    const token = await getAccessToken();
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
      return;
    }

    alert(data.error ?? "Unable to start checkout.");
  }

  return (
    <button onClick={handleCheckout} disabled={loading} className="rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
      {loading ? "Redirecting..." : "Upgrade to Pro"}
    </button>
  );
}
