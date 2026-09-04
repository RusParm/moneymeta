import type { GtaWeeklyDecisionStatus, GtaWeeklyPlanResult } from "./gta-weekly";

export const GTA_WEEKLY_JOURNAL_VERSION = 1 as const;
export const GTA_WEEKLY_JOURNAL_LIMIT = 8;

export type GtaWeeklyJournalDecision = Extract<GtaWeeklyDecisionStatus, "stay" | "close" | "switch">;

export interface GtaWeeklyJournalEntry {
  version: typeof GTA_WEEKLY_JOURNAL_VERSION;
  weekId: string;
  startsAt: string;
  validThrough: string;
  routeId: string;
  routeTitle: { ru: string; en: string };
  routeSignal: { ru: string; en: string };
  savedAt: string;
  decision: GtaWeeklyJournalDecision;
  inputs: {
    hoursAvailable: number;
    routineHourly: number;
    basePayoutPerRun: number;
    minutesPerRun: number;
    switchMinutes: number;
    confidencePercent: number;
    minimumLiftPercent: number;
    ownsRequiredAsset: boolean;
  };
  projection: {
    runs: number;
    expectedRouteCash: number;
    routineAlternative: number;
    delta: number;
    fixedReward: number;
  };
  outcome?: {
    cashEarned: number;
    minutesPlayed: number;
    recordedAt: string;
  };
}

export interface GtaWeeklyJournalComparison {
  actualHourly: number;
  plannedHourly: number;
  routineHourly: number;
  actualVsPlannedHourly: number;
  actualVsRoutineHourly: number;
  actualLiftPercent: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const finiteAtLeast = (value: unknown, minimum: number): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= minimum;

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/u;

const validDecision = (value: unknown): value is GtaWeeklyJournalDecision =>
  value === "stay" || value === "close" || value === "switch";

const validDateTime = (value: unknown): value is string => nonEmpty(value) && Number.isFinite(Date.parse(value));
const validDateOnly = (value: unknown): value is string => {
  if (!nonEmpty(value) || !DATE_ONLY.test(value)) return false;
  const parsed = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === value;
};

const sanitizeEntry = (value: unknown): GtaWeeklyJournalEntry | null => {
  if (!isRecord(value) || value.version !== GTA_WEEKLY_JOURNAL_VERSION) return null;
  if (!nonEmpty(value.weekId) || !validDateOnly(value.startsAt) || !validDateOnly(value.validThrough)) return null;
  if (!nonEmpty(value.routeId) || !validDateTime(value.savedAt) || !validDecision(value.decision)) return null;
  if (!isRecord(value.routeTitle) || !nonEmpty(value.routeTitle.ru) || !nonEmpty(value.routeTitle.en)) return null;
  if (!isRecord(value.routeSignal) || !nonEmpty(value.routeSignal.ru) || !nonEmpty(value.routeSignal.en)) return null;
  if (!isRecord(value.inputs) || !isRecord(value.projection)) return null;

  const inputs = value.inputs;
  const projection = value.projection;
  if (
    !finiteAtLeast(inputs.hoursAvailable, 0.25) ||
    !finiteAtLeast(inputs.routineHourly, 1) ||
    !finiteAtLeast(inputs.basePayoutPerRun, 1) ||
    !finiteAtLeast(inputs.minutesPerRun, 1) ||
    !finiteAtLeast(inputs.switchMinutes, 0) ||
    !finiteAtLeast(inputs.confidencePercent, 0) ||
    inputs.confidencePercent > 100 ||
    !finiteAtLeast(inputs.minimumLiftPercent, 0) ||
    typeof inputs.ownsRequiredAsset !== "boolean" ||
    !finiteAtLeast(projection.runs, 1) ||
    !finiteAtLeast(projection.expectedRouteCash, 0) ||
    !finiteAtLeast(projection.routineAlternative, 0) ||
    !finiteAtLeast(projection.delta, Number.NEGATIVE_INFINITY) ||
    !finiteAtLeast(projection.fixedReward, 0)
  ) return null;

  let outcome: GtaWeeklyJournalEntry["outcome"];
  if (value.outcome !== undefined) {
    if (
      !isRecord(value.outcome) ||
      !finiteAtLeast(value.outcome.cashEarned, 0) ||
      !finiteAtLeast(value.outcome.minutesPlayed, 1) ||
      !validDateTime(value.outcome.recordedAt)
    ) return null;
    outcome = {
      cashEarned: value.outcome.cashEarned,
      minutesPlayed: value.outcome.minutesPlayed,
      recordedAt: value.outcome.recordedAt
    };
  }

  return {
    version: GTA_WEEKLY_JOURNAL_VERSION,
    weekId: value.weekId,
    startsAt: value.startsAt,
    validThrough: value.validThrough,
    routeId: value.routeId,
    routeTitle: { ru: value.routeTitle.ru, en: value.routeTitle.en },
    routeSignal: { ru: value.routeSignal.ru, en: value.routeSignal.en },
    savedAt: value.savedAt,
    decision: value.decision,
    inputs: {
      hoursAvailable: inputs.hoursAvailable,
      routineHourly: inputs.routineHourly,
      basePayoutPerRun: inputs.basePayoutPerRun,
      minutesPerRun: inputs.minutesPerRun,
      switchMinutes: inputs.switchMinutes,
      confidencePercent: inputs.confidencePercent,
      minimumLiftPercent: inputs.minimumLiftPercent,
      ownsRequiredAsset: inputs.ownsRequiredAsset
    },
    projection: {
      runs: Math.floor(projection.runs),
      expectedRouteCash: projection.expectedRouteCash,
      routineAlternative: projection.routineAlternative,
      delta: projection.delta,
      fixedReward: projection.fixedReward
    },
    ...(outcome ? { outcome } : {})
  };
};

export function canSaveGtaWeeklyDecision(status: GtaWeeklyDecisionStatus): status is GtaWeeklyJournalDecision {
  return validDecision(status);
}

export function parseGtaWeeklyJournal(value: unknown, limit = GTA_WEEKLY_JOURNAL_LIMIT): GtaWeeklyJournalEntry[] {
  if (!Array.isArray(value)) return [];
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : GTA_WEEKLY_JOURNAL_LIMIT;
  const seen = new Set<string>();
  return value
    .map(sanitizeEntry)
    .filter((entry): entry is GtaWeeklyJournalEntry => Boolean(entry))
    .sort((left, right) => Date.parse(right.savedAt) - Date.parse(left.savedAt))
    .filter((entry) => {
      if (!entry || seen.has(entry.weekId)) return false;
      seen.add(entry.weekId);
      return true;
    })
    .slice(0, safeLimit);
}

export function upsertGtaWeeklyJournalEntry(
  entries: GtaWeeklyJournalEntry[],
  next: GtaWeeklyJournalEntry,
  limit = GTA_WEEKLY_JOURNAL_LIMIT
): GtaWeeklyJournalEntry[] {
  const existing = entries.find((entry) => entry.weekId === next.weekId);
  const protectedNext = existing?.outcome ? existing : next;
  return parseGtaWeeklyJournal([protectedNext, ...entries.filter((entry) => entry.weekId !== next.weekId)], limit);
}

export function closeGtaWeeklyJournalEntry(
  entry: GtaWeeklyJournalEntry,
  cashEarned: number,
  minutesPlayed: number,
  recordedAt = new Date().toISOString()
): GtaWeeklyJournalEntry | null {
  if (entry.outcome || !finiteAtLeast(cashEarned, 0) || !finiteAtLeast(minutesPlayed, 1) || !validDateTime(recordedAt)) {
    return null;
  }
  return { ...entry, outcome: { cashEarned, minutesPlayed, recordedAt } };
}

export function compareGtaWeeklyJournalOutcome(entry: GtaWeeklyJournalEntry): GtaWeeklyJournalComparison | null {
  if (!entry.outcome || entry.inputs.hoursAvailable <= 0 || entry.outcome.minutesPlayed <= 0) return null;
  const actualHourly = entry.outcome.cashEarned / (entry.outcome.minutesPlayed / 60);
  const plannedHourly = entry.projection.expectedRouteCash / entry.inputs.hoursAvailable;
  const routineHourly = entry.inputs.routineHourly;
  return {
    actualHourly,
    plannedHourly,
    routineHourly,
    actualVsPlannedHourly: actualHourly - plannedHourly,
    actualVsRoutineHourly: actualHourly - routineHourly,
    actualLiftPercent: routineHourly > 0 ? (actualHourly / routineHourly - 1) * 100 : 0
  };
}

export function journalProjectionFromPlan(plan: GtaWeeklyPlanResult): GtaWeeklyJournalEntry["projection"] {
  return {
    runs: plan.runs,
    expectedRouteCash: plan.expectedRouteCash,
    routineAlternative: plan.routineAlternative,
    delta: plan.delta,
    fixedReward: plan.fixedReward
  };
}
