CREATE TABLE resident_quests (
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  quest_id TEXT NOT NULL CHECK (quest_id IN ('hugo','liv','ari')),
  step INTEGER NOT NULL DEFAULT 0 CHECK (step BETWEEN 0 AND 2),
  path TEXT NOT NULL DEFAULT '' CHECK (length(path)=step AND path NOT GLOB '*[^ab]*'),
  completed_at INTEGER,
  PRIMARY KEY (visitor_key,quest_id),
  CHECK ((step=2 AND completed_at IS NOT NULL) OR (step<2 AND completed_at IS NULL))
);
--> statement-breakpoint
CREATE TABLE island_cabins (
  visitor_key TEXT PRIMARY KEY NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'sage' CHECK (theme IN ('sage','cream','rose')),
  wall TEXT NOT NULL DEFAULT 'print',
  desk TEXT NOT NULL DEFAULT 'books',
  corner TEXT NOT NULL DEFAULT 'plant',
  share_enabled INTEGER NOT NULL DEFAULT 0 CHECK (share_enabled IN (0,1)),
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);
