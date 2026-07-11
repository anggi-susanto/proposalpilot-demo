import { notFound } from "next/navigation";

import { getDemoUser, getProposalForUser } from "@/lib/repositories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = getDemoUser();
  if (!user) throw new Error("Demo user is missing. Run npm run db:reset.");
  const proposal = getProposalForUser(user.id, id);
  if (!proposal) notFound();

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Proposal detail</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-bold tracking-tight">{proposal.clientName}</h1><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{proposal.status}</span></div>
      <p className="mt-3 text-slate-600">{proposal.service} · {proposal.budget}</p>
      <pre className="mt-7 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-800">{proposal.content}</pre>
    </main>
  );
}
