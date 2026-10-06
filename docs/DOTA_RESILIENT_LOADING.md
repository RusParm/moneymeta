# Dota: preserve a review during provider failures

A failed new load previously erased the current match, selected hero and unsaved replay observations before receiving any replacement. The September 18 Slardar walkthrough also showed a provider HTTP 522 being presented with an invitation to check the Match ID.

## Behavior

- Keep the displayed match, hero, episode and observations while a new read is pending, fails or is cancelled. The status names both the requested Match ID and the retained match so old evidence cannot be mistaken for the new result.
- Commit a replacement only after a valid matching response. Reject a thinner response for the same match using the existing replay-evidence coverage check. A successful new load resets replay decision answers instead of transferring them between matches.
- One read at a time. An explicit Cancel loading action aborts the browser wait immediately; late results and errors cannot mutate a newer request. Leaving the page cancels the wait and unlocks controls before a possible back-forward cache freeze. This is not a promise that an upstream server stopped processing its read.
- Classify only known relay codes. Distinguish provider outages, access restrictions, rate limits, missing matches, timeouts and rejected payloads. Never display raw upstream text. Only a genuine not-found state suggests checking the ID.
- During a read, lock the request field and loading/demo buttons; restore them on completion or cancellation. Replay parsing controls are unavailable while a separate match is loading. No automatic retry, replay-parse submission, provider switch or additional telemetry.
- Error/cancel actions include an explicit provider-page link with the requested ID and the existing saved-task journal. No provider request occurs merely by showing a link or opening the journal.

## Evidence and limits

The previous attempt returned OpenDota HTTP 522 in the Vercel runtime log. Tests exercise the outage classification, retained model on failure, duplicate submission, immediate cancellation, late success and late rejection races, and rejection of a replacement by its validator. Final deployment/browser results are recorded in the PR.

No local cache of provider responses is added: preservation lasts for this open page. Existing deliberate task saves retain their independent bounded journal. External provider uptime is not fixed by this change.

## Product sequence

The September 14 saved calibration and GTA test plan both prioritize actual player tasks and identify the player tests as prepared, not completed. After this reliability repair, the next evidence remains new player matches and observed GTA/WoW sessions. Do not infer demand from synthetic tests, add generic tools to fill this evidence gap, or contact communities without the owner's specific request.
