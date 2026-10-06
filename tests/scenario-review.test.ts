import { describe, expect, it } from "vitest";
import { reviewScenario } from "../src/lib/scenario-review";
import { scenarioReviewSources, scenarioContexts, scenarioEngineVersion } from "../src/data/scenario-context";
import { scenarioTools } from "../src/data/scenario-tools";
import type { SavedScenario } from "../src/lib/saved-scenarios";

const record: SavedScenario = {
  id: "00000000-0000-4000-8000-000000000001", toolKey: "dota-compare", name: "Two items", lang: "ru",
  createdAt: "2026-09-01T00:00:00Z", updatedAt: "2026-09-01T00:00:00Z", values: { gold: "1000" },
  summary: [{ label: "Gold", value: "1000" }], context: "7.41e", engineVersion: "1.35.0", note: "", reviewed: false
};
const current = {
  engine: "1.35.0", contexts: { ru: { "dota-compare": "7.41e" }, en: { "dota-compare": "Patch 7.41e" } },
  sources: { "dota-compare": { policy: { checkedAt: "2026-09-01T00:00:00Z", maxAgeHours: 48 }, path: "/dota-2/items/" } }
};
describe("Saved-plan source and assumption review", () => {
  it("expires unchanged source data at the exact boundary without requiring a deployment", () => {
    expect(reviewScenario(record, current, "ru", new Date("2026-09-02T23:59:59Z")).needsReview).toBe(false);
    const due = reviewScenario(record, current, "ru", new Date("2026-09-03T00:00:00Z"));
    expect(due.needsReview).toBe(true); expect(due.reasons).toHaveLength(1);
    expect(due.reasons[0]).toContain("не делает их свежими");
  });
  it("compares context in the original save language when viewing in English", () => {
    expect(reviewScenario(record, current, "en", new Date("2026-09-01T01:00:00Z")).reasons).toEqual([]);
  });
  it("flags missing or changed metadata without claiming a game formula changed", () => {
    const result = reviewScenario({ ...record, context: "", engineVersion: "old" }, current, "en", new Date("2026-09-01T01:00:00Z"));
    expect(result.reasons).toHaveLength(2);
    expect(result.reasons[0]).toContain("does not establish a game-formula change");
    expect(reviewScenario(record, { ...current, contexts: {} }, "en").needsReview).toBe(true);
  });
  it("a note edit, after-play mark or recent copy cannot refresh the underlying source", () => {
    for (const modified of [{ ...record, reviewed: true }, { ...record, updatedAt: "2026-09-18T00:00:00Z" }, { ...record, createdAt: "2026-09-18T00:00:00Z" }]) {
      expect(reviewScenario(modified, current, "en", new Date("2026-09-18T00:00:00Z")).needsReview).toBe(true);
    }
  });
  it("is read-only and preserves historical inputs, result and note", () => {
    const before = JSON.stringify(record);
    reviewScenario(record, current, "en", new Date("2026-09-18T00:00:00Z"));
    expect(JSON.stringify(record)).toBe(before);
  });
  it("keeps personal-input models independent from the GTA event or WoW news date", () => {
    const sources = scenarioReviewSources();
    expect(sources["gta-session"]).toBeUndefined(); expect(sources["wow-crafting"]).toBeUndefined();
    expect(sources["dota-compare"]!.policy.maxAgeHours).toBe(48);
    expect(sources["gta-business"]!.policy.validThrough).toBeUndefined();
  });
  it("provides concrete bilingual checks for every supported calculator without certifying live inputs", () => {
    for (const tool of scenarioTools) for (const lang of ["ru", "en"] as const) {
      const contexts = { ru: scenarioContexts("ru"), en: scenarioContexts("en") };
      const item = { ...record, toolKey: tool.key, context: contexts.ru[tool.key]!, engineVersion: scenarioEngineVersion };
      const result = reviewScenario(item, { engine: scenarioEngineVersion, contexts, sources: scenarioReviewSources() }, lang, new Date("2026-09-18T00:00:00Z"));
      expect(result.checks.length).toBeGreaterThan(1);
      expect(result.checks.every((check) => check.length > 30)).toBe(true);
      if (result.sourcePath) expect(result.sourcePath).toMatch(/^\/(dota-2|gta-online|wow|total-war|crusader-kings-3|civilization-7)\//);
    }
  });
  it("fails closed for malformed and future source dates", () => {
    for (const checkedAt of ["bad", "2027-01-01T00:00:00Z"]) {
      expect(reviewScenario(record, { ...current, sources: { "dota-compare": { policy: { checkedAt, maxAgeHours: 48 }, path: "/dota-2/items/" } } }, "en", new Date("2026-09-18T00:00:00Z")).needsReview).toBe(true);
    }
  });
});
