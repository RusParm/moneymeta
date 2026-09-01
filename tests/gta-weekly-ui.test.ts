import { describe, expect, it } from "vitest";

const component = Object.values(import.meta.glob("../src/components/GtaWeeklyPlanner.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>)[0] ?? "";
const sectionPage = Object.values(import.meta.glob("../src/components/HubSectionPage.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>)[0] ?? "";

describe("GTA weekly planner UI contract", () => {
  it("is mounted before long-term GTA rankings", () => {
    expect(sectionPage.indexOf("<GtaWeeklyPlanner")).toBeGreaterThan(sectionPage.indexOf("<GtaPulse"));
    expect(sectionPage.indexOf("<GtaWeeklyPlanner")).toBeLessThan(sectionPage.indexOf("<GtaRankings"));
  });

  it("keeps scenario and weekly-return state local", () => {
    expect(component).toContain('const storageKey = "money-meta:gta-weekly:v1"');
    expect(component).toContain('const seenKey = "money-meta:gta-weekly:last-seen"');
    expect(component).toContain("localStorage.setItem(seenKey, snapshotId)");
  });

  it("creates shareable inputs without a network channel", () => {
    expect(component).toContain('url.searchParams.set(`gta-weekly.${key}`');
    expect(component).toContain('url.hash = "weekly-plan"');
    expect(component).not.toMatch(/fetch\(|XMLHttpRequest|WebSocket/);
  });

  it("contains both language contracts and the asset gate", () => {
    expect(component).toContain("Стоит ли менять обычный денежный маршрут?");
    expect(component).toContain("Should you leave your normal money route?");
    expect(component).toContain("data-ownership hidden");
  });
});
