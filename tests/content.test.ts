import { describe, expect, it } from "vitest";
import { gtaEconomyNodes, gtaPlayerPaths, gtaScenarios } from "../src/data/gta-hub";
import { weeklyMeta } from "../src/data/gta-businesses";
import { dotaEconomyNodes, dotaPlayerPaths, dotaPulse, dotaRoleLenses, dotaScenarios } from "../src/data/dota-hub";
import { dotaPatchContext } from "../src/data/dota-economy";
import { wowEconomyNodes, wowMarketRoutes, wowPlayerPaths, wowPulse, wowScenarios } from "../src/data/wow-hub";
import { wowPatchContext } from "../src/data/wow-economy";
import { crusaderKingsHub, totalWarHub } from "../src/data/strategy-hubs";
import { insights } from "../src/data/insights";

describe("GTA benchmark hub content", () => {
  it("meets the benchmark depth gate", () => {
    expect(gtaEconomyNodes).toHaveLength(7);
    expect(gtaPlayerPaths).toHaveLength(3);
    expect(gtaScenarios).toHaveLength(6);
    expect(insights.filter((insight) => insight.game === "gta")).toHaveLength(8);
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
    expect(dotaScenarios).toHaveLength(8);
    expect(new Set(dotaScenarios.map((scenario) => scenario.kind)).size).toBeGreaterThanOrEqual(6);
    expect(insights.filter((insight) => insight.game === "dota")).toHaveLength(8);
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

describe("WoW living hub content", () => {
  it("meets the living-hub depth gate", () => {
    expect(wowEconomyNodes).toHaveLength(7);
    expect(wowPlayerPaths).toHaveLength(3);
    expect(wowMarketRoutes).toHaveLength(6);
    expect(wowScenarios).toHaveLength(8);
    expect(new Set(wowScenarios.map((scenario) => scenario.kind)).size).toBeGreaterThanOrEqual(5);
    expect(insights.filter((insight) => insight.game === "wow")).toHaveLength(8);
  });

  it("keeps every WoW research note complete in both languages", () => {
    const wowInsights = insights.filter((insight) => insight.game === "wow");

    wowInsights.forEach((insight) => {
      expect(insight.content.ru.sections.length).toBeGreaterThanOrEqual(3);
      expect(insight.content.en.sections.length).toBe(insight.content.ru.sections.length);
      expect(insight.content.ru.takeaways).toHaveLength(3);
      expect(insight.content.en.takeaways).toHaveLength(3);
      expect(insight.toolPath.ru).toBeTruthy();
      expect(insight.toolPath.en).toBeTruthy();
    });
  });

  it("ties Market Pulse to a dated primary source and freshness rule", () => {
    expect(wowPulse.release).toContain("Curse of Ula’tek");
    expect(wowPatchContext.release).toContain("Curse of Ula’tek");
    expect(wowPulse.status).toBe("verified");
    expect(wowPulse.sourceUrl).toContain("worldofwarcraft.blizzard.com");
    expect(wowPulse.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(wowPulse.staleAfterDays).toBeGreaterThan(0);
    expect(wowPulse.changes).toHaveLength(3);
  });
});

describe.each([
  ["Total War", totalWarHub],
  ["Crusader Kings III", crusaderKingsHub]
])("%s living hub content", (_label, hub) => {
  it("meets the launch depth gate", () => {
    expect(hub.economyNodes).toHaveLength(7);
    expect(hub.paths).toHaveLength(3);
    expect(hub.pulse.changes).toHaveLength(3);
    expect(hub.lenses).toHaveLength(3);
    expect(hub.scenarios).toHaveLength(6);
    expect(hub.models).toHaveLength(3);
    expect(hub.briefs).toHaveLength(6);
  });

  it("keeps sources, freshness and editable model metadata visible", () => {
    expect(hub.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(hub.staleAfterDays).toBeGreaterThan(0);
    expect(hub.version).toBeTruthy();
    expect(hub.methodology.sources.length).toBeGreaterThanOrEqual(2);
    hub.methodology.sources.forEach((source) => expect(source.url).toMatch(/^https:\/\//));
    hub.models.forEach((model) => {
      expect(model.inputs.length).toBeGreaterThanOrEqual(5);
      expect(model.results.length).toBeGreaterThanOrEqual(4);
      expect(model.title.ru).toBeTruthy();
      expect(model.title.en).toBeTruthy();
    });
  });
});

describe("five-hub guide edition", () => {
  it("publishes one complete featured guide for every economy", () => {
    const games = ["gta", "dota", "wow", "totalwar", "ck3"] as const;

    games.forEach((game) => {
      const guides = insights.filter((insight) => insight.game === game && insight.format === "guide" && insight.featuredInHub);
      expect(guides).toHaveLength(1);
      const guide = guides[0]!;
      expect(guide.updatedAt).toBe("2026-08-18");
      expect(guide.sources?.length).toBeGreaterThanOrEqual(1);
      guide.sources?.forEach((source) => expect(source.url).toMatch(/^https:\/\//));
      expect(guide.content.ru.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.content.en.sections.length).toBe(guide.content.ru.sections.length);
      expect(guide.content.ru.takeaways).toHaveLength(3);
      expect(guide.content.en.takeaways).toHaveLength(3);
      expect(guide.toolPath.ru).toMatch(/^\//);
      expect(guide.toolPath.en).toMatch(/^\/en\//);
    });
  });

  it("adds standalone research depth to both strategy hubs", () => {
    expect(insights.filter((insight) => insight.game === "totalwar")).toHaveLength(5);
    expect(insights.filter((insight) => insight.game === "ck3")).toHaveLength(4);
  });

  it("keeps every strategy guide actionable in both languages", () => {
    insights.filter((insight) => insight.game === "totalwar" || insight.game === "ck3").forEach((guide) => {
      expect(guide.format).toBe("guide");
      expect(guide.sources?.length).toBeGreaterThanOrEqual(1);
      expect(guide.content.ru.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.content.en.sections.length).toBe(guide.content.ru.sections.length);
      expect(guide.content.ru.takeaways).toHaveLength(3);
      expect(guide.toolPath.ru).toMatch(/\/(?:tools|goal-planner)\//u);
      expect(guide.toolPath.en).toContain("/en/");
    });
  });
});
