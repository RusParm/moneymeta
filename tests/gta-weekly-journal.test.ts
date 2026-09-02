import { describe, expect, it } from "vitest";
import {
  canSaveGtaWeeklyDecision,
  closeGtaWeeklyJournalEntry,
  compareGtaWeeklyJournalOutcome,
  journalProjectionFromPlan,
  parseGtaWeeklyJournal,
  upsertGtaWeeklyJournalEntry,
  type GtaWeeklyJournalEntry
} from "../src/lib/gta-weekly-journal";
import type { GtaWeeklyDecisionStatus } from "../src/lib/gta-weekly";

const entry = (weekId = "week-1", savedAt = "2026-09-01T12:00:00Z"): GtaWeeklyJournalEntry => ({
  version: 1,
  weekId,
  startsAt: "2026-08-27",
  validThrough: "2026-09-02",
  routeId: "drift-races",
  routeTitle: { ru: "Drift Races", en: "Drift Races" },
  routeSignal: { ru: "2X + GTA$100K", en: "2X + GTA$100K" },
  savedAt,
  decision: "switch",
  inputs: {
    hoursAvailable: 3,
    routineHourly: 300_000,
    basePayoutPerRun: 50_000,
    minutesPerRun: 15,
    switchMinutes: 10,
    confidencePercent: 80,
    minimumLiftPercent: 15,
    ownsRequiredAsset: false
  },
  projection: {
    runs: 11,
    expectedRouteCash: 960_000,
    routineAlternative: 900_000,
    delta: 60_000,
    fixedReward: 100_000
  }
});

describe("GTA weekly journal", () => {
  it("only saves complete decision states", () => {
    const saveable: GtaWeeklyDecisionStatus[] = ["stay", "close", "switch"];
    const blocked: GtaWeeklyDecisionStatus[] = ["incomplete", "expired", "ineligible", "no-fit"];
    expect(saveable.every(canSaveGtaWeeklyDecision)).toBe(true);
    expect(blocked.some(canSaveGtaWeeklyDecision)).toBe(false);
  });

  it("rejects malformed records, deduplicates weeks and keeps newest first", () => {
    const parsed = parseGtaWeeklyJournal([
      entry("old", "2026-08-20T12:00:00Z"),
      { broken: true },
      entry("new", "2026-09-01T12:00:00Z"),
      entry("old", "2026-08-22T12:00:00Z")
    ]);
    expect(parsed.map((item) => item.weekId)).toEqual(["new", "old"]);
    expect(parsed[1]?.savedAt).toBe("2026-08-22T12:00:00Z");
  });

  it("limits the local archive", () => {
    const records = Array.from({ length: 12 }, (_, index) =>
      entry(`week-${index}`, `2026-08-${String(index + 1).padStart(2, "0")}T12:00:00Z`)
    );
    expect(parseGtaWeeklyJournal(records, 3).map((item) => item.weekId)).toEqual(["week-11", "week-10", "week-9"]);
  });

  it("does not rewrite an outcome when the saved plan is updated", () => {
    const closed = closeGtaWeeklyJournalEntry(entry(), 1_050_000, 180, "2026-09-02T12:00:00Z");
    expect(closed).not.toBeNull();
    const updated = upsertGtaWeeklyJournalEntry([closed!], {
      ...entry(),
      savedAt: "2026-09-02T13:00:00Z",
      projection: { ...entry().projection, expectedRouteCash: 2_000_000 }
    });
    expect(updated[0]?.outcome?.cashEarned).toBe(1_050_000);
    expect(updated[0]?.projection.expectedRouteCash).toBe(960_000);
  });

  it("accepts a zero-cash session but refuses to close twice", () => {
    const closed = closeGtaWeeklyJournalEntry(entry(), 0, 60, "2026-09-02T12:00:00Z");
    expect(closed?.outcome?.cashEarned).toBe(0);
    expect(closeGtaWeeklyJournalEntry(closed!, 10, 10)).toBeNull();
  });

  it("compares actual and planned rates over different session lengths", () => {
    const closed = closeGtaWeeklyJournalEntry(entry(), 400_000, 60, "2026-09-02T12:00:00Z");
    const comparison = compareGtaWeeklyJournalOutcome(closed!);
    expect(comparison).toMatchObject({
      actualHourly: 400_000,
      plannedHourly: 320_000,
      routineHourly: 300_000,
      actualVsPlannedHourly: 80_000,
      actualVsRoutineHourly: 100_000
    });
    expect(comparison?.actualLiftPercent).toBeCloseTo(100 / 3, 8);
  });

  it("copies only the auditable projection fields from the live result", () => {
    expect(journalProjectionFromPlan({
      status: "switch",
      runs: 5,
      usableMinutes: 90,
      variableCash: 500_000,
      fixedReward: 100_000,
      rawRouteCash: 600_000,
      expectedRouteCash: 480_000,
      routineAlternative: 400_000,
      targetRouteCash: 460_000,
      delta: 80_000,
      requiredBasePayoutPerRun: 46_000
    })).toEqual({
      runs: 5,
      expectedRouteCash: 480_000,
      routineAlternative: 400_000,
      delta: 80_000,
      fixedReward: 100_000
    });
  });
});
