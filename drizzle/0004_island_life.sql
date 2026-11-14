CREATE TABLE island_practice_answers (
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  port TEXT NOT NULL CHECK (port IN ('tasks','career','network','mba','english','finance')),
  answer TEXT NOT NULL CHECK (length(answer) BETWEEN 1 AND 800),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (visitor_key, port)
);
--> statement-breakpoint
CREATE TABLE island_board_greetings (
  visitor_key TEXT PRIMARY KEY NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  greeting TEXT NOT NULL CHECK (greeting IN ('wave','coffee','practice','travel')),
  nickname TEXT NOT NULL,
  bear TEXT NOT NULL,
  outfit TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX island_board_greetings_recent ON island_board_greetings(updated_at DESC);
--> statement-breakpoint
CREATE TABLE island_weekly_activities (
  week TEXT NOT NULL,
  activity TEXT NOT NULL CHECK (activity IN ('coffee','english','walk')),
  visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  PRIMARY KEY (week, activity, visitor_key)
);
