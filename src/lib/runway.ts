export interface RunwayInput {
  current: number;
  target: number;
  reserve: number;
  rate: number;
  horizon: number;
}

export type RunwayState = "funded" | "on-track" | "close" | "off-track";

export interface RunwayResult {
  requiredTotal: number;
  gap: number;
  periods: number;
  requiredRate: number;
  projected: number;
  slack: number;
  progress: number;
  state: RunwayState;
}

const finiteNonNegative = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;

export function calculateRunway(input: RunwayInput): RunwayResult {
  const current = finiteNonNegative(input.current);
  const target = finiteNonNegative(input.target);
  const reserve = finiteNonNegative(input.reserve);
  const rate = finiteNonNegative(input.rate);
  const horizon = finiteNonNegative(input.horizon);
  const requiredTotal = target + reserve;
  const gap = Math.max(0, requiredTotal - current);
  const periods = gap === 0 ? 0 : rate > 0 ? gap / rate : Number.POSITIVE_INFINITY;
  const requiredRate = gap === 0 ? 0 : horizon > 0 ? gap / horizon : Number.POSITIVE_INFINITY;
  const projected = current + rate * horizon;
  const slack = projected - requiredTotal;
  const progress = requiredTotal > 0 ? Math.min(1, current / requiredTotal) : 1;

  let state: RunwayState;
  if (gap === 0) state = "funded";
  else if (horizon > 0 && periods <= horizon) state = "on-track";
  else if (horizon > 0 && periods <= horizon * 1.25) state = "close";
  else state = "off-track";

  return { requiredTotal, gap, periods, requiredRate, projected, slack, progress, state };
}
