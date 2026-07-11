import Link from "next/link";

import { requireAuth, logoutUser } from "@/lib/auth";

const nav = [
  ["Dashboard", "/app"],
  ["Billing", "/app/billing"],
  ["Proposals", "/app/proposals"],
  ["New proposal", "/app/proposals/new"],
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return (
    <div className="grid min-h-screen bg-slate-50 text-slate-950 lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-slate-200 bg-white px-5 py-6">
        <Link href="/" className="block">
          <p className="text-lg font-bold tracking-tight">ProposalPilot</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Local SQLite workspace</p>
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold text-slate-400">{user.email}</p>
          <form action={logoutUser} className="mt-2">
            <button className="text-xs font-semibold text-slate-500 hover:text-slate-950">Log out</button>
          </form>
        </div>
      </aside>
      <section className="px-6 py-8 lg:px-10">{children}</section>
    </div>
  );
}
