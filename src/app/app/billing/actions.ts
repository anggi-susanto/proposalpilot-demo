"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { activateSandboxSubscription } from "@/lib/proposal-service";
import { DEMO_USER_ID, type PlanName } from "@/lib/types";

export async function activateSubscription(formData: FormData) {
  const plan = formData.get("plan");
  if (plan !== "Starter" && plan !== "Pro" && plan !== "Agency") throw new Error("Invalid plan.");
  activateSandboxSubscription(DEMO_USER_ID, plan as PlanName);
  revalidatePath("/app");
  revalidatePath("/app/billing");
  redirect("/app");
}
