import { describe, expect, it } from "vitest";
import { addSavedScenario, deleteSavedScenario, editSavedScenario, readSavedScenarios, savedScenarioHref, savedScenarioIdFromHash, savedScenarioLimit, savedScenarioStorageLimit, savedScenariosKey, type SavedScenario, type ScenarioStorage } from "../src/lib/saved-scenarios";
import { scenarioTools } from "../src/data/scenario-tools";

const entry = (index = 1): SavedScenario => ({
  id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`, toolKey: "wow-farm", name: "Фарм перед рейдом", lang: "ru",
  createdAt: "2026-09-07T10:00:00.000Z", updatedAt: "2026-09-07T10:00:00.000Z",
  values: { "farm-units": "100", "farm-price": "1", "farm-expenses": "500" },
  summary: [{ label: "Доход в час", value: "−400 зол." }], context: "Retail", engineVersion: "1.26.0", note: "", reviewed: false
});
const memory = (initial: string | null = null) => {
  let raw = initial;
  const storage: ScenarioStorage = { getItem: () => raw, setItem: (_key, value) => { raw = value; } };
  return { storage, raw: () => raw };
};

describe("Named calculation storage", () => {
  it("keeps distinct variants across later reads without overwriting a previous plan", () => {
    const { storage } = memory();
    expect(addSavedScenario(storage, entry()).ok).toBe(true);
    expect(addSavedScenario(storage, { ...entry(2), name: "Другой маршрут", values: { "farm-units": "200" } }).ok).toBe(true);
    const saved = readSavedScenarios(storage);
    expect(saved.ok && saved.records.map((record) => record.values["farm-units"])).toEqual(["200", "100"]);
  });
  it("updates the outcome without changing the original inputs or forecast", () => {
    const { storage } = memory(); addSavedScenario(storage, entry());
    const edited = editSavedScenario(storage, entry().id, { name: "Новый заголовок", note: "Получилось −500", reviewed: true }, "2026-09-08T10:00:00.000Z");
    expect(edited.ok && edited.records[0]).toMatchObject({ values: entry().values, summary: entry().summary, createdAt: entry().createdAt, note: "Получилось −500", reviewed: true });
  });
  it("reads fresh storage before a write from another page and preserves unrelated records", () => {
    const { storage } = memory(); addSavedScenario(storage, entry()); addSavedScenario(storage, entry(2));
    editSavedScenario(storage, entry().id, { name: "После сессии", note: "Проверено", reviewed: true });
    const saved = readSavedScenarios(storage);
    expect(saved.ok && saved.records.find((record) => record.id === entry(2).id)).toEqual(entry(2));
  });
  it("removes only the selected record and supports restoring the same snapshot", () => {
    const { storage } = memory(); addSavedScenario(storage, entry()); addSavedScenario(storage, entry(2));
    expect(deleteSavedScenario(storage, entry().id).ok).toBe(true);
    expect(addSavedScenario(storage, entry()).ok).toBe(true);
    expect(readSavedScenarios(storage)).toEqual({ ok: true, records: [entry(), entry(2)] });
  });
  it("does not overwrite corrupt, future-version or duplicate-ID data", () => {
    for (const raw of ["broken", JSON.stringify({ schemaVersion: 2, records: [] }), JSON.stringify({ schemaVersion: 1, records: [entry(), entry()] })]) {
      const { storage, raw: current } = memory(raw);
      expect(addSavedScenario(storage, entry()).ok).toBe(false); expect(current()).toBe(raw);
    }
  });
  it("undo keeps the latest note even when the removed card was rendered before another tab edited it", () => {
    const { storage } = memory(); addSavedScenario(storage, entry());
    editSavedScenario(storage, entry().id, { name: entry().name, note: "Более новый итог", reviewed: true });
    const deleted = deleteSavedScenario(storage, entry().id);
    expect(deleted.ok && deleted.removed?.note).toBe("Более новый итог");
    if (deleted.ok) addSavedScenario(storage, deleted.removed!);
    const restored = readSavedScenarios(storage);
    expect(restored.ok && restored.records[0]?.note).toBe("Более новый итог");
  });
  it("reports unavailable storage on read or write rather than claiming a successful save", () => {
    const denied: ScenarioStorage = { getItem: () => { throw new Error("denied"); }, setItem: () => {} };
    const full: ScenarioStorage = { getItem: () => null, setItem: () => { throw new Error("quota"); } };
    expect(readSavedScenarios(denied)).toEqual({ ok: false, error: "unavailable" });
    expect(addSavedScenario(full, entry())).toEqual({ ok: false, error: "unavailable" });
  });
  it("rejects overflow without silently evicting the oldest calculation", () => {
    const records = Array.from({ length: savedScenarioLimit }, (_, i) => entry(i + 1));
    const raw = JSON.stringify({ schemaVersion: 1, records }); const { storage, raw: current } = memory(raw);
    expect(addSavedScenario(storage, entry(51))).toEqual({ ok: false, error: "limit" }); expect(current()).toBe(raw);
  });
  it("rejects malformed records and unsupported tools before saving", () => {
    const { storage } = memory();
    for (const invalid of [{ ...entry(), toolKey: "https://external.example" }, { ...entry(), values: { constructor: "x" } }, { ...entry(), values: { key: "x".repeat(161) } }, { ...entry(), note: "x".repeat(501) }, { ...entry(), summary: [] }]) {
      expect(addSavedScenario(storage, invalid).ok).toBe(false);
    }
    expect(storage.getItem(savedScenariosKey)).toBeNull();
  });
  it("does not resurrect a calculation removed in another tab through a note update", () => {
    const { storage } = memory(); addSavedScenario(storage, entry()); deleteSavedScenario(storage, entry().id);
    expect(editSavedScenario(storage, entry().id, { name: "Название", note: "Поздняя заметка", reviewed: true })).toEqual({ ok: false, error: "missing" });
  });
  it("preserves optional historical labels and the decision while editing a note alongside older records", () => {
    const old = entry();
    const labelled = { ...entry(2), inputs: [{ key: "farm-units", label: "Товар за час", value: "100" }], decision: "Доход после продажи меньше стоимости выставленного товара." };
    const { storage } = memory();
    expect(addSavedScenario(storage, old).ok).toBe(true);
    expect(addSavedScenario(storage, labelled).ok).toBe(true);
    const changed = editSavedScenario(storage, labelled.id, { name: labelled.name, note: "Продал половину", reviewed: true });
    expect(changed.ok && changed.records[0]).toMatchObject({ inputs: labelled.inputs, decision: labelled.decision, summary: labelled.summary });
    expect(changed.ok && changed.records[1]).toEqual(old);
  });
  it("rejects invented, duplicate or oversized input labels without changing existing data", () => {
    const { storage, raw } = memory(); addSavedScenario(storage, entry()); const initial = raw();
    for (const inputs of [
      [{ key: "unknown", label: "Missing input", value: "10" }],
      [{ key: "farm-units", label: "Units", value: "100" }, { key: "farm-units", label: "Again", value: "100" }],
      [{ key: "farm-units", label: "x".repeat(121), value: "100" }]
    ]) expect(addSavedScenario(storage, { ...entry(2), inputs }).ok).toBe(false);
    expect(addSavedScenario(storage, { ...entry(2), decision: "x".repeat(361) }).ok).toBe(false);
    expect(raw()).toBe(initial);
  });
  it("never writes a collection larger than its own read limit", () => {
    const { storage, raw } = memory();
    const values = Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`field${i}`, "1".repeat(160)]));
    const inputs = Object.entries(values).map(([key, value]) => ({ key, label: "l".repeat(120), value }));
    let capacityReached = false;
    for (let i = 1; i <= savedScenarioLimit; i++) {
      const before = raw();
      const result = addSavedScenario(storage, { ...entry(i), values, inputs, decision: "d".repeat(360) });
      if (!result.ok) {
        expect(result.error).toBe("capacity"); expect(raw()).toBe(before); capacityReached = true; break;
      }
      expect(raw()!.length).toBeLessThanOrEqual(savedScenarioStorageLimit);
      expect(readSavedScenarios(storage).ok).toBe(true);
    }
    expect(capacityReached).toBe(true);
    expect(readSavedScenarios(storage).ok).toBe(true);
  });
});

describe("Private restore links", () => {
  it("uses the requested language and sends no inputs, names or notes in the URL", () => {
    const link = savedScenarioHref(entry(), "en")!;
    expect(link).toBe(`/en/wow/tools/#saved=${entry().id}`);
    expect(link).not.toContain("farm-units"); expect(link).not.toContain("Фарм"); expect(link).not.toContain("?");
    expect(savedScenarioIdFromHash(link.slice(link.indexOf("#")))).toBe(entry().id);
  });
  it("never restores arbitrary fragments or unknown tools", () => {
    for (const hash of ["#farm-liquidity", "#saved=../x", `#saved=${entry().id}&autoload=1`, "#saved="]) expect(savedScenarioIdFromHash(hash)).toBeNull();
    expect(savedScenarioHref({ ...entry(), toolKey: "unknown" }, "ru")).toBeNull();
  });
  it("covers all six live games with unique route-backed tools", () => {
    expect(new Set(scenarioTools.map((tool) => tool.game)).size).toBe(6);
    expect(new Set(scenarioTools.map((tool) => tool.key)).size).toBe(scenarioTools.length);
  });
});
