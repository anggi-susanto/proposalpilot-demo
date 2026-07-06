# Demo Acceptance Criteria

## Happy Path

- [ ] Visitor can view landing page.
- [ ] Visitor can view pricing page.
- [ ] User can register/login.
- [ ] User can choose a plan.
- [ ] User can complete mock/sandbox checkout.
- [ ] Subscription becomes active.
- [ ] User sees available quota.
- [ ] User can open create-proposal form.
- [ ] User can generate proposal from valid input.
- [ ] Generated proposal is saved.
- [ ] Quota decreases by 1 after successful generation/save.
- [ ] Proposal appears in dashboard/list.
- [ ] User can update status to Sent/Accepted/Rejected.

## Guardrails

- [ ] Unauthenticated users cannot access dashboard.
- [ ] Inactive subscription cannot generate proposal.
- [ ] Exhausted quota cannot generate proposal.
- [ ] Failed AI generation does not decrement quota.
- [ ] Proposal records are scoped to the logged-in user.

## Webinar Honesty Checks

- [ ] Mock checkout is labeled as mock/sandbox.
- [ ] Real billing/webhooks are described as next production steps.
- [ ] Any local-only deployment is labeled local-only.
- [ ] Any mocked AI fallback is labeled fallback, not live provider output.
