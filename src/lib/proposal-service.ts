import "server-only";

import { randomUUID } from "node:crypto";

import { db } from "./db";
import { generateProposal, type ProposalInput } from "./proposal-generator";
import { plans, type PlanName, type ProposalStatus } from "./types";

export function activateSandboxSubscription(userId: string, planName: PlanName) {
  const plan = plans.find((item) => item.name === planName);
  if (!plan) throw new Error("Invalid plan.");
  const now = new Date().toISOString();
  db.prepare(`UPDATE subscriptions SET plan = ?, status = 'active', quota_total = ?, quota_used = 0, activated_at = ?, updated_at = ? WHERE user_id = ?`)
    .run(plan.name, plan.quota, now, now, userId);
}

export function createProposalForUser(userId: string, input: ProposalInput) {
  const now = new Date().toISOString();
  const proposalId = randomUUID();
  const eventId = randomUUID();
  const content = generateProposal(input);
  db.exec("BEGIN IMMEDIATE");
  try {
    const subscription = db.prepare("SELECT status, quota_total, quota_used FROM subscriptions WHERE user_id = ?").get(userId) as { status: string; quota_total: number; quota_used: number } | undefined;
    if (!subscription || subscription.status !== "active") throw new Error("Choose a plan and complete sandbox checkout before generating.");
    if (subscription.quota_used >= subscription.quota_total) throw new Error("Monthly proposal quota reached.");
    db.prepare(`INSERT INTO proposals (id, user_id, client_name, industry, service, problem, outcome, budget, tone, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft', ?, ?)`)
      .run(proposalId, userId, input.clientName, input.industry, input.service, input.problem, input.outcome, input.budget, input.tone, content, now, now);
    db.prepare("UPDATE subscriptions SET quota_used = quota_used + 1, updated_at = ? WHERE user_id = ?").run(now, userId);
    db.prepare("INSERT INTO usage_events (id, user_id, proposal_id, event_type, units, created_at) VALUES (?, ?, ?, 'proposal_generated', 1, ?)").run(eventId, userId, proposalId, now);
    db.exec("COMMIT");
    return proposalId;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function updateProposalStatus(userId: string, proposalId: string, status: ProposalStatus) {
  const allowed: ProposalStatus[] = ["Draft", "Sent", "Accepted", "Rejected"];
  if (!allowed.includes(status)) throw new Error("Invalid proposal status.");
  const result = db.prepare("UPDATE proposals SET status = ?, updated_at = ? WHERE id = ? AND user_id = ?").run(status, new Date().toISOString(), proposalId, userId) as { changes?: number };
  if (!result.changes) throw new Error("Proposal not found.");
}
