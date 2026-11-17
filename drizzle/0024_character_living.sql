CREATE TABLE island_character_growth (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 species TEXT NOT NULL CHECK(species IN ('bear','cat','rabbit')),
 source TEXT NOT NULL,
 knowledge INTEGER NOT NULL DEFAULT 0 CHECK(knowledge BETWEEN 0 AND 10),
 adventure INTEGER NOT NULL DEFAULT 0 CHECK(adventure BETWEEN 0 AND 10),
 health INTEGER NOT NULL DEFAULT 0 CHECK(health BETWEEN 0 AND 10),
 wealth INTEGER NOT NULL DEFAULT 0 CHECK(wealth BETWEEN 0 AND 10),
 happened_at INTEGER NOT NULL,
 day TEXT NOT NULL,
 PRIMARY KEY(visitor_key,source)
);
--> statement-breakpoint
CREATE INDEX character_growth_owner ON island_character_growth(visitor_key,species,day);
--> statement-breakpoint
CREATE TABLE island_shop_styles (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 species TEXT NOT NULL CHECK(species IN ('bear','cat','rabbit')),
 outfit TEXT,
 accessory TEXT,
 PRIMARY KEY(visitor_key,species)
);
--> statement-breakpoint
CREATE TABLE island_firework_admissions (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 day TEXT NOT NULL,
 token TEXT NOT NULL UNIQUE,
 admitted_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,day)
);
--> statement-breakpoint
CREATE TRIGGER character_growth_collection AFTER INSERT ON island_collection_ledger
WHEN (NEW.kind='sell' AND NEW.item_id IN ('bread','tea','berries') AND NEW.coin_delta=0) OR (NEW.kind IN ('sell','farm_income') AND NEW.coin_delta>0) OR NEW.kind IN ('harvest','pick','catch')
BEGIN
 INSERT OR IGNORE INTO island_character_growth(visitor_key,species,source,knowledge,adventure,health,wealth,happened_at,day)
 VALUES(NEW.visitor_key,CASE (SELECT bear FROM island_passports WHERE visitor_key=NEW.visitor_key) WHEN 'cat' THEN 'cat' WHEN 'rabbit' THEN 'rabbit' ELSE 'bear' END,'collection:'||NEW.operation_id,
 CASE WHEN NEW.item_id='tea' AND NEW.kind='sell' THEN 1 ELSE 0 END,
 CASE WHEN NEW.kind IN ('harvest','pick','catch') THEN 2 ELSE 0 END,
 CASE WHEN NEW.kind='sell' AND NEW.coin_delta=0 THEN CASE NEW.item_id WHEN 'berries' THEN 3 WHEN 'bread' THEN 2 ELSE 1 END ELSE 0 END,
 CASE WHEN NEW.coin_delta>0 THEN CASE NEW.kind WHEN 'farm_income' THEN 3 ELSE 1 END ELSE 0 END,
 NEW.happened_at,date(NEW.happened_at/1000,'unixepoch','+8 hours'));
END;
--> statement-breakpoint
CREATE TRIGGER character_growth_water AFTER UPDATE OF applied_at ON island_garden_operations
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL AND NEW.kind='water'
BEGIN
 INSERT OR IGNORE INTO island_character_growth(visitor_key,species,source,adventure,happened_at,day)
 VALUES(NEW.visitor_key,CASE (SELECT bear FROM island_passports WHERE visitor_key=NEW.visitor_key) WHEN 'cat' THEN 'cat' WHEN 'rabbit' THEN 'rabbit' ELSE 'bear' END,'water:'||NEW.token,1,NEW.applied_at,date(NEW.applied_at/1000,'unixepoch','+8 hours'));
END;
--> statement-breakpoint
CREATE TRIGGER character_growth_adventure AFTER INSERT ON island_adventure_events
BEGIN
 INSERT OR IGNORE INTO island_character_growth(visitor_key,species,source,knowledge,adventure,health,happened_at,day)
 VALUES(NEW.visitor_key,CASE (SELECT bear FROM island_passports WHERE visitor_key=NEW.visitor_key) WHEN 'cat' THEN 'cat' WHEN 'rabbit' THEN 'rabbit' ELSE 'bear' END,'adventure:'||NEW.event||':'||NEW.period,
 CASE WHEN NEW.event LIKE 'economy:%' OR NEW.event LIKE 'growth:read:%' THEN 3 ELSE 0 END,
 CASE WHEN NEW.event NOT LIKE 'economy:%' AND NEW.event NOT LIKE 'growth:%' THEN 2 ELSE 0 END,
 CASE WHEN NEW.event LIKE 'growth:exercise:%' THEN 3 ELSE 0 END,
 NEW.happened_at,date(NEW.happened_at/1000,'unixepoch','+8 hours'));
END;
