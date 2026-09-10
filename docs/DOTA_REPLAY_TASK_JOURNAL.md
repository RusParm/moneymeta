# Replay task journal, v1.34

## Player question

What did I decide to check before my next entry, and did I actually make that check when a comparable situation arose?

v1.33 supplies a bounded conditional task. This increment lets the player keep it and return after play. It does not claim that saving or checking a task improves skill or explains a match result.

## Working flow

1. In an eligible BKB or Blink decision, explicitly save the displayed task. A `verify` focus has no task selected yet. A known obstacle can produce a useful task with other observations still unknown; those remain unknown in the snapshot.
2. The Dota homepage panel and match audit show the latest open task, or the latest recorded result. `/dota-2/tasks/` and its English equivalent open without requesting match data.
3. Record one self-report after play: checked, missed, or no comparable situation. No answer is selected by default. An optional note is limited to 500 characters.
4. The outcome closes the attempt. Its original task and observations stay unchanged. Repeating creates a separate open attempt from the historical task; the new match's heroes and conditions must be checked afresh.
5. Remove unwanted records explicitly. The eight-record journal never silently evicts existing work.

## Data boundary

Only a deliberately selected task snapshot is persisted: public source match ID and selected slot/role/opponent, hero identity, episode and purchase context, patch/check date, original language, task text, observation values and the bounded historical decision note. A subsequent self-report is separate and dated. No public match lookup occurs on a journal page, reload, language switch or local return link.

Provider responses, full timelines, inventory, player/account identities, chat and credentials are excluded. No new telemetry is added. A local return URL contains only a random task UUID in the fragment. The explicit source-audit link carries validated public match parameters and never an autoload flag, task notes or outcomes.

Stored text is rendered as text. Original language and historical context remain visible after a language change. A saved snapshot is never re-evaluated under new mechanics or used to populate the live observation controls.

## Reliability

Reads and writes enforce the same schema and aggregate bounds. Unsupported, corrupt or unavailable storage cannot be interpreted as an empty writable journal. Mutations read current storage and compare an expected record token; stale updates and deletes cannot overwrite a newer result or resurrect removed work. Closed outcomes are immutable. Capacity and duplicate states explain why a save did not occur.

The snapshot is an explicit extension of v1.33's memory-only task scope. Loading a provider response still does not save it.

## Acceptance

- Slardar task save, reload and return without another match load.
- Unknown observations preserved; all-unknown review cannot become a next-match prescription.
- Change live observations/hero/role/opponent without changing the saved snapshot.
- Each self-report closes only the selected attempt; note and original plan remain distinct.
- Repeating keeps the prior outcome and opens a new attempt with historical source context.
- RU/EN navigation preserves the task reference and original text language.
- Full/duplicate/invalid/stale/denied-storage cases preserve prior records.
- Source audit requires deliberate loading; ordinary return links contain no task text or outcomes.
- Homepage return, audit return, journal controls, copy and layout verified in preview after model tests, full tests, build and site-link audit.

The next player evidence should explain whether the remembered check affected a concrete decision, and whether the later situation changed the next task. Technical acceptance is separate from that evidence.
