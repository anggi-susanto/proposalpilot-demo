import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        ProposalPilot baseline
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
        Blank SSR baseline for a real SaaS build.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        This project is intentionally reset to server-rendered empty routes. Build the real app flow here: auth, database, billing, quota ledger, proposal generation, and status workflow.
      </p>
      <div className="mt-8 flex gap-3">
        <Link className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white" href="/app">
          Open app shell
        </Link>
        <Link className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800" href="/app/proposals/new">
          New proposal route
        </Link>
      </div>
    </main>
  );
}
