CREATE TABLE island_economy_config(version TEXT PRIMARY KEY,config_json TEXT NOT NULL,created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE island_economy_goods(version TEXT NOT NULL REFERENCES island_economy_config(version),good_id TEXT NOT NULL,definition_json TEXT NOT NULL,PRIMARY KEY(version,good_id));
--> statement-breakpoint
CREATE TABLE island_economy_snapshots(version TEXT NOT NULL REFERENCES island_economy_config(version),period INTEGER NOT NULL CHECK(period>=0),start_at INTEGER NOT NULL,end_at INTEGER NOT NULL,source TEXT NOT NULL CHECK(source='official-island-simulation'),status TEXT NOT NULL CHECK(status='simulated'),snapshot_json TEXT NOT NULL,digest TEXT NOT NULL,created_at INTEGER NOT NULL,PRIMARY KEY(version,period),CHECK(end_at>start_at));
--> statement-breakpoint
CREATE TABLE island_economy_prices(version TEXT NOT NULL,period INTEGER NOT NULL,good_id TEXT NOT NULL,price REAL NOT NULL CHECK(price>0),supply REAL NOT NULL CHECK(supply>0),demand REAL NOT NULL CHECK(demand>0),quantity REAL NOT NULL CHECK(quantity>=0),PRIMARY KEY(version,period,good_id),FOREIGN KEY(version,period) REFERENCES island_economy_snapshots(version,period),FOREIGN KEY(version,good_id) REFERENCES island_economy_goods(version,good_id));
--> statement-breakpoint
CREATE TABLE island_economy_events(id TEXT PRIMARY KEY,version TEXT NOT NULL,period INTEGER NOT NULL,kind TEXT NOT NULL,start_at INTEGER NOT NULL,end_at INTEGER NOT NULL,event_json TEXT NOT NULL,UNIQUE(version,period),FOREIGN KEY(version,period) REFERENCES island_economy_snapshots(version,period),CHECK(end_at>start_at));

--> statement-breakpoint
CREATE TRIGGER island_economy_config_update BEFORE UPDATE ON island_economy_config BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_config_delete BEFORE DELETE ON island_economy_config BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_goods_update BEFORE UPDATE ON island_economy_goods BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_goods_delete BEFORE DELETE ON island_economy_goods BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_snapshots_update BEFORE UPDATE ON island_economy_snapshots BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_snapshots_delete BEFORE DELETE ON island_economy_snapshots BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_prices_update BEFORE UPDATE ON island_economy_prices BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_prices_delete BEFORE DELETE ON island_economy_prices BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_events_update BEFORE UPDATE ON island_economy_events BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;

--> statement-breakpoint
CREATE TRIGGER island_economy_events_delete BEFORE DELETE ON island_economy_events BEGIN SELECT RAISE(ABORT,'Economy records are immutable; use a new calculation version'); END;
