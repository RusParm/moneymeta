import { describe, expect, it } from "vitest";
import { gtaEconomyNodes, gtaPlayerPaths, gtaScenarios } from "../src/data/gta-hub";
import { weeklyMeta } from "../src/data/gta-businesses";
import { dotaEconomyNodes, dotaPlayerPaths, dotaPulse, dotaRoleLenses, dotaScenarios } from "../src/data/dota-hub";
import { dotaPatchContext } from "../src/data/dota-economy";
import { insights } from "../src/data/insights";

describe("GTA benchmark hub content", () => {
  it("meets the benchmark depth gate", () => {
    expect(gtaEconomyNodes).toHaveLength(7);
    expect(gtaPlayerPaths).toHaveLength(3);
    expect(gtaScenarios).toHaveLength(6);
    expect(insights.filter((insight) => insight.game === "gta")).toHaveLength(6);
  });

  it("keeps every GTA research note complete in both languages", () => {
    const gtaInsights = insights.filter((insight) => insight.game === "gta");

    gtaInsights.forEach((insight) => {
      expect(insight.content.ru.sections.length).toBeGreaterThanOrEqual(3);
      expect(insight.content.en.sections.length).toBe(insight.content.ru.sections.length);
      expect(insight.content.ru.takeaways).toHaveLength(3);
      expect(insight.content.en.takeaways).toHaveLength(3);
      expect(insight.toolPath.ru).toBeTruthy();
      expect(insight.toolPath.en).toBeTruthy();
    });
  });

  it("ties the live pulse to a dated primary source", () => {
    expect(weeklyMeta.status).toBe("verified");
    expect(weeklyMeta.sourceUrl).toContain("rockstargames.com/newswire/article/");
    expect(weeklyMeta.validThrough).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(weeklyMeta.opportunities).toHaveLength(3);
  });
});

describe("Dota living hub content", () => {
  it("meets the living-hub depth gate", () => {
    expect(dotaEconomyNodes).toHaveLength(7);
    expect(dotaPlayerPaths).toHaveLength(3);
    expect(dotaRoleLenses).toHaveLength(3);
    expect(dotaScenarios).toHaveLength(6);
    expect(insights.filter((insight) => insight.game === "dota")).toHaveLength(6);
  });

  it("keeps every Dota research note complete in both languages", () => {
    const dotaInsights = insights.filter((insight) => insight.game === "dota");

    dotaInsights.forEach((insight) => {
      expect(insight.content.ru.sections.length).toBeGreaterThanOrEqual(3);
      expect(insight.content.en.sections.length).toBe(insight.content.ru.sections.length);
      expect(insight.content.ru.takeaways).toHaveLength(3);
      expect(insight.content.en.takeaways).toHaveLength(3);
      expect(insight.toolPath.ru).toBeTruthy();
      expect(insight.toolPath.en).toBeTruthy();
    });
  });

  it("ties Patch Pulse to a dated primary source and freshness rule", () => {
    expect(dotaPatchContext.patch).toBe("7.41e");
    expect(dotaPulse.patch).toBe(dotaPatchContext.patch);
    expect(dotaPulse.status).toBe("verified");
    expect(dotaPulse.sourceUrl).toContain(`dota2.com/patches/${dotaPatchContext.patch}`);
    expect(dotaPulse.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(dotaPulse.staleAfterDays).toBeGreaterThan(0);
    expect(dotaPulse.changes).toHaveLength(3);
  });
});
