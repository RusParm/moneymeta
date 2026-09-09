import type { GtaSessionSource } from "../lib/gta-session";

/** Illustrative observations shared by the entrance and the full planner.
 * They are not official activity payouts, live bonuses or production rates.
 */
export const gtaSessionExample = {
  minutes: 75,
  sourceCount: 2,
  sources: [
    { kind: "ready-sale", available: true, cashPerRun: 200000, minutesPerRun: 35, entryMinutes: 5, maxRuns: 1 },
    { kind: "mission", available: true, cashPerRun: 140000, minutesPerRun: 25, entryMinutes: 5, maxRuns: 4 },
    { kind: "contract", available: false, cashPerRun: 0, minutesPerRun: 30, entryMinutes: 5, maxRuns: 1 },
    { kind: "other", available: false, cashPerRun: 0, minutesPerRun: 30, entryMinutes: 5, maxRuns: 1 }
  ] satisfies GtaSessionSource[]
};
