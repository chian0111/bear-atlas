CREATE TABLE island_economy_quests(
 visitor_key TEXT PRIMARY KEY REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 version TEXT NOT NULL,period INTEGER NOT NULL,snapshot_json TEXT NOT NULL,
 step INTEGER NOT NULL DEFAULT 0 CHECK(step BETWEEN 0 AND 5),
 answer TEXT CHECK(answer IS NULL OR answer IN ('supply','demand','unsure')),
 last_token TEXT,started_at INTEGER NOT NULL,
 FOREIGN KEY(version,period) REFERENCES island_economy_snapshots(version,period)
);
--> statement-breakpoint
CREATE TABLE island_economy_news(
 version TEXT NOT NULL,period INTEGER NOT NULL,template_version TEXT NOT NULL,
 article_json TEXT NOT NULL,created_at INTEGER NOT NULL,
 PRIMARY KEY(version,period),FOREIGN KEY(version,period) REFERENCES island_economy_snapshots(version,period)
);
--> statement-breakpoint
CREATE TRIGGER economy_news_immutable_update BEFORE UPDATE ON island_economy_news BEGIN SELECT RAISE(ABORT,'immutable news');END;
--> statement-breakpoint
CREATE TRIGGER economy_news_immutable_delete BEFORE DELETE ON island_economy_news BEGIN SELECT RAISE(ABORT,'immutable news');END;
--> statement-breakpoint
CREATE TRIGGER economy_quest_pinned BEFORE UPDATE OF version,period,snapshot_json,started_at ON island_economy_quests BEGIN SELECT RAISE(ABORT,'pinned quest case');END;
