CREATE TABLE island_founder (
  slot INTEGER PRIMARY KEY CHECK (slot = 1),
  owner_key TEXT NOT NULL,
  visitor_key TEXT NOT NULL UNIQUE,
  last_issued INTEGER NOT NULL
);
