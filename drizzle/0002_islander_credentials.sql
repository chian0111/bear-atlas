CREATE TABLE island_credentials (
  member_no INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_key TEXT NOT NULL UNIQUE REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  recovery_hash TEXT UNIQUE
);
