# Money Meta engineering instructions

## Product intent

Money Meta is a decision platform for in-game economies, not a generic gaming blog. Every major page should help a player understand an economy or make a concrete decision.

Primary users:

- returning players who no longer understand the meta;
- solo/casual players with limited time;
- advanced grinders who want deeper optimization.

Primary promise: **Understand the economy. Make the smarter move.**

## Product principles

- GTA-first, never GTA-only.
- Content attracts; interactive decision tools create retention.
- Never present estimates as verified facts.
- Every material datum needs a game version, check date, source note and verification status.
- Prefer ranges and editable assumptions to invented precision.
- English-first distribution with complete Russian product parity.
- Do not imply affiliation with game publishers.
- Do not build around cheats, botting, account selling or violations of game rules.

## Engineering rules

- Keep the MVP static-first: Astro + TypeScript, client-side calculations only where needed.
- Keep game data centralized in `src/data/`; never duplicate business metrics inside pages.
- Keep formulas in `src/lib/` and cover them with tests.
- Preserve public URLs or add explicit redirects.
- Run `npm test` and `npm run build` before considering work complete.
- Use a preview deployment before production. Never deploy to production without explicit approval.

## Current priority

Build the GTA Online Returner Toolkit and Next Best Move flow, then establish weekly data freshness and analytics.

Read `docs/PROJECT_CONTEXT.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md` and `docs/CURRENT_STATUS.md` before changing product direction.
