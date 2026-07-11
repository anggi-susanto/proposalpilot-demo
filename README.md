# ProposalPilot — Real SaaS Vertical Slice

Companion repository for **From Prompt to Production: Building SaaS with AI in Under 1 Hour**.

ProposalPilot turns a short client brief into a structured proposal for freelancers, agencies, and consultants.

## What is real in checkpoint 2

This is a local, database-backed SaaS vertical slice:

```text
SQLite user/subscription/proposal/usage-event records
→ server-rendered dashboard and proposal pages
→ sandbox subscription Server Action
→ persisted quota
→ deterministic server-side proposal generator
→ proposal create transaction
→ persisted Draft → Sent status update
→ page reload persistence
→ Playwright proof
```

The source of truth is `data/proposalpilot.sqlite`, not browser localStorage or React-only state.

## Checkpoint branches

| Branch | Actual meaning |
|---|---|
| `checkpoint-0-baseline` | True empty Next.js SSR route scaffold; no product flow |
| `checkpoint-1-ui-shell` | SQLite schema, seeded demo records, Server Component database reads |
| `checkpoint-2-working-saas-flow` | Server Actions for sandbox subscription, quota, proposal creation, and status persistence |
| `main` | Current verified checkpoint 2 plus attendee docs/prompt pack |

## Run locally

```bash
npm install
npm run db:reset
npm run build
npm run start -- --hostname 0.0.0.0 --port 3047
```

Open `http://127.0.0.1:3047`.

## Verify

```bash
npm run db:reset
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

## Live demo journey

```text
/app/billing
→ choose Pro
→ Complete Sandbox Checkout
→ /app shows Pro active and 50/50
→ /app/proposals/new
→ Generate and Save Proposal
→ proposal detail shows generated content
→ /app shows 49/50
→ change Draft to Sent
→ reload confirms Sent + 49/50 persist
```

## Honest boundaries

Implemented:

- local SQLite persistence
- server-rendered reads
- Server Action writes
- local sandbox subscription
- quota transaction with proposal record and usage event
- deterministic server-side generator

Not implemented:

- real login/password/session security
- remote/shared production database
- payment processor, payment webhooks, invoices
- external AI provider
- multi-user authorization, rate limits, monitoring
- PDF export

Sandbox checkout creates a local development subscription. It does not charge a card or contact a payment provider.

## Webinar prompt pack

- [`docs/live-build-master-prompt.md`](docs/live-build-master-prompt.md) — end-to-end idea → plan → CP0 → CP1 → verify → CP2 → verify → final prompt
- [`docs/checkpoint-build-prompts.md`](docs/checkpoint-build-prompts.md) — checkpoint prompts and timing map

## License

MIT.
