import Link from "next/link";

import { createProposal } from "./actions";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionForUser } from "@/lib/repositories";
import { formatQuota } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function NewProposalPage() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated.");
  const subscription = getSubscriptionForUser(user.id);
  if (!subscription) throw new Error("Subscription not found. Please register again.");
  const active = subscription.status === "active" && subscription.quotaUsed < subscription.quotaTotal;

  if (!active) {
    return (
      <main>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">New proposal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Activate a plan first</h1>
        <p className="mt-3 text-slate-600">Choose a plan and complete sandbox checkout before generating.</p>
        <Link className="mt-6 inline-block rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/app/billing">Go to billing</Link>
      </main>
    );
  }

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">New proposal</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Create a proposal</h1>
      <p className="mt-3 text-slate-600">{subscription.plan} active · {formatQuota(subscription)} proposals remaining.</p>
      <form action={createProposal} className="mt-7 grid max-w-3xl gap-4 rounded-xl border border-slate-200 bg-white p-6">
        <Field name="clientName" label="Client name" value="Nusantara Coffee Roasters" />
        <Field name="industry" label="Industry" value="Specialty coffee ecommerce" />
        <Field name="service" label="Service" value="Ecommerce conversion audit, landing page redesign, and retention email flow" multiline />
        <Field name="problem" label="Problem" value="Traffic is growing, but checkout conversion is low and repeat purchase is weak." multiline />
        <Field name="outcome" label="Outcome" value="Improve conversion rate and repeat purchases within 60 days without rebuilding the whole store." multiline />
        <Field name="budget" label="Budget" value="$3,000–$5,000" />
        <Field name="tone" label="Tone" value="Professional and confident" />
        <button className="mt-2 w-fit rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Generate and Save Proposal</button>
      </form>
    </main>
  );
}

function Field({ name, label, value, multiline = false }: { name: string; label: string; value: string; multiline?: boolean }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      {multiline ? <textarea name={name} defaultValue={value} required className="min-h-24 rounded-lg border border-slate-300 px-3 py-2" /> : <input name={name} defaultValue={value} required className="rounded-lg border border-slate-300 px-3 py-2" />}
    </label>
  );
}
