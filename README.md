# ProposalPilot — Real SaaS Live-Build Baseline

Repository pendamping webinar **From Prompt to Production: Building SaaS with AI in Under 1 Hour**.

> Status saat ini: **true Next.js SSR baseline**. Ini sengaja kosong dari flow SaaS palsu. Implementasi live berikutnya dibangun lewat checkpoint yang server-side dan database-backed.

## Webinar contract

Webinar tidak akan membuktikan "halaman yang kelihatan seperti SaaS". Target build adalah satu vertical slice yang bisa diaudit:

```text
Idea
→ plan + acceptance criteria
→ SSR baseline
→ SQLite schema + server-rendered reads
→ sandbox subscription via Server Action
→ persisted quota
→ proposal create transaction
→ saved record
→ Draft → Sent status
→ reload persistence
→ E2E verification
```

Sandbox checkout dan deterministic proposal generator akan diberi label jujur. Keduanya bukan payment provider atau external AI provider.

## Current checkpoint state

| Branch | Meaning |
|---|---|
| `checkpoint-0-baseline` | True SSR route scaffold, no fake SaaS flow |
| `checkpoint-1-ui-shell` | Planned: SQLite-backed SSR reads and seeded data |
| `checkpoint-2-working-saas-flow` | Planned: Server Actions, local subscription/quota, persisted proposal flow |
| `main` | Current attendee baseline and live-build prompt pack |

> Historical branch names may predate this truth contract. Treat `docs/live-build-master-prompt.md` as the current checkpoint specification.

## Routes in the SSR baseline

```text
/                         public baseline
/app                      workspace shell
/app/billing              billing baseline
/app/proposals            proposal list baseline
/app/proposals/new        proposal creation baseline
/app/proposals/[id]       dynamic server-rendered detail baseline
```

## Run locally

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3047
```

Open `http://127.0.0.1:3047`.

## Verify the current baseline

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

## Live build guide

Read these in order:

1. [`docs/live-build-master-prompt.md`](docs/live-build-master-prompt.md) — one master prompt from idea to final checkpoint proof
2. [`docs/checkpoint-build-prompts.md`](docs/checkpoint-build-prompts.md) — prompt sections and timing map per checkpoint

## Honest scope today

Not implemented in the baseline:

- authentication/session security
- database persistence
- payment provider or webhooks
- subscription/entitlement ledger
- proposal creation or status workflow
- external AI provider
- PDF export

Those are built during the checkpointed live implementation, not implied by a polished static interface.

## License

MIT.
