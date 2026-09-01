export interface BuildingWindowInput {
  cost: number;
  buildTurns: number;
  benefitPerTurn: number;
  horizonTurns: number;
  confidencePercent: number;
}

export interface BuildingWindowResult {
  activeTurns: number;
  adjustedBenefitPerTurn: number;
  expectedReturn: number;
  netValue: number;
  paybackTurn: number | null;
  clearsHorizon: boolean;
}

export interface SettlementChoiceInput {
  conversionCost: number;
  conversionTurns: number;
  currentValuePerTurn: number;
  developedValuePerTurn: number;
  horizonTurns: number;
  confidencePercent: number;
}

export interface SettlementChoiceResult {
  incrementalValuePerTurn: number;
  adjustedIncrementPerTurn: number;
  activeTurns: number;
  expectedGain: number;
  netValue: number;
  paybackTurn: number | null;
  clearsHorizon: boolean;
}

export interface EconomicVictoryGapInput {
  currentGdp: number;
  targetGdp: number;
  resourceGdp: number;
  convoyGdp: number;
  buildingGdp: number;
  confidencePercent: number;
}

export interface EconomicVictoryGapResult {
  currentGap: number;
  rawAddedGdp: number;
  adjustedAddedGdp: number;
  projectedGdp: number;
  remainingGap: number;
  targetCoveragePercent: number;
  closesGap: boolean;
  largestContributor: "resources" | "convoys" | "buildings" | "none";
}

const finite = (value: number, floor = 0): number => Number.isFinite(value) ? Math.max(floor, value) : floor;
const confidence = (value: number): number => Math.min(100, finite(value)) / 100;

export function calculateBuildingWindow(input: BuildingWindowInput): BuildingWindowResult {
  const cost = finite(input.cost);
  const buildTurns = finite(input.buildTurns);
  const horizonTurns = finite(input.horizonTurns);
  const benefitPerTurn = finite(input.benefitPerTurn);
  const activeTurns = Math.max(0, horizonTurns - buildTurns);
  const adjustedBenefitPerTurn = benefitPerTurn * confidence(input.confidencePercent);
  const expectedReturn = activeTurns * adjustedBenefitPerTurn;
  const netValue = expectedReturn - cost;
  const paybackTurn = adjustedBenefitPerTurn > 0 ? buildTurns + cost / adjustedBenefitPerTurn : null;

  return {
    activeTurns,
    adjustedBenefitPerTurn,
    expectedReturn,
    netValue,
    paybackTurn,
    clearsHorizon: paybackTurn !== null && paybackTurn <= horizonTurns
  };
}

export function calculateSettlementChoice(input: SettlementChoiceInput): SettlementChoiceResult {
  const conversionCost = finite(input.conversionCost);
  const conversionTurns = finite(input.conversionTurns);
  const horizonTurns = finite(input.horizonTurns);
  const currentValuePerTurn = finite(input.currentValuePerTurn);
  const developedValuePerTurn = finite(input.developedValuePerTurn);
  const incrementalValuePerTurn = developedValuePerTurn - currentValuePerTurn;
  const adjustedIncrementPerTurn = incrementalValuePerTurn * confidence(input.confidencePercent);
  const activeTurns = Math.max(0, horizonTurns - conversionTurns);
  const expectedGain = activeTurns * adjustedIncrementPerTurn;
  const netValue = expectedGain - conversionCost;
  const paybackTurn = adjustedIncrementPerTurn > 0
    ? conversionTurns + conversionCost / adjustedIncrementPerTurn
    : null;

  return {
    incrementalValuePerTurn,
    adjustedIncrementPerTurn,
    activeTurns,
    expectedGain,
    netValue,
    paybackTurn,
    clearsHorizon: paybackTurn !== null && paybackTurn <= horizonTurns
  };
}

export function calculateEconomicVictoryGap(input: EconomicVictoryGapInput): EconomicVictoryGapResult {
  const currentGdp = finite(input.currentGdp);
  const resourceGdp = finite(input.resourceGdp);
  const convoyGdp = finite(input.convoyGdp);
  const buildingGdp = finite(input.buildingGdp);
  const target = finite(input.targetGdp);
  const rawAddedGdp = resourceGdp + convoyGdp + buildingGdp;
  const adjustedAddedGdp = rawAddedGdp * confidence(input.confidencePercent);
  const projectedGdp = currentGdp + adjustedAddedGdp;
  const currentGap = Math.max(0, target - currentGdp);
  const remainingGap = Math.max(0, target - projectedGdp);
  const contributors = [
    ["resources", resourceGdp],
    ["convoys", convoyGdp],
    ["buildings", buildingGdp]
  ] as const;
  let largestContributor: EconomicVictoryGapResult["largestContributor"] = "none";
  let largestValue = 0;
  contributors.forEach(([key, value]) => {
    if (value > largestValue) {
      largestContributor = key;
      largestValue = value;
    }
  });

  return {
    currentGap,
    rawAddedGdp,
    adjustedAddedGdp,
    projectedGdp,
    remainingGap,
    targetCoveragePercent: target > 0 ? Math.min(100, projectedGdp / target * 100) : 100,
    closesGap: projectedGdp >= target,
    largestContributor
  };
}
