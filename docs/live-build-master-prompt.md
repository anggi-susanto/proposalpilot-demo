# Master Prompt — Build a Real SaaS in Under 1 Hour, from Idea to Verified Checkpoints

> Paste this **entire prompt** into one coding agent. Do not let it skip phases. The agent must stop at each gate, verify, commit the checkpoint, and only then continue.

```text
You are the lead product engineer for a live webinar:

“From Prompt to Production — Building SaaS with AI in Under 1 Hour”

Your task is to build **ProposalPilot**, a real local database-backed SaaS vertical slice, in auditable checkpoints.

This is not a request to create a polished static landing page, a React-only mock, fake dashboard metrics, browser-localStorage product state, or UI that merely “looks like” a SaaS.

The product must have server-rendered reads, server-side writes, a real local SQLite database, reload persistence, and automated verification.

# Webinar truth and scope

At the end of this build, it is valid to claim:

- A real local SQLite-backed SaaS vertical slice was built.
- Server Components read account, subscription, quota, and proposal data from SQLite.
- Server Actions persist sandbox subscription activation, proposal creation, quota use, and status changes.
- Data remains after page refresh and server restart as long as the SQLite file remains.
- Checkout is sandbox/local only, not real billing.
- Proposal generation is deterministic/server-side only, not a paid external AI provider.

It is NOT valid to claim:

- production-ready SaaS
- real payment processing
- payment webhooks
- real auth/session security
- external AI generation
- remote/shared production database

# Product idea

Build **ProposalPilot**.

ProposalPilot helps freelancers, agencies, and consultants turn a short client brief into a structured proposal. The productized journey is:

```text
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
→ refresh proves data persists
```

# Required stack

- Existing Next.js App Router project
- TypeScript
- Tailwind CSS
- React Server Components
- Server Actions
- Node runtime only for DB-backed pages/actions; do NOT use Edge runtime
- Node 24 built-in SQLite through `node:sqlite`
- Playwright E2E

Database path:

```text
data/proposalpilot.sqlite
```

Add that database file to `.gitignore`.

# Absolute anti-fake rules

1. Do NOT use localStorage, IndexedDB, in-memory global variables, or React useState as the source of truth for business state.
2. Do NOT display hardcoded dashboard values such as plan/quota/proposal counts if SQLite has the source data.
3. Do NOT add a giant marketing hero as the first application screen.
4. Do NOT use user-facing phrases such as:
   - “SaaS demo slice”
   - “Demo guard”
   - “prove persistence and quota decrement”
   - “mock billing”
5. Do NOT claim a button works when it is not wired to a Server Action.
6. Do NOT say work is done because the UI looks good. Every checkpoint needs a proof gate.
7. Do NOT jump ahead: complete phases in the exact order below.

# Branch and commit contract

Use this branch story exactly:

```text
checkpoint-0-baseline
checkpoint-1-ui-shell
checkpoint-2-working-saas-flow
main
```

Checkpoint meaning:

| Branch | Meaning |
|---|---|
| checkpoint-0-baseline | True empty SSR route scaffold. No fake SaaS behavior. |
| checkpoint-1-ui-shell | Real SQLite schema + seed + SSR DB reads + app shell. |
| checkpoint-2-working-saas-flow | Real Server Action vertical slice: sandbox subscription, quota transaction, proposal record, status persistence. |
| main | Attendee docs, CI, checkpoint map, final packaging after checkpoint 2 is verified. |

Never overwrite a previously verified checkpoint with later work. Create commits in sequence.

---

# PHASE 0 — Inspect the existing repository

## Goal

Confirm the repository and current state before changing anything.

## Do

Run:

```bash
pwd
git status --short --branch
git remote -v
git branch -a
git log --oneline --decorate -8
node --version
node -e "require('node:sqlite'); console.log('node:sqlite available')"
```

Read:

```text
package.json
next.config.ts
src/app/layout.tsx
src/app/globals.css
README.md
tests/
```

## Report before moving on

Return a compact table:

| Check | Actual result |
|---|---|
| Repo path | |
| Remote | |
| Current branch | |
| Existing checkpoint branches | |
| Existing dirty files | |
| Node/SQLite availability | |
| Existing app state | |

Do not edit code until this inspection is complete.

---

# PHASE 1 — Turn the idea into an implementation plan

## Goal

Convert ProposalPilot from an idea into a small, testable SaaS vertical slice.

## Create

```text
docs/live-build-plan.md
docs/acceptance-criteria.md
docs/data-model.md
```

## `docs/live-build-plan.md` must contain

1. Product problem
2. Target user
3. One user journey
4. Route map
5. SQLite ownership model
6. Server Action boundaries
7. Checkpoint map
8. Demo timing map for 60 minutes
9. What is deliberately out of scope
10. Verification strategy

## `docs/acceptance-criteria.md` must contain exact proof states

```text
AC-01: `/app` server-renders demo account from SQLite.
AC-02: `/app/billing` displays plans from a server-owned constant/config.
AC-03: selecting Pro + sandbox checkout writes active Pro subscription to SQLite.
AC-04: after checkout, reload shows Pro active and quota 50/50.
AC-05: proposal creation form is server-action backed and rejects inactive subscription.
AC-06: creating a proposal inserts a proposal row and usage event in one DB transaction.
AC-07: successful proposal creation changes quota 50/50 to 49/50 after reload.
AC-08: proposal detail reads stored generated content from SQLite.
AC-09: Draft → Sent status update is a Server Action and remains Sent after reload.
AC-10: Playwright verifies the happy path and pre-checkout guardrail.
```

## `docs/data-model.md` must define

```sql
users
subscriptions
proposals
usage_events
```

Include each table’s fields, ownership, and why it exists.

## Gate 1 — Plan review

Before coding, check:

- [ ] every acceptance criterion can be directly tested
- [ ] no feature depends on a fake client-only source of truth
- [ ] product scope fits 60 minutes
- [ ] real billing/auth/external AI are explicitly out of scope
- [ ] no requirement is ambiguous

Commit planning only:

```bash
git add docs
git commit -m "docs: define ProposalPilot live build plan"
```

Report the commit SHA and the final one-paragraph plan.

---

# PHASE 2 — Build checkpoint 0: true SSR baseline

## Goal

Create the pre-session baseline. This is deliberately empty but structurally real.

## Branch

```bash
git switch checkpoint-0-baseline || git switch -c checkpoint-0-baseline
```

## Required route structure

```text
src/app/
├── page.tsx
├── layout.tsx
└── app/
    ├── layout.tsx
    ├── page.tsx
    ├── billing/page.tsx
    └── proposals/
        ├── page.tsx
        ├── new/page.tsx
        └── [id]/page.tsx
```

## Requirements

- `/` is a minimal public entry page.
- `/app` is a server-rendered workspace shell.
- `/app/billing`, `/app/proposals`, `/app/proposals/new`, `/app/proposals/[id]` are honest server-rendered placeholders.
- app shell has navigation: Dashboard, Billing, Proposals, New Proposal.
- no database exists yet.
- no fake metrics, fake quota, fake checkout, fake proposal generator, or fake saved proposal state.
- dynamic `/app/proposals/[id]` renders server-side using `params` and shows the ID.

## Baseline test requirements

Create Playwright tests that prove:

```text
/ renders
/app renders workspace shell
/app/billing renders
/app/proposals renders
/app/proposals/new renders
/app/proposals/demo-123 renders server-side
```

## Verify checkpoint 0

Run exactly:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

Expected build output must include a dynamic route:

```text
ƒ /app/proposals/[id]
```

## Commit checkpoint 0

```bash
git add src tests package.json package-lock.json .gitignore
git commit -m "chore: establish true SSR baseline"
git push -u origin checkpoint-0-baseline
```

## Gate 2 — checkpoint 0 proof

Report:

- commit SHA
- build route table
- test output
- screenshot of `/` and `/app`
- explicit statement: “No SaaS behavior is implemented yet.”

Do not begin checkpoint 1 until this gate passes.

---

# PHASE 3 — Build checkpoint 1: SQLite + SSR database reads

## Goal

Build a real server-rendered foundation. It is okay if sandbox checkout and proposal creation do not exist yet, but everything displayed must come from SQLite.

## Branch

```bash
git switch -c checkpoint-1-ui-shell checkpoint-0-baseline
```

## Create these modules

```text
src/lib/types.ts
src/lib/db.ts
src/lib/repositories.ts
src/lib/seed.ts
scripts/reset-db.mjs
```

## SQLite requirements

Use built-in `node:sqlite` only.

DB file:

```text
data/proposalpilot.sqlite
```

Add it to `.gitignore`.

Create schema idempotently:

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

## Seed requirements

Idempotently create:

```text
Alex Morgan
alex@proposalpilot.local
inactive subscription
quota_total=0
quota_used=0
```

Also create two sample proposal records:

```text
Urban Plant Studio — Sent
Apex Legal Advisory — Accepted
```

Because the account is inactive, label them `Sample records` in a compact honest note.

## Repository requirements

All SQL is inside `src/lib/repositories.ts` or DB helper modules.

Required functions:

```ts
getDemoUser()
getSubscriptionForUser(userId)
listProposalsForUser(userId)
getProposalForUser(userId, proposalId)
getDashboardSummary(userId)
```

## SSR page requirements

### `/app`

- Server Component calls repository functions.
- Render user name, subscription state, quota, counts, and recent proposals from DB.
- No hardcoded product numbers.

### `/app/proposals`

- Server-render DB-backed proposal table.
- Fields: client, service, budget, status, updated timestamp.
- Every row links to its detail route.

### `/app/proposals/[id]`

- Query the proposal from SQLite server-side.
- Use `notFound()` if absent.
- Render stored proposal content/status.

### `/app/billing`

- Render plan offerings and subscription state from server data/config.
- No checkout mutation yet.
- Small honest note: “Sandbox activation is added in checkpoint 2.”

## Add reset script

In package.json:

```json
"db:reset": "node scripts/reset-db.mjs"
```

This command deletes/recreates/seeds the DB deterministically.

## Verify checkpoint 1

1. Run:

```bash
npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

2. Expand E2E so it proves:

```text
/app shows Alex Morgan and inactive 0/0 state from DB
/app/proposals contains seeded Urban Plant Studio record
/app/proposals/[seeded-id] renders stored proposal content
```

3. Manually reload all pages once and verify seed data remains.

## Commit checkpoint 1

```bash
git add src scripts tests package.json package-lock.json .gitignore README.md docs
git commit -m "feat: add SQLite-backed SSR workspace foundation"
git push -u origin checkpoint-1-ui-shell
```

## Gate 3 — checkpoint 1 proof

Report:

- exact database path
- server-only DB read modules
- screenshots of DB-backed dashboard and proposal detail
- test output
- commit SHA
- explicit statement: “Checkout, quota mutation, and create flow are not built yet.”

Do not begin checkpoint 2 until this gate passes.

---

# PHASE 4 — Build checkpoint 2: real SaaS vertical slice

## Goal

Add the first real mutation flow using Server Actions and SQLite transactions. This is the actual SaaS proof checkpoint.

## Branch

```bash
git switch -c checkpoint-2-working-saas-flow checkpoint-1-ui-shell
```

## Create these modules

```text
src/lib/proposal-generator.ts
src/lib/proposal-service.ts
src/app/app/billing/actions.ts
src/app/app/proposals/new/actions.ts
src/app/app/proposals/[id]/actions.ts
```

## Deterministic generator

`src/lib/proposal-generator.ts` must export a pure server-side function:

```ts
generateProposal(input: ProposalInput): string
```

The generated content must have all sections:

```text
Executive Summary
Client Problem Recap
Proposed Solution
Scope of Work
Expected Outcome
Investment
Timeline
Next Steps
```

It must not call external APIs. README must call it deterministic/demo generator.

## Real plan activation

On `/app/billing`:

- Show Starter, Pro, Agency plan cards.
- Each plan selection submits a real HTML form to a Server Action.
- Server Action validates `plan`.
- Server Action writes a local sandbox subscription to SQLite:

```text
Starter: quota_total 10
Pro: quota_total 50
Agency: quota_total 200
status: active
quota_used: 0
activated_at: now
```

- Use `revalidatePath` and `redirect` after successful write.
- User-facing copy must say:

```text
Sandbox checkout writes a local development subscription.
No payment provider is contacted.
```

## Real proposal creation

On `/app/proposals/new`:

- Read subscription from DB server-side.
- If no active subscription, render a server-side message and link to `/app/billing`.
- If active, render a real `<form action={createProposal}>`.
- Required fields:
  - client name
  - industry
  - service
  - problem
  - outcome
  - budget
  - tone

`createProposal` Server Action must call:

```ts
createProposalForUser(userId, input)
```

## Transaction rule

`createProposalForUser` must use one SQLite transaction, in this order:

```text
1. Read subscription
2. Reject if inactive
3. Reject if quota_used >= quota_total
4. Generate deterministic proposal text
5. Insert proposal row as Draft
6. Increment quota_used exactly once
7. Insert usage_events row with event_type=proposal_generated and units=1
8. Commit
```

On failure, rollback. Never create a proposal without usage event/quota update, and never decrement quota without proposal insert.

## Real status transition

On `/app/proposals/[id]`:

- Read proposal content/status from SQLite.
- Provide status form backed by Server Action.
- Allow: Draft, Sent, Accepted, Rejected.
- Server validates ownership and allowed status value.
- Persist `updated_at` and revalidate.

## Required screen proof

### Dashboard `/app`

Must show database-derived:

```text
Alex Morgan
Pro active
50/50 after checkout
49/50 after first proposal creation
recent proposal list
status counts
```

### Billing `/app/billing`

Must show active plan after reload.

### Proposal list `/app/proposals`

Must show new Nusantara Coffee record from DB.

### Proposal detail `/app/proposals/[id]`

Must show generated content and persisted status.

## E2E test requirements

Replace/check existing tests. Add a true happy path test:

```text
1. Run db reset in test setup.
2. Visit /app/billing.
3. Select Pro and submit sandbox checkout.
4. Assert page shows Pro active and 50/50.
5. Visit /app/proposals/new.
6. Submit Nusantara Coffee form.
7. Assert generated content includes Executive Summary.
8. Assert proposal list/detail contains Nusantara Coffee as Draft.
9. Assert dashboard quota is 49/50.
10. Change status to Sent.
11. Reload page.
12. Assert Sent and 49/50 remain.
```

Add a guardrail test:

```text
1. Reset DB.
2. Visit /app/proposals/new.
3. Assert form cannot create proposal while inactive.
4. Assert message links to billing.
5. Confirm quota remains 0/0 and no new proposal exists.
```

## Verify checkpoint 2

Run exactly:

```bash
npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

Then manually prove on production mode, not dev mode:

```bash
npm run build
npm run start -- --hostname 0.0.0.0 --port 3047
```

Use a browser to prove:

```text
inactive state
→ Pro activation 50/50
→ create proposal 49/50
→ status Sent
→ reload persists
```

## Commit checkpoint 2

```bash
git add src scripts tests package.json package-lock.json README.md docs
git commit -m "feat: add SQLite-backed proposal SaaS flow"
git push -u origin checkpoint-2-working-saas-flow
```

## Gate 4 — checkpoint 2 proof

Return a strict table:

| Claim | Code evidence | Browser proof | Test proof |
|---|---|---|---|
| sandbox subscription persisted | file/function | screenshot | test name |
| 50/50 quota | file/function | screenshot | test name |
| proposal saved | file/function | screenshot | test name |
| 49/50 quota after create | transaction function | screenshot | test name |
| Draft → Sent persistence | status action | screenshot after reload | test name |

If any cell lacks proof, label it `unchecked` or `blocked`; do not call the checkpoint done.

---

# PHASE 5 — Final attendee packaging

## Goal

Merge/package only verified work. Do not add product features here.

## Branch

```bash
git switch main
git merge --ff-only checkpoint-2-working-saas-flow
```

If a fast-forward is impossible, stop and report the exact branch divergence. Do not force-push.

## Final docs required

Create/update:

```text
README.md
docs/checkpoint-map.md
docs/live-build-prompts.md
docs/demo-runbook.md
docs/production-checklist.md
```

## README must state exactly

### Implemented

```text
- SQLite-backed local demo user
- SSR dashboard/list/detail reads
- sandbox subscription via Server Actions
- persisted local quota
- atomic proposal create + usage event transaction
- persisted proposal status transitions
- deterministic server-side generator
- Playwright proof for happy path and guardrail
```

### Not implemented

```text
- login/password/session security
- remote/shared production database
- real payment processor or webhooks
- external AI provider
- multi-user authorization and rate limits
- PDF export
```

## Checkpoint map must state

```text
checkpoint-0: route scaffold only
checkpoint-1: real SQLite reads, no mutations
checkpoint-2: real local vertical slice, server mutations, reload persistence
main: attendee package
```

## Final proof assets

Capture from the real running URL:

1. baseline route/app shell
2. checkpoint 1 DB-backed dashboard
3. checkpoint 2 inactive billing state
4. checkpoint 2 Pro active 50/50
5. checkpoint 2 generated/saved proposal 49/50
6. checkpoint 2 Sent status after reload
7. short backup MP4 of only the checkpoint 2 happy path

## Final verification

```bash
npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
git status --short
git log --oneline --decorate -8
```

## Final commit

```bash
git add README.md docs proof package.json package-lock.json .github
git commit -m "docs: package verified SaaS checkpoint walkthrough"
git push origin main
```

## Final report required

Return:

1. checkpoint SHA table
2. exact routes
3. exact verified journey
4. test output
5. screenshot/video paths
6. live URL
7. honest limitations
8. no claim beyond local SQLite-backed SaaS vertical slice
```

---

# Presenter talk track to use during the webinar

```text
Kita nggak mulai dari UI palsu. Kita mulai dari baseline SSR kosong.

Checkpoint pertama: kita bikin database, seed user, lalu baca data itu lewat server-rendered routes. Jadi dashboard bukan angka hardcode.

Checkpoint kedua: kita pasang Server Actions. Saat saya aktifkan plan Pro, subscription dan quota benar-benar ditulis ke SQLite. Saat saya buat proposal, satu transaction menulis proposal, usage event, lalu mengubah quota 50 jadi 49.

Setelah itu kita reload. Kalau state masih ada, baru kita boleh bilang vertical slice-nya bekerja.

Checkout-nya sandbox dan generator-nya deterministic agar sesi stabil. Tapi data path-nya benar-benar server-side dan persisted lokal.
```

# Final agent behavior rule

At every phase boundary, stop, verify, commit, and report the gate result. Never silently proceed through a failed checkpoint. Never substitute an attractive client-only page for a database-backed implementation.
```

## How to use it live

1. Pre-session: have `checkpoint-0-baseline` cloned, dependencies installed, and baseline tests green.
2. Start from the master prompt through Phase 0–1 on your coding agent.
3. Live build: run Phase 3 prompt section until checkpoint 1 commit lands.
4. Continue Phase 4 until checkpoint 2 proof passes.
5. At the end, show the SHA/checkpoint graph and `npm run test:e2e`.

## Non-negotiable proof sentence

```text
“Kalau reload menghapus state, itu bukan bukti SaaS slice. Kalau test cuma cek UI, itu bukan bukti business flow.”
```
