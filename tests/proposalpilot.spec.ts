import { execFileSync } from "node:child_process";
import { expect, test, type Page } from "@playwright/test";

function resetDatabase() {
  execFileSync("npm", ["run", "db:reset"], { cwd: process.cwd(), stdio: "inherit" });
}

test.beforeEach(() => resetDatabase());

async function loginAsDemoUser(page: Page) {
  await page.goto("/auth/login");
  await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
  await page.getByLabel("Email").fill("alex@proposalpilot.local");
  await page.getByLabel("Password").fill("demo123456");
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/app$/);
}

test("auth: register a new user, login, and access dashboard", async ({ page }) => {
  await page.goto("/auth/register");
  await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();

  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill("test@proposalpilot.local");
  await page.getByLabel("Password").fill("testpass123");
  await page.getByRole("button", { name: /create account/i }).click();

  // Should redirect to /app dashboard
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText("Welcome back, Test User.")).toBeVisible();
  await expect(page.getByText("No active plan")).toBeVisible();
  await expect(page.getByText("0/0", { exact: true })).toBeVisible();
});

test("auth: login with demo user persists session and loads data", async ({ page }) => {
  await loginAsDemoUser(page);
  await expect(page.getByText("Welcome back, Alex Morgan.")).toBeVisible();

  // Demo seed data should be visible
  await expect(page.getByText("No active plan")).toBeVisible();
  await expect(page.getByText("2 records in SQLite")).toBeVisible();

  // Navigate to proposals
  await page.goto("/app/proposals");
  await expect(page.getByRole("heading", { name: "Urban Plant Studio" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Apex Legal Advisory" })).toBeVisible();
});

test("auth: logout redirects to login", async ({ page }) => {
  await loginAsDemoUser(page);
  await expect(page).toHaveURL(/\/app$/);

  // Click logout
  await page.getByRole("button", { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/auth\/login/);
});

test("auth: unauthenticated access to /app redirects to login", async ({ page }) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/auth\/login/);

  await page.goto("/app/billing");
  await expect(page).toHaveURL(/\/auth\/login/);

  await page.goto("/app/proposals/new");
  await expect(page).toHaveURL(/\/auth\/login/);
});

test("checkpoint 2 persists sandbox subscription, quota, proposal, and status", async ({ page }) => {
  await loginAsDemoUser(page);

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
  await loginAsDemoUser(page);

  await page.goto("/app/proposals/new");
  await expect(page.getByRole("heading", { name: /activate a plan first/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /go to billing/i })).toBeVisible();
  await page.goto("/app");
  await expect(page.getByText("0/0", { exact: true })).toBeVisible();
});

test("end-to-end: register new user → checkout → proposal → status", async ({ page }) => {
  // Register a fresh user
  await page.goto("/auth/register");
  await page.getByLabel("Name").fill("Jane Smith");
  await page.getByLabel("Email").fill("jane@proposalpilot.local");
  await page.getByLabel("Password").fill("janepass123");
  await page.getByRole("button", { name: /create account/i }).click();

  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText("Welcome back, Jane Smith.")).toBeVisible();

  // Start with no plan
  await expect(page.getByText("0/0", { exact: true })).toBeVisible();

  // Go to billing and activate Pro
  await page.goto("/app/billing");
  await page.locator('form:has(input[value="Pro"])').getByRole("button", { name: /complete sandbox checkout/i }).click();
  await expect(page.getByText("Pro", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("50/50", { exact: true })).toBeVisible();

  // Create a proposal
  await page.goto("/app/proposals/new");
  await page.getByRole("button", { name: /generate and save proposal/i }).click();
  await expect(page.getByText(/Executive Summary/)).toBeVisible();

  // Verify quota decreased
  await page.goto("/app");
  await expect(page.getByText("49/50", { exact: true })).toBeVisible();

  // Logout and login again to verify session persistence
  await page.getByRole("button", { name: /log out/i }).click();
  await expect(page).toHaveURL(/\/auth\/login/);

  await page.getByLabel("Email").fill("jane@proposalpilot.local");
  await page.getByLabel("Password").fill("janepass123");
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText("Welcome back, Jane Smith.")).toBeVisible();
  await expect(page.getByText("49/50", { exact: true })).toBeVisible();
});
