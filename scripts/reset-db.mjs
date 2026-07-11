import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync } from "node:crypto";

const file = join(process.cwd(), "data", "proposalpilot.sqlite");
mkdirSync(dirname(file), { recursive: true });
const db = new DatabaseSync(file);
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS subscriptions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, plan TEXT, status TEXT NOT NULL, quota_total INTEGER NOT NULL DEFAULT 0, quota_used INTEGER NOT NULL DEFAULT 0, activated_at TEXT, updated_at TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id));
  CREATE TABLE IF NOT EXISTS proposals (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, client_name TEXT NOT NULL, industry TEXT NOT NULL, service TEXT NOT NULL, problem TEXT NOT NULL, outcome TEXT NOT NULL, budget TEXT NOT NULL, tone TEXT NOT NULL, content TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id));
  CREATE TABLE IF NOT EXISTS usage_events (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, proposal_id TEXT, event_type TEXT NOT NULL, units INTEGER NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (proposal_id) REFERENCES proposals(id));
  DELETE FROM usage_events;
  DELETE FROM proposals;
  DELETE FROM subscriptions;
  DELETE FROM users;
`);

// Hash password for demo seed user (password: "demo123456")
const salt = randomBytes(16).toString("hex");
const derived = scryptSync("demo123456", salt, 64).toString("hex");
const passwordHash = `${salt}:${derived}`;

const now = "2026-07-11T09:00:00.000Z";
db.prepare("INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)").run(
  "user_alex_morgan",
  "Alex Morgan",
  "alex@proposalpilot.local",
  passwordHash,
  now,
);
db.prepare("INSERT INTO subscriptions (id, user_id, plan, status, quota_total, quota_used, activated_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
  "sub_alex",
  "user_alex_morgan",
  null,
  "inactive",
  0,
  0,
  null,
  now,
);
const insert = db.prepare("INSERT INTO proposals (id, user_id, client_name, industry, service, problem, outcome, budget, tone, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
insert.run("proposal_urban", "user_alex_morgan", "Urban Plant Studio", "Home decor ecommerce", "Landing page refresh + abandoned cart email sequence", "Strong Instagram traffic but low mobile conversion.", "Lift checkout conversion and recover lost carts.", "$4,500", "Warm and strategic", "Sample record: Urban Plant Studio conversion sprint.", "Sent", now, now);
insert.run("proposal_apex", "user_alex_morgan", "Apex Legal Advisory", "Boutique legal services", "Website messaging audit and lead magnet funnel", "High referral traffic, weak online inquiry conversion.", "Turn expertise into a clearer consultation pipeline.", "$7,000", "Executive and precise", "Sample record: Apex Legal Advisory funnel proposal.", "Accepted", now, now);
db.close();
console.log(`Reset and seeded ${file}`);
