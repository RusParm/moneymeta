import { describe, expect, it } from "vitest";
import {
  getGtaViPath,
  gtaViConfirmedFacts,
  gtaViLaunchMetrics,
  gtaViLaunchPhases,
  gtaViMedia,
  gtaViPrecedents,
  gtaViRoutes,
  gtaViSignals,
  gtaViSources,
  gtaViUnknowns,
  gtaViWatch
} from "../src/data/gta-vi";
import { gtaViInsights } from "../src/data/gta-vi-insights";
import { insights } from "../src/data/insights";

const routeFiles = import.meta.glob("../src/pages/{gta-6,en/gta-6}/**/*.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>;

describe("GTA VI Economy Watch", () => {
  it("keeps a dated, primary-source-only fact registry", () => {
    expect(gtaViWatch.checkedAt).toBe("2026-08-20");
    expect(gtaViWatch.releaseDate).toBe("2026-11-19");
    expect(gtaViSources.length).toBeGreaterThanOrEqual(6);
    gtaViSources.forEach((source) => {
      expect(source.url).toMatch(/^https:\/\/(?:www\.)?(?:rockstargames|take2games)\.com\//u);
      expect(source.checkedAt).toBe(gtaViWatch.checkedAt);
      expect(source.label.ru).toBeTruthy();
      expect(source.label.en).toBeTruthy();
    });
    gtaViConfirmedFacts.forEach((fact) => {
      expect(gtaViSources.some((source) => source.id === fact.sourceId)).toBe(true);
      expect(fact.detail.ru).toBeTruthy();
      expect(fact.detail.en).toBeTruthy();
    });
  });

  it("separates narrative evidence, unknown mechanics and launch tests", () => {
    expect(gtaViSignals).toHaveLength(4);
    gtaViSignals.forEach((signal) => {
      expect(signal.status).toBe("confirmed");
      expect(signal.evidence.ru).toBeTruthy();
      expect(signal.boundary.ru).toBeTruthy();
      expect(signal.measure.ru).toBeTruthy();
      expect(signal.evidence.en).toBeTruthy();
      expect(signal.boundary.en).toBeTruthy();
      expect(signal.measure.en).toBeTruthy();
    });
    expect(gtaViUnknowns).toHaveLength(8);
    expect(gtaViPrecedents).toHaveLength(5);
  });

  it("publishes a measurable first 72-hour protocol without fake calculators", () => {
    expect(gtaViLaunchPhases.map((phase) => phase.window)).toEqual(["T-90 → T-1", "0 → 6H", "6 → 24H", "24 → 72H"]);
    expect(gtaViLaunchMetrics).toHaveLength(9);
    expect(new Set(gtaViLaunchMetrics.map((metric) => metric.code)).size).toBe(9);
    const routeSource = Object.values(routeFiles).join("\n");
    expect(routeSource).not.toMatch(/calculator|калькулятор/iu);
    expect(routeSource).not.toMatch(/GTA VI Online/iu);
  });

  it("keeps every official image credited, sourced and removable", () => {
    const media = Object.values(gtaViMedia);
    expect(media).toHaveLength(5);
    media.forEach((item) => {
      expect(item.credit).toBe("Rockstar Games");
      expect(item.sourceUrl).toContain("rockstargames.com/VI/media");
      expect(item.alt.ru).toBeTruthy();
      expect(item.alt.en).toBeTruthy();
    });
  });

  it("ships four focused routes with complete RU and EN parity", () => {
    expect(Object.keys(gtaViRoutes)).toEqual(["overview", "economy", "precedent", "launch"]);
    Object.keys(gtaViRoutes).forEach((id) => {
      const section = id as keyof typeof gtaViRoutes;
      expect(getGtaViPath(section, "ru")).toMatch(/^\/gta-6\//u);
      expect(getGtaViPath(section, "en")).toMatch(/^\/en\/gta-6\//u);
    });
    expect(Object.keys(routeFiles)).toHaveLength(8);
  });

  it("adds three deep bilingual GTA VI editorial routes", () => {
    expect(gtaViInsights).toHaveLength(3);
    expect(insights.filter((insight) => insight.game === "gta6")).toHaveLength(3);
    gtaViInsights.forEach((insight) => {
      expect(insight.evidenceStatus).toBe("verified");
      expect(insight.updatedAt).toBe(gtaViWatch.checkedAt);
      expect(insight.sources?.length).toBeGreaterThanOrEqual(2);
      expect(insight.content.ru.sections.length).toBeGreaterThanOrEqual(5);
      expect(insight.content.en.sections.length).toBe(insight.content.ru.sections.length);
      expect(insight.content.ru.takeaways).toHaveLength(3);
      expect(insight.content.en.takeaways).toHaveLength(3);
      expect(insight.toolPath.ru).toMatch(/^\/gta-6\//u);
      expect(insight.toolPath.en).toMatch(/^\/en\/gta-6\//u);
    });
  });
});
