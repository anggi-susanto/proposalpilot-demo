import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";

function resetDatabase() {
  execFileSync("npm", ["run", "db:reset"], { cwd: process.cwd(), stdio: "inherit" });
}

test.beforeEach(() => resetDatabase());

test("checkpoint 1 server-renders SQLite-backed workspace data", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByRole("heading", { name: /welcome back, alex morgan/i })).toBeVisible();
  await expect(page.getByText("0/0", { exact: true })).toBeVisible();
  await expect(page.getByText("Urban Plant Studio", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: /open proposals/i }).click();
  await expect(page.getByRole("heading", { name: /database-backed proposal records/i })).toBeVisible();
  await page.getByText("Urban Plant Studio", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "Urban Plant Studio" })).toBeVisible();
  await expect(page.getByText(/sample record: urban plant studio/i)).toBeVisible();
});

test("checkpoint 1 billing reads inactive subscription from SQLite", async ({ page }) => {
  await page.goto("/app/billing");
  await expect(page.getByText(/current database state: inactive/i)).toBeVisible();
  await expect(page.getByText("50 proposals/month", { exact: true })).toBeVisible();
  await expect(page.getByText(/sandbox activation is intentionally added in checkpoint 2/i)).toBeVisible();
});
