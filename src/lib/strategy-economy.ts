export interface InvestmentScenario {
  cost: number;
  incomePerPeriod: number;
  delayPeriods: number;
  horizonPeriods: number;
  riskPercent: number;
}

export interface InvestmentMetrics {
  activePeriods: number;
  riskAdjustedIncome: number;
  grossValue: number;
  netValue: number;
  paybackPeriods: number;
  roiPercent: number;
}

export interface ReserveScenario {
  treasury: number;
  incomePerPeriod: number;
  currentOutflow: number;
  newOutflow: number;
  oneOffCost: number;
  horizonPeriods: number;
  reserve: number;
}

export interface ReserveMetrics {
  netFlow: number;
  cashAtTarget: number;
  buffer: number;
  safePeriods: number;
  maxSustainableOutflow: number;
  coveragePercent: number;
}

export interface ComparisonScenario {
  aImmediate: number;
  aRecurring: number;
  aDelay: number;
  aRiskPercent: number;
  bImmediate: number;
  bRecurring: number;
  bDelay: number;
  bRiskPercent: number;
  horizonPeriods: number;
}

export interface ComparisonMetrics {
  optionAValue: number;
  optionBValue: number;
  advantage: number;
  winner: "a" | "b" | "tie";
}

const finite = (value: number, fallback = 0) => Number.isFinite(value) ? value : fallback;
const nonNegative = (value: number) => Math.max(0, finite(value));
const normalizedRisk = (value: number) => Math.min(100, nonNegative(value)) / 100;

export function calculateInvestmentMetrics(input: InvestmentScenario): InvestmentMetrics {
  const cost = nonNegative(input.cost);
  const incomePerPeriod = finite(input.incomePerPeriod);
  const delayPeriods = nonNegative(input.delayPeriods);
  const horizonPeriods = nonNegative(input.horizonPeriods);
  const activePeriods = Math.max(0, horizonPeriods - delayPeriods);
  const riskAdjustedIncome = incomePerPeriod * (1 - normalizedRisk(input.riskPercent));
  const grossValue = activePeriods * riskAdjustedIncome;
  const netValue = grossValue - cost;
  const paybackPeriods = riskAdjustedIncome > 0 ? delayPeriods + cost / riskAdjustedIncome : Number.POSITIVE_INFINITY;
  const roiPercent = cost > 0 ? (netValue / cost) * 100 : netValue > 0 ? Number.POSITIVE_INFINITY : 0;

  return { activePeriods, riskAdjustedIncome, grossValue, netValue, paybackPeriods, roiPercent };
}

export function calculateReserveMetrics(input: ReserveScenario): ReserveMetrics {
  const treasury = nonNegative(input.treasury);
  const incomePerPeriod = finite(input.incomePerPeriod);
  const currentOutflow = nonNegative(input.currentOutflow);
  const newOutflow = nonNegative(input.newOutflow);
  const oneOffCost = nonNegative(input.oneOffCost);
  const horizonPeriods = nonNegative(input.horizonPeriods);
  const reserve = nonNegative(input.reserve);
  const startingCash = treasury - oneOffCost;
  const totalOutflow = currentOutflow + newOutflow;
  const netFlow = incomePerPeriod - totalOutflow;
  const cashAtTarget = startingCash + netFlow * horizonPeriods;
  const buffer = cashAtTarget - reserve;
  const burn = Math.max(0, -netFlow);
  const safePeriods = burn > 0 ? Math.max(0, (startingCash - reserve) / burn) : Number.POSITIVE_INFINITY;
  const maxSustainableOutflow = horizonPeriods > 0
    ? Math.max(0, incomePerPeriod + (startingCash - reserve) / horizonPeriods)
    : Math.max(0, incomePerPeriod);
  const coveragePercent = reserve > 0 ? (cashAtTarget / reserve) * 100 : cashAtTarget >= 0 ? 100 : 0;

  return { netFlow, cashAtTarget, buffer, safePeriods, maxSustainableOutflow, coveragePercent };
}

export function calculateComparisonMetrics(input: ComparisonScenario): ComparisonMetrics {
  const horizonPeriods = nonNegative(input.horizonPeriods);
  const value = (immediate: number, recurring: number, delay: number, risk: number) => {
    const activePeriods = Math.max(0, horizonPeriods - nonNegative(delay));
    return finite(immediate) + finite(recurring) * activePeriods * (1 - normalizedRisk(risk));
  };
  const optionAValue = value(input.aImmediate, input.aRecurring, input.aDelay, input.aRiskPercent);
  const optionBValue = value(input.bImmediate, input.bRecurring, input.bDelay, input.bRiskPercent);
  const advantage = Math.abs(optionAValue - optionBValue);
  const winner = Math.abs(optionAValue - optionBValue) < 0.005 ? "tie" : optionAValue > optionBValue ? "a" : "b";

  return { optionAValue, optionBValue, advantage, winner };
}
