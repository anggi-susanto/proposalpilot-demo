import "server-only";

import { db } from "./db";
import {
  type DashboardSummary,
  type Proposal,
  type Subscription,
  type User,
  DEMO_USER_EMAIL,
  DEMO_USER_ID,
} from "./types";

type UserRow = { id: string; name: string; email: string; created_at: string };
type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: Subscription["plan"];
  status: Subscription["status"];
  quota_total: number;
  quota_used: number;
  activated_at: string | null;
  updated_at: string;
};
type ProposalRow = {
  id: string;
  user_id: string;
  client_name: string;
  industry: string;
  service: string;
  problem: string;
  outcome: string;
  budget: string;
  tone: string;
  content: string;
  status: Proposal["status"];
  created_at: string;
  updated_at: string;
};

type SummaryRow = { total_proposals: number; sent_proposals: number; accepted_proposals: number };

function mapUser(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at };
}

function mapSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    plan: row.plan,
    status: row.status,
    quotaTotal: row.quota_total,
    quotaUsed: row.quota_used,
    activatedAt: row.activated_at,
    updatedAt: row.updated_at,
  };
}

function mapProposal(row: ProposalRow): Proposal {
  return {
    id: row.id,
    userId: row.user_id,
    clientName: row.client_name,
    industry: row.industry,
    service: row.service,
    problem: row.problem,
    outcome: row.outcome,
    budget: row.budget,
    tone: row.tone,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getDemoUser() {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(DEMO_USER_ID) as UserRow | undefined;
  return row ? mapUser(row) : null;
}

export function getDemoUserByEmail() {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(DEMO_USER_EMAIL) as UserRow | undefined;
  return row ? mapUser(row) : null;
}

export function getSubscriptionForUser(userId: string) {
  const row = db.prepare("SELECT * FROM subscriptions WHERE user_id = ?").get(userId) as SubscriptionRow | undefined;
  return row ? mapSubscription(row) : null;
}

export function listProposalsForUser(userId: string) {
  const rows = db.prepare("SELECT * FROM proposals WHERE user_id = ? ORDER BY updated_at DESC").all(userId) as ProposalRow[];
  return rows.map(mapProposal);
}

export function getProposalForUser(userId: string, proposalId: string) {
  const row = db.prepare("SELECT * FROM proposals WHERE user_id = ? AND id = ?").get(userId, proposalId) as ProposalRow | undefined;
  return row ? mapProposal(row) : null;
}

export function getDashboardSummary(userId: string): DashboardSummary {
  const row = db.prepare(`
    SELECT
      COUNT(*) AS total_proposals,
      COALESCE(SUM(CASE WHEN status = 'Sent' THEN 1 ELSE 0 END), 0) AS sent_proposals,
      COALESCE(SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END), 0) AS accepted_proposals
    FROM proposals
    WHERE user_id = ?
  `).get(userId) as SummaryRow;
  return { totalProposals: row.total_proposals, sentProposals: row.sent_proposals, acceptedProposals: row.accepted_proposals };
}

export function hasSampleRecords(userId: string) {
  return listProposalsForUser(userId).length > 0;
}

export function getProposalByClientName(userId: string, clientName: string) {
  const row = db.prepare("SELECT * FROM proposals WHERE user_id = ? AND client_name = ?").get(userId, clientName) as ProposalRow | undefined;
  return row ? mapProposal(row) : null;
}

export function closeDatabaseForTests() {
  // Node's SQLite handle is deliberately kept process-wide in application runtime.
  // The test reset command runs in a fresh process and removes the file before use.
}
