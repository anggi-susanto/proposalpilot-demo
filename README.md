# ProposalPilot

A focused proposal workflow for freelancers, consultants, and service agencies.

ProposalPilot helps you turn a client brief into a structured proposal, manage a simple plan quota, and track the proposal from **Draft** to **Sent**, **Accepted**, or **Rejected**.

## What works today

- Register, login, logout, and protected workspace routes
- Signed HttpOnly session cookie
- Local SQLite persistence for users, subscriptions, proposals, and usage events
- Starter, Pro, and Agency plan selection
- Sandbox subscription activation
- Server-side quota enforcement
- Server-side deterministic proposal generation
- Proposal save + usage-event + quota update in one transaction
- Proposal status tracking and reload persistence
- Playwright end-to-end coverage for auth and the core proposal journey

## Quick start

### Requirements

- Node.js 24+ (the project uses Node's built-in SQLite support)
- npm

### Install and run

```bash
npm install
npm run db:reset
npm run build
npm run start -- --hostname 0.0.0.0 --port 3047
```

Open [http://127.0.0.1:3047](http://127.0.0.1:3047).

A seeded development account is available after `npm run db:reset`:

```text
Email:    alex@proposalpilot.local
Password: demo123456
```

You can also create your own account from `/auth/register`.

## Verify

```bash
npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

## Product journey

```text
Register / log in
→ choose a plan
→ complete sandbox activation
→ receive an active subscription and quota
→ create + save a proposal
→ quota decreases after a successful save
→ update lifecycle status
→ reload or log back in: data persists
```

## Participant prompt guides

Use these step-by-step prompt guides to rebuild or extend the app with an AI coding assistant:

- [Bahasa Indonesia](docs/proposalpilot-step-prompts-v3-id.md)
- [English](docs/proposalpilot-step-prompts-v3-en.md)

They are participant-facing examples, not required runtime files.

## Project structure

```text
src/app/              public landing, auth, and protected workspace routes
src/lib/              SQLite, auth/session, proposal generation, repositories
docs/                 participant step-by-step AI prompt guides
data/                 local SQLite database (generated; ignored by Git)
scripts/reset-db.mjs  reset + seed local development database
tests/                Playwright end-to-end tests
```

## Current boundaries

This repository is a functional **local SaaS vertical slice**, not a production billing platform.

Implemented locally:

- account credentials, sessions, and user-scoped data
- SQLite persistence
- quota and proposal transactions
- sandbox subscription flow

Still needed for production:

- a remote/shared database and migrations
- stronger session/security hardening and multi-user authorization policy
- payment provider integration, webhooks, invoices, and cancellation flows
- external AI provider integration
- rate limits, monitoring, backup/export, and operational controls

Sandbox activation does **not** charge a card or contact a payment provider.

## License

MIT.
