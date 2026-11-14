CREATE TABLE island_cabin_environment (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 room_id TEXT NOT NULL CHECK (room_id IN ('living','bedroom')),
 state_json TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1 CHECK (revision>=1),
 updated_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,room_id)
);
