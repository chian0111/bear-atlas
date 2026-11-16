CREATE TABLE island_collection_wallets (
 visitor_key TEXT PRIMARY KEY REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 coins INTEGER NOT NULL DEFAULT 0 CHECK(typeof(coins)='integer' AND coins BETWEEN 0 AND 1000000)
);
--> statement-breakpoint
CREATE TABLE island_collection_inventory (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 item_id TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK(typeof(quantity)='integer' AND quantity BETWEEN 0 AND 999),
 first_at INTEGER NOT NULL,
 PRIMARY KEY(visitor_key,item_id)
);
--> statement-breakpoint
CREATE TABLE island_collection_spawns (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 day TEXT NOT NULL,
 scene TEXT NOT NULL CHECK(scene IN ('beach','forest')),
 slot INTEGER NOT NULL CHECK(slot BETWEEN 0 AND 5),
 item_id TEXT NOT NULL,
 claimed_at INTEGER,
 PRIMARY KEY(visitor_key,day,scene,slot)
);
--> statement-breakpoint
CREATE TABLE island_collection_operations (
 token TEXT PRIMARY KEY,
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('pick','sell','buy','craft','gift','display','clear','reward')),
 item_id TEXT,
 material_id TEXT,
 material_count INTEGER NOT NULL DEFAULT 0 CHECK(material_count BETWEEN 0 AND 10),
 coin_delta INTEGER NOT NULL DEFAULT 0 CHECK(coin_delta BETWEEN -100 AND 100),
 target_key TEXT REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 reference TEXT NOT NULL,
 scene TEXT,
 slot INTEGER,
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 applied_at INTEGER
);
--> statement-breakpoint
CREATE INDEX collection_pending_owner ON island_collection_operations(visitor_key,expires_at);
--> statement-breakpoint
CREATE TABLE island_collection_displays (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 slot INTEGER NOT NULL CHECK(slot BETWEEN 1 AND 4),
 item_id TEXT NOT NULL,
 PRIMARY KEY(visitor_key,slot),
 FOREIGN KEY(visitor_key,item_id) REFERENCES island_collection_inventory(visitor_key,item_id)
);
--> statement-breakpoint
CREATE TABLE island_collection_ledger (
 operation_id TEXT PRIMARY KEY,
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 kind TEXT NOT NULL,
 item_id TEXT,
 quantity_delta INTEGER NOT NULL DEFAULT 0,
 coin_delta INTEGER NOT NULL DEFAULT 0,
 reference TEXT NOT NULL,
 peer_key TEXT,
 happened_at INTEGER NOT NULL,
 UNIQUE(visitor_key,kind,reference)
);
--> statement-breakpoint
CREATE INDEX collection_ledger_owner ON island_collection_ledger(visitor_key,happened_at);
--> statement-breakpoint
CREATE TRIGGER collection_validate BEFORE UPDATE OF applied_at ON island_collection_operations
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM island_collection_wallets WHERE visitor_key=NEW.visitor_key AND coins+NEW.coin_delta>=0) THEN RAISE(ABORT,'collection_unavailable') END;
 SELECT CASE WHEN NEW.kind='pick' AND NOT EXISTS(SELECT 1 FROM island_collection_spawns WHERE visitor_key=NEW.visitor_key AND day=substr(NEW.reference,1,10) AND scene=NEW.scene AND slot=NEW.slot AND item_id=NEW.item_id AND claimed_at IS NULL) THEN RAISE(ABORT,'collection_unavailable') END;
 SELECT CASE WHEN NEW.kind IN ('sell','gift') AND COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id=NEW.item_id),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id=NEW.item_id)<1 THEN RAISE(ABORT,'collection_unavailable') END;
 SELECT CASE WHEN NEW.kind='gift' AND (NEW.target_key IS NULL OR NEW.target_key=NEW.visitor_key) THEN RAISE(ABORT,'collection_unavailable') END;
 SELECT CASE WHEN NEW.kind='craft' AND COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id=NEW.material_id),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id=NEW.material_id)<NEW.material_count THEN RAISE(ABORT,'collection_unavailable') END;
 SELECT CASE WHEN NEW.kind='display' AND COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id=NEW.item_id),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id=NEW.item_id AND slot<>NEW.slot)<1 THEN RAISE(ABORT,'collection_unavailable') END;
 SELECT CASE WHEN NEW.kind='reward' AND NOT EXISTS(SELECT 1 FROM island_adventure_rewards WHERE visitor_key=NEW.visitor_key AND quest_id||'@'||period=NEW.reference) THEN RAISE(ABORT,'collection_unavailable') END;
END;
--> statement-breakpoint
CREATE TRIGGER collection_apply AFTER UPDATE OF applied_at ON island_collection_operations
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 UPDATE island_collection_wallets SET coins=coins+NEW.coin_delta WHERE visitor_key=NEW.visitor_key;
 UPDATE island_collection_spawns SET claimed_at=NEW.applied_at WHERE NEW.kind='pick' AND visitor_key=NEW.visitor_key AND day=substr(NEW.reference,1,10) AND scene=NEW.scene AND slot=NEW.slot;
 UPDATE island_collection_inventory SET quantity=quantity-1 WHERE NEW.kind IN ('sell','gift') AND visitor_key=NEW.visitor_key AND item_id=NEW.item_id;
 UPDATE island_collection_inventory SET quantity=quantity-NEW.material_count WHERE NEW.kind='craft' AND visitor_key=NEW.visitor_key AND item_id=NEW.material_id;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.visitor_key,NEW.item_id,1,NEW.applied_at WHERE NEW.kind IN ('pick','buy','craft') ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+1;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.target_key,NEW.item_id,1,NEW.applied_at WHERE NEW.kind='gift' ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+1;
 DELETE FROM island_collection_displays WHERE NEW.kind IN ('display','clear') AND visitor_key=NEW.visitor_key AND slot=NEW.slot;
 INSERT INTO island_collection_displays(visitor_key,slot,item_id) SELECT NEW.visitor_key,NEW.slot,NEW.item_id WHERE NEW.kind='display';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) VALUES(NEW.token,NEW.visitor_key,NEW.kind,NEW.item_id,CASE WHEN NEW.kind IN ('pick','buy','craft') THEN 1 WHEN NEW.kind IN ('sell','gift') THEN -1 ELSE 0 END,NEW.coin_delta,NEW.reference,NEW.target_key,NEW.applied_at);
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':material',NEW.visitor_key,'material',NEW.material_id,-NEW.material_count,0,NEW.reference,NULL,NEW.applied_at WHERE NEW.kind='craft';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':received',NEW.target_key,'received',NEW.item_id,1,0,NEW.reference,NEW.visitor_key,NEW.applied_at WHERE NEW.kind='gift';
END;
