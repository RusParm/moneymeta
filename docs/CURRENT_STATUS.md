# Current status

Updated: 2026-08-11

## Baseline

The production repository contained three standalone HTML files with CDN Tailwind on two pages and a separate CSS system on the calculator. There was no package manifest, build step, type checking or test suite.

## Implemented in `product/v0.3`

- Branch: `product/v0.3` (local only until reviewed).
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

- `npm test`: 6 tests passing.
- `npm run build`: type check and static build passing.
- All six public RU/EN routes plus robots.txt and sitemap return a successful static response.
- Browser-level visual QA remains required before production deployment.

## Deployment state

No GitHub push or Vercel deployment has been performed in this branch.
