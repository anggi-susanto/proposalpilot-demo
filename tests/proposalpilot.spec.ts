import { expect, test } from "@playwright/test";

test("ProposalPilot SaaS journey works end-to-end", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /generate client proposals/i })).toBeVisible();
  await expect(page.getByText("Landing", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Choose Pro" }).click();
  await expect(page.locator("#checkout").getByRole("heading", { name: "Pro" })).toBeVisible();
  await expect(page.getByText("$29/mo · 50 proposals/month")).toBeVisible();

  await page.getByRole("button", { name: /complete mock checkout/i }).click();
  await expect(page.getByText("Demo user", { exact: true })).toBeVisible();
  await expect(page.getByText("Pro active", { exact: true })).toBeVisible();
  await expect(page.locator("#app").getByText("50/50", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /generate \+ save proposal/i }).click();
  await expect(page.locator("#app").getByText("49/50", { exact: true })).toBeVisible();
  await expect(page.getByText("Nusantara Coffee Roasters").last()).toBeVisible();
  await expect(page.getByText("Generated with ProposalPilot demo mode on the Pro plan.")).toBeVisible();

  await page.getByRole("combobox").selectOption("Sent");
  await expect(page.getByRole("combobox")).toHaveValue("Sent");
  await expect(page.getByText("Step 7").locator("..")).toContainText("Verified");
});

test("AI generation is guarded before mock checkout", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /generate \+ save proposal/i }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: /generate \+ save proposal/i })).toBeDisabled();
  await expect(page.getByText(/register\/login, complete mock checkout/i)).toBeVisible();
});
