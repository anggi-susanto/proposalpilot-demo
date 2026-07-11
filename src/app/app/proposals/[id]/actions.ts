"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { updateProposalStatus } from "@/lib/proposal-service";
import type { ProposalStatus } from "@/lib/types";

export async function changeProposalStatus(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated.");

  const proposalId = formData.get("proposalId");
  const status = formData.get("status");
  if (typeof proposalId !== "string") throw new Error("Missing proposal ID.");
  if (status !== "Draft" && status !== "Sent" && status !== "Accepted" && status !== "Rejected") throw new Error("Invalid proposal status.");
  updateProposalStatus(user.id, proposalId, status as ProposalStatus);
  revalidatePath("/app");
  revalidatePath("/app/proposals");
  revalidatePath(`/app/proposals/${proposalId}`);
}
