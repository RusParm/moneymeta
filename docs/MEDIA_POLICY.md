# Money Meta media policy

## Default rule

Money Meta must remain visually premium even if every publisher asset disappears. Original brand worlds, code-rendered diagrams, charts and product UI are the default visual layer.

“No visible prohibition” is not treated as permission for commercial use.

## Media classes

### A: owned brand assets

- Original Money Meta illustrations, generated assets and commissioned work.
- Safe for heroes, hub cards, social crops and product marketing after internal review.
- Keep source files, generation prompts or artist agreements and edit history.

Current original world assets:

- `src/assets/game-worlds/gta-economy-world.webp`
- `src/assets/game-worlds/dota-economy-world.webp`
- `src/assets/game-worlds/wow-economy-world.webp`
- `src/assets/game-worlds/total-war-economy-world.webp`
- `src/assets/game-worlds/ck3-economy-world.webp`

The Total War and Crusader Kings worlds are original Money Meta campaign-economy illustrations. They contain no publisher logos, character likeness requirements or readable game UI. They can be replaced without changing any calculation or information architecture.

### Dota editorial identifiers

The Dota living hub links item icons and hero portraits from Valve's official Dota asset CDN only inside mechanic explanations, role lenses, scenarios and research cards. They are not stored as a substitute art pack and are not used as the primary brand hero.

- Owner: Valve.
- Placement purpose: editorial identification of the exact item, hero archetype or objective under analysis.
- Commercial status: pending exact-use rights review; not treated as a blanket license.
- Fallback: every placement has a styled text fallback and can be removed without breaking the product.
- Record: `src/data/dota-hub.ts` → `dotaMediaPolicy` and `dotaMedia`.

### B: product visuals

- HTML/SVG economy maps, charts, comparison matrices and calculator states.
- Numbers remain data-driven and cannot be baked into decorative raster art.
- Preferred for explanations, search graphics and screenshots of Money Meta itself.

### C: first-party game captures

- Use only when a screenshot is necessary to discuss a specific mechanic, interface or change.
- Capture source, game version, date and editorial purpose.
- Crop only as needed for the analysis; never use a capture as an unlicensed decorative hero.
- Review publisher rules again before enabling advertising, sponsorship or paid access around the page.

### D: publisher or press assets

- Use only when the asset has explicit terms that cover the exact commercial/editorial context or written permission has been obtained.
- Store the permission URL or correspondence alongside the asset record.
- Attribution is not a substitute for a license.

### E: community and creator media

- Written permission is required before storing or republishing it.
- Record creator, source URL, allowed placements, monetization terms and revocation contact.
- Embedding an authorized original post is preferred when it preserves attribution and context.

## Current publisher-risk finding

- [Rockstar / Take-Two policy](https://support.rockstargames.com/articles/7bNaeoMFTV0iUDGhStTXvz/policy-on-posting-copyrighted-rockstar-games-material) describes its general fan-content tolerance as non-commercial and directs digital-publishing licensing requests to the rights holder.
- [Blizzard legal FAQ](https://www.blizzard.com/en-us/legal/28d5ebbf-c245-4408-8ba9-043dd5f056bf/legal-faq) limits its general fan-site material license to personal, non-commercial use.
- [Valve video policy](https://store.steampowered.com/video_policy?l=english) permits monetization through video-platform partner programs, but that does not create a blanket commercial website-art license.

This is a product risk policy, not legal advice. Commercial exceptions should be verified for the exact proposed use.

## Asset record

Every third-party visual needs:

- owner and original URL;
- asset type and page placement;
- license or permission basis;
- required attribution;
- date checked;
- game version when relevant;
- review status and removal path.
