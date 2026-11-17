# V98 — harvest selling and quieter island life

- Header Market replaces Square and links directly to the existing backpack's Sell harvest view. Square remains on the island map. Harvest receipts link directly to this sale view; shop also exposes it.
- Sale view opens item controls, shows fixed unit price and a quantity input (1–50, bounded by available stock). Bulk sale uses one D1 transaction containing existing server-owned single-unit operations. Existing triggers protect reserved displays and atomically debit stock/credit coins/write ledger. Parent receipt and deterministic child tokens make retry safe; no migrations or trigger replacements.
- POST fragment updates retain the page's pre-submit height and the clicked card's position, including zero-stock receipts. Open item controls are restored. Progress/error notice floats without pushing content.
- Original inline SVG shop and task scenes reserve their own height. Verified food consumption shows the current passport character lifting the food, including the last serving; reduced-motion users see a still scene. Consumes one virtual serving, no energy or real food simulation.
- Remove redundant home directions card and duplicated map account links; collapse the greeting editor. Remove harbor wave panel. First harbor arrival records the existing welcome quest station automatically, preserving existing five-stop rewards without a confusing wave action.

Validation: build and ESM artifact; source and compiled collection integration; adventure; pocket inline; garden inline; garden; task return; player experience; resort navigation; bear world; bilingual catalog/runtime suites. Added bulk quantity tampering, cross-account, changed-quantity replay, independent same-quantity sales, all-or-nothing stock conflict rollback, display reservation, zero-stock food scene and map simplification coverage. No production test accounts or player data changed.

Verification limit: required Sites browser tool cua_repl.js is unavailable in this environment; no browser QA or physical mobile acceptance is claimed. Source and runtime integration tests pass.

Publication verified: V98 / platform 116, runtime bc8525f9498caf6e9140e03b8489ad5d380be2a4. Deployment appgdep_6afb9fb77a508191af3a023cd0117a27 succeeded at 2026-11-17 00:28 UTC. GitHub implementation 87eae57e89541fbf222afb3ae315acbc5d10d666 matched remote main. Historical sync helper stopped because old commits live in the preserved Git bundle; a normal non-force push mirrored V98 without changing historical backup.
