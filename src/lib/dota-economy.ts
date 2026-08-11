export interface MidasInput {
  itemCost: number;
  transmuteGold: number;
  foregoneCreepBounty: number;
  otherValuePerUse: number;
  chargeRestoreSeconds: number;
  purchaseMinute: number;
  expectedEndMinute: number;
}

export interface MidasMetrics {
  usesRemaining: number;
  incrementalValuePerUse: number;
  grossIncrementalValue: number;
  netEconomicValue: number;
  paybackUses: number;
  paybackMatchMinute: number;
  realizedRoi: number;
  breaksEvenBeforeEnd: boolean;
}

export interface BuybackInput {
  netWorth: number;
  currentGold: number;
  goldPerMinute: number;
  secondsToObjective: number;
  deathProbabilityPercent: number;
}

export interface BuybackMetrics {
  estimatedCost: number;
  reserveGap: number;
  reserveSurplus: number;
  coveragePercent: number;
  farmMinutesToReserve: number;
  projectedGoldAtObjective: number;
  probabilityWeightedReserve: number;
  state: "ready-now" | "ready-by-objective" | "underfunded";
}

function positive(value: number): number {
  return Math.max(0, Number.isFinite(value) ? value : 0);
}

export function calculateMidasMetrics(input: MidasInput): MidasMetrics {
  const itemCost = positive(input.itemCost);
  const cooldown = Math.max(1, positive(input.chargeRestoreSeconds));
  const purchaseMinute = positive(input.purchaseMinute);
  const expectedEndMinute = positive(input.expectedEndMinute);
  const timeAvailableSeconds = Math.max(0, (expectedEndMinute - purchaseMinute) * 60);
  const usesRemaining = expectedEndMinute >= purchaseMinute
    ? Math.floor(timeAvailableSeconds / cooldown) + 1
    : 0;
  const incrementalValuePerUse = Math.max(
    0,
    positive(input.transmuteGold) - positive(input.foregoneCreepBounty) + positive(input.otherValuePerUse)
  );
  const grossIncrementalValue = usesRemaining * incrementalValuePerUse;
  const netEconomicValue = grossIncrementalValue - itemCost;
  const paybackUses = incrementalValuePerUse > 0
    ? Math.ceil(itemCost / incrementalValuePerUse)
    : Number.POSITIVE_INFINITY;
  const paybackMatchMinute = Number.isFinite(paybackUses)
    ? purchaseMinute + Math.max(0, paybackUses - 1) * cooldown / 60
    : Number.POSITIVE_INFINITY;
  const realizedRoi = itemCost > 0 ? (netEconomicValue / itemCost) * 100 : 0;

  return {
    usesRemaining,
    incrementalValuePerUse,
    grossIncrementalValue,
    netEconomicValue,
    paybackUses,
    paybackMatchMinute,
    realizedRoi,
    breaksEvenBeforeEnd: paybackMatchMinute <= expectedEndMinute
  };
}

export function estimateBuybackCost(netWorth: number): number {
  return 100 + positive(netWorth) / 13;
}

export function calculateBuybackMetrics(input: BuybackInput): BuybackMetrics {
  const estimatedCost = estimateBuybackCost(input.netWorth);
  const currentGold = positive(input.currentGold);
  const goldPerMinute = positive(input.goldPerMinute);
  const secondsToObjective = positive(input.secondsToObjective);
  const deathProbability = Math.min(100, positive(input.deathProbabilityPercent)) / 100;
  const reserveGap = Math.max(0, estimatedCost - currentGold);
  const reserveSurplus = Math.max(0, currentGold - estimatedCost);
  const coveragePercent = estimatedCost > 0 ? currentGold / estimatedCost * 100 : 100;
  const farmMinutesToReserve = reserveGap === 0
    ? 0
    : goldPerMinute > 0 ? reserveGap / goldPerMinute : Number.POSITIVE_INFINITY;
  const projectedGoldAtObjective = currentGold + goldPerMinute * secondsToObjective / 60;
  const state = currentGold >= estimatedCost
    ? "ready-now"
    : projectedGoldAtObjective >= estimatedCost ? "ready-by-objective" : "underfunded";

  return {
    estimatedCost,
    reserveGap,
    reserveSurplus,
    coveragePercent,
    farmMinutesToReserve,
    projectedGoldAtObjective,
    probabilityWeightedReserve: estimatedCost * deathProbability,
    state
  };
}
