# ProposalPilot V3 — Step-by-Step AI Prompts, English Version

Use these prompts one at a time. Paste the next prompt only after the previous step is completed, verified, and committed. The prompts intentionally describe a normal SaaS implementation workflow, not a presentation or demo workflow.

Baseline repository:

```text
git@github.com:anggi-susanto/proposalpilot-baseline.git
```

Start from a fresh clone of this baseline repository. Do not start from an existing modified ProposalPilot working directory.

Runtime URL requirement for every checkpoint:

```text
Host: 0.0.0.0
Port: 3047
Public subdomain attached by the operator: proposal.jordi.web.id
```

At the start of every checkpoint prompt, make sure the app can run on `0.0.0.0:3047`. Use this runtime for browser checks and manual verification. Prefer production mode after a successful build; use dev mode only when the checkpoint explicitly needs fast iteration.

## Product Brief

ProposalPilot is a SaaS app for freelancers, agencies, and consultants. It helps a user register an account, log in, choose a plan, complete a sandbox checkout, receive a local invoice, turn a short client brief into a structured proposal, track proposal quota, and update proposal status.

Core flow:

```text
Visitor lands on marketing page
→ register account
→ log in
→ choose plan
→ sandbox checkout
→ local invoice created
→ subscription active
→ quota available
→ submit client brief
→ server generates deterministic proposal
→ proposal is saved
→ quota is used
→ proposal status changes Draft to Sent
→ reload confirms persistence
```

Required technical boundaries:

- Existing GitHub baseline repository with dependencies already prepared: `git@github.com:anggi-susanto/proposalpilot-baseline.git`.
- Next.js App Router, TypeScript, Tailwind CSS.
- React Server Components for DB-backed reads.
- Server Actions for DB-backed writes.
- Landing page, local register/login/logout, sandbox checkout, and invoice records are in scope.
- Node runtime for DB-backed pages/actions; do not use Edge runtime.
- Node 24 built-in SQLite via `node:sqlite`.
- SQLite database path: `data/proposalpilot.sqlite`.
- Playwright E2E tests.
- Business state must be stored in SQLite, not browser storage or in-memory state.
- Proposal generation must be deterministic and server-side, with no external AI API.
- Checkout is local sandbox activation only, with no payment provider, but it must create a persisted invoice record.

Do not implement:

- real payment processing or webhooks
- remote production database
- external AI provider calls
- production multi-tenant authorization
- PDF export

Recommended branches:

```text
main
checkpoint-0-baseline
checkpoint-1-foundation
checkpoint-2-saas-flow
```

---

## Prompt 1 — Inspect Repo and Create Implementation Plan

```text
You are a senior full-stack engineer. I need you to start from this baseline repository and create an implementation plan for a local SQLite-backed SaaS called ProposalPilot:

git@github.com:anggi-susanto/proposalpilot-baseline.git

If you are not already inside a fresh clone of that repository, clone it first and work inside the cloned directory. Do not use any other existing ProposalPilot directory as the starting point.

Do not edit application code yet. First inspect the repository and confirm the baseline.

Runtime requirement:
Before reporting this step complete, confirm the project can be served on host 0.0.0.0 and port 3047 for the public subdomain proposal.jordi.web.id. If no code has changed yet, use the baseline app.

Product:
ProposalPilot helps freelancers, agencies, and consultants turn a short client brief into a structured proposal. The app must support a landing page, local registration, local login/logout, sandbox plan checkout, persisted invoices, subscription activation, proposal quota, proposal creation, saved generated proposal content, and persisted proposal status changes.

Required stack:
- Baseline repo: git@github.com:anggi-susanto/proposalpilot-baseline.git
- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components
- Server Actions
- Landing page, register/login/logout, sandbox checkout, and invoices
- Node runtime for database-backed routes/actions
- Node 24 built-in SQLite through node:sqlite
- Playwright E2E
- SQLite file at data/proposalpilot.sqlite

Rules:
- Do not use localStorage, IndexedDB, in-memory globals, or React useState as the business source of truth.
- Do not hardcode dashboard business metrics when they should come from SQLite.
- Do not create fake checkout, fake proposal records, or fake quota state.
- Do not fake auth state; registration, login, and logout must be backed by server-side persistence/cookies.
- Do not fake invoices; checkout must persist an invoice record in SQLite.
- Do not call external AI APIs.
- Do not add production auth, real billing, or PDF export.

Inspect by running:
- pwd
- git status --short --branch
- git remote -v
- git branch -a
- git log --oneline --decorate -8
- node --version
- node -e "require('node:sqlite'); console.log('node:sqlite available')"
- npm --version

Runtime check:
- npm install if dependencies are missing
- npm run build
- npm run start -- --hostname 0.0.0.0 --port 3047
- Open http://127.0.0.1:3047 and, if available, https://proposal.jordi.web.id
- Stop the server after confirming it works, unless the operator asks you to keep it running

Read the existing package.json, Next config, app layout, global CSS, README, and tests.

Confirm these baseline expectations before planning:
- origin points to git@github.com:anggi-susanto/proposalpilot-baseline.git
- main has the clean SSR scaffold
- package.json already includes lint, typecheck, build, and test:e2e scripts
- baseline routes exist for /, /app, /app/billing, /app/proposals, /app/proposals/new, and /app/proposals/[id]
- auth, checkout, and invoice routes may be added in the baseline scaffold step if they do not already exist
- no SQLite implementation or SaaS business behavior exists yet

Create these planning files:
- docs/implementation-plan.md
- docs/acceptance-criteria.md
- docs/data-model.md
- docs/task-tracker.md

docs/implementation-plan.md must include:
1. Product problem
2. Target user
3. One end-to-end user journey
4. Route map
5. Landing page and conversion flow
6. Register/login/session model
7. Checkout and invoice flow
8. Data ownership model
9. Server Action boundaries
10. Implementation phases
11. Verification strategy
12. Out-of-scope list

docs/acceptance-criteria.md must include:
- AC-01: / renders a real landing page with CTA links to register and login.
- AC-02: /register creates a local account in SQLite through a Server Action.
- AC-03: /login creates a server-side local session and redirects to /app.
- AC-04: /app server-renders the authenticated account from SQLite.
- AC-05: /app/billing displays plans from server-owned config.
- AC-06: selecting Pro + sandbox checkout writes active Pro subscription and an invoice to SQLite.
- AC-07: after checkout, reload shows Pro active, quota 50/50, and the invoice in /app/invoices.
- AC-08: proposal creation form is Server Action backed and rejects inactive subscriptions.
- AC-09: creating a proposal inserts a proposal row and usage event in one DB transaction.
- AC-10: successful proposal creation changes quota 50/50 to 49/50 after reload.
- AC-11: proposal detail reads stored generated content from SQLite.
- AC-12: Draft to Sent status update is a Server Action and remains Sent after reload.
- AC-13: Playwright verifies landing, register, login, checkout/invoice, happy path, and inactive-subscription guardrail.

docs/data-model.md must define users, sessions, subscriptions, invoices, proposals, and usage_events with fields, ownership, and purpose.

docs/task-tracker.md must be a table:
| ID | Task | Phase | Dependencies | Acceptance Criteria | Status | Proof |

Use statuses: pending, in_progress, blocked, verified.

After creating the planning docs, update the task tracker and commit only the docs:
git add docs
git commit -m "docs: plan ProposalPilot implementation"

Report:
- repo path
- current branch
- remote
- confirmation that the remote is git@github.com:anggi-susanto/proposalpilot-baseline.git
- Node and node:sqlite status
- runtime status for 0.0.0.0:3047 and proposal.jordi.web.id if reachable
- planning files created
- commit SHA
- any blockers
```

---

## Prompt 2 — Prepare Baseline Routes and Smoke Tests

```text
Continue from the planning commit. Create or verify the baseline application scaffold for ProposalPilot.

Runtime requirement:
At the beginning of this checkpoint, verify the app runs on 0.0.0.0:3047 so it can be attached to proposal.jordi.web.id. Keep using this host/port for browser checks.

Goal:
Create an honest server-rendered baseline with public, auth, checkout, invoice, and app route structure, but no SaaS business behavior yet.

Branch:
Create checkpoint-0-baseline from main in the cloned baseline repository git@github.com:anggi-susanto/proposalpilot-baseline.git.

Required route structure:
- src/app/page.tsx
- src/app/register/page.tsx
- src/app/login/page.tsx
- src/app/checkout/page.tsx
- src/app/layout.tsx
- src/app/app/layout.tsx
- src/app/app/page.tsx
- src/app/app/billing/page.tsx
- src/app/app/invoices/page.tsx
- src/app/app/invoices/[id]/page.tsx
- src/app/app/proposals/page.tsx
- src/app/app/proposals/new/page.tsx
- src/app/app/proposals/[id]/page.tsx

Requirements:
- / is a real but lightweight marketing landing page with value proposition, feature sections, pricing CTA, register CTA, and login link.
- /register is an honest placeholder for account creation.
- /login is an honest placeholder for login.
- /checkout is an honest placeholder for sandbox checkout.
- /app is a server-rendered workspace shell.
- /app/billing is an honest placeholder for plan selection.
- /app/invoices is an honest placeholder for invoice list.
- /app/invoices/[id] is a server-rendered dynamic invoice detail placeholder.
- /app/proposals is an honest placeholder for proposal list.
- /app/proposals/new is an honest placeholder for proposal creation.
- /app/proposals/[id] is a server-rendered dynamic route that shows the requested ID.
- App shell navigation includes Dashboard, Billing, Invoices, Proposals, New Proposal.
- Do not add database behavior yet.
- Do not show fake quota, fake plan state, fake proposal counts, fake checkout, or fake generated proposals.
- Keep the baseline honest. If the scaffold already exists from the baseline repo, verify it instead of rewriting it.

Add or update Playwright smoke tests proving:
- / renders
- /register renders
- /login renders
- /checkout renders
- /app renders workspace shell
- /app/billing renders
- /app/invoices renders
- /app/invoices/inv-demo-123 renders and displays inv-demo-123
- /app/proposals renders
- /app/proposals/new renders
- /app/proposals/demo-123 renders and displays demo-123

Run verification:
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Open http://127.0.0.1:3047
- If the public subdomain is already attached, open https://proposal.jordi.web.id
- Confirm / and /app render from the running server
- Stop the server after verification unless asked to keep it running

The build output should include the dynamic route /app/proposals/[id].

Commit:
git add src tests package.json package-lock.json .gitignore README.md docs
git commit -m "chore: establish ProposalPilot SSR baseline"
git push -u origin checkpoint-0-baseline

Report:
- commit SHA
- route list
- verification command results
- runtime URL result for 0.0.0.0:3047 and proposal.jordi.web.id if reachable
- confirmation that no SaaS behavior is implemented yet
- any changed files of note
```

---

## Prompt 3 — Implement SQLite Foundation and Server-Rendered Reads

```text
Continue from checkpoint-0-baseline. Implement the database foundation and server-rendered reads.

Runtime requirement:
At the beginning of this checkpoint, start from a working runtime target of 0.0.0.0:3047 for browser checks. The operator will attach proposal.jordi.web.id to that host/port.

Goal:
ProposalPilot should read real account, session-aware app data, subscription, invoice, quota, and proposal data from SQLite. Do not implement auth actions, checkout, proposal creation mutation, or status mutation yet.

Branch:
Create checkpoint-1-foundation from checkpoint-0-baseline.

Create these files:
- src/lib/types.ts
- src/lib/db.ts
- src/lib/repositories.ts
- src/lib/seed.ts
- src/lib/auth.ts
- scripts/reset-db.mjs

Database:
- Use node:sqlite only.
- SQLite path must be data/proposalpilot.sqlite.
- Add data/proposalpilot.sqlite to .gitignore.
- Schema creation must be idempotent.

Schema:
users(
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at text not null
)

sessions(
  id text primary key,
  user_id text not null,
  token_hash text not null unique,
  expires_at text not null,
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

invoices(
  id text primary key,
  user_id text not null,
  subscription_id text,
  plan text not null,
  amount_cents integer not null,
  currency text not null,
  status text not null,
  issued_at text not null,
  paid_at text
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

Seed data:
- User: Alex Morgan, alex@proposalpilot.local
- Password for local development login: proposalpilot123
- Subscription: inactive, quota_total=0, quota_used=0
- Invoice: no paid invoice yet for inactive subscription
- Proposal: Urban Plant Studio, status Sent
- Proposal: Apex Legal Advisory, status Accepted

Required repository functions:
- getDemoUser()
- getUserByEmail(email)
- getUserById(userId)
- createUser(input)
- createSessionForUser(userId)
- getCurrentUser()
- logoutCurrentUser()
- getSubscriptionForUser(userId)
- listInvoicesForUser(userId)
- getInvoiceForUser(userId, invoiceId)
- listProposalsForUser(userId)
- getProposalForUser(userId, proposalId)
- getDashboardSummary(userId)

Add script to package.json:
"db:reset": "node scripts/reset-db.mjs"

Page requirements:
/register:
- Server Component renders local registration form placeholder or disabled form; actual register mutation arrives in the auth prompt.

/login:
- Server Component renders local login form placeholder or disabled form; actual login mutation arrives in the auth prompt.

/app:
- Server Component reads user, subscription, quota, proposal count, recent proposals, and status counts from SQLite.
- No hardcoded business metrics.

/app/billing:
- Server Component displays Starter, Pro, and Agency plans from server-owned config.
- Reads and displays current subscription state from SQLite.
- Shows that activation is not implemented yet.

/app/invoices:
- Server Component renders invoice table from SQLite.
- For inactive seed state, shows empty invoice state from DB.

/app/invoices/[id]:
- Server Component reads invoice from SQLite and uses notFound() when missing.

/app/proposals:
- Server Component renders proposal table from SQLite.
- Shows client, service, budget, status, updated timestamp.
- Each row links to detail.

/app/proposals/[id]:
- Server Component reads the proposal from SQLite.
- Uses notFound() when the proposal does not exist.
- Renders stored proposal content and status.

/app/proposals/new:
- Server Component reads subscription state.
- If inactive, shows a server-rendered message and link to billing.
- Do not render a working create form yet.

Tests:
Update Playwright tests to prove:
- npm run db:reset seeds Alex Morgan.
- /app shows Alex Morgan and inactive 0/0 quota from SQLite.
- /app/invoices shows empty invoice state from SQLite.
- /app/proposals shows Urban Plant Studio.
- /app/proposals/[seeded-id] renders stored proposal content.
- /app/proposals/new blocks creation while inactive.
- Reload keeps the seeded data visible.

Run verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Verify /app, /app/proposals, /app/proposals/new, and at least one proposal detail route in the browser
- Use http://127.0.0.1:3047 locally and https://proposal.jordi.web.id if the public subdomain is reachable
- Stop the server after verification unless asked to keep it running

Update docs/task-tracker.md with verified tasks and proof.

Commit:
git add src scripts tests package.json package-lock.json .gitignore README.md docs
git commit -m "feat: add SQLite-backed ProposalPilot foundation"
git push -u origin checkpoint-1-foundation

Report:
- commit SHA
- exact DB path
- repository functions implemented
- pages now backed by SQLite
- verification command results
- runtime URL result for 0.0.0.0:3047 and proposal.jordi.web.id if reachable
- confirmation that register/login actions, checkout, proposal creation, and status mutation are not implemented yet
```

---

## Prompt 4 — Implement Local Register, Login, Logout, and Route Guards

```text
Continue from checkpoint-1-foundation. Implement local account registration, login, logout, session cookies, and basic route guards.

Runtime requirement:
At the beginning of this checkpoint, confirm the app can be started on 0.0.0.0:3047. Use this runtime target for browser checks through proposal.jordi.web.id when available.

Goal:
Users can register, log in, access /app only when authenticated, and log out. This is local development auth, not production-grade security.

Create or update:
- src/lib/auth.ts
- src/app/register/actions.ts
- src/app/login/actions.ts
- src/app/app/logout/actions.ts or equivalent logout action
- src/app/register/page.tsx
- src/app/login/page.tsx
- src/app/app/layout.tsx
- middleware.ts if needed for route guards
- Playwright tests

Requirements:
- /register renders a form for name, email, password.
- Registration is a Server Action and writes a user row to SQLite.
- Passwords must not be stored in plaintext. Use Node crypto hashing with salt.
- /login renders a form for email and password.
- Login is a Server Action that validates credentials, creates a session row, and sets an httpOnly cookie.
- /app routes require a valid local session and redirect unauthenticated users to /login.
- App shell displays the current user's name/email from SQLite.
- Logout clears the cookie, deletes or invalidates the session, and redirects to /login.
- Keep seeded Alex Morgan available for tests with password proposalpilot123.

Tests:
- Unauthenticated /app redirects to /login.
- A new user can register and lands in /app or can log in after registering.
- Seeded Alex Morgan can log in.
- Logged-in dashboard displays the current user from SQLite.
- Logout prevents access to /app.

Run verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Verify register, login, /app guard, and logout in the browser
- Use http://127.0.0.1:3047 locally and https://proposal.jordi.web.id if reachable
- Stop the server after verification unless asked to keep it running

Update docs/task-tracker.md with verified auth proof.

Commit:
git add src tests package.json package-lock.json README.md docs middleware.ts
git commit -m "feat: add local account authentication"

Report:
- commit SHA
- auth files/functions
- cookie/session model summary
- test summary
- verification command results
- runtime URL result for 0.0.0.0:3047 and proposal.jordi.web.id if reachable
```

---

## Prompt 5 — Implement Plan Checkout and Invoice Creation

```text
Continue from the local auth commit. Implement plan checkout and invoice creation using Server Actions.

Runtime requirement:
At the beginning of this checkpoint, confirm the current app can be started on 0.0.0.0:3047. Use that same runtime target for manual browser checks through proposal.jordi.web.id when available.

Goal:
The authenticated user can select a plan, go through local sandbox checkout, activate a subscription, and receive a persisted invoice.

Create or update:
- src/app/app/billing/actions.ts
- src/app/app/billing/page.tsx
- src/app/checkout/actions.ts
- src/app/checkout/page.tsx
- src/app/app/invoices/page.tsx
- src/app/app/invoices/[id]/page.tsx
- repository functions needed for subscription updates
- repository functions needed for invoice creation/reads
- tests covering checkout, subscription activation, and invoices

Plan config:
- Starter: quota_total 10
- Pro: quota_total 50
- Agency: quota_total 200

Requirements:
- /app/billing shows Starter, Pro, and Agency plan cards.
- Each plan links or submits to /checkout?plan=PLAN.
- /checkout requires login and displays selected plan summary.
- Checkout confirmation uses a real Server Action.
- Server Action validates the selected plan.
- Server Action writes subscription to SQLite:
  - plan
  - status=active
  - quota_total based on plan
  - quota_used=0
  - activated_at=now
  - updated_at=now
- Server Action calls revalidatePath for affected routes.
- Server Action creates a paid invoice row in SQLite with user_id, subscription_id, plan, amount_cents, currency=USD, status=paid, issued_at, and paid_at.
- Server Action redirects after success.
- UI copy must clearly state this is local sandbox activation and no payment provider is contacted.
- Reload after selecting Pro must show Pro active and quota 50/50.
- /app/invoices must list the invoice.
- /app/invoices/[id] must render invoice detail from SQLite.

Do not implement proposal creation yet.

Tests:
Update Playwright tests to prove:
- Reset DB starts inactive with 0/0.
- Visiting /app/billing and selecting Pro opens checkout and activates Pro after confirmation.
- Checkout creates a paid invoice.
- Reload keeps Pro active.
- Dashboard shows quota 50/50 after activation.
- /app/invoices shows the Pro invoice.
- Invoice detail persists after reload.

Run verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Verify /app/billing from the browser
- Activate Pro and confirm /app shows 50/50 after reload
- Use http://127.0.0.1:3047 locally and https://proposal.jordi.web.id if reachable
- Stop the server after verification unless asked to keep it running

Update docs/task-tracker.md with verified subscription activation proof.

Commit:
git add src tests package.json package-lock.json README.md docs
git commit -m "feat: add sandbox subscription activation"

Report:
- commit SHA
- Server Action file/function
- repository function used for subscription update
- invoice file/function
- test names or test summary
- verification command results
- runtime URL result for 0.0.0.0:3047 and proposal.jordi.web.id if reachable
```

---

## Prompt 6 — Implement Proposal Generator and Atomic Proposal Creation

```text
Continue from the checkout and invoice commit. Implement deterministic proposal generation and atomic proposal creation.

Runtime requirement:
At the beginning of this checkpoint, confirm the app starts on 0.0.0.0:3047. Use this runtime for all manual browser checks and for the public subdomain proposal.jordi.web.id when reachable.

Goal:
An active user can create a proposal from a brief. The proposal content is generated server-side, saved to SQLite, quota is incremented, and a usage event is inserted in one transaction.

Create or update:
- src/lib/proposal-generator.ts
- src/lib/proposal-service.ts
- src/app/app/proposals/new/actions.ts
- src/app/app/proposals/new/page.tsx
- src/app/app/proposals/page.tsx
- src/app/app/proposals/[id]/page.tsx
- repository functions needed for mutation and reads
- Playwright tests

Generator requirements:
- Export generateProposal(input).
- Must be deterministic and server-side.
- Must not call external APIs.
- Generated content must include:
  - Executive Summary
  - Client Problem Recap
  - Proposed Solution
  - Scope of Work
  - Expected Outcome
  - Investment
  - Timeline
  - Next Steps

New proposal form:
- /app/proposals/new reads subscription from SQLite server-side.
- If inactive, render a message and billing link; do not render the create form.
- If active, render a real form action={createProposal}.
- Required fields: client name, industry, service, problem, outcome, budget, tone.

Transaction requirements:
createProposalForUser(userId, input) must perform one SQLite transaction in this order:
1. Read subscription.
2. Reject if inactive.
3. Reject if quota_used >= quota_total.
4. Generate deterministic proposal content.
5. Insert proposal row with status Draft.
6. Increment quota_used exactly once.
7. Insert usage_events row with event_type=proposal_generated and units=1.
8. Commit.

On failure, rollback. Never create a proposal without quota and usage_event changes. Never increment quota without a proposal row.

After success:
- Redirect to proposal detail.
- Proposal detail reads stored generated content from SQLite.
- Proposal list shows the new proposal.
- Dashboard shows quota changed from 50/50 to 49/50 after creating one proposal.

Tests:
Update Playwright tests to prove:
- Reset DB, register/login or log in as seeded Alex Morgan, activate Pro through checkout, create Nusantara Coffee proposal.
- Generated content includes Executive Summary.
- Proposal detail contains Nusantara Coffee and stored generated content.
- Proposal list contains Nusantara Coffee as Draft.
- Dashboard quota is 49/50 after reload.
- Inactive user cannot create proposal and no new proposal is inserted.

Run verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Activate Pro, create Nusantara Coffee, verify generated detail content, and confirm quota 49/50 after reload
- Use http://127.0.0.1:3047 locally and https://proposal.jordi.web.id if reachable
- Stop the server after verification unless asked to keep it running

Update docs/task-tracker.md with verified proposal creation proof.

Commit:
git add src tests package.json package-lock.json README.md docs
git commit -m "feat: add atomic proposal creation flow"

Report:
- commit SHA
- generator file/function
- transaction file/function
- routes updated
- test summary
- verification command results
- runtime URL result for 0.0.0.0:3047 and proposal.jordi.web.id if reachable
```

---

## Prompt 7 — Implement Proposal Status Updates and End-to-End Flow

```text
Continue from the proposal creation commit. Implement proposal status updates and complete the end-to-end SaaS flow.

Runtime requirement:
At the beginning of this checkpoint, confirm the app starts on 0.0.0.0:3047. Use this runtime target for production-mode and public-subdomain verification.

Goal:
Users can update a saved proposal status from Draft to Sent, and the status persists after reload.

Create or update:
- src/app/app/proposals/[id]/actions.ts
- src/app/app/proposals/[id]/page.tsx
- repository function for status updates
- Playwright tests

Requirements:
- Proposal detail reads content and status from SQLite.
- Detail page provides a form backed by a Server Action.
- Allowed statuses: Draft, Sent, Accepted, Rejected.
- Server Action validates proposal ownership.
- Server Action validates status value.
- Server Action persists status and updated_at.
- Server Action revalidates affected routes.
- Reload after updating Draft to Sent must still show Sent.

Full E2E test must prove:
1. Reset DB.
2. Visit landing page.
3. Register or log in as Alex Morgan.
4. Visit /app/proposals/new while inactive and confirm creation is blocked.
5. Visit /app/billing.
6. Select Pro and complete /checkout.
7. Reload and confirm Pro active with 50/50 quota.
8. Confirm /app/invoices contains the paid Pro invoice.
9. Visit /app/proposals/new.
10. Create Nusantara Coffee proposal.
11. Confirm generated content includes Executive Summary.
12. Confirm proposal detail shows Draft.
13. Confirm dashboard shows 49/50.
14. Change status to Sent.
15. Reload the detail page.
16. Confirm status remains Sent and quota remains 49/50.

Run verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Also run production-mode verification:
- npm run build
- npm run start -- --hostname 0.0.0.0 --port 3047

Use the running app to manually verify:
- inactive creation guardrail
- Pro activation 50/50
- proposal creation 49/50
- generated proposal detail
- Draft to Sent update
- reload persistence
- local URL: http://127.0.0.1:3047
- public URL if reachable: https://proposal.jordi.web.id

Update docs/task-tracker.md with verified status update and end-to-end proof.

Commit on branch checkpoint-2-saas-flow:
git add src tests package.json package-lock.json README.md docs
git commit -m "feat: complete ProposalPilot SaaS flow"
git push -u origin checkpoint-2-saas-flow

Report:
- commit SHA
- status action file/function
- full E2E test summary
- verification command results
- production-mode verification result
- runtime URL result for 0.0.0.0:3047 and proposal.jordi.web.id if reachable
- any remaining limitations
```

---

## Prompt 8 — Final Packaging and Project Documentation

```text
Continue from checkpoint-2-saas-flow. Package the project documentation and final verification. Do not add new product features in this step.

Runtime requirement:
At the beginning of this checkpoint, confirm the final app can run on 0.0.0.0:3047. Include the local URL and public subdomain status in the final documentation.

Goal:
Make the repository easy to run, verify, and understand.

Merge:
- Switch to main.
- Merge checkpoint-2-saas-flow using fast-forward only.
- If fast-forward is impossible, stop and report the divergence. Do not force-push.

Create or update:
- README.md
- docs/checkpoint-map.md
- docs/runbook.md
- docs/production-notes.md
- docs/proof.md

README must include:
- product overview
- stack
- setup instructions
- database reset command
- test commands
- route list
- auth flow
- checkout and invoice flow
- implemented features
- not implemented limitations

Implemented features list:
- SQLite-backed local demo user
- landing page with register/login CTAs
- local registration, login, logout, and session cookie
- SSR dashboard/list/detail reads
- sandbox checkout and subscription via Server Actions
- persisted invoice records and invoice detail pages
- persisted local quota
- atomic proposal create + usage event transaction
- persisted proposal status transitions
- deterministic server-side generator
- Playwright proof for happy path and guardrail

Not implemented list:
- production-grade login/password/session security
- remote/shared production database
- real payment processor or webhooks
- external AI provider
- multi-user authorization and rate limits
- PDF export

docs/checkpoint-map.md must describe:
- checkpoint-0-baseline: route scaffold only
- checkpoint-1-foundation: SQLite reads and server-rendered app foundation
- checkpoint-2-saas-flow: Server Actions, transaction flow, quota, status persistence
- main: packaged final project

docs/runbook.md must include exact steps:
1. install dependencies
2. reset DB
3. run lint
4. run typecheck
5. run build
6. run E2E tests
7. start production server
8. verify the app flow manually

The runbook must use this production start command:
npm run start -- --hostname 0.0.0.0 --port 3047

The runbook must list:
- local URL: http://127.0.0.1:3047
- public subdomain: https://proposal.jordi.web.id

Final verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e
- npm run start -- --hostname 0.0.0.0 --port 3047
- git status --short
- git log --oneline --decorate -8

Final commit:
git add README.md docs package.json package-lock.json .github
git commit -m "docs: package ProposalPilot project"
git push origin main

Final report:
- checkpoint SHA table
- exact routes
- verified user journey
- verification command results
- known limitations
- runtime URL status for http://127.0.0.1:3047 and https://proposal.jordi.web.id
- final branch and commit SHA
```
