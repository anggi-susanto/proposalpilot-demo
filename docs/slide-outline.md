# Slide Deck Outline

## 1. Title

**From Prompt to Production**  
Building SaaS with AI in Under 1 Hour

Speaker: Anggi Susanto  
Principal Engineer / Backend Platform Leader / AI Solution Designer

## 2. Opening Hook

**Masih nunggu invoice cair baru semangat ngoding?** 💀

In the AI era, developers do not have to only wait for projects to arrive.

## 3. The Shift

Old mode:

```text
Wait for client/project → code → invoice → repeat
```

New mode:

```text
Find painful workflow → build SaaS slice → validate → iterate → market
```

## 4. What We’ll Prove Tonight

We will turn one idea into an AI-powered SaaS journey:

```text
Idea → Workflow → Build → Verify → Ship
```

Not a unicorn. Not a toy. A credible MVP slice.

## 5. What Counts as SaaS?

A SaaS slice needs more than a generated app:

- landing: what is it?
- pricing: how is value packaged?
- account: who uses it?
- plan/checkout: how access starts
- entitlement: what user can do
- quota: usage model
- core value: useful workflow
- saved data/status: continuity

## 6. Demo Product

**ProposalPilot**  
AI proposal-generator SaaS for freelancers, agencies, and consultants.

Why this demo works:

- pain is familiar
- value is obvious
- workflow is SaaS-like
- AI output is visible
- product can be packaged and sold

## 7. Required Demo Journey

```text
Landing
→ Pricing
→ Register/Login
→ Choose Plan
→ Mock/Sandbox Checkout
→ Subscription Active
→ Quota Available
→ Generate Proposal
→ Save Proposal
→ Quota Decreases
→ Track Status
```

## 8. The Framework

# PROBLEM → WORKFLOW → BUILD → VERIFY → SHIP

| Step | Output |
|---|---|
| Problem | Painful workflow worth solving |
| Workflow | User journey + SaaS rules |
| Build | Working MVP slice |
| Verify | Checklist + tests + demo proof |
| Ship | Demo URL/runbook + next hardening steps |

## 9. Prompt Like a Product Builder

Bad prompt:

```text
Build me a SaaS proposal generator.
```

Better prompt includes:

- who the user is
- what pain they have
- the end-to-end workflow
- SaaS business rules
- quota/entitlement
- acceptance criteria
- failure states

## 10. Architecture

```text
Visitor
  ↓
Landing + Pricing
  ↓
Auth / Demo User
  ↓
Plan + Mock Checkout
  ↓
Subscription + Quota
  ↓
Proposal Workflow
  ↓
AI Proposal Generator
  ↓
Saved Proposals + Status
```

## 11. Live Demo Start

We ask AI for:

- product brief
- user stories
- SaaS journey
- data model
- implementation plan
- verification checklist

Then we build the smallest slice that proves the promise.

## 12. Verification Checklist

The demo is only successful if:

- user can register/login or enter demo-auth state
- user can choose plan and pass mock checkout
- subscription becomes active
- quota is visible
- AI proposal can be generated and saved
- quota decreases
- status can be updated

## 13. Speed Without Quality Collapse

Fast does not mean careless.

Quality guardrails:

- acceptance criteria before build
- scoped live demo cuts
- lint/build/test
- happy-path verification
- honest fallback behavior
- production-hardening notes

## 14. What We Intentionally Cut

These are production next steps, not live build scope:

- real recurring billing
- payment webhooks
- invoices
- admin dashboard
- team workspace
- forgot password
- cancellation/proration

## 15. Production Checklist

- env vars
- migrations/seeds
- auth/session safety
- server-side entitlement checks
- quota ledger
- error handling
- logging/monitoring
- rate limiting
- tests
- backup/export plan

## 16. What AI Gets Wrong

- invents APIs/packages
- misses auth/security boundaries
- over-engineers small MVPs
- creates inconsistent UI
- ignores edge cases
- sounds confident while wrong

## 17. Key Takeaway

**AI accelerates execution, not accountability.**

Developers still own:

- product judgment
- scope
- quality
- verification
- shipping decisions

## 18. Closing CTA

This week:

1. Stop waiting for the perfect project.
2. Pick one painful workflow.
3. Write the smallest SaaS journey.
4. Define acceptance criteria.
5. Use AI to build, verify, and ship a tiny product slice.

Because in the AI era, the winning developer is not only the fastest project executor — but the one brave enough to build their own product.

## 19. Q&A

Seed topics:

- stack choice
- SaaS idea selection
- billing sandbox vs mock
- AI provider choice
- deployment options
- monetization and validation
- production hardening
