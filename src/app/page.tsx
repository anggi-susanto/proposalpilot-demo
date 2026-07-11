import Link from "next/link";

const plans = [
  { name: "Starter", price: "$9", quota: "10 proposals / month", note: "For solo consultants validating a repeatable offer." },
  { name: "Pro", price: "$29", quota: "50 proposals / month", note: "For client-facing operators who send proposals every week.", featured: true },
  { name: "Agency", price: "$79", quota: "200 proposals / month", note: "For teams with a repeatable sales and delivery motion." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfaf7] text-[#17213c]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#17213c] text-sm text-white">PP</span>
          <span>ProposalPilot</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-medium text-[#596176] md:flex">
          <a href="#workflow">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#proof">What is real</a>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/auth/login" className="hidden px-3 py-2 text-[#46516b] sm:block">Log in</Link>
          <Link href="/auth/register" className="rounded-xl bg-[#17213c] px-4 py-2.5 text-white shadow-[0_8px_22px_rgba(23,33,60,.18)] transition hover:-translate-y-0.5 hover:bg-[#26355e]">Start free</Link>
        </div>
      </nav>

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-10 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-[#ff7858]/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-14 h-80 w-80 rounded-full bg-[#5a8dee]/15 blur-3xl" />
        <div className="relative grid items-center gap-14 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#f1c4b7] bg-[#fff4f0] px-3 py-1.5 text-xs font-bold tracking-[.12em] text-[#b84630]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e85d43]" />
              PROPOSAL WORKFLOW FOR SERVICE TEAMS
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[.98] tracking-[-.055em] text-[#17213c] sm:text-6xl lg:text-7xl">
              Turn a client brief into a proposal your team can actually ship.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5b6476]">
              ProposalPilot gives freelancers and agencies one focused workflow: sign in, activate a plan, create a structured draft, and track every proposal from Draft to Sent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/register" className="rounded-xl bg-[#e85d43] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(232,93,67,.25)] transition hover:-translate-y-0.5 hover:bg-[#d54d34]">Create your workspace</Link>
              <a href="#proof" className="rounded-xl border border-[#d9dce4] bg-white px-5 py-3.5 text-sm font-bold text-[#263454] transition hover:border-[#aab2c4]">See the product proof</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#667085]">
              <span className="flex items-center gap-2"><Check /> Register + login</span>
              <span className="flex items-center gap-2"><Check /> Proposal quota</span>
              <span className="flex items-center gap-2"><Check /> Saved lifecycle</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl rounded-[28px] border border-[#d9deea] bg-white p-3 shadow-[0_32px_70px_rgba(31,46,83,.18)]">
            <div className="overflow-hidden rounded-[20px] bg-[#17213c] p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ff7558]" /><span className="text-sm font-bold">ProposalPilot</span></div>
                <span className="rounded-full bg-[#30436f] px-2.5 py-1 text-[10px] font-bold tracking-wider">PRO ACTIVE</span>
              </div>
              <div className="mt-5 grid grid-cols-[1.25fr_.75fr] gap-3">
                <div className="rounded-2xl bg-white p-4 text-[#17213c]">
                  <p className="text-[10px] font-bold tracking-[.14em] text-[#8a93a5]">NEW PROPOSAL</p>
                  <h2 className="mt-2 text-lg font-black">Nusantara Coffee Roasters</h2>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full rounded bg-[#e9edf4]" /><div className="h-2 w-5/6 rounded bg-[#e9edf4]" /><div className="h-2 w-2/3 rounded bg-[#e9edf4]" />
                  </div>
                  <div className="mt-5 flex items-center justify-between"><span className="rounded-full bg-[#fff0ec] px-2.5 py-1 text-[10px] font-bold text-[#c34d37]">DRAFT</span><span className="text-xs font-bold text-[#52607a]">Open proposal →</span></div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-[#30436f] p-4"><p className="text-[10px] font-bold tracking-[.12em] text-[#bdc9e8]">QUOTA</p><p className="mt-2 text-3xl font-black">49<span className="text-base text-[#bdc9e8]">/50</span></p><p className="mt-1 text-[10px] text-[#bdc9e8]">remaining this month</p></div>
                  <div className="rounded-2xl border border-white/10 p-4"><p className="text-[10px] font-bold tracking-[.12em] text-[#bdc9e8]">STATUS</p><p className="mt-2 text-sm font-bold">Sent</p><p className="mt-1 text-[10px] text-[#bdc9e8]">saved after reload</p></div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#24345a] px-3 py-2.5 text-xs text-[#cdd6ea]"><span className="h-2 w-2 rounded-full bg-[#49d6a3]" /> Session active · Proposal record saved · Usage event recorded</div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="border-y border-[#e7e3dd] bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[.7fr_1.3fr] lg:px-10">
          <div><p className="text-xs font-bold tracking-[.15em] text-[#b84630]">BUILT FOR A REAL PRODUCT JOURNEY</p><h2 className="mt-3 text-3xl font-black tracking-[-.04em]">Not a dashboard mockup.</h2></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Proof title="Authenticated" text="Register, login, signed session cookie, and protected workspace routes." />
            <Proof title="Persisted" text="User, subscription, quota, proposal, usage event, and lifecycle records live in SQLite." />
            <Proof title="Verifiable" text="A real journey is covered by E2E: signup to checkout, proposal, status, and return login." />
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-2xl"><p className="text-xs font-bold tracking-[.15em] text-[#b84630]">ONE FOCUSED SALES WORKFLOW</p><h2 className="mt-3 text-4xl font-black tracking-[-.045em]">From a messy brief to a trackable next step.</h2></div>
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <Step number="01" title="Create workspace" text="Register your account and enter a protected proposal workspace." />
          <Step number="02" title="Activate a plan" text="Choose Starter, Pro, or Agency with a transparent sandbox activation." />
          <Step number="03" title="Generate & save" text="Turn a brief into a structured proposal and record its usage." />
          <Step number="04" title="Move it forward" text="Track Draft, Sent, Accepted, or Rejected without losing context." />
        </div>
      </section>

      <section id="pricing" className="bg-[#17213c] px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-xs font-bold tracking-[.15em] text-[#ff9b85]">SIMPLE, USAGE-BASED PRICING</p><h2 className="mt-3 text-4xl font-black tracking-[-.045em]">A plan should make the value obvious.</h2><p className="mt-4 text-[#c3cce0]">Start with the volume you need. Upgrade when proposal work becomes a reliable sales habit.</p></div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">{plans.map((plan) => <article key={plan.name} className={`rounded-3xl p-6 ${plan.featured ? "bg-[#fff8f4] text-[#17213c] shadow-[0_24px_60px_rgba(0,0,0,.25)]" : "border border-white/15 bg-white/[.06]"}`}><div className="flex items-center justify-between"><h3 className="text-xl font-black">{plan.name}</h3>{plan.featured && <span className="rounded-full bg-[#ffe1d8] px-2.5 py-1 text-[10px] font-black tracking-wider text-[#b84630]">MOST PRACTICAL</span>}</div><p className="mt-6 text-5xl font-black">{plan.price}<span className={`text-sm font-medium ${plan.featured ? "text-[#667085]" : "text-[#c3cce0]"}`}> / month</span></p><p className={`mt-3 font-bold ${plan.featured ? "text-[#b84630]" : "text-[#ffb09f]"}`}>{plan.quota}</p><p className={`mt-5 min-h-12 text-sm leading-6 ${plan.featured ? "text-[#5b6476]" : "text-[#c3cce0]"}`}>{plan.note}</p><Link href="/auth/register" className={`mt-7 block rounded-xl px-4 py-3 text-center text-sm font-bold ${plan.featured ? "bg-[#e85d43] text-white" : "bg-white text-[#17213c]"}`}>Choose {plan.name}</Link></article>)}</div>
          <p className="mt-7 text-xs text-[#9eabc6]">Current product uses sandbox plan activation. Payment processing and webhooks are explicit production-hardening work.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="rounded-[30px] border border-[#e5ddd5] bg-[#fff4ef] p-8 lg:flex lg:items-end lg:justify-between lg:p-12"><div className="max-w-2xl"><p className="text-xs font-bold tracking-[.15em] text-[#b84630]">YOUR NEXT CLIENT PROPOSAL</p><h2 className="mt-3 text-4xl font-black tracking-[-.045em]">Stop rebuilding the same sales document from zero.</h2><p className="mt-4 text-[#5b6476]">Create an account, pick a plan, and run your first proposal through one accountable workflow.</p></div><Link href="/auth/register" className="mt-7 inline-block rounded-xl bg-[#17213c] px-5 py-3.5 text-sm font-bold text-white lg:mt-0">Start your workspace</Link></div></section>

      <footer className="border-t border-[#e7e3dd] px-6 py-8 text-sm text-[#677085] lg:px-10"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3"><span>© 2026 ProposalPilot</span><span>Proposal workflow, not proposal chaos.</span></div></footer>
    </main>
  );
}

function Check() { return <span className="grid h-4 w-4 place-items-center rounded-full bg-[#daf5eb] text-[10px] font-black text-[#188563]">✓</span>; }
function Proof({ title, text }: { title: string; text: string }) { return <article className="border-l-2 border-[#e85d43] pl-4"><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-[#667085]">{text}</p></article>; }
function Step({ number, title, text }: { number: string; title: string; text: string }) { return <article className="rounded-2xl border border-[#e1e4ea] bg-white p-6 shadow-[0_8px_22px_rgba(23,33,60,.05)]"><span className="text-sm font-black text-[#e85d43]">{number}</span><h3 className="mt-8 text-xl font-black tracking-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-[#667085]">{text}</p></article>; }
