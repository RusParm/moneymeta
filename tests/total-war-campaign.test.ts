import { describe, expect, it } from "vitest";
import { getTotalWarCampaignPresetsPath, totalWarCampaignContext, totalWarCampaignPresets } from "../src/data/total-war-campaign-presets";
import { calculateCampaignCapital } from "../src/lib/total-war-campaign";
import { sitemapPaths } from "../src/pages/sitemap.xml";

const pageSource = Object.values(import.meta.glob("../src/components/TotalWarCampaignPresetsPage.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>)[0] ?? "";

describe("Total War campaign command", () => {
  it("carries an adverse case through to the protected reserve", () => {
    const metrics = calculateCampaignCapital(totalWarCampaignPresets[0]!.inputs);

    expect(metrics.netFlowPerTurn).toBe(2400);
    expect(metrics.baseCashAtHorizon).toBe(33300);
    expect(metrics.stressLoss).toBe(2200);
    expect(metrics.stressCashAtHorizon).toBe(31100);
    expect(metrics.reserveBuffer).toBe(28600);
    expect(metrics.maxOneOffCost).toBe(32600);
    expect(metrics.maxAdditionalUpkeepPerTurn).toBeCloseTo(2383.333, 3);
    expect(metrics.state).toBe("funded");
  });

  it("separates a fragile negative-flow plan from a reserve breach", () => {
    const fragile = calculateCampaignCapital({ treasury: 5000, netIncomePerTurn: 1000, oneOffCost: 2000, additionalUpkeepPerTurn: 1200, horizonTurns: 5, protectedReserve: 1000, incomeAtRiskPerTurn: 0, disruptionTurns: 0, emergencyCost: 0 });
    const breach = calculateCampaignCapital({ treasury: 5000, netIncomePerTurn: 1000, oneOffCost: 4500, additionalUpkeepPerTurn: 1000, horizonTurns: 5, protectedReserve: 2000, incomeAtRiskPerTurn: 0, disruptionTurns: 0, emergencyCost: 500 });

    expect(fragile.reserveBuffer).toBe(1000);
    expect(fragile.state).toBe("fragile");
    expect(breach.reserveBuffer).toBe(-2000);
    expect(breach.state).toBe("breach");
  });

  it("ships four localized presets with explicit source boundaries", () => {
    expect(totalWarCampaignPresets).toHaveLength(4);
    expect(totalWarCampaignPresets.filter((preset) => preset.scope === "faction")).toHaveLength(1);
    expect(new Set(totalWarCampaignPresets.map((preset) => preset.id)).size).toBe(4);
    expect(totalWarCampaignContext.checkedAt).toBe("2026-08-24");
    expect(totalWarCampaignContext.nextReview).toBe("2026-09-24");

    totalWarCampaignPresets.forEach((preset) => {
      expect(preset.title.ru).toBeTruthy();
      expect(preset.title.en).toBeTruthy();
      expect(preset.sourceUrl).toMatch(/^https:\/\//u);
      expect(preset.sourceBoundary.ru.length).toBeGreaterThan(80);
      expect(preset.checks).toHaveLength(3);
      expect(Object.keys(preset.inputs)).toHaveLength(9);
    });
  });

  it("publishes stable RU and EN destinations", () => {
    expect(getTotalWarCampaignPresetsPath("ru")).toBe("/total-war/tools/campaign-presets/");
    expect(getTotalWarCampaignPresetsPath("en")).toBe("/en/total-war/tools/campaign-presets/");
    expect(sitemapPaths).toEqual(expect.arrayContaining([
      "/total-war/tools/campaign-presets/",
      "/en/total-war/tools/campaign-presets/",
      "/insights/total-war-campaign-capital-presets-field-guide/",
      "/en/insights/total-war-campaign-capital-presets-field-guide/"
    ]));
  });

  it("reserves a dedicated mark column everywhere new icons meet text", () => {
    expect(pageSource).toContain("tw-preset-card");
    expect(pageSource).toContain("tw-command-boundary");
    expect(pageSource).toContain("tw-command-result-head");
    expect(pageSource).toContain("tw-field-order-grid");
    expect(pageSource).toContain('import "../styles/total-war-campaign-presets.css"');
  });
});
