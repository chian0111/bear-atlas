CREATE TABLE island_garden_plots (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 slot INTEGER NOT NULL CHECK(slot BETWEEN 1 AND 4),
 crop_id TEXT CHECK(crop_id IS NULL OR crop_id IN ('herb','carrot','tomato','rice','sunflower')),
 planted_at INTEGER,
 watered_at INTEGER,
 ready_at INTEGER,
 revision INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(visitor_key,slot)
);
--> statement-breakpoint
CREATE TABLE island_garden_fishing (
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 day TEXT NOT NULL,
 number INTEGER NOT NULL CHECK(number BETWEEN 1 AND 6),
 item_id TEXT NOT NULL,
 cast_at INTEGER NOT NULL,
 ready_at INTEGER NOT NULL,
 claimed_at INTEGER,
 PRIMARY KEY(visitor_key,day,number)
);
--> statement-breakpoint
CREATE TABLE island_garden_trades (
 id TEXT PRIMARY KEY,
 sender_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 target_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 offered_item TEXT NOT NULL,
 wanted_item TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','cancelled','declined')),
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 closed_at INTEGER,
 CHECK(sender_key<>target_key)
);
--> statement-breakpoint
CREATE INDEX garden_trade_target ON island_garden_trades(target_key,status,created_at);
--> statement-breakpoint
CREATE TABLE island_garden_operations (
 token TEXT PRIMARY KEY,
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('starter','plant','water','harvest','cast','catch','trade_post','trade_accept','trade_cancel','trade_decline')),
 slot INTEGER,
 revision INTEGER,
 crop_id TEXT,
 item_id TEXT,
 input_id TEXT,
 wanted_item TEXT,
 target_key TEXT REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 reference TEXT NOT NULL,
 duration INTEGER NOT NULL DEFAULT 0,
 day TEXT,
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 applied_at INTEGER
);
--> statement-breakpoint
CREATE INDEX garden_operation_owner ON island_garden_operations(visitor_key,expires_at);
--> statement-breakpoint
CREATE TRIGGER garden_validate BEFORE UPDATE OF applied_at ON island_garden_operations
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 SELECT CASE WHEN NEW.kind='starter' AND EXISTS(SELECT 1 FROM island_collection_ledger WHERE visitor_key=NEW.visitor_key AND kind='starter' AND reference='garden-starter') THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind IN ('plant','water','harvest') AND NOT EXISTS(SELECT 1 FROM island_garden_plots WHERE visitor_key=NEW.visitor_key AND slot=NEW.slot AND revision=NEW.revision) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='plant' AND ((NEW.slot=4 AND NEW.crop_id<>'rice') OR (NEW.slot<>4 AND NEW.crop_id='rice')) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='plant' AND (EXISTS(SELECT 1 FROM island_garden_plots WHERE visitor_key=NEW.visitor_key AND slot=NEW.slot AND crop_id IS NOT NULL) OR COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id=NEW.input_id),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id=NEW.input_id)<1) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='water' AND NOT EXISTS(SELECT 1 FROM island_garden_plots WHERE visitor_key=NEW.visitor_key AND slot=NEW.slot AND crop_id=NEW.crop_id AND watered_at IS NULL) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='harvest' AND NOT EXISTS(SELECT 1 FROM island_garden_plots WHERE visitor_key=NEW.visitor_key AND slot=NEW.slot AND crop_id=NEW.crop_id AND ready_at IS NOT NULL AND ready_at<=NEW.applied_at) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='cast' AND (EXISTS(SELECT 1 FROM island_garden_fishing WHERE visitor_key=NEW.visitor_key AND claimed_at IS NULL) OR EXISTS(SELECT 1 FROM island_garden_fishing WHERE visitor_key=NEW.visitor_key AND claimed_at>NEW.applied_at-120000) OR NEW.slot NOT BETWEEN 1 AND 6) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='catch' AND NOT EXISTS(SELECT 1 FROM island_garden_fishing WHERE visitor_key=NEW.visitor_key AND day=NEW.day AND number=NEW.slot AND item_id=NEW.item_id AND claimed_at IS NULL AND ready_at<=NEW.applied_at) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='trade_post' AND (NEW.target_key IS NULL OR NEW.target_key=NEW.visitor_key OR NEW.item_id=NEW.wanted_item OR COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id=NEW.item_id),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id=NEW.item_id)<1) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='trade_accept' AND NOT EXISTS(SELECT 1 FROM island_garden_trades t WHERE t.id=NEW.reference AND t.target_key=NEW.visitor_key AND t.status='pending' AND t.expires_at>NEW.applied_at AND COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id=t.wanted_item),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id=t.wanted_item)>=1) THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='trade_cancel' AND NOT EXISTS(SELECT 1 FROM island_garden_trades WHERE id=NEW.reference AND sender_key=NEW.visitor_key AND status='pending') THEN RAISE(ABORT,'garden_conflict') END;
 SELECT CASE WHEN NEW.kind='trade_decline' AND NOT EXISTS(SELECT 1 FROM island_garden_trades WHERE id=NEW.reference AND target_key=NEW.visitor_key AND status='pending') THEN RAISE(ABORT,'garden_conflict') END;
END;
--> statement-breakpoint
CREATE TRIGGER garden_apply AFTER UPDATE OF applied_at ON island_garden_operations
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.visitor_key,'seed_herb',2,NEW.applied_at WHERE NEW.kind='starter' ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+2;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.visitor_key,'seed_carrot',2,NEW.applied_at WHERE NEW.kind='starter' ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+2;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.visitor_key,'seed_tomato',2,NEW.applied_at WHERE NEW.kind='starter' ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+2;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.visitor_key,'seed_rice',1,NEW.applied_at WHERE NEW.kind='starter' ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+1;
 UPDATE island_collection_inventory SET quantity=quantity-1 WHERE NEW.kind='plant' AND visitor_key=NEW.visitor_key AND item_id=NEW.input_id;
 UPDATE island_garden_plots SET crop_id=NEW.crop_id,planted_at=NEW.applied_at,watered_at=NULL,ready_at=NULL,revision=revision+1 WHERE NEW.kind='plant' AND visitor_key=NEW.visitor_key AND slot=NEW.slot;
 UPDATE island_garden_plots SET watered_at=NEW.applied_at,ready_at=NEW.applied_at+NEW.duration,revision=revision+1 WHERE NEW.kind='water' AND visitor_key=NEW.visitor_key AND slot=NEW.slot;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.visitor_key,NEW.item_id,2,NEW.applied_at WHERE NEW.kind='harvest' ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+2;
 UPDATE island_garden_plots SET crop_id=NULL,planted_at=NULL,watered_at=NULL,ready_at=NULL,revision=revision+1 WHERE NEW.kind='harvest' AND visitor_key=NEW.visitor_key AND slot=NEW.slot;
 INSERT INTO island_garden_fishing(visitor_key,day,number,item_id,cast_at,ready_at) SELECT NEW.visitor_key,NEW.day,NEW.slot,NEW.item_id,NEW.applied_at,NEW.applied_at+20000 WHERE NEW.kind='cast';
 UPDATE island_garden_fishing SET claimed_at=NEW.applied_at WHERE NEW.kind='catch' AND visitor_key=NEW.visitor_key AND day=NEW.day AND number=NEW.slot;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT NEW.visitor_key,NEW.item_id,1,NEW.applied_at WHERE NEW.kind='catch' ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+1;
 UPDATE island_collection_inventory SET quantity=quantity-1 WHERE NEW.kind='trade_post' AND visitor_key=NEW.visitor_key AND item_id=NEW.item_id;
 INSERT INTO island_garden_trades(id,sender_key,target_key,offered_item,wanted_item,created_at,expires_at) SELECT NEW.reference,NEW.visitor_key,NEW.target_key,NEW.item_id,NEW.wanted_item,NEW.applied_at,NEW.applied_at+86400000 WHERE NEW.kind='trade_post';
 UPDATE island_collection_inventory SET quantity=quantity-1 WHERE NEW.kind='trade_accept' AND visitor_key=NEW.visitor_key AND item_id=(SELECT wanted_item FROM island_garden_trades WHERE id=NEW.reference);
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT t.target_key,t.offered_item,1,NEW.applied_at FROM island_garden_trades t WHERE NEW.kind='trade_accept' AND t.id=NEW.reference ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+1;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT t.sender_key,t.wanted_item,1,NEW.applied_at FROM island_garden_trades t WHERE NEW.kind='trade_accept' AND t.id=NEW.reference ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+1;
 INSERT INTO island_collection_inventory(visitor_key,item_id,quantity,first_at) SELECT t.sender_key,t.offered_item,1,NEW.applied_at FROM island_garden_trades t WHERE NEW.kind IN ('trade_cancel','trade_decline') AND t.id=NEW.reference ON CONFLICT(visitor_key,item_id) DO UPDATE SET quantity=quantity+1;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token,NEW.visitor_key,NEW.kind,NEW.item_id,CASE WHEN NEW.kind='harvest' THEN 2 WHEN NEW.kind='catch' THEN 1 WHEN NEW.kind='trade_post' THEN -1 ELSE 0 END,0,CASE WHEN NEW.kind='starter' THEN 'garden-starter' ELSE NEW.reference END,NEW.target_key,NEW.applied_at;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':seed_herb',NEW.visitor_key,'starter_seed','seed_herb',2,0,'garden-starter:seed_herb',NULL,NEW.applied_at WHERE NEW.kind='starter';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':seed_carrot',NEW.visitor_key,'starter_seed','seed_carrot',2,0,'garden-starter:seed_carrot',NULL,NEW.applied_at WHERE NEW.kind='starter';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':seed_tomato',NEW.visitor_key,'starter_seed','seed_tomato',2,0,'garden-starter:seed_tomato',NULL,NEW.applied_at WHERE NEW.kind='starter';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':seed_rice',NEW.visitor_key,'starter_seed','seed_rice',1,0,'garden-starter:seed_rice',NULL,NEW.applied_at WHERE NEW.kind='starter';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':seed',NEW.visitor_key,'plant_seed',NEW.input_id,-1,0,NEW.reference,NULL,NEW.applied_at WHERE NEW.kind='plant';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':offered',t.target_key,'trade_received',t.offered_item,1,0,NEW.reference,t.sender_key,NEW.applied_at FROM island_garden_trades t WHERE NEW.kind='trade_accept' AND t.id=NEW.reference;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':paid',t.target_key,'trade_paid',t.wanted_item,-1,0,NEW.reference,t.sender_key,NEW.applied_at FROM island_garden_trades t WHERE NEW.kind='trade_accept' AND t.id=NEW.reference;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':sender',t.sender_key,'trade_received',t.wanted_item,1,0,NEW.reference,t.target_key,NEW.applied_at FROM island_garden_trades t WHERE NEW.kind='trade_accept' AND t.id=NEW.reference;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':returned',t.sender_key,'trade_returned',t.offered_item,1,0,NEW.reference,t.target_key,NEW.applied_at FROM island_garden_trades t WHERE NEW.kind IN ('trade_cancel','trade_decline') AND t.id=NEW.reference;
 UPDATE island_garden_trades SET status=CASE NEW.kind WHEN 'trade_accept' THEN 'accepted' WHEN 'trade_cancel' THEN 'cancelled' ELSE 'declined' END,closed_at=NEW.applied_at WHERE NEW.kind IN ('trade_accept','trade_cancel','trade_decline') AND id=NEW.reference;
 INSERT OR IGNORE INTO island_adventure_events(visitor_key,event,period,happened_at) SELECT NEW.visitor_key,CASE NEW.kind WHEN 'harvest' THEN 'garden:harvest' ELSE 'pond:catch' END,strftime('%Y-%m-%d',NEW.applied_at/1000,'unixepoch','+8 hours'),NEW.applied_at WHERE NEW.kind IN ('harvest','catch');
END;
