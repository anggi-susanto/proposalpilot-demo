# Fallback Prompts

## If the Agent Over-Engineers

```text
Stop over-engineering. Reduce scope to the smallest working SaaS demo slice.

Keep only:
- landing
- pricing
- register/login or demo auth
- choose plan
- mock checkout
- active subscription state
- quota display
- proposal generation
- save proposal
- quota decrement
- status tracking

Move everything else to production-next-steps TODOs.
```

## If Billing Gets Too Real

```text
Do not implement real billing in this live demo.

Use a clearly labeled mock/sandbox checkout that simulates success and activates the selected plan.

Add comments/TODOs for real payment provider integration and webhooks as production next steps.
```

## If AI API Is Not Available

```text
Implement the AI proposal generator behind an abstraction.

If no API key is configured, return a clearly labeled deterministic demo proposal so the UI flow can be verified.

The UI must show that this is fallback/demo output, not live AI provider output.
```

## If Auth Takes Too Long

```text
Use a safe demo-auth flow for the webinar if full auth takes too long.

Requirements:
- authenticated dashboard state exists
- proposal records are associated with a demo user
- explain that production auth hardening is a next step

Do not pretend demo-auth is production-grade authentication.
```

## If the UI Looks Generic

```text
Improve the UI for a professional SaaS webinar demo.

Use:
- clear hero section
- polished pricing cards
- dashboard cards for plan/quota/status
- strong empty states
- consistent spacing and typography
- visible mock/sandbox labels

Keep functionality unchanged.
```
