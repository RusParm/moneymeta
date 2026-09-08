import type { CivilizationComparisonInput } from "../lib/civ-comparison";

/** Illustrative player-entered alternatives, not named buildings or patch benchmarks. */
export const civilizationComparisonExample: CivilizationComparisonInput = {
  unit: "science",
  horizonTurns: 20,
  a: { productionCost: 180, buildTurns: 3, yieldPerTurn: 5 },
  b: { productionCost: 300, buildTurns: 7, yieldPerTurn: 8 }
};
