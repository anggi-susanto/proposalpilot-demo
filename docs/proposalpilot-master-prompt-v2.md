# Master Prompt V2 — ProposalPilot SaaS Build With Ideation, Task Tracker, Parallel Waves, and Live Proof

> Paste this entire prompt into one coding agent. The agent must follow the phases in order, maintain a visible task tracker, run verification gates, and stop if proof is missing.

```text
You are the lead product engineer for a live build of ProposalPilot, a real local SQLite-backed SaaS vertical slice.

Your job is not to make a fake SaaS UI. Your job is to turn an idea into a working, testable, auditable product slice with real server-side state, checkpoints, tests, and live proof.

Product: ProposalPilot
Audience: freelancers, agencies, and consultants
Core promise: turn a short client brief into a structured proposal, track quota, and persist proposal status.

Primary user journey:

Demo user
→ choose plan
→ sandbox checkout
→ subscription active
→ proposal quota available
→ submit client brief
→ server generates deterministic proposal
→ proposal is saved
→ quota is decremented
→ proposal status changes Draft → Sent
→ refresh/restart proves data persists

At the end, it is valid to claim:

- A real local SQLite-backed SaaS vertical slice was built.
- Server Components read account, subscription, quota, proposal, and usage data from SQLite.
- Server Actions persist sandbox subscription activation, proposal creation, quota usage, and proposal status changes.
- Proposal creation uses one atomic SQLite transaction.
- Data persists after reload and local server restart as long as the SQLite file remains.
- Checkout is sandbox/local only.
- Proposal generation is deterministic/server-side only.

It is NOT valid to claim:

- production-ready SaaS
- real payment processing
- payment webhooks
- real auth/session security
- external AI generation
- remote/shared production database
- multi-tenant production authorization

# Required Stack

- Existing GitHub repository with dependencies already prepared
- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components
- Server Actions
- Node runtime only for DB-backed pages/actions; do not use Edge runtime
- Node 24 built-in SQLite through node:sqlite
- Playwright E2E

Database path:

data/proposalpilot.sqlite

Add this database file to .gitignore.

# Absolute Anti-Fake Rules

1. Do not use localStorage, IndexedDB, in-memory globals, or React useState as the business source of truth.
2. Do not display hardcoded dashboard metrics if SQLite owns the data.
3. Do not add a giant marketing landing page as the first application screen.
4. Do not claim a button works unless it is wired to a Server Action or real route.
5. Do not call a checkpoint complete without test output and browser/live proof.
6. Do not skip the ideation and task planning phase.
7. Do not continue to the next phase if the current gate fails.
8. Do not silently replace a DB-backed implementation with a client-only mock.

# Required Branch Story

Use this branch/checkpoint story unless the repository already has a different agreed convention:

main
checkpoint-0-baseline
checkpoint-1-wave-1-foundation
checkpoint-2-wave-2-saas-flow

Checkpoint meanings:

- checkpoint-0-baseline: baseline from GitHub repo, dependencies ready, no fake SaaS behavior added.
- checkpoint-1-wave-1-foundation: SQLite schema, seed, repositories, SSR reads, workspace UI shell, first proof set.
- checkpoint-2-wave-2-saas-flow: Server Actions, sandbox checkout, atomic proposal transaction, status persistence, final proof set.
- main: final packaging, docs, proof index, runbook.

Never overwrite a verified checkpoint with later work. Commit in sequence.

-------------------------------------------------------------------------------
PHASE 1 — Ideation and Implementation Plan
-------------------------------------------------------------------------------

Goal:
Turn the ProposalPilot idea into a precise implementation plan that can be built in two parallelizable waves.

Do first:

1. Inspect the repo without editing code.
2. Confirm current branch, remote, dependencies, scripts, app structure, tests, Node version, and node:sqlite availability.
3. Read the existing README, package.json, Next config, app layout, global CSS, and tests.

Run:

pwd

Create or update:

docs/live-build-plan.md

docs/live-build-plan.md must contain:

1. Product problem
2. Target user
3. One end-to-end user journey
4. Route map
5. Data ownership model
6. Server Action boundaries
7. Two-wave build plan
8. Checkpoint map
9. 60-minute live demo timing map
10. Out-of-scope list
11. Verification strategy

docs/acceptance-criteria.md must define these proof states:

AC-01: /app server-renders demo account from SQLite.
AC-02: /app/billing displays plans from server-owned config.
AC-03: selecting Pro + sandbox checkout writes active Pro subscription to SQLite.
AC-04: after checkout, reload shows Pro active and quota 50/50.
AC-05: proposal creation form is server-action backed and rejects inactive subscriptions.
AC-06: creating a proposal inserts proposal row and usage event in one DB transaction.
AC-07: successful proposal creation changes quota 50/50 to 49/50 after reload.
AC-08: proposal detail reads stored generated content from SQLite.
AC-09: Draft → Sent status update is a Server Action and remains Sent after reload.
AC-10: Playwright verifies the happy path and inactive-subscription guardrail.

docs/data-model.md must define:

- users
- subscriptions
- proposals
- usage_events

For every table, document fields, ownership, why it exists, and which UI screens read/write it.

docs/architecture-notes.md must document:

- why SQLite is the source of truth
- why generator is deterministic
- why checkout is sandbox-only
- why Server Actions are used
- where transaction boundaries live
- limitations before production

Gate 1 — Ideation Proof:

Return a compact report:

| Check | Result |
|---|---|
| Repo path | |
| Remote | |
| Current branch | |
| Dirty files before work | |
| Node/SQLite availability | |
| Existing app structure | |
| Plan files created | |
| Acceptance criteria testability | |

Then commit planning only:

git add docs
git commit -m "docs: plan ProposalPilot SaaS live build"

Report the commit SHA and one-paragraph implementation plan. Stop if planning is incomplete.

-------------------------------------------------------------------------------
PHASE 2 — Task Breakdown, Task Tracker, and Parallel Waves
-------------------------------------------------------------------------------

Goal:
Create an executable task system before coding, including wave boundaries and proof requirements.

Create:

docs/task-breakdown.md

docs/task-breakdown.md must include tasks grouped by these areas:

- Repo baseline and checkpoint hygiene
- Routes and layouts
- SQLite schema and seed
- Repository layer
- Dashboard SSR reads
- Billing SSR reads
- Proposal list/detail SSR reads
- Sandbox subscription Server Action
- Proposal generation service
- Atomic proposal creation transaction
- Status transition Server Action
- Playwright tests
- Live proof assets
- Final docs and packaging

docs/task-tracker.md must be a table with:

| ID | Task | Wave | Owner lane | Dependencies | Acceptance criteria | Status | Proof |

Use statuses exactly:

- pending
- in_progress
- blocked
- verified

docs/parallel-waves.md must define:

Wave 0 — Baseline:
- pull/checkout repo baseline
- verify dependencies
- ensure route scaffold is honest and SSR
- baseline Playwright smoke tests

Wave 1 — Foundation, can be split into lanes:
- Lane A: SQLite schema, seed, reset script, repository layer
- Lane B: SSR workspace UI, dashboard, billing read state, proposal list/detail reads
- Lane C: Playwright coverage for SSR data and baseline routes

Wave 2 — SaaS Flow, can be split into lanes:
- Lane A: Server Actions for sandbox checkout and status transition
- Lane B: deterministic generator and atomic proposal creation service
- Lane C: E2E happy path, guardrail tests, production-mode live proof

Parallelism rule:

- Work can be planned in parallel lanes, but integration must happen through explicit file ownership.
- Do not let two lanes edit the same file at the same time without reconciliation.
- Every wave ends with lint, typecheck, build, E2E, browser proof, and commit.

Gate 2 — Task System Proof:

Return:

- task counts by wave
- dependency risks
- files likely touched per wave
- exact proof required for each wave

Commit:

git add docs/task-breakdown.md docs/task-tracker.md docs/parallel-waves.md
git commit -m "docs: define ProposalPilot task tracker and waves"

Stop if the tracker does not make dependencies clear.

-------------------------------------------------------------------------------
PHASE 3 — Take Baseline From GitHub Repo With Prepared Dependencies
-------------------------------------------------------------------------------

Goal:
Start from the prepared GitHub repo baseline, not from a blank generated project.

Do:

1. Ensure the repo has a remote.
2. Fetch current remote state.
3. Check out or create checkpoint-0-baseline from the intended baseline branch.
4. Install dependencies only if needed.
5. Verify existing scripts.
6. Create an honest baseline route scaffold if it does not already exist.

Required route structure:

src/app/page.tsx
src/app/layout.tsx
src/app/app/layout.tsx
src/app/app/page.tsx
src/app/app/billing/page.tsx
src/app/app/proposals/page.tsx
src/app/app/proposals/new/page.tsx
src/app/app/proposals/[id]/page.tsx

Baseline requirements:

- / is a minimal public entry page.
- /app is a server-rendered workspace shell.
- /app/billing, /app/proposals, /app/proposals/new, and /app/proposals/[id] are honest server-rendered placeholders.
- App shell has navigation: Dashboard, Billing, Proposals, New Proposal.
- No database behavior yet.
- No fake metrics, fake checkout, fake quota, fake proposal generator, or fake saved proposal state.
- Dynamic proposal detail route renders server-side using params and shows the ID.

Baseline Playwright tests must prove:

- / renders
- /app renders workspace shell
- /app/billing renders
- /app/proposals renders
- /app/proposals/new renders
- /app/proposals/demo-123 renders server-side

Verify baseline:

npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e

Expected build output must include dynamic route /app/proposals/[id].

Commit baseline:

git add src tests package.json package-lock.json .gitignore README.md docs
git commit -m "chore: verify ProposalPilot baseline from prepared repo"
git push -u origin checkpoint-0-baseline

Gate 3 — Baseline Proof:

Report:

- baseline commit SHA
- remote branch
- build route table
- test output summary
- screenshots or proof paths for / and /app
- explicit statement: No SaaS behavior is implemented yet.

Stop if baseline proof fails.

-------------------------------------------------------------------------------
PHASE 4 — Parallel Wave 1 Complete: SQLite Foundation, SSR Reads, Tests, Live Proof
-------------------------------------------------------------------------------

Goal:
Complete the first implementation wave: real SQLite data, server-side reads, and DB-backed UI. No mutation flow yet.

Branch:

git switch -c checkpoint-1-wave-1-foundation checkpoint-0-baseline

Wave 1 file ownership:

- Lane A owns: src/lib/db.ts, src/lib/types.ts, src/lib/repositories.ts, src/lib/seed.ts, scripts/reset-db.mjs
- Lane B owns: app routes, layouts, CSS, server-rendered UI components
- Lane C owns: Playwright tests and proof notes

Create modules:

src/lib/types.ts
src/lib/db.ts
src/lib/repositories.ts
src/lib/seed.ts
scripts/reset-db.mjs

SQLite schema:

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

Seed requirements:

- Alex Morgan
- alex@proposalpilot.local
- inactive subscription
- quota_total=0
- quota_used=0
- sample proposal: Urban Plant Studio — Sent
- sample proposal: Apex Legal Advisory — Accepted
- UI must label seeded proposal rows as sample records while the account is inactive.

Repository functions required:

- getDemoUser()
- getSubscriptionForUser(userId)
- listProposalsForUser(userId)
- getProposalForUser(userId, proposalId)
- getDashboardSummary(userId)

SSR page requirements:

/app:
- Server Component reads demo user, subscription, quota, counts, recent proposals, and status counts from SQLite.
- No hardcoded product metrics.

/app/billing:
- Server Component shows Starter, Pro, Agency plan options from server config.
- Shows current subscription state from SQLite.
- Shows an honest note that sandbox activation arrives in Wave 2.

/app/proposals:
- Server Component renders DB-backed proposal table.
- Each row links to detail.

/app/proposals/[id]:
- Server Component reads the proposal from SQLite.
- Uses notFound() if absent.
- Renders stored content and status.

/app/proposals/new:
- Server Component reads subscription state.
- If inactive, shows a server-rendered guardrail and link to billing.
- Does not create proposals yet.

Add package script:

"db:reset": "node scripts/reset-db.mjs"

Wave 1 tests must prove:

- db reset seeds Alex Morgan
- /app shows Alex Morgan and inactive 0/0 state from DB
- /app/proposals shows Urban Plant Studio
- /app/proposals/[seeded-id] renders stored proposal content
- /app/proposals/new blocks creation while inactive
- reload keeps seeded DB data

Verify Wave 1:

npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e

Live proof:

Run the app and capture proof paths or screenshots for:

- DB-backed dashboard
- DB-backed proposal list
- DB-backed proposal detail
- inactive new proposal guardrail

Commit Wave 1:

git add src scripts tests package.json package-lock.json .gitignore README.md docs proof
git commit -m "feat: add SQLite-backed ProposalPilot foundation"
git push -u origin checkpoint-1-wave-1-foundation

Gate 4 — Wave 1 Proof:

Return a table:

| Claim | Code evidence | Browser proof | Test proof |
|---|---|---|---|
| SQLite schema and seed exist | | | |
| dashboard reads DB | | | |
| proposal list reads DB | | | |
| proposal detail reads DB | | | |
| inactive guardrail is server-rendered | | | |

If any cell is missing, mark it unchecked and do not continue.

-------------------------------------------------------------------------------
PHASE 5 — Parallel Wave 2 Complete: SaaS Mutations, Tests, and Live Proof
-------------------------------------------------------------------------------

Goal:
Complete the second implementation wave: real Server Actions, sandbox checkout, atomic proposal creation, quota usage, status persistence, and production-mode proof.

Branch:

git switch -c checkpoint-2-wave-2-saas-flow checkpoint-1-wave-1-foundation

Wave 2 file ownership:

- Lane A owns: billing action, status action, mutation repository functions
- Lane B owns: proposal generator, proposal service, transaction logic, proposal creation page
- Lane C owns: Playwright happy path, guardrail tests, live proof capture, README proof notes

Create modules:

src/lib/proposal-generator.ts
src/lib/proposal-service.ts
src/app/app/billing/actions.ts
src/app/app/proposals/new/actions.ts
src/app/app/proposals/[id]/actions.ts

Deterministic generator:

generateProposal(input) must return stored proposal content with these sections:

- Executive Summary
- Client Problem Recap
- Proposed Solution
- Scope of Work
- Expected Outcome
- Investment
- Timeline
- Next Steps

It must not call external APIs.

Sandbox checkout:

/app/billing must show Starter, Pro, and Agency plan cards.

Each plan selection must submit a real form to a Server Action that:

- validates the selected plan
- writes subscription to SQLite
- sets status=active
- sets quota_used=0
- sets activated_at=now
- sets quota_total by plan:
  - Starter: 10
  - Pro: 50
  - Agency: 200
- calls revalidatePath
- redirects after success

User-facing copy must include:

Sandbox checkout writes a local development subscription.
No payment provider is contacted.

Proposal creation:

/app/proposals/new must:

- read subscription server-side
- reject inactive subscription before showing the form
- render a real form action={createProposal} when active
- collect client name, industry, service, problem, outcome, budget, and tone

createProposalForUser(userId, input) must use one SQLite transaction:

1. Read subscription
2. Reject if inactive
3. Reject if quota_used >= quota_total
4. Generate deterministic proposal text
5. Insert proposal row as Draft
6. Increment quota_used exactly once
7. Insert usage_events row with event_type=proposal_generated and units=1
8. Commit

On failure, rollback. Never create a proposal without usage event/quota update, and never decrement quota without proposal insert.

Status transition:

/app/proposals/[id] must:

- render stored content/status from SQLite
- provide a form backed by Server Action
- allow Draft, Sent, Accepted, Rejected
- validate ownership and allowed status value
- persist updated_at
- revalidate after update

Wave 2 E2E happy path:

1. Reset DB.
2. Visit /app/billing.
3. Select Pro and submit sandbox checkout.
4. Assert Pro active and 50/50 after reload.
5. Visit /app/proposals/new.
6. Submit Nusantara Coffee proposal form.
7. Assert generated content includes Executive Summary.
8. Assert proposal list/detail contains Nusantara Coffee as Draft.
9. Assert dashboard quota is 49/50.
10. Change status to Sent.
11. Reload page.
12. Assert Sent and 49/50 remain.

Wave 2 guardrail test:

1. Reset DB.
2. Visit /app/proposals/new.
3. Assert form cannot create proposal while inactive.
4. Assert message links to billing.
5. Confirm quota remains 0/0 and no new proposal was inserted.

Verify Wave 2:

npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e

Production-mode live proof:

npm run build
npm run start -- --hostname 0.0.0.0 --port 3047

Use the running URL to prove:

inactive state
→ Pro activation 50/50
→ create Nusantara Coffee proposal
→ quota becomes 49/50
→ detail shows generated content
→ status changes Draft to Sent
→ reload still shows Sent and 49/50

Commit Wave 2:

git add src scripts tests package.json package-lock.json README.md docs proof
git commit -m "feat: add ProposalPilot SaaS mutation flow"
git push -u origin checkpoint-2-wave-2-saas-flow

Gate 5 — Wave 2 Proof:

Return a strict table:

| Claim | Code evidence | Browser proof | Test proof |
|---|---|---|---|
| sandbox subscription persisted | | | |
| Pro quota shows 50/50 after checkout | | | |
| proposal saved to SQLite | | | |
| usage event created in same transaction | | | |
| quota changes to 49/50 after create | | | |
| generated content is stored and rendered | | | |
| Draft → Sent persists after reload | | | |
| inactive subscription cannot create proposal | | | |

If any cell lacks proof, label it unchecked or blocked. Do not call Wave 2 complete.

-------------------------------------------------------------------------------
PHASE 6 — Final Packaging
-------------------------------------------------------------------------------

Goal:
Package verified work for attendees. Do not add product features in this phase.

Merge/package:

git switch main

If fast-forward is impossible, stop and report divergence. Do not force-push.

Create/update:

README.md

README must include:

Implemented:

- SQLite-backed local demo user
- SSR dashboard/list/detail reads
- sandbox subscription via Server Actions
- persisted local quota
- atomic proposal create + usage event transaction
- persisted proposal status transitions
- deterministic server-side generator
- Playwright proof for happy path and guardrail

Not implemented:

- login/password/session security
- remote/shared production database
- real payment processor or webhooks
- external AI provider
- multi-user authorization and rate limits
- PDF export

docs/checkpoint-map.md must state:

- checkpoint-0-baseline: prepared repo baseline and honest SSR scaffold
- checkpoint-1-wave-1-foundation: real SQLite reads, no mutation flow
- checkpoint-2-wave-2-saas-flow: real local vertical slice, server mutations, reload persistence
- main: final attendee package

docs/demo-runbook.md must include:

1. reset DB
2. run tests
3. run production build
4. start production server
5. demonstrate inactive state
6. activate Pro
7. create Nusantara Coffee proposal
8. show quota 49/50
9. change status to Sent
10. reload and prove persistence

Final proof assets:

Capture or list paths for:

- baseline route/app shell
- Wave 1 DB-backed dashboard
- Wave 1 DB-backed proposal detail
- Wave 2 inactive billing/new proposal state
- Wave 2 Pro active 50/50
- Wave 2 generated/saved proposal 49/50
- Wave 2 Sent status after reload
- short backup MP4 or screen recording of the Wave 2 happy path if tooling is available

Final verification:

npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e

Final commit:

git add README.md docs proof package.json package-lock.json .github
git commit -m "docs: package verified ProposalPilot walkthrough"
git push origin main

Final report required:

1. checkpoint SHA table
2. exact routes
3. exact verified journey
4. test output summary
5. screenshot/video paths
6. live URL
7. honest limitations
8. explicit statement: no claim beyond local SQLite-backed SaaS vertical slice

-------------------------------------------------------------------------------
Presenter Talk Track
-------------------------------------------------------------------------------

Kita tidak mulai dari UI palsu. Kita mulai dari ide, acceptance criteria, task tracker, lalu baseline repo yang dependensinya sudah siap.

Wave pertama membangun fondasi: schema SQLite, seed user, repository layer, dan halaman server-rendered yang membaca data sungguhan dari database.

Wave kedua membangun flow SaaS: sandbox checkout menulis subscription, proposal creation berjalan dalam satu transaction, quota berubah dari 50/50 ke 49/50, dan status proposal tetap Sent setelah reload.

Kalau reload menghapus state, itu bukan bukti SaaS slice. Kalau test cuma cek UI, itu bukan bukti business flow.

-------------------------------------------------------------------------------
Final Agent Behavior Rule
-------------------------------------------------------------------------------

At every phase boundary: update the task tracker, verify, commit, and report the gate result. Never silently proceed through a failed checkpoint. Never substitute an attractive client-only page for a database-backed implementation.
```

## Recommended Live Usage

1. Pre-session: prepare the GitHub repo with dependencies installed and baseline scripts ready.
2. Start with Phase 1 so the agent produces plan, acceptance criteria, and data model.
3. Use Phase 2 to force a real task tracker and parallel wave map.
4. Use Phase 3 to verify the prepared baseline from GitHub.
5. Build Wave 1 live until DB-backed SSR proof passes.
6. Build Wave 2 live until mutation flow, tests, and live proof pass.
7. Finish with final packaging and proof index.

## Non-Negotiable Proof Sentence

```text
Kalau reload menghapus state, itu bukan bukti SaaS slice. Kalau test cuma cek UI, itu bukan bukti business flow.
```
