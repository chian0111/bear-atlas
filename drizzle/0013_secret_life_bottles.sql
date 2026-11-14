CREATE TABLE island_secret_memories (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 resident TEXT NOT NULL CHECK(resident IN ('hugo','liv','ari')),
 phase TEXT NOT NULL CHECK(phase IN ('morning','afternoon','evening','night')),
 choice TEXT NOT NULL CHECK(choice IN ('a','b')),
 discovered_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,resident,phase)
);
--> statement-breakpoint
CREATE TABLE island_bottles (
 id TEXT PRIMARY KEY NOT NULL,
 creator_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 theme TEXT NOT NULL CHECK(theme IN ('warm','explore','wish')),
 day TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1 CHECK(revision BETWEEN 1 AND 6),
 current_stop TEXT NOT NULL CHECK(current_stop IN ('dock','travel','sports','mba')),
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL,
 closed_at INTEGER,
 UNIQUE(creator_key,day),
 CHECK((revision=6 AND closed_at IS NOT NULL) OR (revision<6 AND closed_at IS NULL))
);
--> statement-breakpoint
CREATE TABLE island_bottle_segments (
 bottle_id TEXT NOT NULL REFERENCES island_bottles(id) ON DELETE CASCADE,
 seq INTEGER NOT NULL CHECK(seq BETWEEN 1 AND 6),
 writer_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 phrase INTEGER NOT NULL CHECK(phrase BETWEEN 0 AND 3),
 from_stop TEXT NOT NULL CHECK(from_stop IN ('dock','travel','sports','mba')),
 to_stop TEXT NOT NULL CHECK(to_stop IN ('dock','travel','sports','mba')),
 day TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 PRIMARY KEY(bottle_id,seq),
 UNIQUE(bottle_id,writer_key)
);
--> statement-breakpoint
CREATE INDEX island_bottle_writer_day ON island_bottle_segments(writer_key,day);
--> statement-breakpoint
CREATE INDEX island_bottle_drifting ON island_bottles(closed_at,updated_at);
