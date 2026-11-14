CREATE TABLE island_bedroom_layouts (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 room_id TEXT NOT NULL CHECK(room_id='bedroom'),
 theme TEXT NOT NULL CHECK(theme IN ('cream','sage','rose')),
 revision INTEGER NOT NULL DEFAULT 1,
 migrated INTEGER NOT NULL DEFAULT 0 CHECK(migrated IN (0,1)),
 legacy_backup_json TEXT NOT NULL,
 write_token TEXT NOT NULL DEFAULT '',
 PRIMARY KEY(visitor_key,room_id)
);
CREATE TABLE island_bedroom_instances (
 visitor_key TEXT NOT NULL,
 room_id TEXT NOT NULL CHECK(room_id='bedroom'),
 id TEXT NOT NULL,
 furniture_type TEXT NOT NULL,
 x REAL NOT NULL, y REAL NOT NULL,
 rotation INTEGER NOT NULL CHECK(rotation BETWEEN 0 AND 3),
 layer REAL NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,room_id,id),
 FOREIGN KEY(visitor_key,room_id) REFERENCES island_bedroom_layouts(visitor_key,room_id) ON DELETE CASCADE
);
