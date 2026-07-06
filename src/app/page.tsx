"use client";

import { FormEvent, useMemo, useState } from "react";

type Plan = {
  name: "Starter" | "Pro" | "Agency";
  price: string;
  quota: number;
  tagline: string;
  featured?: boolean;
};

type ProposalStatus = "Draft" | "Sent" | "Accepted" | "Rejected";

type Proposal = {
  id: number;
  clientName: string;
  industry: string;
  service: string;
  problem: string;
  outcome: string;
  budget: string;
  tone: string;
  content: string;
  status: ProposalStatus;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$9/mo",
    quota: 10,
    tagline: "For solo freelancers validating demand.",
  },
  {
    name: "Pro",
    price: "$29/mo",
    quota: 50,
    tagline: "For operators sending proposals every week.",
    featured: true,
  },
  {
    name: "Agency",
    price: "$79/mo",
    quota: 200,
    tagline: "For future team workspaces and sales pods.",
  },
];

const initialForm = {
  clientName: "Nusantara Coffee Roasters",
  industry: "Specialty coffee ecommerce",
  service: "Ecommerce conversion audit, landing page redesign, and retention email flow",
  problem:
    "Traffic is growing, but checkout conversion is low and repeat purchase is weak.",
  outcome:
    "Improve conversion rate and repeat purchases within 60 days without rebuilding the whole store.",
  budget: "$3,000–$5,000",
  tone: "Professional and confident",
};

function generateProposalDraft(form: typeof initialForm, planName: string) {
  return `Executive Summary\n${form.clientName} is ready to convert more of its existing ${form.industry.toLowerCase()} traffic into paid and repeat customers. ProposalPilot recommends a focused ${form.service.toLowerCase()} engagement designed to produce visible improvements within 60 days.\n\nClient Problem Recap\n${form.problem}\n\nProposed Solution\nWe will run a conversion audit, identify the highest-friction buying moments, redesign the primary landing experience, and launch a retention email sequence that brings qualified customers back after their first visit or purchase.\n\nScope of Work\n1. Funnel and checkout friction audit\n2. Landing page messaging and layout redesign\n3. Offer and trust-signal refinement\n4. Retention email flow strategy and copy\n5. Launch checklist and post-launch measurement plan\n\nExpected Outcome\n${form.outcome}\n\nInvestment\nThe expected investment range is ${form.budget}. This keeps the engagement focused enough to ship quickly while still covering strategy, production, and QA.\n\nNext Steps\nIf the direction looks good, the next step is a 30-minute discovery call to confirm analytics access, success metrics, and the first landing page candidate.\n\nGenerated with ProposalPilot demo mode on the ${planName} plan.`;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 shadow-sm shadow-slate-200/60">
      {children}
    </span>
  );
}

export default function Home() {
  const [registered, setRegistered] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [generated, setGenerated] = useState("");
  const [error, setError] = useState("");

  const quotaTotal = selectedPlan?.quota ?? 0;
  const quotaRemaining = Math.max(quotaTotal - quotaUsed, 0);
  const canGenerate = registered && subscriptionActive && quotaRemaining > 0;

  const journey = useMemo(
    () => [
      { label: "Landing", done: true },
      { label: "Pricing", done: Boolean(selectedPlan) },
      { label: "Register", done: registered },
      { label: "Mock Checkout", done: subscriptionActive },
      { label: "Quota", done: subscriptionActive && quotaRemaining >= 0 },
      { label: "Generate", done: proposals.length > 0 },
      { label: "Status", done: proposals.some((proposal) => proposal.status !== "Draft") },
    ],
    [proposals, quotaRemaining, registered, selectedPlan, subscriptionActive],
  );

  function choosePlan(plan: Plan) {
    setSelectedPlan(plan);
    setError("");
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  }

  function activateSubscription() {
    if (!selectedPlan) {
      setError("Choose a plan before mock checkout.");
      return;
    }
    setRegistered(true);
    setSubscriptionActive(true);
    setQuotaUsed(0);
    setError("");
    document.getElementById("app")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!registered) {
      setError("Register/login first before generating a proposal.");
      return;
    }
    if (!subscriptionActive || !selectedPlan) {
      setError("Activate a mock subscription before using AI generation.");
      return;
    }
    if (quotaRemaining <= 0) {
      setError("Quota exhausted. Upgrade or wait for next month in the real product.");
      return;
    }

    const draft = generateProposalDraft(form, selectedPlan.name);
    const proposal: Proposal = {
      id: Date.now(),
      ...form,
      content: draft,
      status: "Draft",
    };

    setGenerated(draft);
    setProposals((current) => [proposal, ...current]);
    setQuotaUsed((used) => used + 1);
    setError("");
  }

  function updateStatus(id: number, status: ProposalStatus) {
    setProposals((current) =>
      current.map((proposal) =>
        proposal.id === id ? { ...proposal, status } : proposal,
      ),
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f1e8] text-slate-950">
      <section className="relative border-b border-slate-900/10 px-5 py-6 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f59e0b33,transparent_34%),radial-gradient(circle_at_80%_10%,#0f766e33,transparent_28%),linear-gradient(135deg,#fffaf0,transparent_45%)]" />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-amber-300 shadow-xl shadow-slate-900/20">
              PP
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">ProposalPilot</p>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                SaaS demo slice
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <a href="#pricing" className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white/70">
              Pricing
            </a>
            <a href="#app" className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-slate-900/20">
              Open Demo App
            </a>
          </div>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              <Badge>Prompt → Production</Badge>
              <Badge>Mock billing</Badge>
              <Badge>Quota proof</Badge>
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-7xl lg:text-8xl">
                Generate client proposals without turning every lead into homework.
              </h1>
              <p className="max-w-2xl text-xl leading-8 text-slate-650">
                A webinar-ready mini SaaS: landing, pricing, demo auth, mock checkout,
                subscription entitlement, monthly quota, AI proposal generation, save,
                and status tracking.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#pricing" className="rounded-full bg-teal-700 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-teal-900/25 hover:bg-teal-800">
                Choose Plan
              </a>
              <a href="#journey" className="rounded-full border border-slate-300 bg-white/75 px-7 py-4 text-center text-sm font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-white">
                See Journey
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-10 top-8 h-52 w-52 rounded-full bg-amber-300/40 blur-3xl" />
            <div className="relative rotate-1 rounded-[2rem] border border-slate-900/10 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/30">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-bold text-amber-200">Dashboard Preview</p>
                  <p className="text-xs text-slate-400">Pro plan · demo subscription</p>
                </div>
                <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-200">
                  Active
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs text-slate-400">Quota</p>
                  <p className="mt-2 text-3xl font-black">49/50</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="mt-2 text-3xl font-black">Draft</p>
                </div>
                <div className="rounded-3xl bg-amber-300 p-4 text-slate-950">
                  <p className="text-xs font-bold text-slate-700">AI draft</p>
                  <p className="mt-2 text-3xl font-black">Ready</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl bg-white p-5 text-slate-950">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                  Generated proposal
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight">
                  Nusantara Coffee conversion sprint
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Scope, investment, timeline, and next steps drafted from a short client brief.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-900/10 bg-white/70 p-5 shadow-xl shadow-slate-900/5">
          <div className="grid gap-3 md:grid-cols-7">
            {journey.map((step, index) => (
              <div key={step.label} className={`rounded-2xl border p-4 ${step.done ? "border-teal-200 bg-teal-50" : "border-slate-200 bg-white"}`}>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Step {index + 1}
                </p>
                <p className="mt-2 text-sm font-black text-slate-900">{step.label}</p>
                <p className={`mt-1 text-xs font-bold ${step.done ? "text-teal-700" : "text-slate-400"}`}>
                  {step.done ? "Verified" : "Pending"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="font-black uppercase tracking-[0.25em] text-teal-700">Pricing</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
              SaaS packaging before the first line of code gets fancy.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={`rounded-[2rem] border p-6 shadow-xl shadow-slate-900/5 ${plan.featured ? "border-slate-950 bg-slate-950 text-white" : "border-slate-900/10 bg-white/80"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black">{plan.name}</h3>
                    <p className={`mt-2 text-sm leading-6 ${plan.featured ? "text-slate-300" : "text-slate-600"}`}>{plan.tagline}</p>
                  </div>
                  {plan.featured && <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">Recommended</span>}
                </div>
                <p className="mt-8 text-5xl font-black tracking-[-0.05em]">{plan.price}</p>
                <p className={`mt-2 text-sm font-bold ${plan.featured ? "text-teal-200" : "text-teal-700"}`}>{plan.quota} AI proposals/month</p>
                <button onClick={() => choosePlan(plan)} className={`mt-8 w-full rounded-full px-5 py-4 text-sm font-black uppercase tracking-[0.18em] ${plan.featured ? "bg-amber-300 text-slate-950 hover:bg-amber-200" : "bg-slate-950 text-white hover:bg-slate-800"}`}>
                  Choose {plan.name}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="checkout" className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] bg-amber-300 p-8 text-slate-950 shadow-xl shadow-amber-900/10">
            <p className="text-sm font-black uppercase tracking-[0.24em]">Mock checkout</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.04em]">
              Safe webinar payment simulation.
            </h2>
            <p className="mt-4 leading-7">
              This intentionally avoids real recurring billing and webhooks. A successful mock checkout activates entitlement and quota for the demo user.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-900/10 bg-white p-8 shadow-xl shadow-slate-900/5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-400">Selected plan</p>
                <h3 className="mt-2 text-3xl font-black">{selectedPlan ? selectedPlan.name : "No plan selected"}</h3>
                <p className="mt-1 text-slate-600">{selectedPlan ? `${selectedPlan.price} · ${selectedPlan.quota} proposals/month` : "Choose a plan above first."}</p>
              </div>
              <button onClick={activateSubscription} className="rounded-full bg-teal-700 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white hover:bg-teal-800">
                Complete Mock Checkout
              </button>
            </div>
            {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
          </div>
        </div>
      </section>

      <section id="app" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-black uppercase tracking-[0.25em] text-teal-700">Demo app</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                Subscription, quota, AI generation, save, status.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">User</p>
                <p className="mt-2 font-black">{registered ? "Demo user" : "Guest"}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Subscription</p>
                <p className="mt-2 font-black">{subscriptionActive ? `${selectedPlan?.name} active` : "Inactive"}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-900/5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Quota</p>
                <p className="mt-2 font-black">{quotaRemaining}/{quotaTotal}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <form onSubmit={handleGenerate} className="rounded-[2rem] border border-slate-900/10 bg-white p-6 shadow-xl shadow-slate-900/5">
              <h3 className="text-2xl font-black">Create proposal</h3>
              <div className="mt-6 grid gap-4">
                {Object.entries(form).map(([key, value]) => (
                  <label key={key} className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    {key === "problem" || key === "outcome" || key === "service" ? (
                      <textarea value={value} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-600" />
                    ) : (
                      <input value={value} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-600" />
                    )}
                  </label>
                ))}
              </div>
              <button disabled={!canGenerate} className="mt-6 w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                Generate + Save Proposal
              </button>
              {!canGenerate && (
                <p className="mt-3 text-sm font-bold text-slate-500">
                  Demo guard: register/login, complete mock checkout, and keep quota available before generation.
                </p>
              )}
            </form>

            <div className="space-y-6">
              <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Latest AI output</p>
                    <h3 className="mt-2 text-2xl font-black">Generated draft</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                    Demo AI fallback ready
                  </span>
                </div>
                <pre className="mt-5 max-h-[440px] overflow-auto whitespace-pre-wrap rounded-3xl bg-white p-5 text-sm leading-6 text-slate-800">
                  {generated || "Generated proposal content will appear here after the SaaS journey is activated."}
                </pre>
              </div>

              <div className="rounded-[2rem] border border-slate-900/10 bg-white p-6 shadow-xl shadow-slate-900/5">
                <h3 className="text-2xl font-black">Saved proposals</h3>
                <div className="mt-5 space-y-3">
                  {proposals.length === 0 ? (
                    <p className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
                      No proposals yet. Generate one to prove persistence and quota decrement.
                    </p>
                  ) : (
                    proposals.map((proposal) => (
                      <article key={proposal.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h4 className="font-black">{proposal.clientName}</h4>
                            <p className="text-sm text-slate-600">{proposal.service}</p>
                          </div>
                          <select value={proposal.status} onChange={(event) => updateStatus(proposal.id, event.target.value as ProposalStatus)} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold">
                            <option>Draft</option>
                            <option>Sent</option>
                            <option>Accepted</option>
                            <option>Rejected</option>
                          </select>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
