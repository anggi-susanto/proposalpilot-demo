import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "./db";
import { hashPassword, verifyPassword } from "./password";
import { createSessionToken, verifySessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "./session";

/** Get the currently authenticated user from the session cookie. Returns null if not logged in. */
export async function getCurrentUser(): Promise<{ id: string; name: string; email: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE);
  if (!sessionCookie?.value) return null;

  const payload = verifySessionToken(sessionCookie.value);
  if (!payload) return null;

  const row = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(payload.userId) as
    | { id: string; name: string; email: string }
    | undefined;

  return row ?? null;
}

/** Require authentication; redirect to login if not authenticated. */
export async function requireAuth(): Promise<{ id: string; name: string; email: string }> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

/** Server action: register a new user with an inactive subscription. */
export async function registerUser(formData: FormData) {
  "use server";

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof name !== "string" || !name.trim()) throw new Error("Name is required.");
  if (typeof email !== "string" || !email.trim()) throw new Error("Email is required.");
  if (typeof password !== "string" || password.length < 6) throw new Error("Password must be at least 6 characters.");

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  // Check for existing user
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(trimmedEmail);
  if (existing) throw new Error("An account with this email already exists.");

  const userId = randomUUID();
  const subId = randomUUID();
  const now = new Date().toISOString();
  const passwordHash = hashPassword(password);

  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)").run(
      userId,
      trimmedName,
      trimmedEmail,
      passwordHash,
      now,
    );
    db.prepare("INSERT INTO subscriptions (id, user_id, plan, status, quota_total, quota_used, activated_at, updated_at) VALUES (?, ?, NULL, 'inactive', 0, 0, NULL, ?)").run(
      subId,
      userId,
      now,
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/app");
}

/** Server action: log in with email + password. */
export async function loginUser(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) throw new Error("Email is required.");
  if (typeof password !== "string" || !password) throw new Error("Password is required.");

  const trimmedEmail = email.trim().toLowerCase();

  const row = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(trimmedEmail) as
    | { id: string; password_hash: string }
    | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) {
    throw new Error("Invalid email or password.");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(row.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/app");
}

/** Server action: log out by deleting the session cookie. */
export async function logoutUser() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  redirect("/auth/login");
}
