# V85 Sports Venue Depth & Details

Base: production V84 source e4573473b95c46dad939158a49033e13c97785c2. Development directly on main; no new branch.

## Shipped scope

Five venue dialogs now have projected 3D box geometry rendered with Canvas 2D, three real camera angles, directional face shading, contact shadows and retained species-matched avatar sprites. This follows the cottage's low-cost projected-scene approach, not a heavyweight engine replacement. Existing SVG venue cards and fallback artwork remain available.

- Gym: wood planks, wall/window thickness, treadmill frames/belts/console, dumbbell rack, bench, mat, plants.
- Table tennis: thick tabletop and legs, table markings, net mesh/posts, bench/paddle and room windows.
- Pickleball/tennis: distinct surface colors, markings, net strands/posts, perimeter rail, paving, benches and plants.
- Pool: coping thickness, water/tile cues, ladder, lounge seating and small ripples. Avatar starts poolside and enters during the short movement preview.
- View controls are bilingual semantic keys, keyboard accessible, and at least 44px high. Reduced motion disables preview frame animation. The renderer does not animate idle scenes; active previews are capped at approximately 12 FPS and DPR 1.5. Closing/hidden pages cancel preview frames; re-entry disposes prior scene listeners and observers. Pagehide disconnects the venue watcher.
- No game records, identities, furniture, collections, visitor permissions or database schema changes. Golf's existing state machine and scene are retained.

## Verification

- Model test: finite, bounded geometry; mesh budget below 400 objects per venue; platform containment; fresh models on re-entry; shipping integration.
- Existing golf, i18n and in-memory world integration tests passed. HTML audit: 176 request paths, zero incomplete built-in strings.
- Build and Worker artifact validation passed.
- Chrome isolated preview: all five venues opened, left/right view controls worked, gym movement feedback and early close/re-entry worked, selected cat body was displayed, table/pool visually reviewed. Fixed floor/equipment painter ordering and versioned the script URLs to avoid stale previews.
- Safari/device testing is not available in this environment; desktop Chrome checks do not constitute real iPhone Safari verification.

## Limits and rollback

This release refines venue appearance and camera views. Sports movements remain short previews, without full opponent simulation, multiplayer matches or newly added rewards. Golf remains the existing playable activity. Characters remain species-matched SVG sprites inside the projected environment, not newly rigged 3D character models.

Rollback target: saved V84 appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_53600924088481919067c7fb59733981. No data migration is required.

## Publication

Saved V85: appgprj_6af26b560248819190b1dc4fdcf765b2~appgver_1dd8e3a8921c81919d87a80e061644c9
Source: a027cb2b62881a887c62d4987fb5797e33441ab6
Deployment: appgdep_6af87233b5888191b1c0ebdbd9af9f47 (succeeded)
URL: https://atlas-sports-reply.kitty50228.chatgpt.site

Additional Chrome verification: Chinese scene/view controls, pool preview feedback, early close/reopen, and stopped render count after closing.
