CREATE TABLE island_square_residents (
  visitor_key TEXT PRIMARY KEY NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE island_meetups (
  id TEXT PRIMARY KEY NOT NULL,
  host_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 48),
  category TEXT NOT NULL CHECK (category IN ('sports','culture','food','learning','other')),
  starts_at INTEGER NOT NULL,
  venue TEXT NOT NULL CHECK (length(venue) BETWEEN 1 AND 80),
  details TEXT NOT NULL CHECK (length(details) <= 280),
  capacity INTEGER NOT NULL CHECK (capacity BETWEEN 2 AND 20),
  cancelled INTEGER NOT NULL DEFAULT 0 CHECK (cancelled IN (0,1))
);
--> statement-breakpoint
CREATE INDEX island_meetups_upcoming ON island_meetups(starts_at,id);
--> statement-breakpoint
CREATE TABLE island_meetup_guests (
  meetup_id TEXT NOT NULL REFERENCES island_meetups(id) ON DELETE CASCADE,
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  PRIMARY KEY (meetup_id,visitor_key)
);
