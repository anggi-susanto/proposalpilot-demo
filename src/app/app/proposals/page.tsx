import Link from "next/link";

import { requireAuth } from "@/lib/auth";
import { listProposalsForUser } from "@/lib/repositories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const user = await requireAuth();
  const proposals = listProposalsForUser(user.id);

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Proposals</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Database-backed proposal records</h1>
      <p className="mt-3 max-w-2xl text-slate-600">These records are queried from SQLite in a Server Component.</p>
      <div className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {proposals.map((proposal) => (
          <Link key={proposal.id} href={`/app/proposals/${proposal.id}`} className="grid gap-2 border-b border-slate-100 p-5 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center hover:bg-slate-50">
            <div><h2 className="font-semibold">{proposal.clientName}</h2><p className="mt-1 text-sm text-slate-600">{proposal.service}</p><p className="mt-1 text-xs text-slate-400">{proposal.budget} · updated {proposal.updatedAt}</p></div>
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{proposal.status}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
