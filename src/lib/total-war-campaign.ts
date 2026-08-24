export interface CampaignCapitalInput {
  treasury: number;
  netIncomePerTurn: number;
  oneOffCost: number;
  additionalUpkeepPerTurn: number;
  horizonTurns: number;
  protectedReserve: number;
  incomeAtRiskPerTurn: number;
  disruptionTurns: number;
  emergencyCost: number;
}

export interface CampaignCapitalMetrics {
  netFlowPerTurn: number;
  baseCashAtHorizon: number;
  stressLoss: number;
  stressCashAtHorizon: number;
  reserveBuffer: number;
  reserveCoveragePercent: number;
  maxOneOffCost: number;
  maxAdditionalUpkeepPerTurn: number;
  committedCapital: number;
  state: "funded" | "fragile" | "breach";
}

const finite = (value: number): number => Number.isFinite(value) ? value : 0;
const nonNegative = (value: number): number => Math.max(0, finite(value));

export function calculateCampaignCapital(input: CampaignCapitalInput): CampaignCapitalMetrics {
  const treasury = nonNegative(input.treasury);
  const netIncomePerTurn = finite(input.netIncomePerTurn);
  const oneOffCost = nonNegative(input.oneOffCost);
  const additionalUpkeepPerTurn = nonNegative(input.additionalUpkeepPerTurn);
  const horizonTurns = nonNegative(input.horizonTurns);
  const protectedReserve = nonNegative(input.protectedReserve);
  const incomeAtRiskPerTurn = nonNegative(input.incomeAtRiskPerTurn);
  const disruptionTurns = Math.min(horizonTurns, nonNegative(input.disruptionTurns));
  const emergencyCost = nonNegative(input.emergencyCost);

  const netFlowPerTurn = netIncomePerTurn - additionalUpkeepPerTurn;
  const baseCashAtHorizon = treasury - oneOffCost + netFlowPerTurn * horizonTurns;
  const stressLoss = incomeAtRiskPerTurn * disruptionTurns + emergencyCost;
  const stressCashAtHorizon = baseCashAtHorizon - stressLoss;
  const reserveBuffer = stressCashAtHorizon - protectedReserve;
  const reserveCoveragePercent = protectedReserve > 0
    ? stressCashAtHorizon / protectedReserve * 100
    : stressCashAtHorizon >= 0 ? 100 : 0;
  const maxOneOffCost = Math.max(0, treasury + netFlowPerTurn * horizonTurns - stressLoss - protectedReserve);
  const maxAdditionalUpkeepPerTurn = horizonTurns > 0
    ? Math.max(0, netIncomePerTurn + (treasury - oneOffCost - stressLoss - protectedReserve) / horizonTurns)
    : 0;
  const committedCapital = oneOffCost + additionalUpkeepPerTurn * horizonTurns;
  const state = reserveBuffer < 0
    ? "breach"
    : netFlowPerTurn < 0 ? "fragile" : "funded";

  return {
    netFlowPerTurn,
    baseCashAtHorizon,
    stressLoss,
    stressCashAtHorizon,
    reserveBuffer,
    reserveCoveragePercent,
    maxOneOffCost,
    maxAdditionalUpkeepPerTurn,
    committedCapital,
    state
  };
}
