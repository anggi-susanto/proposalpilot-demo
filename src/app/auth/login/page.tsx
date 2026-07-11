import Link from "next/link";

import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <Link href="/" className="mb-8 block">
        <p className="text-lg font-bold tracking-tight text-slate-950">ProposalPilot</p>
      </Link>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">Log in</h1>
      <p className="mt-2 text-slate-600">Sign in to your ProposalPilot workspace.</p>

      <form action={loginUser} className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-6">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Email</span>
          <input name="email" type="email" required autoFocus className="rounded-lg border border-slate-300 px-3 py-2" placeholder="you@example.com" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Password</span>
          <input name="password" type="password" required className="rounded-lg border border-slate-300 px-3 py-2" placeholder="At least 6 characters" />
        </label>
        <button className="mt-2 w-full rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Log in</button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-slate-950 underline">Register</Link>
      </p>
    </main>
  );
}
