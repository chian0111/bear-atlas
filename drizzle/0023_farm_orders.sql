CREATE TABLE island_farm_orders(
 id TEXT PRIMARY KEY,visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 period INTEGER NOT NULL,template_id TEXT NOT NULL,npc_id TEXT NOT NULL,
 item_id TEXT NOT NULL CHECK(item_id IN ('carrot','herb','tomato')),
 quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 4),
 reward INTEGER NOT NULL CHECK(reward BETWEEN 1 AND 30),unit_reward INTEGER NOT NULL CHECK(unit_reward BETWEEN 1 AND 15),
 quote_version TEXT NOT NULL,source_version TEXT NOT NULL,source_period INTEGER NOT NULL,source_json TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'offered' CHECK(status IN ('offered','accepted','declined','cancelled','delivered')),
 created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,accepted_at INTEGER,due_at INTEGER,closed_at INTEGER,
 UNIQUE(visitor_key,period,template_id),CHECK(reward=quantity*unit_reward)
);
--> statement-breakpoint
CREATE TABLE island_farm_order_operations(
 token TEXT PRIMARY KEY,visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 order_id TEXT NOT NULL REFERENCES island_farm_orders(id),kind TEXT NOT NULL CHECK(kind IN ('accept','decline','cancel','deliver')),
 created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,applied_at INTEGER
);
--> statement-breakpoint
CREATE INDEX farm_orders_owner ON island_farm_orders(visitor_key,created_at);
--> statement-breakpoint
CREATE TRIGGER farm_order_terms_immutable BEFORE UPDATE OF id,visitor_key,period,template_id,npc_id,item_id,quantity,reward,unit_reward,quote_version,source_version,source_period,source_json,created_at,expires_at ON island_farm_orders BEGIN SELECT RAISE(ABORT,'immutable accepted quote');END;
--> statement-breakpoint
CREATE TRIGGER farm_order_validate BEFORE UPDATE OF applied_at ON island_farm_order_operations
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 SELECT CASE WHEN NEW.expires_at<=NEW.applied_at OR NOT EXISTS(SELECT 1 FROM island_farm_orders WHERE id=NEW.order_id AND visitor_key=NEW.visitor_key) THEN RAISE(ABORT,'farm_order_invalid') END;
 SELECT CASE WHEN NEW.kind='accept' AND (NOT EXISTS(SELECT 1 FROM island_farm_orders WHERE id=NEW.order_id AND status='offered' AND expires_at>NEW.applied_at) OR (SELECT count(*) FROM island_farm_orders WHERE visitor_key=NEW.visitor_key AND status='accepted' AND due_at>NEW.applied_at)>=3) THEN RAISE(ABORT,'farm_order_conflict') END;
 SELECT CASE WHEN NEW.kind='decline' AND NOT EXISTS(SELECT 1 FROM island_farm_orders WHERE id=NEW.order_id AND status='offered') THEN RAISE(ABORT,'farm_order_conflict') END;
 SELECT CASE WHEN NEW.kind='cancel' AND NOT EXISTS(SELECT 1 FROM island_farm_orders WHERE id=NEW.order_id AND status='accepted') THEN RAISE(ABORT,'farm_order_conflict') END;
 SELECT CASE WHEN NEW.kind='deliver' AND NOT EXISTS(SELECT 1 FROM island_farm_orders o WHERE o.id=NEW.order_id AND o.status='accepted' AND o.due_at>NEW.applied_at AND COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id=o.item_id),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id=o.item_id)>=o.quantity AND EXISTS(SELECT 1 FROM island_collection_wallets WHERE visitor_key=NEW.visitor_key AND coins+o.reward<=1000000)) THEN RAISE(ABORT,'farm_order_unavailable') END;
END;
--> statement-breakpoint
CREATE TRIGGER farm_order_apply AFTER UPDATE OF applied_at ON island_farm_order_operations
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 UPDATE island_collection_inventory SET quantity=quantity-(SELECT quantity FROM island_farm_orders WHERE id=NEW.order_id) WHERE NEW.kind='deliver' AND visitor_key=NEW.visitor_key AND item_id=(SELECT item_id FROM island_farm_orders WHERE id=NEW.order_id);
 UPDATE island_collection_wallets SET coins=coins+(SELECT reward FROM island_farm_orders WHERE id=NEW.order_id) WHERE NEW.kind='deliver' AND visitor_key=NEW.visitor_key;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':produce',NEW.visitor_key,'farm_deliver',item_id,-quantity,0,id,NULL,NEW.applied_at FROM island_farm_orders WHERE NEW.kind='deliver' AND id=NEW.order_id;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,peer_key,happened_at) SELECT NEW.token||':income',NEW.visitor_key,'farm_income',NULL,0,reward,id,NULL,NEW.applied_at FROM island_farm_orders WHERE NEW.kind='deliver' AND id=NEW.order_id;
 UPDATE island_farm_orders SET status=CASE NEW.kind WHEN 'accept' THEN 'accepted' WHEN 'decline' THEN 'declined' WHEN 'cancel' THEN 'cancelled' ELSE 'delivered' END,accepted_at=CASE WHEN NEW.kind='accept' THEN NEW.applied_at ELSE accepted_at END,due_at=CASE WHEN NEW.kind='accept' THEN NEW.applied_at+1209600000 ELSE due_at END,closed_at=CASE WHEN NEW.kind='accept' THEN NULL ELSE NEW.applied_at END WHERE id=NEW.order_id;
END;
