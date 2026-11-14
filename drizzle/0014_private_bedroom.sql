CREATE TABLE island_cabin_rooms (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 room_id TEXT NOT NULL CHECK(room_id='bedroom'),
 layout_json TEXT NOT NULL,
 theme TEXT NOT NULL DEFAULT 'cream' CHECK(theme IN ('sage','cream','rose')),
 revision INTEGER NOT NULL DEFAULT 1,
 living_backup_json TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,room_id)
);
