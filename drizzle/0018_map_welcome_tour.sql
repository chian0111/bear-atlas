ALTER TABLE island_adventure_preferences ADD COLUMN tour_step INTEGER NOT NULL DEFAULT 0 CHECK(tour_step BETWEEN 0 AND 4);
--> statement-breakpoint
ALTER TABLE island_adventure_preferences ADD COLUMN tour_auto INTEGER NOT NULL DEFAULT 0 CHECK(tour_auto IN (0,1));
