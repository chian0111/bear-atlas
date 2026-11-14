CREATE TABLE bear_world_islands (
  island_id TEXT PRIMARY KEY NOT NULL,
  owner_key TEXT NOT NULL UNIQUE REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  name TEXT NOT NULL,
  welcome TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'private' CHECK(mode IN ('private','invite','password','public')),
  password_hash TEXT,
  password_salt TEXT,
  password_revision INTEGER NOT NULL DEFAULT 0,
  access_days INTEGER NOT NULL DEFAULT 1,
  area_mask INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE bear_world_grants (
  island_id TEXT NOT NULL REFERENCES bear_world_islands(island_id) ON DELETE CASCADE,
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK(method IN ('invite','password','blocked')),
  expires_at INTEGER NOT NULL,
  password_revision INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(island_id, visitor_key)
);
--> statement-breakpoint
CREATE TABLE bear_world_attempts (
  island_id TEXT NOT NULL REFERENCES bear_world_islands(island_id) ON DELETE CASCADE,
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  time_bucket INTEGER NOT NULL,
  network_key TEXT NOT NULL,
  attempts INTEGER NOT NULL,
  PRIMARY KEY(island_id, visitor_key, time_bucket)
);
--> statement-breakpoint
CREATE INDEX bear_world_attempts_net ON bear_world_attempts(island_id, time_bucket, network_key);
--> statement-breakpoint
CREATE INDEX bear_world_attempts_gc ON bear_world_attempts(time_bucket);
--> statement-breakpoint
CREATE TABLE bear_world_visits (
  island_id TEXT NOT NULL REFERENCES bear_world_islands(island_id) ON DELETE CASCADE,
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  first_visit_at INTEGER NOT NULL,
  PRIMARY KEY(island_id, visitor_key)
);
--> statement-breakpoint
CREATE INDEX bear_world_visits_passport ON bear_world_visits(visitor_key, first_visit_at DESC);
