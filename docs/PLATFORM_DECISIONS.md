# Platform decisions, v1.31

## Player value

The next step after Dota draft context addresses a shared question: which of my feasible plans fits this session, and what would make me change it? All six live hubs remain available. The release does not measure retention or claim proven demand.

## Compare saved alternatives

My calculations can compare two deliberately saved copies of the same tool. It shows each original result and the inputs that differ, with unchanged inputs expandable. Records from different model versions or source contexts require review; the page does not declare a winner or parse arithmetic from translated result strings.

New records retain readable input labels, selected option names and a short decision when present. An explicit result-priority contract replaces taking the first four arbitrary DOM metrics. Old schema-1 records remain readable without migration or automatic recalculation. Missing historical labels are acknowledged instead of exposing technical input keys. Search, notes, names and comparison choices are not sent to a service. Aggregate storage limits are checked before writing so a successful save remains readable.

## GTA session allocation

The session planner selects whole completed runs from up to four activities the player says are available. Each has an observed cash receipt after the chosen run costs, a complete cycle duration, a one-time block-entry overhead and a maximum run count. A ready-stock sale is limited to one run. Activities execute sequentially in blocks with no overlap.

The exact bounded optimization compares the chosen combination with the best single activity. Unused minutes do not earn money. Cash from selling stock accumulated before the session is not represented as indefinitely repeatable hourly profit. The model does not simulate production, independent cooldowns, stock growth, world travel or current official reward multipliers. The player must include those constraints in the observed cycle and available run count.

Acceptance example: one ready sale of 200,000 in 35 minutes plus 5 minutes entry, and a repeatable 140,000 activity in 25 minutes plus 5 minutes entry. At 60 minutes, two repeatable runs yield 280,000 in 55 minutes. At 75 minutes, sale plus one repeatable run yield 340,000 in 70 minutes. The choice changes because only completed runs pay.

## Campaign sensitivity

Total War and CK3 show the uniform extra income change from the first period that preserves the chosen reserve at every checkpoint under the existing scenario. A later income change already entered by the player remains active. Future income cannot repair an immediate reserve breach caused by an initial payment. A displayed threshold is not resilience to simultaneous longer wars, higher upkeep and lost income.

Civilization VII shows the last whole-turn completion delay at which the currently leading option still produces strictly more of the selected resource by the chosen deadline, then the outcome one turn later. A tie remains a tie. Production cost remains separate; a lead in one resource is not a universal recommendation.

The check buttons change one visible input through the existing calculation flow. They do not overwrite a previously saved plan.

## Discovery and editorial trust

The existing analysis library gains local search, game filtering and progressive disclosure in groups of twelve. All article URLs and the complete no-JavaScript list remain available. Search text is neither persisted nor included in a URL. Article dates and evidence classifications are not refreshed merely because the interface changed.

Static strategy cards no longer display unexplained fit numbers, letter grades or unimplemented weighted formulas. They describe conditions to compare. Succession copy describes a user-specified cash scenario rather than promising to calculate inheritance.

## Release gates

Model checks cover exact session allocation and its boundaries, income sensitivity across intermediate cash paths, and the last winning completion turn. Persistence checks cover old records, incompatible tasks, displayed input labels and aggregate storage limits. Full tests, Astro check/build and built-site audit remain required. Preview browser verification must exercise saved alternatives, at least one completed GTA example, campaign check buttons, RU/EN and library filtering before production approval.

Useful next evidence is a player explaining a decision changed by these tools and revisiting it after play. Test counts and saved-record counts are not substitutes for that observation.
