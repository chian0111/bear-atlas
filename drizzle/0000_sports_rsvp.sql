CREATE TABLE sports_invites (
  invite_key TEXT PRIMARY KEY NOT NULL,
  token TEXT UNIQUE NOT NULL,
  activity TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE sports_replies (
  invite_key TEXT NOT NULL REFERENCES sports_invites(invite_key) ON DELETE CASCADE,
  guest_key TEXT NOT NULL,
  nickname TEXT NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('yes','maybe','no')),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (invite_key, guest_key)
);
