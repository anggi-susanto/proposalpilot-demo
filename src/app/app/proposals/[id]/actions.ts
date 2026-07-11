"use server";

import { revalidatePath } from "next/cache";

import { updateProposalStatus } from "@/lib/proposal-service";
import { DEMO_USER_ID, type ProposalStatus } from "@/lib/types";

export async function changeProposalStatus(formData: FormData) {
  const proposalId = formData.get("proposalId");
  const status = formData.get("status");
  if (typeof proposalId !== "string") throw new Error("Missing proposal ID.");
  if (status !== "Draft" && status !== "Sent" && status !== "Accepted" && status !== "Rejected") throw new Error("Invalid proposal status.");
  updateProposalStatus(DEMO_USER_ID, proposalId, status as ProposalStatus);
  revalidatePath("/app");
  revalidatePath("/app/proposals");
  revalidatePath(`/app/proposals/${proposalId}`);
}
