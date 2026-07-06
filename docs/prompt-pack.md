# Live Demo Prompt Pack

## Prompt 1 — Product Brief

```text
You are a senior product engineer and SaaS product strategist.

I want to build a SaaS MVP called ProposalPilot.

ProposalPilot helps freelancers, agencies, and consultants generate professional client proposals using AI.

The demo must show a credible SaaS journey:
1. Visitor sees landing page
2. Visitor sees pricing page
3. User registers/logs in
4. User chooses a plan
5. User completes mock/sandbox checkout
6. User gets active subscription and monthly quota
7. User creates a proposal from a short client brief
8. AI generates a proposal draft
9. Proposal is saved
10. Quota decreases
11. User tracks proposal status: Draft, Sent, Accepted, Rejected

Live build constraints:
- finish the demo slice in under 1 hour
- mock/sandbox checkout is acceptable
- real recurring billing and webhooks are out of scope
- prioritize happy path and honest failure states

Create a concise product brief, MVP scope, user stories, data model, and acceptance criteria.
```

## Prompt 2 — Implementation Plan

```text
Based on the ProposalPilot product brief, create an implementation plan for a full-stack SaaS MVP.

Include:
- recommended tech stack
- routes/pages
- database tables
- core components
- server-side business rules
- seed/demo data
- verification checklist
- what to mock for the live demo
- what must be production-hardened later

Optimize for a live webinar build in under 1 hour.
```

## Prompt 3 — Build Instruction

```text
Implement the ProposalPilot MVP slice.

Requirements:
- Landing page with clear SaaS value proposition
- Pricing page with Starter, Pro, and Agency plans
- Register/login or a safe demo-auth equivalent
- Plan selection
- Mock/sandbox checkout success page
- Active subscription state after checkout
- Dashboard showing plan and remaining quota
- Proposal creation form
- AI proposal generation function with graceful failure fallback
- Save generated proposal
- Quota decrement after successful generation/save
- Proposal list with status update: Draft, Sent, Accepted, Rejected
- Basic validation and empty states
- README/setup instructions

Do not implement real recurring billing, payment webhooks, invoices, admin dashboard, team workspace, forgot password, or cancellation/proration in the live demo scope. Add comments or TODOs for them as production next steps.
```

## Prompt 4 — Review / Verification

```text
Review the generated ProposalPilot app as a senior engineer.

Verify the journey:
Landing → Pricing → Register/Login → Choose Plan → Mock Checkout → Active Subscription → Quota → Generate Proposal → Save → Quota Decreases → Status Tracking

Check for:
- broken routes
- missing auth guards
- user data leakage
- subscription entitlement bugs
- quota decrement bugs
- AI failure handling
- unclear mock checkout labeling
- UI/UX issues that would hurt the webinar demo

Return a prioritized fix list with exact files/areas to change.
```

## Prompt 5 — Production Hardening

```text
List what must be added before ProposalPilot could become a real production SaaS.

Separate into:
1. Billing and webhooks
2. Auth/security
3. Quota/usage accounting
4. AI reliability and cost control
5. Data/privacy
6. Observability
7. Tests
8. Deployment/operations

Be explicit about what was mocked in the live demo.
```

## Prompt 6 — Fallback If AI Output Drifts

```text
You are drifting away from the required webinar scope.

Return to this exact journey:
Landing → Pricing → Register/Login → Choose Plan → Mock Checkout → Active Subscription → Quota → Generate Proposal → Save → Quota Decreases → Status Tracking

Do not add real billing, admin dashboards, team workspaces, invoices, forgot password, cancellation, or complex integrations.

Focus only on the smallest working demo slice that proves the SaaS journey.
```
