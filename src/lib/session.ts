import "server-only";

import { createHmac } from "node:crypto";

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  "dev-session-secret-proposalpilot-2026-dont-use-in-production";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionPayload {
  userId: string;
  expires: number; // unix ms
}

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function encodeBase64Url(data: string): string {
  return Buffer.from(data).toString("base64url");
}

function decodeBase64Url(encoded: string): string {
  return Buffer.from(encoded, "base64url").toString("utf-8");
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    userId,
    expires: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const payloadEncoded = encodeBase64Url(JSON.stringify(payload));
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;

  const payloadEncoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(payloadEncoded);

  // constant-time comparison
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  let payload: SessionPayload;
  try {
    payload = JSON.parse(decodeBase64Url(payloadEncoded));
  } catch {
    return null;
  }

  if (typeof payload.userId !== "string" || typeof payload.expires !== "number") {
    return null;
  }

  if (Date.now() > payload.expires) return null;

  return payload;
}

function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.byteLength !== b.byteLength) return false;
  let result = 0;
  for (let i = 0; i < a.byteLength; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

export { SESSION_COOKIE, SESSION_MAX_AGE };
