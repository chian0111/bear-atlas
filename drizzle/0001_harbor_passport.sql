CREATE TABLE trip_proposals (
  token TEXT PRIMARY KEY NOT NULL,
  owner_key TEXT NOT NULL,
  draft_key TEXT NOT NULL,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  options_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  closed INTEGER NOT NULL DEFAULT 0,
  UNIQUE(owner_key, draft_key)
);
--> statement-breakpoint
CREATE INDEX trip_proposals_owner_idx ON trip_proposals(owner_key, created_at DESC);
--> statement-breakpoint
CREATE TABLE island_passports (
  visitor_key TEXT PRIMARY KEY NOT NULL,
  nickname TEXT NOT NULL,
  bear TEXT NOT NULL,
  outfit TEXT NOT NULL,
  joined_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE trip_ballots (
  proposal_token TEXT NOT NULL REFERENCES trip_proposals(token) ON DELETE CASCADE,
  visitor_key TEXT NOT NULL,
  option_index INTEGER NOT NULL,
  cast_at INTEGER NOT NULL,
  PRIMARY KEY (proposal_token, visitor_key)
);
--> statement-breakpoint
CREATE INDEX trip_ballots_visitor_idx ON trip_ballots(visitor_key, cast_at DESC);
