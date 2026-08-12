# Current status

Updated: 2026-08-12

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

## Release policy

Every release is built and tested locally, deployed to a branch preview, checked for deployment errors and only then promoted to production.
