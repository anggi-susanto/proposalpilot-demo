# ProposalPilot Demo Runbook

## Pre-Demo Setup

- [ ] Open tracker and prompt pack.
- [ ] Open terminal in demo app repo.
- [ ] Ensure dependencies are installed.
- [ ] Ensure database is migrated/seeded.
- [ ] Ensure `.env` exists with safe demo values.
- [ ] Prepare fallback branch/state.
- [ ] Prepare screenshots/GIF/video fallback.

## Live Demo Flow

1. Show landing page.
2. Click pricing.
3. Choose Pro plan.
4. Register/login as demo user.
5. Complete mock checkout.
6. Show dashboard with active subscription and quota.
7. Create a proposal with sample client brief.
8. Generate proposal.
9. Save generated proposal.
10. Show quota decreased.
11. Update proposal status to Sent.
12. Show proposal in list/dashboard.

## Sample Proposal Brief

```text
Client: Nusantara Coffee Roasters
Industry: specialty coffee / ecommerce
Problem: Their online store traffic is growing, but conversion is low and repeat purchase is weak.
Service: Ecommerce conversion audit + landing page redesign + retention email flow
Expected outcome: improve conversion rate and repeat purchases within 60 days
Budget: $3,000–$5,000
Tone: professional and confident
```

## Backup Plan

If live AI generation fails:

1. Say: "This is exactly why production apps need graceful failure."
2. Show fallback generated proposal sample.
3. Verify that quota does not decrement on failed generation.
4. Switch to prepared state where generation succeeded.
5. Continue save/status tracking journey.

## Do Not Overclaim

- Do not call mock checkout real billing.
- Do not call local-only app public production.
- Do not pretend fallback sample is live AI output.
- Do not claim security is complete.
