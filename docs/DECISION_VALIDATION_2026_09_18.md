# Decision review · September 18, 2026

Preview increment stacked on the September game-data branch. Production remains unchanged.

## Dota: dated mechanic reviews

Reviewed all 72 recorded hero profiles and 15 purchase prompts against Valve's complete 7.41f delta and September 15 accompanying fixes:

- https://www.dota2.com/patches/7.41f
- https://www.dota2.com/newsentry/677383425371407609

This is a delta review of the previously checked OpenDota ability/item blobs, not a newly collected ability database or statistical cohort. Recorded capabilities are qualitative; no power rankings, durations, damage amounts or win probabilities are inferred.

| Patch change intersecting a recorded hero/item | Why the existing bounded statement survives |
| --- | --- |
| Anti-Mage Mana Break, Shadow Fiend souls/raze, Slardar Crush | Magnitudes change; damage/armor/stun traits do not claim these amounts. |
| Clockwerk Cogs, Mirana Arrow, Winter Wyvern Cold Embrace | Mana, duration or healing changes; recorded barrier/stun/heal and damage-type limits remain. |
| Earth Spirit talents/remnant count, Ember stats, Marci Rebound speed | No charge count, talent bonus or speed number is used in rules. |
| Underlord Pit loses Scepter upgrade, Gate cooldown | Profile describes base root and portal travel; upgrades are explicitly omitted. |
| Enigma Scepter pull/Eidolons; Bane armor/Nightmare fix | Profile describes Black Hole/Fiend's Grip control, not those changed features. |
| Invoker Ghost Walk Shard, Spirit Breaker Planar Pocket fixes | Neither mechanic occurs in their recorded profiles or item interaction prompts. |
| Other changed heroes present in the catalog | Changed stats or abilities are absent from recorded evidence (e.g. Spectre Desolate, Lifestealer Rage/Infest, Lone Druid Entangle). |
| Manta ranged illusion damage, Halberd price | Purchase prompts describe illusions/basic dispel and disarm, without damage or price claims. |
| Blink and BKB | No 7.41f changes to the bounded reviewed mechanics. |

Original 7.41e matches keep their September 8 review and original sources. A separate 7.41f review covers September 16–18 UTC. September 15 is withheld because release hour is unknown. Matches beyond the review date, unknown timestamps and other patch families remain unsupported. Extend the reviewed interval only after checking subsequent notes. Replay decisions require a matching patch/date pair and inherit that review's sources.

The raw 7.41e item timing cohort is unchanged and remains unavailable as a current-patch benchmark. A read-only 7.41f Explorer cohort query timed out; no new sample, role coverage or distribution is claimed. Mechanical review does not require a professional-match sample.

## WoW: funding before paper profitability

Deployed walkthrough exposed a misleading priority: with only 10,000 gold, the 16,740-gold batch still led with a profit headline. It now first distinguishes insufficient cash from spending the protected reserve. Hypothetical profit and negative cash comparisons remain visible, but do not imply the batch can be funded. The action directs the player to reduce the batch or check wallet/reserve; future revenue cannot finance upfront spending.

Synthetic fixture: materials 825/craft, output 5, sale price 225/unit, deposit 12/craft, cut 5%, requested 20 crafts, wallet 10,000, reserve 5,000, total sales cap 70, existing stock 60. Cash alone fits 5 crafts; remaining sales fit 2. Explicit resize produces 10 new units, outlay 1,674, cash after crafting 8,326 and conditional cash gain 487.5. No old-stock proceeds or cost basis are invented.

## GTA: one-hour plan

The existing synthetic homepage example hands off 60 minutes and exact assumptions to the session planner. Two missions take 55 minutes and yield 280,000. Reducing time to 55 preserves the plan; 70 minutes allows one ready-stock sale plus one mission for 340,000. The longer plan replaces the combination, not an imaginary extra run. RU/EN continuity is checked. No formula change was needed.

## Acceptance and next evidence

Automated gates and final deployed checks are recorded in the PR. Synthetic calculations verify implementation, not player value. The already supplied Slardar match is the real-data regression case; no new player observations are fabricated. Next evidence needed: a fresh match and actual measured GTA/WoW receipts, durations and sales to assess whether the advice changes a decision. No new pages, rankings or monetization added.
