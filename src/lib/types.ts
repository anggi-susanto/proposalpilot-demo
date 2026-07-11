export type PlanName = "Starter" | "Pro" | "Agency";
export type SubscriptionStatus = "inactive" | "active";
export type ProposalStatus = "Draft" | "Sent" | "Accepted" | "Rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: PlanName | null;
  status: SubscriptionStatus;
  quotaTotal: number;
  quotaUsed: number;
  activatedAt: string | null;
  updatedAt: string;
};

export type Proposal = {
  id: string;
  userId: string;
  clientName: string;
  industry: string;
  service: string;
  problem: string;
  outcome: string;
  budget: string;
  tone: string;
  content: string;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  totalProposals: number;
  sentProposals: number;
  acceptedProposals: number;
};

export const DEMO_USER_ID = "user_alex_morgan";
export const DEMO_USER_EMAIL = "alex@proposalpilot.local";

export const plans: Array<{ name: PlanName; price: string; quota: number }> = [
  { name: "Starter", price: "$9/mo", quota: 10 },
  { name: "Pro", price: "$29/mo", quota: 50 },
  { name: "Agency", price: "$79/mo", quota: 200 },
];

export function formatQuota(subscription: Subscription) {
  return `${Math.max(subscription.quotaTotal - subscription.quotaUsed, 0)}/${subscription.quotaTotal}`;
}
