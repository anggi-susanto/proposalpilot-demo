import { activateSubscription } from "./actions";
import { getCurrentUser } from "@/lib/auth";
import { getSubscriptionForUser } from "@/lib/repositories";
import { formatQuota, plans } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated.");
  const subscription = getSubscriptionForUser(user.id);
  if (!subscription) throw new Error("Subscription not found. Please register again.");

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Billing</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Sandbox subscription</h1>
      <p className="mt-3 text-slate-600">Current database state: {subscription.plan ?? "no plan"} · {subscription.status} · {formatQuota(subscription)} quota.</p>
      <p className="mt-2 text-sm text-slate-500">Sandbox checkout writes a local development subscription. No payment provider is contacted.</p>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className={`rounded-xl border p-5 ${subscription.plan === plan.name && subscription.status === "active" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white"}`}>
            <h2 className="text-xl font-bold">{plan.name}</h2><p className="mt-2 text-2xl font-bold">{plan.price}</p><p className="mt-1 text-sm text-slate-600">{plan.quota} proposals/month</p>
            <form action={activateSubscription} className="mt-5"><input type="hidden" name="plan" value={plan.name} /><button className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Complete Sandbox Checkout</button></form>
          </article>
        ))}
      </div>
    </main>
  );
}
