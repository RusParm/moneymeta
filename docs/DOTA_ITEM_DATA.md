# Dota item data contract

## Product boundary

The item atlas is a decision surface, not a build prescription. It combines current item constants with observed first purchases in professional matches. A professional median is context for a player's plan, not proof that one timing or item is universally correct.

## Current cohort

- Patch label: 7.41e.
- OpenDota patch family: 7.41.
- Minor-patch boundary: the official Valve 7.41e release timestamp, 2026-07-30 00:00:00 UTC.
- Matches: parsed professional matches with a positive league ID and a known parser version.
- Roles: OpenDota notable-player `fantasy_role` values 1, 3 and 4 are grouped as core; value 2 is support.
- Unknown roles: excluded from role timing and purchase-rate calculations. Coverage remains visible in the interface.

OpenDota identifies the major patch family rather than every lettered patch. The release timestamp prevents older 7.41 matches from entering the 7.41e cohort.

## Timing calculation

The refresh query expands each player's `purchase_log`, keeps the first non-recipe purchase of an item after 0:00 and calculates P25, median and P75 in match minutes.

Purchase rate is:

`players with a first purchase / all classified player appearances in that role`

Metrics remain hidden in the product until the role has at least 200 first purchases. The snapshot retains smaller samples so a future refresh can cross the threshold without changing the schema.

## Catalog boundary

The catalog includes every positive-cost item observed in the cohort and recursively adds its component tree. Recipe and zero-cost records are excluded. This rule avoids presenting removed records that remain in the constants mirror while preserving the build path for current observed items.

## Stat pricing

Gold efficiency covers only explicit attributes that have a clean base-item reference. Current references include the three single-attribute items, Blades of Attack, Gloves of Haste, Ring of Protection, Fluffy Hat, Energy Booster, Wind Lace, Sage's Mask, Ring of Regen, Cloak, Morbid Mask and Talisman of Evasion.

All Attributes expands into strength, agility and intelligence at their separate base rates. Active abilities, passive effects, auras, inventory compression, recipe convenience and timing value are never assigned invented prices. The interface calls the remaining amount an unpriced remainder, not overpayment.

## Refresh and governance

- Local refresh: `npm run data:dota:refresh`.
- Schema validation: `npm run data:dota:validate`.
- Generated artifact: `src/data/snapshots/dota-items-7.41e.json`.
- Scheduled workflow: `.github/workflows/update-dota-items.yml`.
- Automation target: `automation/dota-item-snapshot`.

The workflow may update only the automation branch and its pull request. It runs snapshot validation, the full test suite and the static build. It never writes directly to `main` and never auto-merges.

Every refresh also checks OpenDota's latest major patch family. If the configured 7.41 family is no longer current, the workflow fails instead of silently presenting an old cohort as live. A lettered minor patch still requires a manual first-party Valve review and a new timestamp boundary.

## Source seam

OpenDota is the current evidence provider because no STRATZ token is configured. The checked-in snapshot and page layer use a provider-neutral internal shape. A later STRATZ adapter may populate the same contract after its role and timing definitions are validated against this cohort.
