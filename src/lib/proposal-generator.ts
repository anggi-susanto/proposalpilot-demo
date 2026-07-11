import "server-only";

export type ProposalInput = {
  clientName: string;
  industry: string;
  service: string;
  problem: string;
  outcome: string;
  budget: string;
  tone: string;
};

export function generateProposal(input: ProposalInput) {
  return `Executive Summary\n${input.clientName} can improve results across its ${input.industry.toLowerCase()} workflow through a focused ${input.service.toLowerCase()} engagement.\n\nClient Problem Recap\n${input.problem}\n\nProposed Solution\nWe will identify the highest-friction moments, prioritize the strongest conversion opportunities, and deliver a focused implementation plan in a ${input.tone.toLowerCase()} voice.\n\nScope of Work\n1. Discovery and conversion audit\n2. Messaging and workflow recommendations\n3. Prioritized implementation plan\n4. Measurement and iteration checklist\n\nExpected Outcome\n${input.outcome}\n\nInvestment\nThe proposed investment is ${input.budget}.\n\nTimeline\nA focused first delivery can be completed within 2–4 weeks after discovery.\n\nNext Steps\nConfirm the brief, schedule discovery, and approve the implementation scope.`;
}
