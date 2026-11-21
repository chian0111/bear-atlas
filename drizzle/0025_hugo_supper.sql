CREATE TABLE island_supper_story (
 visitor_key TEXT PRIMARY KEY REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 step INTEGER NOT NULL DEFAULT 0 CHECK(step BETWEEN 0 AND 5),
 revision INTEGER NOT NULL DEFAULT 0,
 clues INTEGER NOT NULL DEFAULT 0 CHECK(clues BETWEEN 0 AND 7),
 choice TEXT CHECK(choice IS NULL OR choice IN ('sell','cook','share')),
 source TEXT CHECK(source IS NULL OR source IN ('own','hugo')),
 detail TEXT CHECK(detail IS NULL OR detail IN ('seeds','room','window','door','near','sea')),
 feedback TEXT CHECK(feedback IS NULL OR feedback IN ('yes','unsure','no')),
 started_at INTEGER NOT NULL,
 completed_at INTEGER,
 updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE island_supper_actions (
 token TEXT PRIMARY KEY,
 visitor_key TEXT NOT NULL REFERENCES island_passports(visitor_key) ON DELETE CASCADE,
 kind TEXT NOT NULL CHECK(kind IN ('start','clue','listen','decide','finish','return','feedback')),
 revision INTEGER NOT NULL,
 clue INTEGER NOT NULL DEFAULT 0 CHECK(clue IN (0,1,2,4)),
 choice TEXT CHECK(choice IS NULL OR choice IN ('sell','cook','share')),
 source TEXT CHECK(source IS NULL OR source IN ('own','hugo')),
 detail TEXT CHECK(detail IS NULL OR detail IN ('seeds','room','window','door','near','sea','yes','unsure','no')),
 coin_delta INTEGER NOT NULL DEFAULT 0 CHECK(coin_delta BETWEEN 0 AND 20),
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 applied_at INTEGER
);
--> statement-breakpoint
CREATE INDEX supper_actions_owner ON island_supper_actions(visitor_key,expires_at);
--> statement-breakpoint
CREATE TRIGGER supper_validate BEFORE UPDATE OF applied_at ON island_supper_actions
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 SELECT CASE WHEN NEW.expires_at<=NEW.applied_at OR NEW.revision<>COALESCE((SELECT revision FROM island_supper_story WHERE visitor_key=NEW.visitor_key),0) THEN RAISE(ABORT,'supper_changed') END;
 SELECT CASE WHEN NEW.kind='start' AND EXISTS(SELECT 1 FROM island_supper_story WHERE visitor_key=NEW.visitor_key) THEN RAISE(ABORT,'supper_started') END;
 SELECT CASE WHEN NEW.kind<>'start' AND NOT EXISTS(SELECT 1 FROM island_supper_story WHERE visitor_key=NEW.visitor_key AND step=CASE NEW.kind WHEN 'clue' THEN 1 WHEN 'listen' THEN 1 WHEN 'decide' THEN 2 WHEN 'finish' THEN 3 WHEN 'return' THEN 4 WHEN 'feedback' THEN 5 END) THEN RAISE(ABORT,'supper_step') END;
 SELECT CASE WHEN NEW.kind='clue' AND NEW.clue NOT IN (1,2,4) THEN RAISE(ABORT,'supper_clue') END;
 SELECT CASE WHEN NEW.kind='listen' AND COALESCE((SELECT clues FROM island_supper_story WHERE visitor_key=NEW.visitor_key),0)=0 THEN RAISE(ABORT,'supper_look') END;
 SELECT CASE WHEN NEW.kind='decide' AND (NEW.choice IS NULL OR NEW.source IS NULL) THEN RAISE(ABORT,'supper_choice') END;
 SELECT CASE WHEN NEW.kind='decide' AND NEW.source='own' AND COALESCE((SELECT quantity FROM island_collection_inventory WHERE visitor_key=NEW.visitor_key AND item_id='carrot'),0)-(SELECT count(*) FROM island_collection_displays WHERE visitor_key=NEW.visitor_key AND item_id='carrot')<2 THEN RAISE(ABORT,'supper_stock') END;
 SELECT CASE WHEN NEW.kind='finish' AND NOT EXISTS(SELECT 1 FROM island_supper_story WHERE visitor_key=NEW.visitor_key AND ((choice='sell' AND NEW.detail IN ('seeds','room')) OR (choice='cook' AND NEW.detail IN ('window','door')) OR (choice='share' AND NEW.detail IN ('near','sea')))) THEN RAISE(ABORT,'supper_detail') END;
 SELECT CASE WHEN NEW.kind='feedback' AND (NEW.detail IS NULL OR NEW.detail NOT IN ('yes','unsure','no')) THEN RAISE(ABORT,'supper_feedback') END;
END;
--> statement-breakpoint
CREATE TRIGGER supper_apply AFTER UPDATE OF applied_at ON island_supper_actions
WHEN OLD.applied_at IS NULL AND NEW.applied_at IS NOT NULL
BEGIN
 INSERT OR IGNORE INTO island_collection_wallets(visitor_key) SELECT NEW.visitor_key WHERE NEW.kind='start';
 INSERT INTO island_supper_story(visitor_key,step,revision,started_at,updated_at) SELECT NEW.visitor_key,1,1,NEW.applied_at,NEW.applied_at WHERE NEW.kind='start';
 UPDATE island_collection_inventory SET quantity=quantity-2 WHERE NEW.kind='decide' AND NEW.source='own' AND visitor_key=NEW.visitor_key AND item_id='carrot';
 INSERT INTO island_collection_wallets(visitor_key,coins) SELECT NEW.visitor_key,NEW.coin_delta WHERE NEW.kind='decide' AND NEW.source='own' AND NEW.choice='sell' ON CONFLICT(visitor_key) DO UPDATE SET coins=coins+excluded.coins;
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,happened_at) SELECT NEW.token,NEW.visitor_key,'supper_use','carrot',-2,0,'hugo-supper:carrots',NEW.applied_at WHERE NEW.kind='decide' AND NEW.source='own';
 INSERT INTO island_collection_ledger(operation_id,visitor_key,kind,item_id,quantity_delta,coin_delta,reference,happened_at) SELECT NEW.token||':sale',NEW.visitor_key,'supper_sale','carrot',0,NEW.coin_delta,'hugo-supper:sale',NEW.applied_at WHERE NEW.kind='decide' AND NEW.source='own' AND NEW.choice='sell';
 UPDATE island_supper_story SET revision=revision+1,clues=CASE WHEN NEW.kind='clue' THEN clues|NEW.clue ELSE clues END,step=CASE NEW.kind WHEN 'listen' THEN 2 WHEN 'decide' THEN 3 WHEN 'finish' THEN 4 WHEN 'return' THEN 5 ELSE step END,choice=CASE WHEN NEW.kind='decide' THEN NEW.choice ELSE choice END,source=CASE WHEN NEW.kind='decide' THEN NEW.source ELSE source END,detail=CASE WHEN NEW.kind='finish' THEN NEW.detail ELSE detail END,feedback=CASE WHEN NEW.kind='feedback' THEN NEW.detail ELSE feedback END,completed_at=CASE WHEN NEW.kind='return' THEN NEW.applied_at ELSE completed_at END,updated_at=NEW.applied_at WHERE NEW.kind<>'start' AND visitor_key=NEW.visitor_key;
END;
