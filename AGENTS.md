# Bear Atlas development rules

- Continue the existing Site, never recreate player data or reset bindings.
- Preserve character IDs, furnishings, collection and invitation permissions.
- Navigation must retain the departure facility and enter destinations in one click.
- Match full bodies and paws to the selected species and fur palette.
- For every release, update CHANGELOG.md and docs/release-history.json with verified version/commit/deployment results.
- The user requests a GitHub mirror of all history and future updates. When an authorized GitHub repository is configured, run scripts/sync-github.mjs after saving the source, then verify the remote commit. Do not claim GitHub synchronization until the push and remote verification succeed.
- GitHub connector is connected. Authorized destination: chian0111/bear-atlas (public; user explicitly authorized full-source publication on 2026-11-16). Preserve current source as normal files and original Sites history as a verified restorable Git bundle when direct Git push authentication is unavailable. Report bundle backup separately from native Git commit mirroring.

- User decision (2026-11-14): develop and synchronize directly on `main`. Do not create feature branches. Keep historical branches as archives unless explicitly asked to delete them. GitHub main contains the complete current source and original version-history bundle.

- User decision (2026-11-15): V86 Nomad House work uses `feature/v86-nomad-house`; this specific instruction supersedes the earlier main-only preference. Preserve main and production V85 until this candidate meets the release gates.

- User decision (2026-11-16): V88 and subsequent authorized development updates must be deployed to the existing Site and synchronized to the public `chian0111/bear-atlas` main branch without repeated confirmation. Preserve existing history and never include runtime credentials or production user data.

- User decision (2026-11-16): V90 Observatory uses `feature/v89-bear-economic-observatory` exactly as requested, superseding main-only during development. Complete Phase 0 then V90.1; defer engine/story quest/banking to their specified batches. Product release label is V90 despite the historical branch name.
