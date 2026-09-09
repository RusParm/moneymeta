# One replay decision, v1.33

## Player question

What could I have done differently at one actual entry into a fight, and what should I check before a similar entry in my next match?

The economic episode supplies a place to look. It does not establish that a fight occurred. The player chooses an actual entry within the displayed window and answers for the instant immediately before it. No precise entry timestamp is inferred.

## Supported evidence

- Reuse `DotaEpisodeContext`, its original episode and its separate fixed three-minute lookback.
- Only the selected hero's own valid nearby purchase can select a case. BKB requires named reviewed opposing immunity-piercing control; base Blink is the other supported case.
- Prefer the specific BKB interaction to the general Blink entry check. This is editorial selection, not a ranking of mistakes or impacts.
- Current-mechanic interpretations require the existing ready/partial version gate. Purchase time remains distinct from delivery, readiness and activation. Final inventory and future purchases cannot create a case.
- Coverage, patch, check date and sources remain available. No new patch verification or provider-data enrichment is claimed.

## Observations and result

Three controls start unknown: item readiness, allied follow-up and the case-specific condition. BKB asks whether the named disables could stop that entry; Blink asks whether the intended target was visible. The BKB answer about threats being unavailable applies to every listed threat and cannot exclude unlisted threats.

The result compares two conditional actions, a cost or trade-off of each and one next-match task. No output establishes the best move, a safe fight, the cause of the economic gap or a player's mistake. Results must stay cautious with unknown circumstances and incomplete profiles. Even all-positive checks cannot evaluate every enemy answer, objective or map condition.

The card sits before the existing purchase evidence, which expands on demand for eligible cases. The previous generic replay task remains the fallback for unsupported heroes, purchases, versions and missing chronology. The player can dismiss the entry case if no such action belongs in the episode; this restores the general task and removes the decision from copied notes. Reopening starts with unknown observations.

## State and copying

- Observations live only in the currently rendered page. Re-rendering for a hero, opponent, role, enriched match or new match clears them; merely switching result tabs does not.
- A reload or language navigation does not persist the observations. The interface explains how to copy the plan first.
- Copy includes the case, source purchase, player observations, alternatives, task and uncertainty. Existing replay-note copying also includes the current decision. It never copies stale answers from another case.
- No provider response storage, new local store, analytics events, account identifier or private notes in URLs. Existing shared match links retain their explicit request boundary.

## Acceptance

Model tests cover valid case selection, future/out-of-window evidence, wrong hero/side, historical dates, partial profiles and all observation branches. Unknown answers never become false negatives. Copy mirrors the evaluated state.

Browser acceptance uses match 8982871362, Slardar: the 31–34-minute economic episode includes BKB at 33:36 and reviewed Legion Commander Duel context. The initial answers are unknown. Changing replay observations changes the conditional alternatives and task; this test does not claim those synthetic answers occurred in the real match. Copy, changing hero/comparison, result-tab switching and language navigation are checked separately.

Run full tests, Astro check/build and the internal-link audit. Verify the ready preview on the tested commit before release approval. Player validation remains separate: record the player's question before the answer, then whether the answer supports a concrete change and whether the player returns with another situation.
