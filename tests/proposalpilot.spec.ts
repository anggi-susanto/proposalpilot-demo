import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

function resetDatabase() {
  execFileSync("npm", ["run", "db:reset"], { cwd: process.cwd(), stdio: "inherit" });
}

test.beforeEach(() => resetDatabase());

test("checkpoint 2 persists sandbox subscription, quota, proposal, and status", async ({ page }) => {
  await page.goto("/app/billing");
  await expect(page.getByRole("heading", { name: /sandbox subscription/i })).toBeVisible();
  await page.locator('form:has(input[value="Pro"])').getByRole("button", { name: /complete sandbox checkout/i }).click();
  await expect(page.getByText("Pro", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("50/50", { exact: true })).toBeVisible();

  await page.goto("/app/proposals/new");
  await expect(page.getByRole("heading", { name: /create a proposal/i })).toBeVisible();
  await page.getByRole("button", { name: /generate and save proposal/i }).click();
  await expect(page.getByText(/Executive Summary/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nusantara Coffee Roasters" })).toBeVisible();

  await page.goto("/app");
  await expect(page.getByText("49/50", { exact: true })).toBeVisible();
  await page.getByText("Nusantara Coffee Roasters", { exact: true }).first().click();
  await page.getByRole("combobox").selectOption("Sent");
  await page.getByRole("button", { name: /update status/i }).click();
  await page.reload();
  await expect(page.getByRole("combobox")).toHaveValue("Sent");
  await page.goto("/app");
  await expect(page.getByText("49/50", { exact: true })).toBeVisible();
});

test("checkpoint 2 blocks proposal creation before sandbox checkout", async ({ page }) => {
  await page.goto("/app/proposals/new");
  await expect(page.getByRole("heading", { name: /activate a plan first/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /go to billing/i })).toBeVisible();
  await page.goto("/app");
  await expect(page.getByText("0/0", { exact: true })).toBeVisible();
});
