# SaaS MVP Production Checklist

Use this as the webinar handout/checklist slide source.

## 1. Product & Scope

- [ ] Target user is explicit
- [ ] Core job-to-be-done is explicit
- [ ] Happy path can be completed by a new user
- [ ] Demo cuts are labeled as cuts, not hidden gaps
- [ ] Next iteration list exists

## 2. Identity & Access

- [ ] Register/login works
- [ ] Sessions are protected
- [ ] Authenticated routes cannot be accessed anonymously
- [ ] User data is scoped by `user_id`
- [ ] Logout works

## 3. Pricing, Subscription, Entitlement

- [ ] Pricing page clearly communicates plans
- [ ] Plan selection is persisted
- [ ] Mock/sandbox checkout has success/cancel states
- [ ] Subscription state becomes active after successful checkout
- [ ] App blocks premium actions when subscription is inactive

## 4. Quota & Usage

- [ ] Quota is displayed clearly
- [ ] Generation requires available quota
- [ ] Quota decrements only after successful generation/save
- [ ] Empty quota state explains next action
- [ ] Server-side quota check exists in real production

## 5. Core Product Value

- [ ] Proposal input form has validation
- [ ] AI generation prompt is structured
- [ ] AI failure has graceful fallback
- [ ] Generated proposal can be edited or saved
- [ ] Saved proposal appears in dashboard/list
- [ ] Proposal status can be updated

## 6. Operational Basics

- [ ] Environment variables documented
- [ ] Setup steps documented
- [ ] Database migrations/seeds documented
- [ ] Error states are visible enough to debug
- [ ] Logs do not leak secrets

## 7. Hardening After Webinar

- [ ] Replace mock checkout with real provider integration
- [ ] Add payment webhooks
- [ ] Add invoice/customer portal if needed
- [ ] Add rate limiting
- [ ] Add audit/usage ledger
- [ ] Add tests for entitlement and quota
- [ ] Add monitoring/analytics
- [ ] Add backup/export strategy
