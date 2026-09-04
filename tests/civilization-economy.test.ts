import { describe, expect, it } from "vitest";
import {
  calculateBuildingWindow,
  calculateEconomicVictoryGap,
  calculateSettlementChoice
} from "../src/lib/civilization-economy";

describe("Civilization VII decision models", () => {
  it("tests a building against the player's horizon and confidence", () => {
    const result = calculateBuildingWindow({
      cost: 400,
      buildTurns: 4,
      benefitPerTurn: 40,
      horizonTurns: 20,
      confidencePercent: 75
    });

    expect(result.activeTurns).toBe(16);
    expect(result.adjustedBenefitPerTurn).toBe(30);
    expect(result.expectedReturn).toBe(480);
    expect(result.netValue).toBe(80);
    expect(result.paybackTurn).toBeCloseTo(17.333, 3);
    expect(result.clearsHorizon).toBe(true);
  });

  it("does not invent payback when the benefit is zero", () => {
    const result = calculateBuildingWindow({
      cost: 200,
      buildTurns: 3,
      benefitPerTurn: 0,
      horizonTurns: 30,
      confidencePercent: 100
    });

    expect(result.paybackTurn).toBeNull();
    expect(result.clearsHorizon).toBe(false);
    expect(result.netValue).toBe(-200);
  });

  it("prices settlement development only on the incremental value", () => {
    const result = calculateSettlementChoice({
      conversionCost: 500,
      conversionTurns: 2,
      currentValuePerTurn: 70,
      developedValuePerTurn: 120,
      horizonTurns: 20,
      confidencePercent: 80
    });

    expect(result.incrementalValuePerTurn).toBe(50);
    expect(result.adjustedIncrementPerTurn).toBe(40);
    expect(result.expectedGain).toBe(720);
    expect(result.netValue).toBe(220);
    expect(result.paybackTurn).toBe(14.5);
    expect(result.clearsHorizon).toBe(true);
  });

  it("keeps a weaker developed state from producing a fake payback", () => {
    const result = calculateSettlementChoice({
      conversionCost: 300,
      conversionTurns: 2,
      currentValuePerTurn: 120,
      developedValuePerTurn: 100,
      horizonTurns: 30,
      confidencePercent: 90
    });

    expect(result.incrementalValuePerTurn).toBe(-20);
    expect(result.paybackTurn).toBeNull();
    expect(result.clearsHorizon).toBe(false);
  });

  it("shows the adjusted Economic Victory gap without assuming a per-turn rate", () => {
    const result = calculateEconomicVictoryGap({
      currentGdp: 420,
      targetGdp: 700,
      resourceGdp: 90,
      convoyGdp: 120,
      buildingGdp: 70,
      confidencePercent: 75
    });

    expect(result.currentGap).toBe(280);
    expect(result.rawAddedGdp).toBe(280);
    expect(result.adjustedAddedGdp).toBe(210);
    expect(result.projectedGdp).toBe(630);
    expect(result.remainingGap).toBe(70);
    expect(result.closesGap).toBe(false);
    expect(result.largestContributor).toBe("convoys");
  });
});
