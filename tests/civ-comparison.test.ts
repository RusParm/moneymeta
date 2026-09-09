import { describe, expect, it } from "vitest";
import { calculateCivilizationComparison, type CivilizationComparisonInput } from "../src/lib/civ-comparison";

const sample: CivilizationComparisonInput = {
  unit: "science", horizonTurns: 20,
  a: { productionCost: 180, buildTurns: 3, yieldPerTurn: 5 },
  b: { productionCost: 300, buildTurns: 7, yieldPerTurn: 8 }
};

describe("Civilization same-resource alternatives", () => {
  it("keeps science output and production commitment in separate units", () => {
    const value = calculateCivilizationComparison(sample)!;
    expect(value.a.totalYield).toBe(85);
    expect(value.b.totalYield).toBe(104);
    expect(value.leader).toBe("b");
    expect(value.yieldDifference).toBe(-19);
    expect(value.productionCostDifference).toBe(-120);
    expect(value.a.netProduction).toBeNull();
    expect(value.b.productionPaybackTurn).toBeNull();
    expect(value.a.yieldToTieOther).toBeCloseTo(104 / 17);
  });

  it("finds the delayed choice overtaking the early choice and reverses at a shorter horizon", () => {
    const value = calculateCivilizationComparison(sample)!;
    expect(value.crossover?.equalTurn).toBeCloseTo(41 / 3);
    expect(value.crossover?.firstLeadTurn).toBe(14);
    expect(calculateCivilizationComparison({ ...sample, horizonTurns: 13 })?.leader).toBe("a");
    expect(calculateCivilizationComparison({ ...sample, horizonTurns: 14 })?.leader).toBe("b");
    expect(value.checkpoints).toEqual([
      { turn: 0, a: 0, b: 0 }, { turn: 3, a: 0, b: 0 }, { turn: 7, a: 20, b: 0 },
      { turn: 14, a: 55, b: 56 }, { turn: 20, a: 85, b: 104 }
    ]);
  });

  it("keeps an exact tied turn distinct from the first strict lead", () => {
    const input = { ...sample, a: { ...sample.a, buildTurns: 2, yieldPerTurn: 4 }, b: { ...sample.b, buildTurns: 5, yieldPerTurn: 8 } };
    expect(calculateCivilizationComparison({ ...input, horizonTurns: 8 })?.leader).toBe("tie");
    expect(calculateCivilizationComparison(input)?.crossover).toEqual({ from: "a", to: "b", equalTurn: 8, firstLeadTurn: 9 });
    expect(calculateCivilizationComparison({ ...input, horizonTurns: 9 })?.leader).toBe("b");
  });

  it("handles either choice being the slower build", () => {
    const value = calculateCivilizationComparison({ ...sample, a: sample.b, b: sample.a })!;
    expect(value.leader).toBe("a");
    expect(value.crossover?.from).toBe("b");
    expect(value.crossover?.to).toBe("a");
    expect(value.crossover?.firstLeadTurn).toBe(14);
  });

  it("does not invent a reversal for identical or dominated output paths", () => {
    expect(calculateCivilizationComparison({ ...sample, b: sample.a })?.crossover).toBeNull();
    expect(calculateCivilizationComparison({ ...sample, b: sample.a })?.leader).toBe("tie");
    expect(calculateCivilizationComparison({ ...sample, b: { ...sample.b, yieldPerTurn: 5 } })?.crossover).toBeNull();
    expect(calculateCivilizationComparison({ ...sample, b: { ...sample.b, buildTurns: 3 } })?.crossover).toBeNull();
    expect(calculateCivilizationComparison({ ...sample, a: { ...sample.a, yieldPerTurn: 0 } })?.crossover).toBeNull();
  });

  it("earns nothing before completion or on the completion turn", () => {
    const value = calculateCivilizationComparison({ ...sample, horizonTurns: 3 })!;
    expect(value.a.totalYield).toBe(0);
    expect(value.b.totalYield).toBe(0);
    expect(value.a.yieldToTieOther).toBeNull();
    expect(value.leader).toBe("tie");
    expect(calculateCivilizationComparison({ ...sample, horizonTurns: 4 })?.a.totalYield).toBe(5);
  });

  it("shows production payback only when cost and yield share that unit", () => {
    const value = calculateCivilizationComparison({ ...sample, unit: "production" })!;
    expect(value.a.netProduction).toBe(-95);
    expect(value.b.netProduction).toBe(-196);
    expect(value.a.productionPaybackTurn).toBe(39);
    expect(value.b.productionPaybackTurn).toBe(45);
    // More output is not the same as more net production or a universally better investment.
    expect(value.leader).toBe("b");
  });

  it("uses the first whole turn that recovers production and handles no-yield investments", () => {
    const input = { ...sample, unit: "production" as const, a: { productionCost: 10, buildTurns: 2, yieldPerTurn: 3 } };
    expect(calculateCivilizationComparison(input)?.a.productionPaybackTurn).toBe(6);
    expect(calculateCivilizationComparison({ ...input, horizonTurns: 5 })?.a.netProduction).toBe(-1);
    expect(calculateCivilizationComparison({ ...input, horizonTurns: 6 })?.a.netProduction).toBe(2);
    expect(calculateCivilizationComparison({ ...input, a: { ...input.a, yieldPerTurn: 0 } })?.a.productionPaybackTurn).toBeNull();
    expect(calculateCivilizationComparison({ ...input, a: { ...input.a, productionCost: 0, yieldPerTurn: 0 } })?.a.productionPaybackTurn).toBe(0);
  });

  it("rejects invalid inputs instead of changing the player assumptions", () => {
    for (const horizonTurns of [NaN, Infinity, -1, 501, 3.5]) expect(calculateCivilizationComparison({ ...sample, horizonTurns })).toBeNull();
    for (const buildTurns of [NaN, Infinity, -1, 201, 3.5]) expect(calculateCivilizationComparison({ ...sample, a: { ...sample.a, buildTurns } })).toBeNull();
    for (const yieldPerTurn of [NaN, Infinity, -1, 100001]) expect(calculateCivilizationComparison({ ...sample, b: { ...sample.b, yieldPerTurn } })).toBeNull();
    expect(calculateCivilizationComparison({ ...sample, unit: "food" as "science" })).toBeNull();
    expect(calculateCivilizationComparison({ ...sample, a: { ...sample.a, productionCost: Infinity } })).toBeNull();
  });

  it("does not expose non-finite or unsafe future turns from tiny yield denominators", () => {
    const value = calculateCivilizationComparison({ ...sample, unit: "production", a: { ...sample.a, yieldPerTurn: Number.MIN_VALUE } })!;
    expect(value.a.productionPaybackTurn).toBeNull();
    expect(value.a.productionPaybackUnavailable).toBe(true);
    const nearEqual = calculateCivilizationComparison({ ...sample, a: { ...sample.a, yieldPerTurn: 1 }, b: { ...sample.b, yieldPerTurn: 1 + Number.EPSILON } })!;
    expect(nearEqual.crossover).toBeNull();
    expect(nearEqual.crossoverUnavailable).toBe(true);
    expect(nearEqual.checkpoints.every((row) => Number.isFinite(row.turn) && Number.isFinite(row.a) && Number.isFinite(row.b))).toBe(true);
  });

  it("finds the last whole completion turn preserving the current leader and the first step beyond it", () => {
    const slack = calculateCivilizationComparison(sample)!.completionSlack!;
    expect(slack).toEqual({ choice: "b", latestCompletionTurn: 9, extraTurns: 2,
      outputAtBoundary: 88, otherOutput: 85, next: { completionTurn: 10, output: 80, leader: "a" } });
    expect(calculateCivilizationComparison({ ...sample, b: { ...sample.b, buildTurns: slack.latestCompletionTurn } })!.leader).toBe("b");
    expect(calculateCivilizationComparison({ ...sample, b: { ...sample.b, buildTurns: slack.next!.completionTurn } })!.leader).toBe("a");
  });

  it("keeps the completion-delay condition symmetric between choices", () => {
    const value = calculateCivilizationComparison({ ...sample, a: sample.b, b: sample.a })!.completionSlack!;
    expect(value.choice).toBe("a");
    expect(value.extraTurns).toBe(2);
    expect(value.next).toEqual({ completionTurn: 10, output: 80, leader: "b" });
  });

  it("distinguishes losing a strict lead to a tie from the other choice taking the lead", () => {
    const input = { ...sample, horizonTurns: 10,
      a: { ...sample.a, buildTurns: 2, yieldPerTurn: 5 },
      b: { ...sample.b, buildTurns: 5, yieldPerTurn: 10 } };
    const slack = calculateCivilizationComparison(input)!.completionSlack!;
    expect(slack.extraTurns).toBe(0);
    expect(slack.next).toEqual({ completionTurn: 6, output: 40, leader: "tie" });
    expect(calculateCivilizationComparison({ ...input, b: { ...input.b, buildTurns: 6 } })!.leader).toBe("tie");
  });

  it("does not invent a leader's delay allowance when output is tied or has not started", () => {
    expect(calculateCivilizationComparison({ ...sample, b: sample.a })!.completionSlack).toBeNull();
    expect(calculateCivilizationComparison({ ...sample, horizonTurns: 2 })!.completionSlack).toBeNull();
    const value = calculateCivilizationComparison({ ...sample, a: { ...sample.a, yieldPerTurn: 0 } })!.completionSlack!;
    expect(value.latestCompletionTurn).toBe(19);
    expect(value.next).toEqual({ completionTurn: 20, output: 0, leader: "tie" });
  });

  it("stops at the supported completion range without claiming an unbounded delay allowance", () => {
    const value = calculateCivilizationComparison({ ...sample, horizonTurns: 500,
      a: { ...sample.a, yieldPerTurn: 1 }, b: { ...sample.b, yieldPerTurn: 100 } })!.completionSlack!;
    expect(value.latestCompletionTurn).toBe(200);
    expect(value.extraTurns).toBe(193);
    expect(value.next).toBeNull();
  });

  it("keeps delay thresholds about cumulative yield even when production costs differ", () => {
    const production = calculateCivilizationComparison({ ...sample, unit: "production" })!;
    expect(production.completionSlack).toEqual(calculateCivilizationComparison(sample)!.completionSlack);
    expect(production.a.netProduction).toBeGreaterThan(production.b.netProduction!);
    expect(production.completionSlack!.choice).toBe("b");
  });
});
