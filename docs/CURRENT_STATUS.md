# Current status

Updated: 2026-08-19

## Baseline

The production repository contained three standalone HTML files with CDN Tailwind on two pages and a separate CSS system on the calculator. There was no package manifest, build step, type checking or test suite.

## Implemented in `product/v0.3`

- Branch `product/v0.3` was published to GitHub and validated in Vercel Preview.
- Astro 7 / TypeScript static build with a Node 22 production target.
- Complete RU/EN routes for home, GTA hub and calculator.
- Centralized GTA business data and provenance metadata.
- Returner / Next Best Move decision flow with saved local preferences.
- Editable Model Lab and baseline comparison.
- Portfolio Optimizer v1.
- Automatic stale Weekly Meta guard.
- SEO metadata, structured data, sitemap, robots.txt and legacy calculator redirect.
- Unit tests for calculations, recommendations, constraints and freshness.

## Validation

- `npm test`: 20 tests passing across economy formulas, ranking logic, freshness and content-depth gates.
- `npm run build`: type check and static build pass with zero diagnostics.
- Twenty-nine public pages plus robots.txt and sitemap build successfully.
- Desktop and mobile browser QA passed for the WoW calculators, three-economy home and RU/EN routes.
- v1.0 browser QA passed for desktop/mobile layout, zero horizontal overflow, cross-economy navigation, scenario URL sharing, local restore, reset and decision-state rendering.

## Production release: `product/v0.4`

- Dota 2 RU/EN Economy Lab.
- Hand of Midas incremental ROI and payback model.
- Buyback Reserve model with objective timing.
- Patch 7.41 context, editable baselines and source disclosures.
- Home, sitemap, version and documentation updated for two active economies.

## Release: `product/v0.5`

- World of Warcraft Retail Economy Lab in RU/EN.
- Crafting Margin model with Auction House cut, sell-through and inventory risk.
- Farm Liquidity model separating listed GPH from effective GPH.
- Midnight / Curse of Ula’tek context, editable assumptions and source disclosures.
- Home, sitemap, version and documentation updated for three active economies.

## Production release: `product/v1.0`

- Unified premium product shell and cross-economy navigation.
- Decision-first homepage with visible model coverage and trust signals.
- Ranked GTA opportunity cards plus current Weekly Meta freshness and source disclosure.
- Persistent, resettable and shareable scenarios across GTA, Dota 2 and WoW calculators.
- Positive, caution and negative result states for faster interpretation.
- Bundled variable typography, keyboard focus treatment and reduced-motion support.

## Active release candidate: `product/v1.1`

- Rebuilt homepage around a concrete promise: stop grinding blind and get a decision in roughly 30 seconds.
- Interactive GTA, Dota 2 and WoW baseline cases above the fold.
- Seven direct question-to-tool entry points instead of architecture-first navigation.
- Game-specific quick-start decks, visual accents and featured analysis links across every vertical.
- Money Meta Field Notes with three flagship analyses in complete RU/EN parity.
- Article-to-tool loops, Article schema and expanded sitemap coverage.
- Nineteen static pages pass desktop/mobile overflow and interaction QA.

## Active release candidate: v1.2 GTA benchmark

- Three original, responsive economy-world hero assets now establish a distinct GTA, Dota and WoW visual identity.
- A shared optimized hero component keeps responsive image delivery, overlays and performance consistent across all verticals.
- The complete living-hub product anatomy and commercial media policy are documented.
- GTA Online now implements the benchmark end to end: seven-node interactive economy map, three complete player paths, official-source Weekly Pulse with browser-time freshness guard, three conditional rankings and six preconfigured scenarios.
- GTA research expanded from one flagship note to six substantial RU/EN analyses with audience filters, evidence status, game version and article-to-tool loops.
- The benchmark dataset has explicit estimated/verified separation; weekly opportunities never silently overwrite long-horizon production scores.
- Twenty tests cover formulas, rankings, freshness and benchmark content depth. Twenty-nine static pages build with zero diagnostics.
- GTA preview approved as the benchmark; the system is now being adapted to Dota 2 and then WoW Retail in sequence.

## Active release candidate: v1.3 Dota living match hub

- Rebuilt the Dota vertical as a nine-section decision product with a seven-stage match-economy map, three player paths and three role-specific capital lenses.
- Added a patch 7.41e Pulse with official-source links, a 45-day freshness guard and explicit separation between cash payback and non-cash Madstone / attack-speed utility.
- Corrected the buyback formula from the stale `100 + Net Worth / 13` baseline to the documented `200 + Net Worth / 13` formula.
- Added eight prepared decisions across farming, acceleration, initiation, utility, buyback, objective conversion and replay review. Midas and buyback remain deep models without defining the whole hub.
- Added rights-aware Dota item and hero identifiers over an original Money Meta hero world; every third-party visual has a fallback and removable media record.
- Twenty-three tests cover formulas, GTA depth and Dota living-hub depth. Thirty-nine static pages build with zero diagnostics.
- Raised shared microcopy and control typography, then verified desktop and mobile layouts for collisions and overflow.

## Release: v1.4 WoW living market hub

- Rebuilt WoW Retail as a complete market operating system with a seven-stage economy map, three player paths and a dated official-source Pulse.
- Added six ranked market routes across three conditional lenses: limited time, low capital and market specialization.
- Added eight decision scenarios spanning gathering, crafting, inventory, pricing, orders, resets and batch sizing.
- Expanded the model stack to crafting margin, farm liquidity and a crafting-order commission floor with twenty-two editable inputs, saved state and shareable URLs.
- Expanded WoW research from one note to six substantial RU/EN analyses with evidence labels and article-to-tool loops.
- Current context reflects Midnight: Curse of Ula'tek and separates official mechanics from editable market assumptions.
- Thirty-two automated tests pass. Forty-nine static pages build with zero Astro diagnostics.
- Desktop and mobile browser QA passes in Russian and English with zero horizontal overflow, icon/text collisions, targeted microtext violations or client errors.
- Next game candidates: Total War and Crusader Kings. Civilization and Age of Empires remain demand-led expansion options.

## Active release candidate: v1.5 five-economy platform

- Rebuilt the RU/EN homepage around a plain-language product explanation before game selection: what Money Meta is, who it serves and how a player moves from understanding to action.
- Replaced the above-the-fold calculation panel with an original five-world Economy Atlas and three clear audience paths for returners, time-limited players and advanced grinders.
- Made the shared six-layer hub contract explicit: economy map, personal path, current Pulse, research library, rankings and comparisons, calculators and scenarios.
- Expanded the platform to five live economies and fifteen editable decision models.
- Added a complete Total War: Warhammer III campaign-capital hub in RU/EN with an interactive economy map, three player paths, Patch 8.1 Pulse, conditional decision lenses, six scenarios, three calculators and six applied briefs.
- Added a complete Crusader Kings III realm-capital hub in RU/EN with an interactive economy map, three player paths, version 1.19.0.6 context, three decision lenses, six scenarios, three calculators and six applied briefs.
- The Crusader Kings hub treats Silk & Silver as a Q4 2026 watch item and does not invent formulas for unreleased trade systems.
- Raised GTA Online to a richer visual and functional layer with asset marks throughout the map, paths and rankings plus three inline models for business return, hours to goal and portfolio allocation.
- Raised WoW Retail to four connected models with an early market-ledger snapshot for liquid gold, risk-adjusted inventory and capital velocity.
- Added two original Money Meta strategy-world hero assets. Publisher logos, screenshots, personal identity and personal data are not used.
- Forty-five automated tests pass. Fifty-three static pages build with zero Astro diagnostics.
- Branch preview and final browser QA remain required before any production promotion.

## Production release: v1.6 trust and measurement layer

- Reworked the homepage proof and trust sequence so the product explains its evidence model before asking for a decision.
- Added shared freshness handling for dated GTA, Dota 2, WoW, Total War and Crusader Kings III context.
- Added Vercel Analytics and Speed Insights through first-party Astro integrations.
- Kept verified facts, working estimates and player-entered assumptions visibly separate.

## Active release candidate: v1.7 hub decision gateways

- Added a three-question quick start to all five hubs in complete RU/EN parity.
- Each gateway uses game-specific questions and weighted outcomes instead of a generic recommendation template.
- GTA routes players toward return, goal or portfolio decisions; Dota 2 toward growth, timing or buyback liquidity; WoW toward farming, crafting, orders or inventory recovery.
- Total War routes campaign capital toward buildings, war reserve or conquest; Crusader Kings III routes realm capital toward domain, war chest or succession resilience.
- Choices stay on the device and require no account or personal data.
- Fifty-three automated tests pass. Fifty-three static pages build with zero Astro diagnostics.
- The built HTML for all ten localized hub routes contains three questions, nine choices, one initial result and valid links to the next model or analysis.
- HTTPS preview deployment and final visual browser QA remain required before production promotion.

## Active release candidate: v1.8 editorial depth

- Replaced the repeated card-grid rhythm after quick start with one asymmetric editorial guide feature in every hub.
- Added five substantial RU/EN field guides, one for each live economy, with four decision stages, three takeaways, a direct model route and primary sources.
- Expanded standalone Field Notes from three to five games and made the homepage feature one deliberately selected guide per economy.
- Updated current context on 2026-08-18: GTA Online Brand Wars through August 26, Dota 2 Patch 7.41e, WoW Curse of Ula'tek hotfix review, Total War Patch 8.1 plus the September 24 watch item, and Crusader Kings III 1.19.0.6 plus the Q4 Silk & Silver boundary.
- Removed oversized decorative path watermarks from GTA, WoW and both strategy hubs. The Dota path portrait now occupies a reserved grid cell and disappears before it can compete with text.
- v1.8 passed branch preview review and is the current production release.

## Active release candidate: v1.9 linked hub architecture

- Replaced every long root hub with a compact portal that explains the player value, exposes the current version and routes to five standalone destinations: economy, player paths, meta, guides and tools.
- Added fifty localized section routes across five games and two languages while preserving every previous public root and calculator URL.
- Migrated quick-start outcomes, economy-map actions, player paths, scenario decks and article CTAs away from root-page fragments to the relevant focused route.
- Added publisher-sourced editorial media with explicit credits and fallbacks. Dota continues to use the existing removable Valve item and hero registry.
- Expanded Total War and Crusader Kings III from one full guide each to three, bringing both strategy guide libraries to a useful launch depth without adding unreleased mechanics to live models.
- Added route, media-policy, navigation-migration and strategy-depth tests. Sixty-one automated tests pass; 121 static pages build with zero Astro diagnostics and zero missing internal links.
- v1.8 production remains unchanged while v1.9 is validated on its branch preview.

## Active release candidate: v1.10 goal runways

- Added a standalone, shareable goal-runway model for each game in complete RU/EN parity.
- GTA tests a purchase date against weekly net flow and a protected cash floor; Dota calculates remaining item timing while preserving a player-defined buffer.
- WoW plans from liquid gold and effective GPH rather than unsold inventory; Total War tests treasury readiness by turn; Crusader Kings III tests an heir buffer across a working transition horizon.
- Every planner reports the funding gap, runway, required pace, checkpoint value and slack, then explains the result with three game-native checks.
- Added five complete operational guides linked directly to the planners, raising each research library by one decision-complete piece.
- Planner inputs persist locally and can be shared in the URL. Patch facts and editable player assumptions remain visibly separate.
- Production v1.8 and `main` remain unchanged while v1.10 is validated through the existing draft PR preview.

## Release policy

Every release is built and tested locally, deployed to a branch preview, checked for deployment errors and only then promoted to production.
