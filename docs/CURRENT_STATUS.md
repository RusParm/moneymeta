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

- `npm test`: 16 tests passing across the GTA, Dota and WoW economy models.
- `npm run build`: type check and static build pass with zero diagnostics.
- All eleven public pages plus robots.txt and sitemap build successfully.
- Desktop and mobile browser QA passed for the WoW calculators, three-economy home and RU/EN routes.
- v1.0 browser QA passed for desktop/mobile layout, zero horizontal overflow, cross-economy navigation, scenario URL sharing, local restore, reset and decision-state rendering.

## Production release — `product/v0.4`

- Dota 2 RU/EN Economy Lab.
- Hand of Midas incremental ROI and payback model.
- Buyback Reserve model with objective timing.
- Patch 7.41 context, editable baselines and source disclosures.
- Home, sitemap, version and documentation updated for two active economies.

## Release — `product/v0.5`

- World of Warcraft Retail Economy Lab in RU/EN.
- Crafting Margin model with Auction House cut, sell-through and inventory risk.
- Farm Liquidity model separating listed GPH from effective GPH.
- Midnight / Curse of Ula’tek context, editable assumptions and source disclosures.
- Home, sitemap, version and documentation updated for three active economies.

## Production release — `product/v1.0`

- Unified premium product shell and cross-economy navigation.
- Decision-first homepage with visible model coverage and trust signals.
- Ranked GTA opportunity cards plus current Weekly Meta freshness and source disclosure.
- Persistent, resettable and shareable scenarios across GTA, Dota 2 and WoW calculators.
- Positive, caution and negative result states for faster interpretation.
- Bundled variable typography, keyboard focus treatment and reduced-motion support.

## Active release candidate — `product/v1.1`

- Rebuilt homepage around a concrete promise: stop grinding blind and get a decision in roughly 30 seconds.
- Interactive GTA, Dota 2 and WoW baseline cases above the fold.
- Seven direct question-to-tool entry points instead of architecture-first navigation.
- Game-specific quick-start decks, visual accents and featured analysis links across every vertical.
- Money Meta Field Notes with three flagship analyses in complete RU/EN parity.
- Article-to-tool loops, Article schema and expanded sitemap coverage.
- Nineteen static pages pass desktop/mobile overflow and interaction QA.

## In development — v1.2 living hubs

- Three original, responsive economy-world hero assets now establish a distinct GTA, Dota and WoW visual identity.
- A shared optimized hero component keeps responsive image delivery, overlays and performance consistent across all verticals.
- The complete living-hub product anatomy and commercial media policy are documented.
- Next gate: choose and implement the first benchmark hub end to end, then transfer the proven system to the remaining verticals.

## Release policy

Every release is built and tested locally, deployed to a branch preview, checked for deployment errors and only then promoted to production.
