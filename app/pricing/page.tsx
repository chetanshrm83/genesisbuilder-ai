import { Navbar } from "@/components/Navbar";
import { CheckoutButton } from "@/components/CheckoutButton";

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 pt-10 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Free Tier</h2>
          <p className="mt-3 text-slate-300">Validate startup concepts without upfront spend.</p>
          <p className="mt-6 text-4xl font-bold">$0</p>
          <ul className="mt-6 space-y-2 text-slate-300">
            <li>• 3 generations/day</li>
            <li>• Save and edit startup plans</li>
            <li>• Dashboard history</li>
          </ul>
        </div>
        <div className="rounded-xl border border-brand-500 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">Pro Tier</h2>
          <p className="mt-3 text-slate-300">Ship faster with unlimited generations and exports.</p>
          <p className="mt-6 text-4xl font-bold">$19/mo</p>
          <ul className="mt-6 space-y-2 text-slate-300">
            <li>• Unlimited generations</li>
            <li>• Export startup plans to PDF</li>
            <li>• Priority support ready architecture</li>
          </ul>
          <div className="mt-8">
            <CheckoutButton />
          </div>
        </div>
      </section>
    </main>
  );
}
