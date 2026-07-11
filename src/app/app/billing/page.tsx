import { getDemoUser, getSubscriptionForUser } from "@/lib/repositories";
import { formatQuota, plans } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function BillingPage() {
  const user = getDemoUser();
  if (!user) throw new Error("Demo user is missing. Run npm run db:reset.");
  const subscription = getSubscriptionForUser(user.id);
  if (!subscription) throw new Error("Demo subscription is missing. Run npm run db:reset.");

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Billing</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Plan foundation</h1>
      <p className="mt-3 text-slate-600">Current database state: {subscription.status} · {formatQuota(subscription)} quota.</p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => <article key={plan.name} className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">{plan.name}</h2><p className="mt-2 text-2xl font-bold">{plan.price}</p><p className="mt-1 text-sm text-slate-600">{plan.quota} proposals/month</p></article>)}
      </div>
      <p className="mt-6 text-sm text-slate-500">Sandbox activation is intentionally added in checkpoint 2.</p>
    </main>
  );
}
