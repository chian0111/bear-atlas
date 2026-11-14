CREATE TABLE island_life_stories (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('visit','event')),
 period TEXT NOT NULL,
 story_id TEXT NOT NULL,
 step INTEGER NOT NULL DEFAULT 0 CHECK(step BETWEEN 0 AND 2),
 path TEXT NOT NULL DEFAULT '' CHECK(length(path)=step AND path NOT GLOB '*[^ab]*'),
 completed_at INTEGER,
 PRIMARY KEY(visitor_key,kind,period),
 CHECK((step=2 AND completed_at IS NOT NULL) OR (step<2 AND completed_at IS NULL))
);
