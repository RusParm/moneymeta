# Current status

Updated: 2026-08-11

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

## Production release — `product/v0.4`

- Dota 2 RU/EN Economy Lab.
- Hand of Midas incremental ROI and payback model.
- Buyback Reserve model with objective timing.
- Patch 7.41 context, editable baselines and source disclosures.
- Home, sitemap, version and documentation updated for two active economies.

## Active release candidate — `product/v0.5`

- World of Warcraft Retail Economy Lab in RU/EN.
- Crafting Margin model with Auction House cut, sell-through and inventory risk.
- Farm Liquidity model separating listed GPH from effective GPH.
- Midnight / Curse of Ula’tek context, editable assumptions and source disclosures.
- Home, sitemap, version and documentation updated for three active economies.

## Release policy

Every release is built and tested locally, deployed to a branch preview, checked for deployment errors and only then promoted to production.
