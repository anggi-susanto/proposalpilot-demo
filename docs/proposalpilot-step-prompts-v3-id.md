# ProposalPilot V3 — Prompt AI Step-by-Step, Versi Bahasa Indonesia

Gunakan prompt ini satu per satu. Paste prompt berikutnya hanya setelah langkah sebelumnya selesai, terverifikasi, dan sudah di-commit. Prompt ini sengaja ditulis seperti workflow implementasi SaaS biasa, bukan workflow presentasi atau demo.

Baseline repository:

```text
git@github.com:anggi-susanto/proposalpilot-baseline.git
```

Mulai dari fresh clone baseline repository ini. Jangan mulai dari working directory ProposalPilot lain yang sudah banyak perubahan.

Runtime URL wajib untuk setiap checkpoint:

```text
Host: 0.0.0.0
Port: 3047
Public subdomain yang akan di-attach operator: proposalpoint.jordi.web.id
```

Di awal setiap checkpoint prompt, pastikan app bisa berjalan di `0.0.0.0:3047`. Gunakan runtime ini untuk browser check dan manual verification. Setelah build berhasil, utamakan production mode; gunakan dev mode hanya saat checkpoint butuh iterasi cepat.

## Product Brief

ProposalPilot adalah aplikasi SaaS untuk freelancer, agency, dan consultant. Aplikasi ini membantu user register account, login, memilih plan, melakukan sandbox checkout, menerima invoice lokal, mengubah brief singkat dari client menjadi proposal terstruktur, melacak quota proposal, dan memperbarui status proposal.

Core flow:

```text
Visitor membuka marketing landing page
→ register account
→ login
→ memilih plan
→ sandbox checkout
→ invoice lokal dibuat
→ subscription aktif
→ quota tersedia
→ submit client brief
→ server membuat proposal deterministik
→ proposal disimpan
→ quota terpakai
→ status proposal berubah dari Draft ke Sent
→ reload memastikan data tetap tersimpan
```

Batasan teknis wajib:

- Existing GitHub baseline repository dengan dependency yang sudah disiapkan: `git@github.com:anggi-susanto/proposalpilot-baseline.git`.
- Next.js App Router, TypeScript, Tailwind CSS.
- React Server Components untuk read yang berasal dari database.
- Server Actions untuk write yang berasal dari database.
- Landing page, local register/login/logout, sandbox checkout, dan invoice records termasuk scope.
- Node runtime untuk route/action yang memakai database; jangan gunakan Edge runtime.
- Node 24 built-in SQLite via `node:sqlite`.
- Path database SQLite: `data/proposalpilot.sqlite`.
- Playwright E2E tests.
- Business state wajib disimpan di SQLite, bukan browser storage atau in-memory state.
- Proposal generation wajib deterministik dan server-side, tanpa external AI API.
- Checkout hanya local sandbox activation, tanpa payment provider, tetapi wajib membuat persisted invoice record.

Jangan implementasikan:

- real payment processing atau webhook
- remote production database
- external AI provider call
- production multi-tenant authorization
- PDF export

Branch yang direkomendasikan:

```text
main
checkpoint-0-baseline
checkpoint-1-foundation
checkpoint-2-saas-flow
```

---

## Prompt 1 — Inspect Repo dan Buat Implementation Plan

```text
  Kamu adalah senior full-stack engineer. Saya ingin kamu mulai dari baseline repository ini dan membuat implementation plan untuk SaaS local SQLite-backed bernama ProposalPilot:

  git@github.com:anggi-susanto/proposalpilot-baseline.git

  Jika kamu belum berada di fresh clone repository tersebut, clone dulu repository itu dan kerjakan dari directory hasil clone. Jangan gunakan directory ProposalPilot lain yang sudah ada sebagai starting point.

  Jangan edit application code dulu. Pertama inspect repository dan konfirmasi baseline.

  Runtime requirement:
  Sebelum melaporkan step ini selesai, konfirmasi project bisa diserve pada host 0.0.0.0 dan port 3047 untuk public subdomain proposalpoint.jordi.web.id. Jika belum ada code yang berubah, gunakan baseline app.

  Product:
  ProposalPilot membantu freelancer, agency, dan consultant mengubah client brief singkat menjadi proposal terstruktur. Aplikasi harus mendukung landing page, local registration, local login/logout, sandbox plan checkout, persisted invoices, subscription activation, proposal quota, proposal creation, saved generated proposal content, dan persisted proposal status changes.

  Required stack:
  - Baseline repo: git@github.com:anggi-susanto/proposalpilot-baseline.git
  - Next.js App Router
  - TypeScript
  - Tailwind CSS
  - React Server Components
  - Server Actions
  - Landing page, register/login/logout, sandbox checkout, dan invoices
  - Node runtime untuk route/action yang memakai database
  - Node 24 built-in SQLite melalui node:sqlite
  - Playwright E2E
  - SQLite file di data/proposalpilot.sqlite

  Rules:
  - Jangan gunakan localStorage, IndexedDB, in-memory globals, atau React useState sebagai source of truth untuk business state.
  - Jangan hardcode dashboard business metrics kalau seharusnya berasal dari SQLite.
  - Jangan membuat fake checkout, fake proposal records, atau fake quota state.
  - Jangan fake auth state; registration, login, dan logout harus backed by server-side persistence/cookies.
  - Jangan fake invoices; checkout wajib persist invoice record di SQLite.
  - Jangan call external AI APIs.
  - Jangan menambahkan production auth, real billing, atau PDF export.

  Inspect dengan menjalankan:
  - pwd
  - git status --short --branch
  - git remote -v
  - git branch -a
  - git log --oneline --decorate -8
  - node --version
  - node -e "require('node:sqlite'); console.log('node:sqlite available')"
  - npm --version

  Runtime check:
  - npm install jika dependencies belum ada
  - npm run build
  - npm run start -- --hostname 0.0.0.0 --port 3047
  - Buka http://127.0.0.1:3047 dan, jika tersedia, https://proposalpoint.jordi.web.id
  - Stop server setelah berhasil dikonfirmasi, kecuali operator meminta server tetap running

  Baca package.json, Next config, app layout, global CSS, README, dan tests yang sudah ada.

  Konfirmasi baseline expectations ini sebelum planning:
  - origin mengarah ke git@github.com:anggi-susanto/proposalpilot-baseline.git
  - main berisi clean SSR scaffold
  - package.json sudah punya script lint, typecheck, build, dan test:e2e
  - baseline routes tersedia untuk /, /app, /app/billing, /app/proposals, /app/proposals/new, dan /app/proposals/[id]
  - auth, checkout, dan invoice routes bisa ditambahkan di baseline scaffold step jika belum tersedia
  - belum ada SQLite implementation atau SaaS business behavior

  Buat file planning ini:
  - docs/implementation-plan.md
  - docs/acceptance-criteria.md
  - docs/data-model.md
  - docs/task-tracker.md

  docs/implementation-plan.md wajib berisi:
  1. Product problem
  2. Target user
  3. One end-to-end user journey
  4. Route map
  5. Landing page dan conversion flow
  6. Register/login/session model
  7. Checkout dan invoice flow
  8. Data ownership model
  9. Server Action boundaries
  10. Implementation phases
  11. Verification strategy
  12. Out-of-scope list

  docs/acceptance-criteria.md wajib berisi:
  - AC-01: / render landing page sungguhan dengan CTA register dan login.
  - AC-02: /register membuat local account di SQLite melalui Server Action.
  - AC-03: /login membuat server-side local session dan redirect ke /app.
  - AC-04: /app melakukan server-render authenticated account dari SQLite.
  - AC-05: /app/billing menampilkan plans dari server-owned config.
  - AC-06: memilih Pro + sandbox checkout menulis active Pro subscription dan invoice ke SQLite.
  - AC-07: setelah checkout, reload menampilkan Pro active, quota 50/50, dan invoice di /app/invoices.
  - AC-08: proposal creation form backed by Server Action dan menolak inactive subscriptions.
  - AC-09: membuat proposal meng-insert proposal row dan usage event dalam satu DB transaction.
  - AC-10: proposal creation yang berhasil mengubah quota 50/50 menjadi 49/50 setelah reload.
  - AC-11: proposal detail membaca stored generated content dari SQLite.
  - AC-12: update status Draft ke Sent adalah Server Action dan tetap Sent setelah reload.
  - AC-13: Playwright memverifikasi landing, register, login, checkout/invoice, happy path, dan inactive-subscription guardrail.

  docs/data-model.md wajib mendefinisikan users, sessions, subscriptions, invoices, proposals, dan usage_events dengan fields, ownership, dan purpose.

  docs/task-tracker.md wajib berupa table:
  | ID | Task | Phase | Dependencies | Acceptance Criteria | Status | Proof |

  Gunakan status: pending, in_progress, blocked, verified.

  Setelah planning docs dibuat, update task tracker dan commit docs saja:
  git add docs
  git commit -m "docs: plan ProposalPilot implementation"

  Report:
  - repo path
  - current branch
  - remote
  - konfirmasi bahwa remote adalah git@github.com:anggi-susanto/proposalpilot-baseline.git
  - Node dan node:sqlite status
  - runtime status untuk 0.0.0.0:3047 dan proposalpoint.jordi.web.id jika reachable
  - planning files created
  - commit SHA
  - blocker jika ada
  ```

---

## Prompt 2 — Siapkan Baseline Routes dan Smoke Tests

```text
Lanjutkan dari planning commit. Buat atau verifikasi baseline application scaffold untuk ProposalPilot.

Runtime requirement:
Di awal checkpoint ini, verifikasi app berjalan di 0.0.0.0:3047 agar bisa di-attach ke proposalpoint.jordi.web.id. Gunakan host/port ini untuk browser checks.

Goal:
Buat baseline server-rendered yang jujur dengan public, auth, checkout, invoice, dan app route structure, tetapi belum ada SaaS business behavior.

Branch:
Buat checkpoint-0-baseline dari main di cloned baseline repository git@github.com:anggi-susanto/proposalpilot-baseline.git.

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
- / adalah marketing landing page yang real tetapi ringan dengan value proposition, feature sections, pricing CTA, register CTA, dan login link.
- /register adalah placeholder jujur untuk account creation.
- /login adalah placeholder jujur untuk login.
- /checkout adalah placeholder jujur untuk sandbox checkout.
- /app adalah server-rendered workspace shell.
- /app/billing adalah placeholder jujur untuk plan selection.
- /app/invoices adalah placeholder jujur untuk invoice list.
- /app/invoices/[id] adalah server-rendered dynamic invoice detail placeholder.
- /app/proposals adalah placeholder jujur untuk proposal list.
- /app/proposals/new adalah placeholder jujur untuk proposal creation.
- /app/proposals/[id] adalah server-rendered dynamic route yang menampilkan requested ID.
- App shell navigation mencakup Dashboard, Billing, Invoices, Proposals, New Proposal.
- Jangan tambahkan database behavior dulu.
- Jangan tampilkan fake quota, fake plan state, fake proposal counts, fake checkout, atau fake generated proposals.
- Jaga baseline tetap jujur. Jika scaffold sudah ada dari baseline repo, verifikasi saja, jangan rewrite tanpa alasan.

Tambahkan atau update Playwright smoke tests yang membuktikan:
- / renders
- /register renders
- /login renders
- /checkout renders
- /app renders workspace shell
- /app/billing renders
- /app/invoices renders
- /app/invoices/inv-demo-123 renders dan menampilkan inv-demo-123
- /app/proposals renders
- /app/proposals/new renders
- /app/proposals/demo-123 renders dan menampilkan demo-123

Jalankan verification:
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Buka http://127.0.0.1:3047
- Jika public subdomain sudah attached, buka https://proposalpoint.jordi.web.id
- Konfirmasi / dan /app render dari running server
- Stop server setelah verification kecuali diminta tetap running

Build output harus mencakup dynamic route /app/proposals/[id].

Commit:
git add src tests package.json package-lock.json .gitignore README.md docs
git commit -m "chore: establish ProposalPilot SSR baseline"
git push -u origin checkpoint-0-baseline

Report:
- commit SHA
- route list
- hasil verification commands
- runtime URL result untuk 0.0.0.0:3047 dan proposalpoint.jordi.web.id jika reachable
- konfirmasi bahwa belum ada SaaS behavior yang diimplementasikan
- changed files penting
```

---

## Prompt 3 — Implement SQLite Foundation dan Server-Rendered Reads

```text
Lanjutkan dari checkpoint-0-baseline. Implementasikan database foundation dan server-rendered reads.

Runtime requirement:
Di awal checkpoint ini, mulai dari runtime target yang working di 0.0.0.0:3047 untuk browser checks. Operator akan attach proposalpoint.jordi.web.id ke host/port tersebut.

Goal:
ProposalPilot harus membaca data account, session-aware app data, subscription, invoice, quota, dan proposal sungguhan dari SQLite. Jangan implementasikan auth actions, checkout, proposal creation mutation, atau status mutation dulu.

Branch:
Buat checkpoint-1-foundation dari checkpoint-0-baseline.

Buat file berikut:
- src/lib/types.ts
- src/lib/db.ts
- src/lib/repositories.ts
- src/lib/seed.ts
- src/lib/auth.ts
- scripts/reset-db.mjs

Database:
- Gunakan node:sqlite saja.
- SQLite path harus data/proposalpilot.sqlite.
- Tambahkan data/proposalpilot.sqlite ke .gitignore.
- Schema creation harus idempotent.

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
- Password untuk local development login: proposalpilot123
- Subscription: inactive, quota_total=0, quota_used=0
- Invoice: belum ada paid invoice untuk inactive subscription
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

Tambahkan script ke package.json:
"db:reset": "node scripts/reset-db.mjs"

Page requirements:
/register:
- Server Component render local registration form placeholder atau disabled form; actual register mutation dibuat di auth prompt.

/login:
- Server Component render local login form placeholder atau disabled form; actual login mutation dibuat di auth prompt.

/app:
- Server Component membaca user, subscription, quota, proposal count, recent proposals, dan status counts dari SQLite.
- Tidak ada hardcoded business metrics.

/app/billing:
- Server Component menampilkan Starter, Pro, dan Agency plans dari server-owned config.
- Membaca dan menampilkan current subscription state dari SQLite.
- Menampilkan bahwa activation belum diimplementasikan.

/app/invoices:
- Server Component render invoice table dari SQLite.
- Untuk inactive seed state, tampilkan empty invoice state dari DB.

/app/invoices/[id]:
- Server Component membaca invoice dari SQLite dan menggunakan notFound() saat missing.

/app/proposals:
- Server Component render proposal table dari SQLite.
- Menampilkan client, service, budget, status, updated timestamp.
- Setiap row link ke detail.

/app/proposals/[id]:
- Server Component membaca proposal dari SQLite.
- Menggunakan notFound() ketika proposal tidak ada.
- Render stored proposal content dan status.

/app/proposals/new:
- Server Component membaca subscription state.
- Jika inactive, tampilkan server-rendered message dan link ke billing.
- Jangan render working create form dulu.

Tests:
Update Playwright tests untuk membuktikan:
- npm run db:reset men-seed Alex Morgan.
- /app menampilkan Alex Morgan dan inactive 0/0 quota dari SQLite.
- /app/invoices menampilkan empty invoice state dari SQLite.
- /app/proposals menampilkan Urban Plant Studio.
- /app/proposals/[seeded-id] render stored proposal content.
- /app/proposals/new memblokir creation saat inactive.
- Reload tetap menampilkan seeded data.

Jalankan verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Verifikasi /app, /app/proposals, /app/proposals/new, dan minimal satu proposal detail route di browser
- Gunakan http://127.0.0.1:3047 secara lokal dan https://proposalpoint.jordi.web.id jika public subdomain reachable
- Stop server setelah verification kecuali diminta tetap running

Update docs/task-tracker.md dengan verified tasks dan proof.

Commit:
git add src scripts tests package.json package-lock.json .gitignore README.md docs
git commit -m "feat: add SQLite-backed ProposalPilot foundation"
git push -u origin checkpoint-1-foundation

Report:
- commit SHA
- exact DB path
- repository functions yang diimplementasikan
- pages yang sekarang backed by SQLite
- hasil verification commands
- runtime URL result untuk 0.0.0.0:3047 dan proposalpoint.jordi.web.id jika reachable
- konfirmasi bahwa register/login actions, checkout, proposal creation, dan status mutation belum diimplementasikan
```

---

## Prompt 4 — Implement Local Register, Login, Logout, dan Route Guards

```text
Lanjutkan dari checkpoint-1-foundation. Implementasikan local account registration, login, logout, session cookies, dan basic route guards.

Runtime requirement:
Di awal checkpoint ini, konfirmasi app bisa distart di 0.0.0.0:3047. Gunakan runtime target ini untuk browser checks melalui proposalpoint.jordi.web.id jika tersedia.

Goal:
User bisa register, login, mengakses /app hanya saat authenticated, dan logout. Ini local development auth, bukan production-grade security.

Buat atau update:
- src/lib/auth.ts
- src/app/register/actions.ts
- src/app/login/actions.ts
- src/app/app/logout/actions.ts atau equivalent logout action
- src/app/register/page.tsx
- src/app/login/page.tsx
- src/app/app/layout.tsx
- middleware.ts jika dibutuhkan untuk route guards
- Playwright tests

Requirements:
- /register render form name, email, password.
- Registration adalah Server Action dan menulis user row ke SQLite.
- Password tidak boleh disimpan plaintext. Gunakan Node crypto hashing dengan salt.
- /login render form email dan password.
- Login adalah Server Action yang validate credentials, membuat session row, dan set httpOnly cookie.
- /app routes memerlukan valid local session dan redirect unauthenticated user ke /login.
- App shell menampilkan current user's name/email dari SQLite.
- Logout clear cookie, delete atau invalidate session, dan redirect ke /login.
- Seeded Alex Morgan tetap tersedia untuk tests dengan password proposalpilot123.

Tests:
- Unauthenticated /app redirect ke /login.
- New user bisa register dan masuk ke /app atau bisa login setelah register.
- Seeded Alex Morgan bisa login.
- Logged-in dashboard menampilkan current user dari SQLite.
- Logout mencegah akses ke /app.

Jalankan verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Verifikasi register, login, /app guard, dan logout di browser
- Gunakan http://127.0.0.1:3047 secara lokal dan https://proposalpoint.jordi.web.id jika reachable
- Stop server setelah verification kecuali diminta tetap running

Update docs/task-tracker.md dengan verified auth proof.

Commit:
git add src tests package.json package-lock.json README.md docs middleware.ts
git commit -m "feat: add local account authentication"

Report:
- commit SHA
- auth files/functions
- cookie/session model summary
- test summary
- hasil verification commands
- runtime URL result untuk 0.0.0.0:3047 dan proposalpoint.jordi.web.id jika reachable
```

---

## Prompt 5 — Implement Plan Checkout dan Invoice Creation

```text
Lanjutkan dari local auth commit. Implementasikan plan checkout dan invoice creation menggunakan Server Actions.

Runtime requirement:
Di awal checkpoint ini, konfirmasi app saat ini bisa distart di 0.0.0.0:3047. Gunakan runtime target yang sama untuk manual browser checks melalui proposalpoint.jordi.web.id jika tersedia.

Goal:
Authenticated user bisa memilih plan, menjalankan local sandbox checkout, mengaktifkan subscription, dan menerima persisted invoice.

Buat atau update:
- src/app/app/billing/actions.ts
- src/app/app/billing/page.tsx
- src/app/checkout/actions.ts
- src/app/checkout/page.tsx
- src/app/app/invoices/page.tsx
- src/app/app/invoices/[id]/page.tsx
- repository functions yang dibutuhkan untuk subscription updates
- repository functions yang dibutuhkan untuk invoice creation/reads
- tests untuk checkout, subscription activation, dan invoices

Plan config:
- Starter: quota_total 10
- Pro: quota_total 50
- Agency: quota_total 200

Requirements:
- /app/billing menampilkan Starter, Pro, dan Agency plan cards.
- Setiap plan link atau submit ke /checkout?plan=PLAN.
- /checkout membutuhkan login dan menampilkan selected plan summary.
- Checkout confirmation menggunakan real Server Action.
- Server Action memvalidasi selected plan.
- Server Action menulis subscription ke SQLite:
  - plan
  - status=active
  - quota_total berdasarkan plan
  - quota_used=0
  - activated_at=now
  - updated_at=now
- Server Action memanggil revalidatePath untuk affected routes.
- Server Action membuat paid invoice row di SQLite dengan user_id, subscription_id, plan, amount_cents, currency=USD, status=paid, issued_at, dan paid_at.
- Server Action redirect setelah success.
- UI copy harus jelas menyatakan ini local sandbox activation dan tidak ada payment provider yang dihubungi.
- Reload setelah memilih Pro harus menampilkan Pro active dan quota 50/50.
- /app/invoices wajib menampilkan invoice.
- /app/invoices/[id] wajib render invoice detail dari SQLite.

Jangan implementasikan proposal creation dulu.

Tests:
Update Playwright tests untuk membuktikan:
- Reset DB dimulai dari inactive dengan 0/0.
- Visit /app/billing dan memilih Pro membuka checkout dan mengaktifkan Pro setelah confirmation.
- Checkout membuat paid invoice.
- Reload tetap Pro active.
- Dashboard menampilkan quota 50/50 setelah activation.
- /app/invoices menampilkan Pro invoice.
- Invoice detail persist setelah reload.

Jalankan verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Verifikasi /app/billing dari browser
- Activate Pro dan konfirmasi /app menampilkan 50/50 setelah reload
- Gunakan http://127.0.0.1:3047 secara lokal dan https://proposalpoint.jordi.web.id jika reachable
- Stop server setelah verification kecuali diminta tetap running

Update docs/task-tracker.md dengan verified subscription activation proof.

Commit:
git add src tests package.json package-lock.json README.md docs
git commit -m "feat: add sandbox subscription activation"

Report:
- commit SHA
- Server Action file/function
- repository function yang digunakan untuk subscription update
- invoice file/function
- test names atau test summary
- hasil verification commands
- runtime URL result untuk 0.0.0.0:3047 dan proposalpoint.jordi.web.id jika reachable
```

---

## Prompt 6 — Implement Proposal Generator dan Atomic Proposal Creation

```text
Lanjutkan dari commit checkout dan invoice. Implementasikan deterministic proposal generation dan atomic proposal creation.

Runtime requirement:
Di awal checkpoint ini, konfirmasi app bisa start di 0.0.0.0:3047. Gunakan runtime ini untuk semua manual browser checks dan untuk public subdomain proposalpoint.jordi.web.id jika reachable.

Goal:
User aktif bisa membuat proposal dari brief. Proposal content dibuat server-side, disimpan ke SQLite, quota bertambah pemakaian, dan usage event di-insert dalam satu transaction.

Buat atau update:
- src/lib/proposal-generator.ts
- src/lib/proposal-service.ts
- src/app/app/proposals/new/actions.ts
- src/app/app/proposals/new/page.tsx
- src/app/app/proposals/page.tsx
- src/app/app/proposals/[id]/page.tsx
- repository functions yang dibutuhkan untuk mutation dan reads
- Playwright tests

Generator requirements:
- Export generateProposal(input).
- Harus deterministik dan server-side.
- Tidak boleh call external APIs.
- Generated content wajib mencakup:
  - Executive Summary
  - Client Problem Recap
  - Proposed Solution
  - Scope of Work
  - Expected Outcome
  - Investment
  - Timeline
  - Next Steps

New proposal form:
- /app/proposals/new membaca subscription dari SQLite server-side.
- Jika inactive, render message dan billing link; jangan render create form.
- Jika active, render real form action={createProposal}.
- Required fields: client name, industry, service, problem, outcome, budget, tone.

Transaction requirements:
createProposalForUser(userId, input) harus menjalankan satu SQLite transaction dengan urutan:
1. Read subscription.
2. Reject jika inactive.
3. Reject jika quota_used >= quota_total.
4. Generate deterministic proposal content.
5. Insert proposal row dengan status Draft.
6. Increment quota_used tepat satu kali.
7. Insert usage_events row dengan event_type=proposal_generated dan units=1.
8. Commit.

Jika failure, rollback. Jangan pernah membuat proposal tanpa quota dan usage_event changes. Jangan pernah increment quota tanpa proposal row.

Setelah success:
- Redirect ke proposal detail.
- Proposal detail membaca stored generated content dari SQLite.
- Proposal list menampilkan proposal baru.
- Dashboard menampilkan quota berubah dari 50/50 menjadi 49/50 setelah membuat satu proposal.

Tests:
Update Playwright tests untuk membuktikan:
- Reset DB, register/login atau login sebagai seeded Alex Morgan, activate Pro melalui checkout, create Nusantara Coffee proposal.
- Generated content mencakup Executive Summary.
- Proposal detail berisi Nusantara Coffee dan stored generated content.
- Proposal list berisi Nusantara Coffee sebagai Draft.
- Dashboard quota 49/50 setelah reload.
- Inactive user tidak bisa create proposal dan tidak ada proposal baru yang di-insert.

Jalankan verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Runtime verification:
- npm run start -- --hostname 0.0.0.0 --port 3047
- Activate Pro, create Nusantara Coffee, verifikasi generated detail content, dan konfirmasi quota 49/50 setelah reload
- Gunakan http://127.0.0.1:3047 secara lokal dan https://proposalpoint.jordi.web.id jika reachable
- Stop server setelah verification kecuali diminta tetap running

Update docs/task-tracker.md dengan verified proposal creation proof.

Commit:
git add src tests package.json package-lock.json README.md docs
git commit -m "feat: add atomic proposal creation flow"

Report:
- commit SHA
- generator file/function
- transaction file/function
- routes updated
- test summary
- hasil verification commands
- runtime URL result untuk 0.0.0.0:3047 dan proposalpoint.jordi.web.id jika reachable
```

---

## Prompt 7 — Implement Proposal Status Updates dan End-to-End Flow

```text
Lanjutkan dari commit proposal creation. Implementasikan proposal status updates dan selesaikan end-to-end SaaS flow.

Runtime requirement:
Di awal checkpoint ini, konfirmasi app bisa start di 0.0.0.0:3047. Gunakan runtime target ini untuk production-mode dan public-subdomain verification.

Goal:
User bisa mengubah saved proposal status dari Draft ke Sent, dan status tetap persist setelah reload.

Buat atau update:
- src/app/app/proposals/[id]/actions.ts
- src/app/app/proposals/[id]/page.tsx
- repository function untuk status updates
- Playwright tests

Requirements:
- Proposal detail membaca content dan status dari SQLite.
- Detail page menyediakan form backed by Server Action.
- Allowed statuses: Draft, Sent, Accepted, Rejected.
- Server Action memvalidasi proposal ownership.
- Server Action memvalidasi status value.
- Server Action menyimpan status dan updated_at.
- Server Action revalidate affected routes.
- Reload setelah update Draft ke Sent harus tetap menampilkan Sent.

Full E2E test wajib membuktikan:
1. Reset DB.
2. Visit landing page.
3. Register atau login sebagai Alex Morgan.
4. Visit /app/proposals/new saat inactive dan confirm creation blocked.
5. Visit /app/billing.
6. Select Pro dan complete /checkout.
7. Reload dan confirm Pro active dengan quota 50/50.
8. Confirm /app/invoices berisi paid Pro invoice.
9. Visit /app/proposals/new.
10. Create Nusantara Coffee proposal.
11. Confirm generated content mencakup Executive Summary.
12. Confirm proposal detail menampilkan Draft.
13. Confirm dashboard menampilkan 49/50.
14. Change status ke Sent.
15. Reload detail page.
16. Confirm status tetap Sent dan quota tetap 49/50.

Jalankan verification:
- npm run db:reset
- npm run lint
- npx tsc --noEmit
- npm run build
- npm run test:e2e

Jalankan juga production-mode verification:
- npm run build
- npm run start -- --hostname 0.0.0.0 --port 3047

Gunakan running app untuk manual verify:
- inactive creation guardrail
- Pro activation 50/50
- proposal creation 49/50
- generated proposal detail
- Draft to Sent update
- reload persistence
- local URL: http://127.0.0.1:3047
- public URL jika reachable: https://proposalpoint.jordi.web.id

Update docs/task-tracker.md dengan verified status update dan end-to-end proof.

Commit di branch checkpoint-2-saas-flow:
git add src tests package.json package-lock.json README.md docs
git commit -m "feat: complete ProposalPilot SaaS flow"
git push -u origin checkpoint-2-saas-flow

Report:
- commit SHA
- status action file/function
- full E2E test summary
- hasil verification commands
- production-mode verification result
- runtime URL result untuk 0.0.0.0:3047 dan proposalpoint.jordi.web.id jika reachable
- remaining limitations jika ada
```

---

## Prompt 8 — Final Packaging dan Project Documentation

```text
Lanjutkan dari checkpoint-2-saas-flow. Package project documentation dan final verification. Jangan tambahkan product feature baru di langkah ini.

Runtime requirement:
Di awal checkpoint ini, konfirmasi final app bisa berjalan di 0.0.0.0:3047. Masukkan local URL dan public subdomain status ke final documentation.

Goal:
Repository mudah dijalankan, diverifikasi, dan dipahami.

Merge:
- Switch ke main.
- Merge checkpoint-2-saas-flow menggunakan fast-forward only.
- Jika fast-forward tidak bisa, stop dan report divergence. Jangan force-push.

Buat atau update:
- README.md
- docs/checkpoint-map.md
- docs/runbook.md
- docs/production-notes.md
- docs/proof.md

README wajib mencakup:
- product overview
- stack
- setup instructions
- database reset command
- test commands
- route list
- auth flow
- checkout dan invoice flow
- implemented features
- not implemented limitations

Implemented features list:
- SQLite-backed local demo user
- landing page dengan register/login CTAs
- local registration, login, logout, dan session cookie
- SSR dashboard/list/detail reads
- sandbox checkout dan subscription via Server Actions
- persisted invoice records dan invoice detail pages
- persisted local quota
- atomic proposal create + usage event transaction
- persisted proposal status transitions
- deterministic server-side generator
- Playwright proof for happy path and guardrail

Not implemented list:
- production-grade login/password/session security
- remote/shared production database
- real payment processor atau webhooks
- external AI provider
- multi-user authorization dan rate limits
- PDF export

docs/checkpoint-map.md wajib menjelaskan:
- checkpoint-0-baseline: route scaffold only
- checkpoint-1-foundation: SQLite reads dan server-rendered app foundation
- checkpoint-2-saas-flow: Server Actions, transaction flow, quota, status persistence
- main: packaged final project

docs/runbook.md wajib mencakup exact steps:
1. install dependencies
2. reset DB
3. run lint
4. run typecheck
5. run build
6. run E2E tests
7. start production server
8. verify app flow manually

Runbook wajib memakai production start command ini:
npm run start -- --hostname 0.0.0.0 --port 3047

Runbook wajib mencantumkan:
- local URL: http://127.0.0.1:3047
- public subdomain: https://proposalpoint.jordi.web.id

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
- hasil verification commands
- known limitations
- runtime URL status untuk http://127.0.0.1:3047 dan https://proposalpoint.jordi.web.id
- final branch dan commit SHA
```
