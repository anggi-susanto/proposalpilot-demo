"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { createProposalForUser } from "@/lib/proposal-service";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} is required.`);
  return value.trim();
}

export async function createProposal(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated.");

  const proposalId = createProposalForUser(user.id, {
    clientName: field(formData, "clientName"),
    industry: field(formData, "industry"),
    service: field(formData, "service"),
    problem: field(formData, "problem"),
    outcome: field(formData, "outcome"),
    budget: field(formData, "budget"),
    tone: field(formData, "tone"),
  });
  redirect(`/app/proposals/${proposalId}`);
}
