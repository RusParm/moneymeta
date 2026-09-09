export type CivilizationYield = "production" | "gold" | "science" | "culture";
export type CivilizationChoice = "a" | "b";

export interface CivilizationInvestment {
  productionCost: number;
  buildTurns: number;
  yieldPerTurn: number;
}

export interface CivilizationComparisonInput {
  unit: CivilizationYield;
  horizonTurns: number;
  a: CivilizationInvestment;
  b: CivilizationInvestment;
}

export interface CivilizationInvestmentResult {
  activeTurns: number;
  totalYield: number;
  productionCost: number;
  netProduction: number | null;
  productionPaybackTurn: number | null;
  productionPaybackUnavailable: boolean;
  yieldToTieOther: number | null;
}

export interface CivilizationComparisonResult {
  unit: CivilizationYield;
  horizonTurns: number;
  a: CivilizationInvestmentResult;
  b: CivilizationInvestmentResult;
  leader: CivilizationChoice | "tie";
  yieldDifference: number;
  productionCostDifference: number;
  crossover: { from: CivilizationChoice; to: CivilizationChoice; equalTurn: number; firstLeadTurn: number } | null;
  crossoverUnavailable: boolean;
  /** Delay only the current cumulative-yield leader; all other inputs stay fixed. */
  completionSlack: {
    choice: CivilizationChoice;
    latestCompletionTurn: number;
    extraTurns: number;
    outputAtBoundary: number;
    otherOutput: number;
    next: { completionTurn: number; output: number; leader: CivilizationChoice | "tie" } | null;
  } | null;
  checkpoints: { turn: number; a: number; b: number }[];
}

const units: CivilizationYield[] = ["production", "gold", "science", "culture"];
const within = (value: number, max: number, whole = false) => Number.isFinite(value) && value >= 0 && value <= max && (!whole || Number.isInteger(value));
const validInvestment = (value: CivilizationInvestment) => within(value.productionCost, 100000) && within(value.buildTurns, 200, true) && within(value.yieldPerTurn, 100000);
const outputAt = (value: CivilizationInvestment, turn: number) => Math.max(0, turn - value.buildTurns) * value.yieldPerTurn;
const near = (a: number, b: number) => Math.abs(a - b) <= Number.EPSILON * 16 * Math.max(1, Math.abs(a), Math.abs(b));
const wholeCeiling = (value: number) => near(value, Math.round(value)) ? Math.round(value) : Math.ceil(value);

/** Turn zero is now. A build lasting d turns first earns at the end of turn d + 1.
 * Costs always stay in production; other resources are never converted or netted against them.
 * A and B are mutually exclusive investments started now, not a build queue or budget optimizer.
 */
export function calculateCivilizationComparison(input: CivilizationComparisonInput): CivilizationComparisonResult | null {
  if (!units.includes(input.unit) || !within(input.horizonTurns, 500, true) || !validInvestment(input.a) || !validInvestment(input.b)) return null;
  const resultFor = (value: CivilizationInvestment): CivilizationInvestmentResult => {
    const totalYield = outputAt(value, input.horizonTurns);
    const projectedPayback = input.unit !== "production" ? null : value.productionCost === 0 ? 0
      : value.yieldPerTurn > 0 ? value.buildTurns + wholeCeiling(value.productionCost / value.yieldPerTurn) : null;
    const productionPaybackUnavailable = projectedPayback !== null && !Number.isSafeInteger(projectedPayback);
    return {
      activeTurns: Math.max(0, input.horizonTurns - value.buildTurns),
      totalYield,
      productionCost: value.productionCost,
      netProduction: input.unit === "production" ? totalYield - value.productionCost : null,
      productionPaybackTurn: productionPaybackUnavailable ? null : projectedPayback,
      productionPaybackUnavailable,
      yieldToTieOther: null
    };
  };
  const a = resultFor(input.a);
  const b = resultFor(input.b);
  a.yieldToTieOther = a.activeTurns > 0 ? b.totalYield / a.activeTurns : null;
  b.yieldToTieOther = b.activeTurns > 0 ? a.totalYield / b.activeTurns : null;
  const leader = near(a.totalYield, b.totalYield) ? "tie" : a.totalYield > b.totalYield ? "a" : "b";
  let completionSlack: CivilizationComparisonResult["completionSlack"] = null;
  if (leader !== "tie") {
    const other: CivilizationChoice = leader === "a" ? "b" : "a";
    const otherOutput = other === "a" ? a.totalYield : b.totalYield;
    let latestCompletionTurn = input[leader].buildTurns;
    let outputAtBoundary = leader === "a" ? a.totalYield : b.totalYield;
    let next: NonNullable<CivilizationComparisonResult["completionSlack"]>["next"] = null;
    // Whole-turn search shares the result's tolerance and supported completion range.
    // Equality ends the strict lead; it is never described as the other choice winning.
    for (let completionTurn = latestCompletionTurn + 1; completionTurn <= 200; completionTurn += 1) {
      const output = outputAt({ ...input[leader], buildTurns: completionTurn }, input.horizonTurns);
      const tied = near(output, otherOutput);
      if (tied || output < otherOutput) {
        next = { completionTurn, output, leader: tied ? "tie" : other };
        break;
      }
      latestCompletionTurn = completionTurn;
      outputAtBoundary = output;
    }
    completionSlack = {
      choice: leader, latestCompletionTurn,
      extraTurns: latestCompletionTurn - input[leader].buildTurns,
      outputAtBoundary, otherOutput, next
    };
  }

  let crossover: CivilizationComparisonResult["crossover"] = null;
  let crossoverUnavailable = false;
  const early: CivilizationChoice = input.a.buildTurns <= input.b.buildTurns ? "a" : "b";
  const late: CivilizationChoice = early === "a" ? "b" : "a";
  const first = input[early];
  const second = input[late];
  // A real reversal needs an initial strict lead, followed by a higher slope.
  // Equal zero output before either completion is not a crossover.
  if (first.buildTurns < second.buildTurns && first.yieldPerTurn > 0 && second.yieldPerTurn > first.yieldPerTurn) {
    const equalTurn = (second.yieldPerTurn * second.buildTurns - first.yieldPerTurn * first.buildTurns)
      / (second.yieldPerTurn - first.yieldPerTurn);
    const normalizedTurn = near(equalTurn, Math.round(equalTurn)) ? Math.round(equalTurn) : equalTurn;
    const firstLeadTurn = Math.floor(normalizedTurn) + 1;
    if (Number.isFinite(equalTurn) && Number.isSafeInteger(firstLeadTurn)) crossover = { from: early, to: late, equalTurn, firstLeadTurn };
    else crossoverUnavailable = true;
  }

  const checkpointTurns = [0, input.a.buildTurns, input.b.buildTurns, input.horizonTurns];
  if (crossover) checkpointTurns.push(wholeCeiling(crossover.equalTurn), crossover.firstLeadTurn);
  const checkpoints = [...new Set(checkpointTurns)].filter((turn) => turn <= input.horizonTurns).sort((x, y) => x - y)
    .map((turn) => ({ turn, a: outputAt(input.a, turn), b: outputAt(input.b, turn) }));

  return {
    unit: input.unit,
    horizonTurns: input.horizonTurns,
    a,
    b,
    leader,
    yieldDifference: a.totalYield - b.totalYield,
    productionCostDifference: input.a.productionCost - input.b.productionCost,
    crossover,
    crossoverUnavailable,
    completionSlack,
    checkpoints
  };
}
