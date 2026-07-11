import { notFound } from "next/navigation";

import { changeProposalStatus } from "./actions";
import { getCurrentUser } from "@/lib/auth";
import { getProposalForUser } from "@/lib/repositories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;
  const proposal = getProposalForUser(user.id, id);
  if (!proposal) notFound();

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Proposal detail</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{proposal.clientName}</h1>
        <form action={changeProposalStatus} className="flex items-center gap-2">
          <input type="hidden" name="proposalId" value={proposal.id} />
          <select name="status" defaultValue={proposal.status} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option>Draft</option><option>Sent</option><option>Accepted</option><option>Rejected</option>
          </select>
          <button className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white">Update status</button>
        </form>
      </div>
      <p className="mt-3 text-slate-600">{proposal.service} · {proposal.budget}</p>
      <pre className="mt-7 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-800">{proposal.content}</pre>
    </main>
  );
}
