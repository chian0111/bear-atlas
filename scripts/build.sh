#!/usr/bin/env bash
set -euo pipefail

project_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
dist_root="$project_root/dist"

node "$project_root/scripts/compile-i18n.mjs"

rm -rf "$dist_root"
mkdir -p "$dist_root/server" "$dist_root/.openai"
{
  sed '/^import /d;s/^export //' "$project_root/worker/i18n-catalog.js" "$project_root/worker/i18n.js" "$project_root/worker/pocket.js" "$project_root/worker/cozy-navigation.js" "$project_root/worker/living-catalog.js" "$project_root/worker/adventure.js" "$project_root/worker/nature-catalog.js" "$project_root/worker/collection.js" "$project_root/worker/garden.js" "$project_root/worker/welcome-tour.js" "$project_root/worker/nomad-house.js" "$project_root/worker/nomad-living.js" "$project_root/worker/cozy-living.js" "$project_root/worker/sports-venues.js" "$project_root/worker/resort-upgrade.js" "$project_root/worker/golf.js" "$project_root/worker/economy-engine.js" "$project_root/worker/simple-living.js" "$project_root/worker/player-experience.js" "$project_root/worker/economy-view.js" "$project_root/worker/economy-story.js" "$project_root/worker/farm-orders.js" "$project_root/worker/market.js" "$project_root/worker/character-living.js" "$project_root/worker/idea.js" "$project_root/worker/observatory.js" "$project_root/worker/resort.js" "$project_root/worker/harbor-art.js" "$project_root/worker/harbor-neighbors.js" "$project_root/worker/public-scenes.js" "$project_root/worker/sad-island.js" "$project_root/worker/bedroom.js" "$project_root/worker/island-life.js"
  sed '/^import /d' "$project_root/worker/index.js"
} > "$dist_root/server/index.js"
cp "$project_root/.openai/hosting.json" "$dist_root/.openai/hosting.json"

echo "Built $dist_root"
