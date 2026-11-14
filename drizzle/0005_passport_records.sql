CREATE INDEX sports_replies_guest_idx ON sports_replies(guest_key, updated_at DESC);
--> statement-breakpoint
CREATE TABLE island_wheel_draws (
  id TEXT PRIMARY KEY NOT NULL,
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('night','weekend')),
  title TEXT NOT NULL,
  drawn_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX island_wheel_visitor_idx ON island_wheel_draws(visitor_key, drawn_at DESC);
--> statement-breakpoint
CREATE TABLE island_pair_missions (
  token TEXT PRIMARY KEY NOT NULL,
  owner_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  partner_key TEXT REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  owner_answer TEXT,
  partner_answer TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (partner_key IS NULL OR partner_key != owner_key)
);
--> statement-breakpoint
CREATE INDEX island_pair_owner_idx ON island_pair_missions(owner_key, updated_at DESC);
--> statement-breakpoint
CREATE INDEX island_pair_partner_idx ON island_pair_missions(partner_key, updated_at DESC);
