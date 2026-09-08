# Money Meta engineering instructions

## Product intent

Money Meta is a decision platform for in-game economies, not a generic gaming blog. Every major page should help a player understand an economy or make a concrete decision.

Primary users:

- returning players who no longer understand the meta;
- solo/casual players with limited time;
- advanced grinders who want deeper optimization.

Primary promise: **Understand the economy. Make the smarter move.**

## Product principles

- Depth first, never one-game only.
- Content attracts; interactive decision tools create retention.
- Never present estimates as verified facts.
- Every material datum needs a game version, check date, source note and verification status.
- Prefer ranges and editable assumptions to invented precision.
- English-first distribution with complete Russian product parity.
- Treat Russian as an original editorial edition, not a literal translation. Russian interface and prose must use natural Russian wording; keep English only for established in-game proper names, abbreviations and player terms that would sound less natural when translated.
- Avoid generic AI-style copy: no stacked slogans, unnecessary abstractions, repetitive three-part constructions or English product jargon inside Russian sentences. Prefer a concrete player situation, a clear conclusion and one direct action.
- Avoid em dashes in published copy. Use ordinary Russian punctuation and short sentences where possible.
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

Operate six complete living hubs: GTA Online, Dota 2, World of Warcraft Retail, Total War: Warhammer III, Crusader Kings III and Civilization VII. Deepen concrete decisions through observed player inputs, comparable alternatives and useful after-session outcomes; verify player value before monetization. Keep recurring source review and local saved-scenario reliability across all six verticals. Update Crusader Kings trade models only after Silk & Silver mechanics ship and can be verified. GTA VI and Fable remain bounded pre-release dossiers; further game expansion remains demand-led.

Read `docs/PROJECT_CONTEXT.md`, `docs/ROADMAP.md`, `docs/DECISIONS.md` and `docs/CURRENT_STATUS.md` before changing product direction.
