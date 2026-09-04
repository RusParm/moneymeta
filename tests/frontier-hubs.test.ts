import { describe, expect, it } from "vitest";
import {
  civilizationHub,
  fableHub,
  frontierHubList,
  getFrontierPath,
  getFrontierSource
} from "../src/data/frontier-hubs";
import { sitemapPaths } from "../src/pages/sitemap.xml";

describe("Civilization VII and Fable expansion hubs", () => {
  it("ships one live economy and one bounded release watch", () => {
    expect(frontierHubList).toHaveLength(2);
    expect(civilizationHub.status).toBe("live");
    expect(fableHub.status).toBe("watch");
    expect(civilizationHub.proof.some((item) => item.value === "3")).toBe(true);
    expect(fableHub.proof.some((item) => item.value === "0")).toBe(true);
  });

  it("keeps both editions localized and routes stable", () => {
    frontierHubList.forEach((hub) => {
      expect(hub.heading.ru).toBeTruthy();
      expect(hub.heading.en).toBeTruthy();
      expect(hub.sections).toHaveLength(3);
      expect(new Set(hub.sections.map((section) => section.slug)).size).toBe(3);
      expect(hub.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      expect(getFrontierPath(hub.id, "ru")).toBe(`/${hub.slug}/`);
      expect(getFrontierPath(hub.id, "en")).toBe(`/en/${hub.slug}/`);

      hub.sections.forEach((section) => {
        expect(section.question.ru).toBeTruthy();
        expect(section.outcome.en).toBeTruthy();
        expect(getFrontierPath(hub.id, "ru", section.slug)).toBe(`/${hub.slug}/${section.slug}/`);
      });
    });
  });

  it("ties every material evidence claim to a primary source", () => {
    frontierHubList.forEach((hub) => {
      expect(hub.sources.length).toBeGreaterThanOrEqual(2);
      hub.sources.forEach((source) => {
        expect(source.url).toMatch(/^https:\/\//u);
        expect(source.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
      });
      hub.evidence.forEach((item) => {
        expect(item.claim.ru).toBeTruthy();
        expect(item.boundary.en).toBeTruthy();
        expect(item.sourceId).toBeTruthy();
        expect(getFrontierSource(hub, item.sourceId)).toBeTruthy();
      });
    });
  });

  it("does not model unreleased Fable values", () => {
    expect(fableHub.evidence.some((item) => item.status === "unknown")).toBe(true);
    expect(fableHub.openQuestions).toHaveLength(6);
    expect(fableHub.sections.map((section) => section.slug)).not.toContain("tools");
  });

  it("publishes every localized route and the local connection surface", () => {
    frontierHubList.forEach((hub) => {
      expect(sitemapPaths).toContain(getFrontierPath(hub.id, "ru"));
      expect(sitemapPaths).toContain(getFrontierPath(hub.id, "en"));
      hub.sections.forEach((section) => {
        expect(sitemapPaths).toContain(getFrontierPath(hub.id, "ru", section.slug));
        expect(sitemapPaths).toContain(getFrontierPath(hub.id, "en", section.slug));
      });
    });
    expect(sitemapPaths).toContain("/connect/");
    expect(sitemapPaths).toContain("/en/connect/");
  });
});
