# V93 Simple Living — delivery and evidence

Implemented:
- Three primary home directions: My Home (guest passport next parameter), Explore (same map anchor), Island Today (same snapshot card anchor). Removed the redundant local account-nav from visual/tab flow; standard global navigation, map pins, native controls and passport access retained.
- Island Today defaults to a short event story and base-relative activity label, explicitly simulated. Closed native details retain authoritative BBI/BCPI numbers and links to original charts/news/methods. No formula/snapshot/market write changes. Simulation outage retains map and a gentle fallback.
- Removed duplicate garden/trade links in collection navigation. Context-specific next-step hints on garden/forest/beach/pond, order, shop, backpack and food-resident pages use existing URLs/settlements. No second task/inventory/navigation state machine. No unsupported NPC AI/actions added.
- About prose uses one 720px maximum reading measure with fluid mobile width, natural wrapping and normal whitespace across nested/direct paragraphs. Retains four lightweight scene illustrations. Updated bilingual lead and future-bank paragraph (explicitly not available).

Files: worker/simple-living.js, index.js, economy-view.js, collection.js, idea.js, locales, build and tests. No DB migration, no analytics or personal-data collection, no asset/permission changes. Audit: docs/V93-AUDIT.md.

Passed: build/ESM validation, full world regression; adventure/tour, economy, story, collection, garden, Nomad living, golf and sports. Integrated farm source/built test proves seed→plant→water→harvest→order→fixed reward→shop buy→shelf display→cottage, existing database transactions only. HTML assertions verify three primary directions, closed economic details, one garden link. I18n audit passes. Existing money, ownership, concurrent/replay/rollback and display/escrow tests pass.

Limits: no physical Safari/PWA or new browser visual acceptance; local browser access was policy-rejected in this environment earlier. No actual-player observations, measured five-minute comprehension, load/memory/FPS profiles or retention claims. Production DB schema not directly queried. V94 is deliberately not started. Implementation, tests and publication are separate statuses; publication details appended only after success.

Rollback: preserved platform106, runtime9d5f8d3310f4586d79ecebb72d9d7286cd6f40a5 and tag rollback/pre-v93-106. Additive previous migrations remain; no rollback data conversion needed.
