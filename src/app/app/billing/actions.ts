"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { activateSandboxSubscription } from "@/lib/proposal-service";
import type { PlanName } from "@/lib/types";

export async function activateSubscription(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated.");

  const plan = formData.get("plan");
  if (plan !== "Starter" && plan !== "Pro" && plan !== "Agency") throw new Error("Invalid plan.");
  activateSandboxSubscription(user.id, plan as PlanName);
  revalidatePath("/app");
  revalidatePath("/app/billing");
  redirect("/app");
}
