import Link from "next/link";

import { getDashboardSummary, getDemoUser, getSubscriptionForUser, listProposalsForUser } from "@/lib/repositories";
import { formatQuota } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const user = getDemoUser();
  if (!user) throw new Error("Demo user is missing. Run npm run db:reset.");
  const subscription = getSubscriptionForUser(user.id);
  if (!subscription) throw new Error("Demo subscription is missing. Run npm run db:reset.");
  const summary = getDashboardSummary(user.id);
  const proposals = listProposalsForUser(user.id).slice(0, 5);

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Welcome back, {user.name}.</h1>
        <p className="mt-3 max-w-2xl text-slate-600">This checkpoint reads all workspace values from local SQLite on the server.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Plan" value={subscription.plan ?? "No active plan"} note={subscription.status} />
        <Metric label="Quota" value={formatQuota(subscription)} note="remaining / total" />
        <Metric label="Sent" value={String(summary.sentProposals)} note="proposal records" />
        <Metric label="Accepted" value={String(summary.acceptedProposals)} note="proposal records" />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-500">Recent proposals</p>
            <h2 className="mt-1 text-xl font-bold">{summary.totalProposals} sample records loaded from SQLite</h2>
          </div>
          <Link className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/app/proposals">Open proposals</Link>
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {proposals.map((proposal) => (
            <Link key={proposal.id} href={`/app/proposals/${proposal.id}`} className="flex items-center justify-between gap-4 py-4 hover:bg-slate-50">
              <div><p className="font-semibold">{proposal.clientName}</p><p className="text-sm text-slate-500">{proposal.service}</p></div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{proposal.status}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-1 text-sm text-slate-500">{note}</p></div>;
}
