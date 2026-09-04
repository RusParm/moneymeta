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
    expect(component).toContain('const journalStorageKey = "money-meta:gta-weekly:journal:v1"');
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

  it("locks a pre-session plan before accepting an actual result", () => {
    expect(component).toContain("data-save-weekly-journal disabled");
    expect(component).toContain("data-journal-outcome-form hidden");
    expect(component).toContain("closeGtaWeeklyJournalEntry");
    expect(component).toContain("Закрытый результат нельзя переписать задним числом.");
    expect(component).toContain("A closed result cannot be rewritten after the fact.");
  });

  it("keeps a bounded device-only history instead of uploading play data", () => {
    expect(component).toContain("Хранится не более восьми недель.");
    expect(component).toContain("Keeps no more than eight weeks.");
    expect(component).toContain("parseGtaWeeklyJournal");
    expect(component).not.toMatch(/fetch\(|XMLHttpRequest|WebSocket/);
  });
});
