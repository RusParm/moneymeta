import { describe, expect, it } from "vitest";
import { homeDecisionExamples, type HomeExampleGame } from "../src/data/home-decision-examples";
import { getScenarioTool } from "../src/data/scenario-tools";
import { calculateGtaSession, type GtaSessionInput, type GtaSessionKind } from "../src/lib/gta-session";
import { totalWarHub, crusaderKingsHub } from "../src/data/strategy-hubs";
import { calculateHomeDecisionExample, homeExampleDefault } from "../src/lib/home-decision-examples";
import { calculateReserveMetrics } from "../src/lib/strategy-economy";

const targetSources = import.meta.glob([
  "../src/components/WowCalculators.astro", "../src/components/WowBatchPlanner.astro"
], { eager: true, import: "default", query: "?raw" }) as Record<string, string>;

function result(game: HomeExampleGame, value: number | string) {
  const result = calculateHomeDecisionExample(game, value, "en");
  if (!result.valid) throw new Error("Expected a valid example");
  return result;
}

describe("consequential homepage examples", () => {
  it("shows profit without pretending unsold WoW stock is spendable gold", () => {
    const current = result("wow", 70);
    expect(current.metrics[0].value).toBeCloseTo(3340.5);
    expect(current.metrics[1].value).toBeCloseTo(-1609.5);
    expect(current.state).toBe("caution");
    expect(result("wow", 77).metrics[1].value).toBeLessThan(0);
    expect(result("wow", 78).metrics[1].value).toBeGreaterThan(0);
    expect(result("wow", 100).metrics[1].value).toBe(4875);
    expect(result("wow", 0).metrics[1].value).toBe(-16740);
  });
  it("changes the GTA activity choice when a whole sale and mission fit", () => {
    expect(result("gta", 60).metrics.map((metric) => metric.value)).toEqual([280000, 280000]);
    expect(result("gta", 60).consequence).toContain("× 2");
    expect(result("gta", 69).metrics[0].value).toBe(280000);
    expect(result("gta", 70).metrics[0].value).toBe(340000);
    const longer = result("gta", 75);
    expect(longer.metrics.map((metric) => metric.value)).toEqual([340000, 280000]);
    expect(longer.consequence).toContain("Uses 70 minutes, leaves 5 free");
    expect(longer.nextAction).toContain("60,000 more");
  });
  it("does not pay for incomplete GTA runs or repeat the ready stock", () => {
    expect(result("gta", 29).metrics.map((metric) => metric.value)).toEqual([0, 0]);
    expect(result("gta", 29).state).toBe("caution");
    expect(result("gta", 30).metrics[0].value).toBe(140000);
    expect(result("gta", 240).metrics.map((metric) => metric.value)).toEqual([760000, 560000]);
    expect(result("gta", 240).consequence).toContain("leaves 95 free");
  });
  it("changes the army decision when the campaign crosses the reserve boundary", () => {
    expect(result("total-war", 8).metrics.map((metric) => metric.value)).toEqual([1900, -1100]);
    expect(result("total-war", 6).state).toBe("positive");
    expect(result("total-war", 7).state).toBe("caution");
    expect(result("ck3", 38).metrics.map((metric) => metric.value)).toEqual([174, -76]);
    expect(result("ck3", 34).state).toBe("positive");
    expect(result("ck3", 35).state).toBe("caution");
  });
  it("the displayed CK3 whole-gold spending cap preserves the reserve; the next gold does not", () => {
    const example = result("ck3", 38);
    const displayedCap = Number(example.consequence.match(/within ([\d,]+) gold/)?.[1]?.replaceAll(",", ""));
    expect(Number.isFinite(displayedCap)).toBe(true);
    const input = example.values;
    const atTotalSpend = (total: number) => calculateReserveMetrics({
      treasury: input.treasury!, incomePerPeriod: input.incomePerPeriod!,
      currentOutflow: input.currentOutflow!, newOutflow: total - input.currentOutflow!,
      oneOffCost: input.oneOffCost!, horizonPeriods: input.horizonPeriods!, reserve: input.reserve!
    });
    expect(atTotalSpend(displayedCap).buffer).toBeGreaterThanOrEqual(0);
    expect(atTotalSpend(displayedCap + 1).buffer).toBeLessThan(0);
  });
  it("Civ changes the leading option with the deadline without subtracting production from science", () => {
    expect(result("civ7", 10).metrics.map((metric) => metric.value)).toEqual([35, 24]);
    expect(result("civ7", 14).metrics.map((metric) => metric.value)).toEqual([55, 56]);
    expect(result("civ7", 20).metrics.map((metric) => metric.value)).toEqual([85, 104]);
    expect(result("civ7", 3).metrics.map((metric) => metric.value)).toEqual([0, 0]);
    expect(result("civ7", 20).consequence).toContain("120 more production");
  });
  it.each(Object.keys(homeDecisionExamples) as HomeExampleGame[])("%s rejects unusable input without emitting a result or handoff", (game) => {
    const config = homeDecisionExamples[game];
    for (const raw of ["", " ", "invalid", "Infinity", Infinity, NaN, config.min - 1, config.max + 1]) {
      expect(calculateHomeDecisionExample(game, raw, "ru")).toEqual({ valid: false });
    }
    if (config.step !== "any") expect(calculateHomeDecisionExample(game, 1.5, "ru")).toEqual({ valid: false });
  });
});

describe("exact full-model handoff", () => {
  it.each(Object.keys(homeDecisionExamples) as HomeExampleGame[])("%s includes every case input and the registered panel in both languages", (game) => {
    const config = homeDecisionExamples[game];
    const tool = getScenarioTool(config.toolKey)!;
    for (const lang of ["ru", "en"] as const) {
      const calculated = calculateHomeDecisionExample(game, homeExampleDefault(game) + 1, lang);
      if (!calculated.valid) throw new Error("Invalid default");
      const url = new URL(calculated.href, "https://themoneymeta.com");
      expect(url.pathname).toBe(`${lang === "en" ? "/en" : ""}${tool.path}`);
      expect(url.hash).toBe(`#${tool.anchor}`);
      expect(url.searchParams.size).toBe(config.fields.length + Object.keys(config.fixedParameters ?? {}).length);
      Object.entries(config.fixedParameters ?? {}).forEach(([key, value]) => {
        expect(url.searchParams.get(`${tool.key}.${key}`)).toBe(value);
      });
      config.fields.forEach((field) => {
        expect(url.searchParams.get(`${tool.key}.${field.key}`)).toBe(String(calculated.values[field.key]));
      });
      expect(Number(url.searchParams.get(`${tool.key}.${config.inputKey}`))).toBe(homeExampleDefault(game) + 1);
    }
  });
  it("field names stay aligned with the actual target controls, not just the example config", () => {
    const configured = (game: HomeExampleGame) => homeDecisionExamples[game].fields.map((field) => field.key).sort();
    expect(configured("total-war")).toEqual(totalWarHub.models.find((model) => model.id === "war-reserve")!.inputs.map((field) => field.key).sort());
    expect(configured("ck3")).toEqual(crusaderKingsHub.models.find((model) => model.id === "war-chest")!.inputs.map((field) => field.key).sort());
    const controls = (path: string, pattern: RegExp) => [...(targetSources[path] ?? "").matchAll(pattern)].map((match) => match[1]!).sort();
    expect(configured("wow")).toEqual(controls("../src/components/WowCalculators.astro", /<input[^>]*data-role="(craft-[^"]+)"/g));
    const wowExtras = Object.keys(homeDecisionExamples.wow.fixedParameters ?? {}).sort();
    expect(wowExtras).toEqual(controls("../src/components/WowBatchPlanner.astro", /<(?:input|select)[^>]*data-role="(craft-[^"]+)"/g));
  });
  it("restores the GTA target field contract and reproduces the displayed result in either language", () => {
    for (const lang of ["ru", "en"] as const) for (const minutes of [0, 29, 30, 60, 69, 70, 75, 240]) {
      const calculated = calculateHomeDecisionExample("gta", minutes, lang);
      if (!calculated.valid) throw new Error("Expected a valid session");
      const params = new URL(calculated.href, "https://themoneymeta.com").searchParams;
      const field = (name: string) => params.get(`gta-session.${name}`)!;
      // These are the receiving planner's controls, including disabled sources.
      const expected = ["minutes", "sources", ...[0, 1, 2, 3].flatMap((i) =>
        ["kind", "available", "cash", "duration", "entry", "runs"].map((key) => `s${i}-${key}`))];
      expect([...params.keys()].sort()).toEqual(expected.map((key) => `gta-session.${key}`).sort());
      expect(field("sources")).toBe("2");
      expect(field("s0-kind")).toBe("ready-sale");
      expect(field("s0-runs")).toBe("1");
      expect(field("s1-runs")).toBe("4");
      expect(field("s2-available")).toBe("no");
      expect(field("s3-available")).toBe("no");
      const restored: GtaSessionInput = {
        minutesAvailable: Number(field("minutes")),
        sources: Array.from({ length: Number(field("sources")) }, (_, i) => ({
          kind: field(`s${i}-kind`) as GtaSessionKind, available: field(`s${i}-available`) === "yes",
          cashPerRun: Number(field(`s${i}-cash`)), minutesPerRun: Number(field(`s${i}-duration`)),
          entryMinutes: Number(field(`s${i}-entry`)), maxRuns: Number(field(`s${i}-runs`))
        }))
      };
      const full = calculateGtaSession(restored)!;
      expect(full).not.toBeNull();
      expect([full.best.cash, full.solo.cash]).toEqual(calculated.metrics.map((metric) => metric.value));
    }
  });
});
