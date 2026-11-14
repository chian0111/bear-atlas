CREATE TABLE bear_world_looks (
  visitor_key TEXT PRIMARY KEY NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
  slots_json TEXT NOT NULL DEFAULT '{}',
  active_slot INTEGER CHECK(active_slot IS NULL OR active_slot BETWEEN 1 AND 4)
);
