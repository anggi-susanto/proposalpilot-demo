import { expect, test } from "@playwright/test";

test("SSR baseline exposes blank app routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /blank ssr baseline/i })).toBeVisible();
  await page.getByRole("link", { name: /open app shell/i }).click();
  await expect(page.getByRole("heading", { name: /workspace shell/i })).toBeVisible();
  await page.getByRole("link", { name: "Billing" }).click();
  await expect(page.getByRole("heading", { name: /plan and checkout baseline/i })).toBeVisible();
  await page.getByRole("link", { name: "Proposals" }).click();
  await expect(page.getByRole("heading", { name: /proposal records baseline/i })).toBeVisible();
  await page.getByRole("link", { name: /create proposal/i }).click();
  await expect(page.getByRole("heading", { name: /proposal creation baseline/i })).toBeVisible();
});

test("proposal detail route is server-rendered", async ({ page }) => {
  await page.goto("/app/proposals/demo-123");
  await expect(page.getByRole("heading", { name: /proposal demo-123/i })).toBeVisible();
});
