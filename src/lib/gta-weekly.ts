import { isExpired } from "./freshness";

export type GtaWeeklyDecisionStatus =
  | "incomplete"
  | "expired"
  | "ineligible"
  | "no-fit"
  | "stay"
  | "close"
  | "switch";

export interface GtaWeeklyRouteFacts {
  id: string;
  multiplier: number;
  fixedReward?: number;
  requiredRunsForReward?: number;
  requiredAsset?: "auto-shop";
}

export interface GtaWeeklyPlanInput {
  route: GtaWeeklyRouteFacts;
  validThrough: string;
  hoursAvailable: number;
  routineHourly: number;
  basePayoutPerRun: number;
  minutesPerRun: number;
  switchMinutes: number;
  confidencePercent: number;
  minimumLiftPercent: number;
  ownsRequiredAsset: boolean;
  asOf?: Date;
}

export interface GtaWeeklyPlanResult {
  status: GtaWeeklyDecisionStatus;
  runs: number;
  usableMinutes: number;
  variableCash: number;
  fixedReward: number;
  rawRouteCash: number;
  expectedRouteCash: number;
  routineAlternative: number;
  targetRouteCash: number;
  delta: number;
  requiredBasePayoutPerRun: number | null;
}

export function getGtaWeeklyRunNoun(count: number, locale: "ru" | "en"): string {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  if (locale === "en") return safeCount === 1 ? "run" : "runs";
  const mod100 = safeCount % 100;
  const mod10 = safeCount % 10;
  if (mod10 === 1 && mod100 !== 11) return "заход";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "захода";
  return "заходов";
}

const finiteFloor = (value: number, minimum = 0): number =>
  Number.isFinite(value) ? Math.max(minimum, value) : minimum;

const emptyResult = (status: GtaWeeklyDecisionStatus, usableMinutes = 0): GtaWeeklyPlanResult => ({
  status,
  runs: 0,
  usableMinutes,
  variableCash: 0,
  fixedReward: 0,
  rawRouteCash: 0,
  expectedRouteCash: 0,
  routineAlternative: 0,
  targetRouteCash: 0,
  delta: 0,
  requiredBasePayoutPerRun: null
});

export function calculateGtaWeeklyPlan(input: GtaWeeklyPlanInput): GtaWeeklyPlanResult {
  if (isExpired(input.validThrough, input.asOf ?? new Date())) return emptyResult("expired");
  if (input.route.requiredAsset && !input.ownsRequiredAsset) return emptyResult("ineligible");

  const hoursAvailable = finiteFloor(input.hoursAvailable);
  const routineHourly = finiteFloor(input.routineHourly);
  const basePayoutPerRun = finiteFloor(input.basePayoutPerRun);
  const minutesPerRun = finiteFloor(input.minutesPerRun);
  const switchMinutes = finiteFloor(input.switchMinutes);
  const multiplier = finiteFloor(input.route.multiplier);
  const confidence = Math.min(100, finiteFloor(input.confidencePercent)) / 100;
  const minimumLift = finiteFloor(input.minimumLiftPercent) / 100;

  if (!hoursAvailable || !routineHourly || !basePayoutPerRun || !minutesPerRun || !multiplier || !confidence) {
    return emptyResult("incomplete", Math.max(0, hoursAvailable * 60 - switchMinutes));
  }

  const usableMinutes = Math.max(0, hoursAvailable * 60 - switchMinutes);
  const runs = Math.floor(usableMinutes / minutesPerRun);
  if (runs < 1) return emptyResult("no-fit", usableMinutes);

  const variableCash = basePayoutPerRun * multiplier * runs;
  const rewardThreshold = finiteFloor(input.route.requiredRunsForReward ?? 0);
  const offeredReward = finiteFloor(input.route.fixedReward ?? 0);
  const fixedReward = offeredReward > 0 && (rewardThreshold === 0 || runs >= rewardThreshold) ? offeredReward : 0;
  const rawRouteCash = variableCash + fixedReward;
  const expectedRouteCash = rawRouteCash * confidence;
  const routineAlternative = routineHourly * hoursAvailable;
  const targetRouteCash = routineAlternative * (1 + minimumLift);
  const delta = expectedRouteCash - routineAlternative;
  const requiredRawCash = targetRouteCash / confidence;
  const requiredBasePayoutPerRun = Math.max(0, (requiredRawCash - fixedReward) / (multiplier * runs));
  const status: GtaWeeklyDecisionStatus = expectedRouteCash >= targetRouteCash
    ? "switch"
    : expectedRouteCash > routineAlternative
      ? "close"
      : "stay";

  return {
    status,
    runs,
    usableMinutes,
    variableCash,
    fixedReward,
    rawRouteCash,
    expectedRouteCash,
    routineAlternative,
    targetRouteCash,
    delta,
    requiredBasePayoutPerRun
  };
}
