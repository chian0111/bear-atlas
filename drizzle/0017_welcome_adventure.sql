CREATE TABLE island_adventure_preferences (
 visitor_key TEXT PRIMARY KEY REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 tour_status TEXT NOT NULL DEFAULT 'new' CHECK(tour_status IN ('new','active','skipped','complete')),
 tour_replay INTEGER NOT NULL DEFAULT 0 CHECK(tour_replay IN (0,1)),
 npc_enabled INTEGER NOT NULL DEFAULT 1 CHECK(npc_enabled IN (0,1))
);
--> statement-breakpoint
CREATE TABLE island_adventure_actions (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 scene TEXT NOT NULL,
 token TEXT NOT NULL,
 expires_at INTEGER NOT NULL,
 consumed_at INTEGER,
 event TEXT,
 period TEXT NOT NULL DEFAULT '',
 PRIMARY KEY(visitor_key,scene)
);
--> statement-breakpoint
CREATE TABLE island_adventure_events (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 event TEXT NOT NULL,
 period TEXT NOT NULL,
 happened_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,event,period)
);
--> statement-breakpoint
CREATE TABLE island_adventure_rewards (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 quest_id TEXT NOT NULL,
 period TEXT NOT NULL,
 claimed_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,quest_id,period)
);
--> statement-breakpoint
CREATE TABLE island_adventure_visits (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 day TEXT NOT NULL,
 resident_id TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('accepted','later','declined','complete')),
 next_at INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(visitor_key,day)
);
--> statement-breakpoint
CREATE TABLE island_custom_greetings (
 visitor_key TEXT PRIMARY KEY REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 message TEXT NOT NULL CHECK(length(message) BETWEEN 1 AND 120),
 visible INTEGER NOT NULL DEFAULT 1 CHECK(visible IN (0,1)),
 updated_at INTEGER NOT NULL
);
