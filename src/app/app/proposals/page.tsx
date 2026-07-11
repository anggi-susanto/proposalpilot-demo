import Link from "next/link";

export default function ProposalsPage() {
  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Proposals</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Proposal records baseline</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Empty SSR proposal list route. Add database-backed proposal table, filters, statuses, and detail links here.
      </p>
      <Link className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white" href="/app/proposals/new">
        Create proposal
      </Link>
    </main>
  );
}
