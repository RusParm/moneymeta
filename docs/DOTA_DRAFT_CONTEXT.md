# Dota draft context, first release

## Player question

Which opportunities do these two lineups create, what makes them work, and which actual purchases changed the available options?

The match audit has a dedicated Draft strengths / Сила составов tab. It presents both sides, named ability evidence, conditions for an interaction and a replay question. The economy summary links directly to it. The former Main finding label is now Economic episode to review: numerical deterioration is not a diagnosis of an execution error.

## Model and observations

The deterministic editorial model recognizes reviewed combinations such as armor reduction plus a different hero's physical damage, Soulbind plus an eligible targeted spell, and long-range movement against a lineup with area control. Rule ordering reflects editorial specificity, not magnitude of advantage.

The separate purchase timeline shows the first valid logged purchase of selected strategic items on both teams, with a ten-minute period filter. Purchase time is distinct from delivery, activation, effectiveness or the time a team became stronger. BKB context names reviewed enemy abilities that pierce debuff immunity.

This release does not estimate an overall winner, win probability, five-on-five damage, lane outcome or a fixed peak by minute. It does not model rank, inferred positions, facets, upgrades, stolen abilities, map vision or cooldown availability. These are visible scope limits.

## Data boundaries

- `src/data/dota-draft-profiles.ts`: reviewed mechanics and immutable source. Capability classification is editorial, not a provider power rating.
- `src/data/dota-draft-rules.ts`: bilingual conditions and comparison axes. Missing traits mean unrecorded capability, never a confirmed weakness. Counts measure profile coverage.
- `src/data/dota-draft-purchases.ts`: item explanations based on the existing checked 7.41e item snapshot. Historical purchase facts remain visible when current-mechanic interpretations are disabled.
- The reviewed release is 7.41e. OpenDota patch ID 60 only identifies the 7.41 family. Match start must also be on or after the first full UTC day after Valve's July 30 release announcement. Release-day, earlier and unknown dates conservatively suppress current-mechanic interpretations. A future update requires profile and cutoff review.
- A valid comparison requires ten distinct heroes in the standard two sets of five player slots, with matching sides. Malformed lineups cannot produce inferred five-on-five conclusions.
- Partial coverage preserves known positive evidence and names unreviewed heroes. It never establishes that the opponent lacks an answer.

Sources: [immutable OpenDota ability data](https://api.github.com/repos/odota/dotaconstants/git/blobs/3f1229d41b1b07beb0a08e125ecb6e3a9118b8cd), [Valve's 7.41e release announcement](https://www.dota2.com/newsentry/678505520073540065). Item sources accompany each explanation.

## Invariants and acceptance

Draft findings depend on hero identity, side and version scope. Outcome, KDA, farm, inventories and inferred positions cannot change them. Changing the selected side exchanges opportunities and threats without changing observations. A multi-hero synergy requires distinct heroes.

Control that restricts allied spell damage cannot trigger a spell-damage follow-up rule. It remains in the capability comparison. Offensive dispels are not classified as allied protection. Physical spell damage is not described as requiring ordinary attacks. Remote spell damage is not treated as teleportation.

Invalid or out-of-match purchase times and unrecognized keys are excluded. Final inventory cannot manufacture a purchase time. No new provider calls, account identifiers, local notes or telemetry are introduced.

Tests use synthetic lineups and identifiers, covering perspective, result invariance, partial coverage, malformed lineups, version dates, incompatible control, purchase chronology and contextual interactions. Full tests and Astro build remain required. Browser gates cover real provider loading, RU/EN, tab navigation, period filtering and visible layout.

Product acceptance remains whether a player can explain a concrete decision or recognize a well-played difficult phase. More profiles and passing tests do not establish utility or retention.

## Next analytical layer

Build a statistical model from patch-, role- and skill-appropriate cohorts. OpenDota's annual matchup endpoint and final-duration win rates are not ready-made current-patch power curves. Validate probabilities on subsequent matches, compare simple baselines and check calibration in the intended audience. Separately evaluate XP/level, objective and teamfight fields and their actual coverage before interpreting current game phases. Post-match results must not enter a supposedly pre-match feature.
