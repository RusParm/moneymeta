# Current status

Updated: 2026-09-04

## Active release candidate: v1.22 Dota economic autopsy

- Replaced Match Audit's single slow-GPM or item-median prompt with a deterministic phase diagnosis that asks where the comparative economy actually moved.
- Added an exact same-position opponent comparison when OpenDota supplies one unambiguous position match. GPM and final net worth never choose the opponent.
- Added 0-to-10, 10-to-20, 20-to-30 and final phase analysis across player gold, opponent gold, direct-position gap, full-team gap and the player's share of team economy.
- Split material windows into personal-comparison, team-pressure and mixed signals using visible thresholds: 750 position gold, 1,500 team gold or 1.5 percentage points of team share.
- Added a confidence label from ten-player timeline coverage, final-only direct-opponent and team context, and a clearly bounded item-delay equivalent based on the selected player's pace inside the critical window.
- Upgraded the gold chart to compare the selected hero with the direct opponent and added one exact replay window with a four-check inspection list.
- Model and UI-contract tests cover direct-position pairing, personal versus team separation, threshold disclosure, final-only fallback and the new analysis surface. Full release gates and HTTPS preview QA remain before handoff.

## Active release candidate: v1.21 GTA Business Rivalries live cycle

- Replaced the expired August 27 through September 2 GTA snapshot with Rockstar's official September 3 through 9 Executive week inside the month-long Business Rivalries Event.
- The live planner now compares 4X Special Vehicle Work, 3X Community Mission Series and 2X Export Mixed Goods without inventing a payout or run time.
- Access gates distinguish an unlocked Special Vehicle Work route from an Executive Office plus Special Cargo Warehouse. Switching routes clears the previous route's access confirmation.
- The GTA pulse separately exposes the GTA$1,000,000 Special Cargo Weekly Challenge, doubled warehouse staff sourcing, free Arcadius Business Center Office and the later Penaud La Coureuse claim window.
- Dates in the GTA pulse and planner are formatted from the central snapshot instead of being copied into component text. The GTA portal now uses the current official Business Rivalries artwork and source.
- Local gates pass with 157 tests, zero Astro diagnostics and 587 generated pages. Refreshed HTTPS preview QA remains before production handoff.

## Active release candidate: v1.20 game-first entry and visible match loading

- The homepage now begins with a neutral game choice instead of routing every visitor into Dota 2. GTA is the initial example, while all seven game worlds retain equal, immediate tab access.
- Removed the full-width Dota item demo from the homepage. Dota-specific tools appear only after the visitor selects Dota.
- Added an inline public Match ID loader to the Dota homepage panel. An explicit submit opens Match Audit and starts the already approved request automatically.
- Match Audit now uses one primary `Load and audit match` action through the sanitized same-origin relay. The separate direct and fallback controls no longer make the reliable route look hidden.
- Restored the shared Dota navigation and status styling on Match Audit by loading its missing stylesheet.
- Game tabs reserve space for status indicators and allow two-line labels. Loaded item media hides fallback initials, uses contained item art and cannot occupy the text column.
- Local gates pass with 157 tests, zero Astro diagnostics and 587 generated pages. HTTPS preview QA passes the neutral homepage, visible Match ID entry, automatic audit load, ten-player result, final inventory and timed purchase flow.

## Active release candidate: v1.19.2 resilient Dota match retrieval

- Replaced the fragile 18-second direct-request cutoff with a 30-second boundary and a distinct explanation that points to a separately chosen fallback.
- Added an explicit same-origin Money Meta relay for slow or blocked OpenDota paths. The relay receives one public Match ID in a POST body, makes one read-only provider GET and returns only the existing sanitized match shape.
- Relay responses are `no-store`; the function has no database, sends no cookies, never requests replay parsing and logs only anonymous duration, status and payload-shape diagnostics.
- Direct and relayed requests retain separate RU/EN loading, timeout and failure states. A shared audit URL still never starts either request automatically.
- Local gates pass with 157 tests, zero Astro diagnostics and 587 generated pages. Vercel function deployment and live direct/relay browser QA remain before handoff.

## Active release candidate: v1.19.1 Dota match audit reliability

- Final inventory now comes from the public match response even when replay timelines are absent: six active slots, three backpack slots and two neutral slots are retained separately from timed purchases.
- A complete 409-item non-recipe ID reference from `odota/dotaconstants` resolves current, neutral and uncommon inventory items. Unknown valid IDs remain visible instead of being silently dropped.
- Position display now retains OpenDota's position estimate, lane role and roaming flag. Broad core or support inference still uses only the explicit position estimate, never final GPM or net worth.
- Missing replay parsing is described precisely as missing minute-by-minute gold or a timed purchase log. It is no longer described as missing items when a final loadout exists.
- Item names moved out of the SVG chart into a numbered responsive legend, eliminating collisions between nearby purchases. Hero and item media now has a deliberate readable fallback when the external image cannot load.
- Local gates pass with 153 tests, zero Astro diagnostics, 587 generated pages and zero missing targets across 25,352 internal navigation links.
- HTTPS preview QA passes the RU and EN public-demo flows: ten-player selection, eight populated final-inventory cards for the selected hero, five timed purchases, five numbered chart markers and the matching five-card legend. The checked result has no application console errors, page-level horizontal overflow, broken visible images or content escaping its result cards.

## Base release candidate: v1.19 Dota match economy audit

- Added a complete RU/EN audit that turns an explicitly submitted public Match ID into a hero-specific economy replay without Steam login, local files or game-client access.
- The page performs only a direct read-only OpenDota GET after a button press. It never auto-fetches a shared URL and never requests remote replay parsing.
- The response is reduced before analysis to hero, slot and economy fields. Account identifiers, player names, chat and every unused field are discarded.
- Parsed matches show accumulated-gold checkpoints, interval pace and completed major-item timings. Unparsed matches remain an honest final snapshot instead of receiving an invented curve.
- Professional timing context is restricted to patch family 7.41, the player-selected role and samples of at least 200 first purchases. Role correction changes only that comparison, not match facts.
- Share URLs contain only the public Match ID, player slot and selected role. Match data is not written to local storage.
- The current Dota snapshot was retrieved on 2026-09-02 from 742 raw matches, with 434 role-eligible matches, 4,074 classified player rows, 93.9% role coverage and 188 observed items.
- The audit has dedicated entry points in the Dota portal, tools surface, item navigation and sitemap. Local gates pass with 150 tests, zero Astro diagnostics, 587 generated pages and zero missing targets across 25,352 internal navigation links.
- HTTPS preview QA passes the empty shared-URL state, explicit demo request, ten-player selection, parsed Necrophos audit, role override, RU/EN rendering and tools-page entry. The verified result contains four checkpoints, five major purchases and five chart markers, with zero site console errors or horizontal overflow.

## Active release candidate: v1.18 GTA weekly journal

- Added a complete RU/EN close-the-loop layer to the GTA weekly planner.
- A player can save only a complete stay, test or switch decision before the session. Missing, expired, no-fit and asset-ineligible states cannot enter history.
- The saved record keeps the official week boundary, selected route, player inputs and calculated projection as one auditable snapshot.
- After play, the player adds total GTA$ earned and actual minutes. The interface compares actual, planned and normal rates on a GTA$/h basis.
- Closing an outcome makes the entire record immutable. The forecast cannot be rewritten after the fact.
- Local parsing rejects malformed records, keeps the newest record for a duplicated week and limits history to eight weeks.
- Journal values never enter the share URL or a network request. The player can clear all local history explicitly.
- Release gates pass with 140 tests, zero Astro diagnostics, 585 generated pages and zero missing targets across 26,391 internal links.
- HTTPS preview QA passes the empty state, save, reload, close, immutable-result and RU/EN history flows with zero site console errors or horizontal overflow. Journal values remain absent from shared URLs.

## Base release candidate: v1.17 GTA weekly decision loop

- Replaced the expired Brand Wars pulse with Rockstar's August 27 through September 2 Random Transform Races snapshot.
- Added a complete RU/EN weekly planner for 3X Random Transform Races, 2X Drift Races and 2X Auto Shop Robbery Contracts.
- The planner waits for the player's normal GTA$/h, observed base payout and observed run time instead of publishing an invented average.
- Session comparison includes route-switching time, repeatability, a player-defined lift threshold and the full normal-route opportunity cost.
- The GTA$100,000 Drift reward activates only after three complete runs; Auto Shop contracts remain ineligible without an already owned property.
- Scenario inputs, share URL and a new-week marker remain local to the browser with no account or network data channel.
- The expired August 28 through 30 6X window is labeled archive and excluded from every result.
- GTA homepage entry and the focused meta route now lead directly to the weekly decision surface; long-term business rankings remain a separate layer below it.
- Release gates currently pass with 131 tests, zero Astro diagnostics, 585 generated pages and zero missing targets across 26,391 internal links.

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

## Production release: v1.10 goal runways

- Added a standalone, shareable goal-runway model for each game in complete RU/EN parity.
- GTA tests a purchase date against weekly net flow and a protected cash floor; Dota calculates remaining item timing while preserving a player-defined buffer.
- WoW plans from liquid gold and effective GPH rather than unsold inventory; Total War tests treasury readiness by turn; Crusader Kings III tests an heir buffer across a working transition horizon.
- Every planner reports the funding gap, runway, required pace, checkpoint value and slack, then explains the result with three game-native checks.
- Added five complete operational guides linked directly to the planners, raising each research library by one decision-complete piece.
- Planner inputs persist locally and can be shared in the URL. Patch facts and editable player assumptions remain visibly separate.
- v1.10 passed branch-preview review, was squash-merged through PR #7 and is the current production release.

## Production release: v1.11 connected decision playbooks

- Added three authored decision playbooks to every game hub: fifteen playbooks and thirty localized RU/EN routes in total.
- Each playbook connects four deliberate steps across economy, player path, current meta, a model or planner and applied analysis instead of sending readers through a cyclic related-card list.
- Hub roots now expose the playbooks as compact entry points; focused section pages, goal planners and matching Field Notes show the player's current step and one concrete next move.
- Every playbook defines the player situation, decision window, starting signal, success condition, failure condition and three game-native operating rules.
- Rechecked all five live context boundaries against first-party publisher sources on 2026-08-19. Total War now names Hotfix 8.1.1 as live while keeping the economic analysis explicitly tied to Patch 8.1.
- Playbooks remain standalone URLs rather than adding another long document to the hub root. Existing public routes remain unchanged.
- Seventy-one automated tests passed, 171 static pages built with zero diagnostics and 6,317 internal links resolved with zero missing destinations.
- Branch preview passed complete RU/EN playbook, context-rail, planner-interaction and responsive layout QA.
- v1.11 was squash-merged through PR #8 and is the current production release.

## Active release candidate: v1.12 GTA VI Economy Watch

- Added a compact GTA VI living dossier in complete RU/EN parity without presenting the unreleased game as a live modeled economy.
- Added focused routes for confirmed economy signals, GTA Online precedent boundaries and a first 72-hour measurement protocol.
- Added three substantial bilingual Field Notes covering the confirmed fact layer, reusable analytical lenses and launch measurement discipline.
- Current evidence uses first-party Rockstar Games and Take-Two sources checked on 2026-08-20. Release date, launch platforms, single-player format and US edition pricing are separated from unconfirmed player mechanics.
- Four narrative signals store the direct evidence, claim boundary and future test. Eight material unknowns remain visibly unresolved.
- Five official media records carry explicit Rockstar Games credit, source links, localized alt text and removable placement.
- Homepage, global navigation, footer, Field Notes and sitemap now expose the watch while keeping the product count at five live economies and fifteen models.
- Seventy-seven automated tests pass, 185 static pages build with zero Astro diagnostics and the next gate is branch-preview responsive browser QA.

## Release policy

Every release is built and tested locally, deployed to a branch preview, checked for deployment errors and only then promoted to production.

## Production release: v1.13 Dota item atlas

- Added a build-time OpenDota snapshot for the Patch 7.41e professional cohort with visible match count, role coverage and source boundaries.
- Added complete RU/EN item-atlas routes with search, role and sample filters, explicit pagination and a standalone analysis URL for every observed item and component.
- Added transparent stat pricing from clean base-item references. Active abilities, passive effects, slot compression and timing utility remain explicitly unpriced.
- Added a shareable two-to-five-item planner with current minute, sustainable GPM, available gold, projected completion minutes, professional median deltas and delay from earlier purchases.
- Added curated decision analysis for high-impact items plus derived role and replay questions for the full catalog.
- Added a daily automation that updates only a dedicated snapshot branch and pull request after validation, tests and static build pass.
- The current snapshot contains 367 parsed professional matches, 3,183 classified player rows, 86.7% role coverage and 188 observed items or components.

## Active release candidate: v1.14 compact decision portals

- Rebuilt all five localized root hubs around three deliberate layers: current context, game-native quick start and a compact command center.
- Removed the duplicated full destination grid, media gallery, long guide cards, expanded playbook rail and standalone source section from every root without removing their focused URLs.
- Kept five direct section routes, three authored playbooks, two current editorial entry points and the primary source boundary visible inside one compact navigation surface.
- Added a Dota-specific item strip linking directly to the atlas and build planner without restoring the full catalog on the hub root.
- Mobile gateway choices, destination cards, playbooks and guide entry points use contained horizontal rails. Text and marks occupy separate grid columns with explicit minimum-width guards.
- Fixed the Dota item atlas cascade bug that rendered hidden cards. Pagination now shows twelve cards per page and has a regression test for both page size and hidden-state display.
- Ninety automated tests pass. Five hundred sixty-five static pages build with zero Astro diagnostics. HTTPS preview browser QA remains required before production promotion.

## Preview candidate: shorter home, item comparison and honest freshness

- Replaced the long homepage introduction with a short explanation, a concrete Dota comparison and direct entry points for all five game hubs. Existing focused routes, guides and the GTA VI dossier remain available in both languages.
- Added `/dota-2/items/compare/` and its English equivalent. Each alternative receives the same independent budget; the model shows full price, missing gold, time to save, explicit stats, editorial purpose and guarded role observations. It never assigns a universal winner.
- Reused local scenario storage and share links, with input validation and storage-failure handling. A positive-income scenario can transfer both items into the existing consecutive-purchase planner.
- Added a shared freshness indicator that checks dates at build time and in the browser. Dota collection expires after 48 hours. GTA weekly events stop looking current after their end date. Collection dates, last observed match and mechanics-review dates remain separate.
- Audited the failed scheduled refreshes through August 30. Earlier runs exposed upstream HTTP failures; the latest run retrieved 700 matches but correctly stopped when the global role coverage fell to 65.1%. Constants can fall back to OpenDota's maintained GitHub repository, while match statistics still fail closed. Successful retrievals advance `fetchedAt`, while `dataUpdatedAt` records content changes.
- Role quality is now checked per match before a match enters timing statistics. The raw patch cohort remains visible in the snapshot, and the same eligibility rule is used for cohort totals and item timings. The automation still requires at least 300 eligible matches and at least 80% role coverage.
- A real refresh on August 31 succeeded: 719 raw league matches, 422 role-eligible matches, 3,969 classified player appearances, 94.1% role coverage and 188 items. The latest eligible match is from August 31.
- Added retrieval, role-cohort, independent-budget, zero-income, weak-sample and freshness boundary tests. All 102 tests pass and 567 pages build with zero Astro diagnostics.
- Desktop preview checks confirm the homepage entry, live recalculation, zero-income handling, sample suppression, copied URL restoration, invalid-input handling, English rendering and transfer into the cumulative planner. At the same 1363px viewport, homepage height fell from 7229px to 2128px and game selection moved from 3154px to 683px. No production promotion is authorized.
- Responsive CSS review added shrinking grid tracks, wrapping item names, 16px comparison inputs and 44px scenario buttons. Comparison fields stack below 380px. The owner reviewed the branch preview and reported no blocking visual issue; a fresh preview check is still required after the role-cohort update. No production promotion is authorized.

## Active release candidate: v1.15 gamer-first homepage

- Replaced the compact card-grid homepage with a cinematic five-game launcher. Each game opens one recognizable player situation, names the inputs that matter and offers two direct action routes plus the full hub.
- Defaulted the launcher to Dota 2 and added a real homepage timing check for Blink Dagger and Force Staff. Gold now, gold per minute and current minute update both completion times and the contextual verdict through the shared tested item-comparison function.
- Kept the conclusion deliberately conditional: a close timing does not produce a universal item winner, and zero farming rate does not produce an invented completion minute.
- Promoted the existing owned game-world art from small thumbnails to the main decision surface. Each game changes the launcher accent without changing the shared interaction contract.
- Collapsed freshness, three selected analyses, the GTA VI dossier and the evidence boundary into compact lower sections so the first useful action no longer waits behind product explanation.
- Added keyboard tab behavior, explicit hidden-state CSS, responsive horizontal game selection and single-column mobile controls.
- Local gate: 103 automated tests pass, 567 pages build and Astro reports zero diagnostics. Branch preview and responsive browser review remain required before production promotion.

## Active release candidate: v1.16 Civilization, Fable and local trust

- Added Civilization VII as a sixth live economy in complete RU/EN parity with a compact portal and focused economy, current-version and tools routes.
- Added three tested, editable Civilization models: building payback window, settlement development choice and Economic Victory GDP gap. Values come from the player's current game and scenarios persist locally with shareable URLs.
- Added Fable as a bounded pre-release dossier with confirmed economic signals, six explicit unknowns, a first-72-hours protocol and a dated Xbox Wire evidence registry.
- Kept Fable out of live numeric models until the Autumn 2026 release build can be measured repeatedly.
- Added a working browser-only Money Meta scenario JSON importer. File reading requires explicit selection, persistence requires a separate action and the component contains no network request path.
- Published the safety contract for future local connectors: read-only, loopback-only, explicit pairing, path allowlists, local audit logs and no memory inspection, injection, credential collection or writes to game files.
- Expanded homepage discovery and global navigation to seven game worlds, six live economies and two pre-release dossiers including GTA VI.
- Added two original Money Meta economy-world assets for Civilization VII and Fable. They contain no publisher artwork, logos or identifiable characters.
- One hundred sixteen automated tests pass. Five hundred eighty-five static pages build with zero Astro diagnostics. HTTPS preview browser QA remains required before production promotion.
