import { describe, expect, it } from "vitest";
import { hubGateways } from "../src/data/hub-gateways";
import { chooseGatewayOutcome, parseGatewayScores } from "../src/lib/hub-gateway";

describe("hub decision gateway", () => {
  it("combines question weights and keeps declared order for ties", () => {
    expect(chooseGatewayOutcome(["a", "b", "c"], [
      { a: 2, b: 1 },
      { b: 3 },
      { c: 1 }
    ])).toBe("b");

    expect(chooseGatewayOutcome(["a", "b"], [{ a: 2, b: 2 }])).toBe("a");
    expect(chooseGatewayOutcome([], [{ a: 2 }])).toBeNull();
  });

  it("parses compact score attributes safely", () => {
    expect(parseGatewayScores("growth:4,timing:1")).toEqual({ growth: 4, timing: 1 });
    expect(parseGatewayScores("growth:nope,liquidity:3,:2")).toEqual({ liquidity: 3 });
  });

  it("ships a complete, localized gateway for every living hub", () => {
    expect(Object.keys(hubGateways)).toEqual(["gta", "dota", "wow", "total-war", "ck3"]);

    Object.values(hubGateways).forEach((gateway) => {
      const outcomeIds = new Set(gateway.outcomes.map((outcome) => outcome.id));

      expect(gateway.questions).toHaveLength(3);
      expect(gateway.outcomes.length).toBeGreaterThanOrEqual(3);
      expect(gateway.title.ru).toBeTruthy();
      expect(gateway.title.en).toBeTruthy();

      gateway.questions.forEach((question) => {
        expect(question.choices).toHaveLength(3);
        expect(question.prompt.ru).toBeTruthy();
        expect(question.prompt.en).toBeTruthy();

        question.choices.forEach((choice) => {
          expect(choice.label.ru).toBeTruthy();
          expect(choice.label.en).toBeTruthy();
          expect(Object.keys(choice.weights).length).toBeGreaterThan(0);
          Object.keys(choice.weights).forEach((id) => expect(outcomeIds.has(id)).toBe(true));
        });
      });

      gateway.outcomes.forEach((outcome) => {
        expect(outcome.checks).toHaveLength(3);
        expect(outcome.title.ru).toBeTruthy();
        expect(outcome.title.en).toBeTruthy();
        expect(outcome.primary.href.ru).toMatch(/^\//u);
        expect(outcome.primary.href.en).toMatch(/^\/en\//u);
        expect(outcome.secondary.href.ru).toMatch(/^\//u);
        expect(outcome.secondary.href.en).toMatch(/^\/en\//u);
      });
    });
  });
});
