# ProposalPilot — Real SaaS in Under 60 Minutes: Checkpoint Prompt Pack

> Use these prompts sequentially with a coding agent. Do **not** ask it to make a polished fake UI. Every checkpoint must contain real server-side behavior, a real local SQLite database, and tests.

## Truth contract

- `checkpoint-0-baseline` is a **true empty Next.js SSR scaffold**, not a fake SaaS UI.
- `checkpoint-1-ui-shell` is a **real server-rendered foundation**: SQLite schema, seed data, SSR app shell, DB reads. It may not yet have the full proposal journey.
- `checkpoint-2-working-saas-flow` is the **first genuinely working vertical slice**: server actions mutate SQLite-backed subscription/quota/proposal records, reload persists state, and E2E proves it.
- `main` is only attendee packaging/docs/CI after checkpoint 2 is verified. Do not describe it as more implemented than checkpoint 2.

## Demo timing map

| Time | What audience sees | Git checkpoint |
|---|---|---|
| Pre-session | SSR baseline already cloned and dependency install complete | `checkpoint-0-baseline` |
| 00:00–00:10 | Data model, SQLite repository, seeded account shown in code | branch from baseline |
| 00:10–00:25 | Real SSR dashboard reads account, subscription, proposal data from SQLite | `checkpoint-1-ui-shell` |
| 00:25–00:50 | Server actions: choose Pro, sandbox checkout, quota becomes 50/50, proposal generation/saving | in-progress branch |
| 00:50–00:58 | Status update + reload proof + E2E test | `checkpoint-2-working-saas-flow` |
| 00:58–01:00 | Commit/tag, show diff/checkpoints, run verification | checkpoint 2 |

## Shared engineering rules for every prompt

```text
- Use Next.js App Router + TypeScript + Tailwind.
- Use Node runtime only, never Edge runtime for database routes/pages.
- Use SQLite through Node's built-in `node:sqlite` API. The host has Node 24.13.0 and `node:sqlite` is available.
- Store the DB file at `data/proposalpilot.sqlite`; add it to `.gitignore`.
- Do not use browser localStorage/IndexedDB as product truth.
- Do not use a fake in-memory global state as product truth.
- Server Components must query the database for dashboard/list/detail reads.
- Writes must use Server Actions or route handlers and persist to SQLite.
- Keep deterministic proposal generation in `lib/proposal-generator.ts`; it is a real server-side provider boundary but does not call a paid provider.
- Treat sandbox checkout honestly: it creates a database-backed local subscription; it is not a payment provider.
- Keep UI functional and compact. Do not spend build time on landing-page glamour.
- Before commit: run `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run test:e2e`.
- If a requirement is unimplemented, say so in README. Never fabricate it.
```

---

# Prompt 0 — Create/normalize the true SSR baseline

> Use only if `checkpoint-0-baseline` does not already contain a clean SSR route skeleton. Do this before the live build, not on stage.

```text
You are preparing the `checkpoint-0-baseline` branch of ProposalPilot for a live webinar.

Goal: create a genuinely empty Next.js SSR baseline. It must not contain fake SaaS state, fake dashboard metrics, localStorage persistence, or a static page pretending to be a product.

Repository: current repo. Branch target: checkpoint-0-baseline.

Required routes:
- `/` public baseline page
- `/app` SSR workspace shell
- `/app/billing` SSR placeholder
- `/app/proposals` SSR placeholder
- `/app/proposals/new` SSR placeholder
- `/app/proposals/[id]` dynamic SSR placeholder

Required app shell:
- server-rendered layout under `src/app/app/layout.tsx`
- sidebar links: Dashboard, Billing, Proposals, New Proposal
- no client component unless absolutely required for a visual-only interaction

Required tests:
- Playwright proves `/`, `/app`, `/app/billing`, `/app/proposals`, `/app/proposals/new`, and `/app/proposals/demo-123` render expected server content.

README must clearly say:
- this is the true SSR starting checkpoint
- no DB/billing/proposal workflow exists at this point
- it is intentionally empty so the live build can demonstrate the real vertical slice

Commit exactly:
`chore: establish true SSR baseline`

Verification required before reporting:
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Report changed files, command outputs, and the commit SHA. Do not implement any fake SaaS behavior.
```

---

# Prompt 1 — Real SQLite foundation + SSR shell

> Run after checking out `checkpoint-0-baseline`. This is the first live build segment. Target 15–25 minutes.

```text
You are building checkpoint 1 for ProposalPilot from `checkpoint-0-baseline`.

Goal: create a real server-rendered SaaS foundation backed by local SQLite. This is NOT a fake dashboard: every displayed account/subscription/proposal value must be read from SQLite on the server.

Branch target: `checkpoint-1-ui-shell`.

Use Node built-in `node:sqlite` with a DB file at `data/proposalpilot.sqlite`.

Create these modules:
- `src/lib/db.ts` — open SQLite database, create schema idempotently, set Node runtime expectations.
- `src/lib/types.ts` — domain types.
- `src/lib/repositories.ts` — all DB reads/writes; pages must not embed raw SQL.
- `src/lib/seed.ts` — idempotent demo data seed.

Schema requirements:

```sql
users(
  id text primary key,
  name text not null,
  email text not null unique,
  created_at text not null
)

subscriptions(
  id text primary key,
  user_id text not null unique,
  plan text,
  status text not null,
  quota_total integer not null default 0,
  quota_used integer not null default 0,
  activated_at text,
  updated_at text not null
)

proposals(
  id text primary key,
  user_id text not null,
  client_name text not null,
  industry text not null,
  service text not null,
  problem text not null,
  outcome text not null,
  budget text not null,
  tone text not null,
  content text not null,
  status text not null,
  created_at text not null,
  updated_at text not null
)

usage_events(
  id text primary key,
  user_id text not null,
  proposal_id text,
  event_type text not null,
  units integer not null,
  created_at text not null
)
```

Seed one real local demo user:

```text
Alex Morgan / alex@proposalpilot.local
subscription: inactive, quota 0/0
```

Seed two historical proposal records with statuses `Sent` and `Accepted`. The UI must label these as `Sample records` while subscription remains inactive, so it does not lie about how they were created.

Implement server-rendered screens:

1. `/app`
   - query the user, subscription, and proposal summary through repository functions
   - render account/plan/quota values from DB
   - render count cards based on DB records
   - render a `Sample records` note only while subscription is inactive

2. `/app/proposals`
   - query and render proposal table from DB
   - show client, service, budget, status, updated time
   - link each row to `/app/proposals/[id]`

3. `/app/proposals/[id]`
   - server-query the record by ID
   - 404 through `notFound()` if no record
   - render actual stored fields/content/status

4. `/app/billing`
   - query real subscription state
   - render available plans, but do NOT implement checkout mutation yet
   - state clearly `Checkout action lands in checkpoint 2` only in developer-facing small text, not marketing copy

No localStorage. No client fake state. No landing-first design.

Tests:
- Add a Node test or Playwright setup helper that resets/seeds SQLite deterministically before each run.
- E2E proves DB-backed user/subscription values render on `/app`.
- E2E proves seeded proposal is listed and detail page reads it server-side.

README:
- add a checkpoint map explaining exactly what is real at checkpoint 1
- document database location and reset/seed command

Commit exactly:
`feat: add SQLite-backed SSR workspace foundation`

Before reporting, run all four verification commands and include results. Confirm page reload reads the same seeded DB records.
```

---

# Prompt 2 — Real server-side SaaS vertical slice

> Run after checking out `checkpoint-1-ui-shell`. This is the main live build. Target 25–35 minutes.

```text
You are building checkpoint 2 for ProposalPilot from `checkpoint-1-ui-shell`.

Goal: implement one real database-backed SaaS vertical slice. The app must mutate SQLite through server actions, reload from SQLite, and prove the exact business journey below.

Branch target: `checkpoint-2-working-saas-flow`.

Do not use localStorage, React-only fake state, or mocked UI values as the source of truth. All business state must come from SQLite.

## Business journey that must work

1. Open `/app/billing`.
2. Choose `Pro` plan.
3. Complete **Sandbox Checkout**.
4. Server action persists subscription:
   - `plan = Pro`
   - `status = active`
   - `quota_total = 50`
   - `quota_used = 0`
   - `activated_at = now`
5. Redirect/revalidate to `/app` and show real DB values `Pro active`, `50/50`.
6. Open `/app/proposals/new`.
7. Submit a proposal brief for Nusantara Coffee Roasters.
8. Server action checks active subscription and quota in one database transaction.
9. Server generates deterministic proposal content via `src/lib/proposal-generator.ts`.
10. Server inserts a `proposals` row, inserts a `usage_events` row, and increments `quota_used` atomically.
11. Redirect/revalidate to proposal detail/list and show `49/50` from DB.
12. Open proposal detail and change `Draft → Sent` with a Server Action.
13. Reload page and prove the `Sent` status and quota remain persisted.

## Required server actions

Create clear Server Actions, for example:

- `src/app/app/billing/actions.ts`
  - `activateSandboxSubscription(formData)`

- `src/app/app/proposals/new/actions.ts`
  - `createProposal(formData)`

- `src/app/app/proposals/[id]/actions.ts`
  - `updateProposalStatus(formData)`

Every action must:
- validate inputs server-side
- call a repository/service function, not inline SQL
- use `revalidatePath` and/or `redirect` appropriately
- return or render user-safe error text for invalid state

## Required service functions

Create `src/lib/proposal-service.ts` with functions such as:

```ts
activateSandboxSubscription(userId: string, plan: "Starter" | "Pro" | "Agency")
createProposalForUser(userId: string, input: ProposalInput)
updateProposalStatus(userId: string, proposalId: string, status: ProposalStatus)
```

`createProposalForUser` must use one SQLite transaction:

```text
read subscription
→ reject if inactive
→ reject if quota_used >= quota_total
→ generate content
→ insert proposal
→ increment quota_used
→ insert usage event
→ commit
```

It must rollback cleanly if any operation fails.

## Required screens

### `/app/billing`
- plan cards
- one real HTML form per plan with hidden `plan` field
- `Complete Sandbox Checkout` submit button
- selected/active subscription status read from DB
- honest copy: sandbox checkout writes a local development subscription; it is not a payment provider

### `/app/proposals/new`
- real `<form action={createProposal}>`
- fields: client name, industry, service, problem, outcome, budget, tone
- no disabled fake flow
- inactive subscription message from server state with link to billing
- active subscription shows remaining quota from DB

### `/app/proposals/[id]`
- DB-backed generated content
- DB-backed status
- form/action to transition status
- action buttons may include `Copy` and `Export PDF (next)` but do not lie that PDF export works if it does not

### `/app`
- account name, plan status, and quota read from DB
- proposal metrics read from DB
- recent proposal list read from DB

## Test requirements

Replace baseline-only E2E tests with real flow tests.

Happy path test must:

```text
reset SQLite database
visit /app/billing
choose Pro
complete sandbox checkout
assert Pro active and 50/50
visit /app/proposals/new
submit Nusantara Coffee brief
assert redirect/detail/list
assert generated content contains Executive Summary
assert quota becomes 49/50
assert row exists in proposals list as Draft
change status to Sent
reload page
assert status remains Sent and quota remains 49/50
```

Guardrail test must:

```text
reset SQLite database
visit /app/proposals/new
assert generation form is unavailable or server rejects it before active subscription
assert user-facing message points to billing
```

Add a deterministic reset/seed command such as:

```bash
npm run db:reset
```

Update package scripts accordingly.

## README truth update

Replace any claim that persistence is intentionally absent. State precisely:

Implemented:
- SQLite-backed local demo user, subscription, quota, proposals, and usage event records
- server-rendered reads
- Server Action writes
- sandbox checkout (local only)
- deterministic server-side proposal generator
- reload persistence on this host

Not implemented:
- real login/password/session security
- remote/shared production database
- payment provider or webhooks
- real external AI provider
- production authorization/rate limiting/auditing

## Commit and proof

Commit exactly:
`feat: add SQLite-backed proposal SaaS flow`

Before reporting:

```bash
npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

Then capture proof from the live URL or local production server of:
1. inactive billing state
2. Pro active, 50/50
3. generated saved proposal, 49/50
4. same proposal marked Sent after reload

Report database file path, relevant server action files, and exact limitations. Do not claim payment/auth/AI provider is real.
```

---

# Prompt 3 — Attendee packaging and checkpoint proof

> Run after checkpoint 2 is complete. Do this off-stage or in the final 2 minutes if only docs are needed.

```text
You are preparing ProposalPilot for webinar attendees after checkpoint 2 passed.

Goal: keep the checkpoint story truthful and easy to follow. Do not add fake feature work.

Branch target: `main`.

Tasks:
1. Update README checkpoint table:
   - checkpoint-0-baseline = true empty SSR baseline
   - checkpoint-1-ui-shell = SQLite-backed SSR reads and seeded records
   - checkpoint-2-working-saas-flow = real Server Action vertical slice with local SQLite persistence
   - main = docs, CI, prompt pack, presenter material links

2. Add `docs/checkpoint-map.md` with:
   - exact checkout commands for each branch
   - what the audience sees at each checkpoint
   - what is pre-baked versus built during the 60-minute session
   - honest constraints

3. Update `docs/demo-runbook.md` so it only says actions that really exist in checkpoint 2.

4. Add `docs/live-build-prompts.md` containing the exact Prompt 1 and Prompt 2 instructions used in the webinar.

5. Add screenshots/video proof paths and reset instructions:
   - `npm run db:reset`
   - checkout activation
   - proposal creation
   - status update

6. Keep CI running lint/build/E2E. Do not modify product behavior unless a test proves an actual mismatch.

Commit exactly:
`docs: package real SaaS checkpoint walkthrough`

Run all standard verification commands and report changed files, commit SHA, and what remains intentionally out of scope.
```

---

## Presenter wording: use this exactly

```text
Kita mulai dari SSR baseline yang kosong. Itu sudah disiapkan sebelum sesi supaya kita tidak membuang waktu di install dependency.

Yang kita build live bukan halaman cantik. Kita build vertical slice: SQLite data model, server-rendered workspace, sandbox subscription, quota transaction, proposal record, lalu status update yang tetap ada setelah reload.

Payment-nya sandbox dan generator-nya deterministic supaya demo stabil. Tapi subscription, quota, proposal, dan status benar-benar ditulis dan dibaca ulang dari SQLite lewat Server Actions.
```

## Presenter wording: do NOT say

```text
- "full production SaaS"
- "real payment"
- "real AI provider" when it is deterministic
- "database persistence belum ada" after checkpoint 2
- "AI bikin semuanya otomatis"
```
