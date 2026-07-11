"use server";

import { redirect } from "next/navigation";

import { createProposalForUser } from "@/lib/proposal-service";
import { DEMO_USER_ID } from "@/lib/types";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} is required.`);
  return value.trim();
}

export async function createProposal(formData: FormData) {
  const proposalId = createProposalForUser(DEMO_USER_ID, {
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
