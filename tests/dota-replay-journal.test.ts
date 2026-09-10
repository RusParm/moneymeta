import { describe, expect, it } from "vitest";
import { dotaDraftProfileSnapshot } from "../src/data/dota-draft-profiles";
import { initialDotaReplayDecisionObservations, type DotaReplayDecision, type DotaReplayDecisionObservations } from "../src/lib/dota-replay-decision";
import {
  DOTA_REPLAY_JOURNAL_KEY, DOTA_REPLAY_JOURNAL_LIMIT, DOTA_REPLAY_JOURNAL_STORAGE_LIMIT,
  addDotaReplayTask, buildDotaReplayTaskSnapshot, closeDotaReplayTask, dotaReplayTaskAuditHref,
  dotaReplayTaskHref, dotaReplayTaskIdFromHash, dotaReplayTaskToken, isDotaReplayTaskRecord,
  isDotaReplayTaskSnapshot, readDotaReplayJournal, removeDotaReplayTask, repeatDotaReplayTask,
  type DotaReplayJournalStorage, type DotaReplayTaskOutcome, type DotaReplayTaskRecord,
} from "../src/lib/dota-replay-journal";

const savedAt = "2026-09-10T10:00:00.000Z";
const closedAt = "2026-09-10T11:00:00.000Z";
const repeatedAt = "2026-09-10T12:00:00.000Z";
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const names = (hero: number) => hero === 28 ? "Slardar" : "Legion Commander";
const candidate = (kind: "bkb" | "blink" = "bkb"): DotaReplayDecision => ({
  id: "bounded-case", heroId: 28, kind, itemKey: kind === "bkb" ? "black_king_bar" : "blink",
  itemTitle: { ru: kind === "bkb" ? "Black King Bar" : "Blink Dagger", en: kind === "bkb" ? "Black King Bar" : "Blink Dagger" },
  purchaseMinute: 33.6, purchaseClock: "33:36", phase: "during", startMinute: 31, endMinute: 34,
  threats: kind === "bkb" ? [{ heroId: 104, ability: "Duel", mechanic: { ru: "Контроль", en: "Control" }, sourceUrl: "https://www.dota2.com/hero/legioncommander" }] : [],
  patchFamily: dotaDraftProfileSnapshot.patchLabel, checkedAt: dotaDraftProfileSnapshot.checkedAt,
  sourceUrls: ["https://www.dota2.com/hero/legioncommander"], partialCoverage: true, purchaseLogHeroCount: 8, totalHeroCount: 10,
});
const answers = (): DotaReplayDecisionObservations => ({ ...initialDotaReplayDecisionObservations(), itemReady: "no" });
const snapshot = (overrides: Partial<Parameters<typeof buildDotaReplayTaskSnapshot>[0]> = {}) => buildDotaReplayTaskSnapshot({
  matchId: 8982871362, playerSlot: 132, role: "core", opponentSlot: 0,
  decision: candidate(), observations: answers(), lang: "ru", heroName: names, ...overrides,
})!;
const record = (n = 1): DotaReplayTaskRecord => ({
  id: id(n), createdAt: savedAt, snapshot: snapshot({ matchId: 8982871362 + n - 1 }), outcome: null,
});
const outcome = (status: DotaReplayTaskOutcome["status"] = "checked"): DotaReplayTaskOutcome => ({ status, note: "Проверил до входа", recordedAt: closedAt });
function memory(initial: string | null = null) {
  let raw = initial;
  let writes = 0;
  const storage: DotaReplayJournalStorage = {
    getItem: (key) => { expect(key).toBe(DOTA_REPLAY_JOURNAL_KEY); return raw; },
    setItem: (key, value) => { expect(key).toBe(DOTA_REPLAY_JOURNAL_KEY); raw = value; writes += 1; },
  };
  return { storage, raw: () => raw, writes: () => writes };
}
const records = (storage: DotaReplayJournalStorage) => {
  const result = readDotaReplayJournal(storage);
  if (!result.ok) throw new Error(result.error);
  return result.records;
};

describe("Explicit replay-task snapshot", () => {
  it("retains a qualified historical task and only the allowlisted selected context", () => {
    const observations = answers();
    const decision = candidate();
    const result = snapshot({ observations, decision });
    expect(result).toMatchObject({ matchId: 8982871362, playerSlot: 132, opponentSlot: 0, heroName: "Slardar", lang: "ru", taskFocus: "item" });
    expect(result.observations).toEqual({ itemReady: "no", alliesReady: "unknown", threatState: "unknown", targetVisible: "unknown" });
    expect(result.note).toContain("Black King Bar");
    expect(result.note).toContain("Legion Commander");
    expect(result.note).toContain(dotaDraftProfileSnapshot.patchLabel);
    expect(result.note).toContain("https://www.dota2.com/hero/legioncommander");
    expect(result.note).toContain("не подтверждает");
    expect(result.task).toContain("доставлен ли Black King Bar");
    expect(result).not.toHaveProperty("sourceUrls");
    expect(result).not.toHaveProperty("threats");
    observations.itemReady = "yes";
    decision.itemTitle.ru = "Changed later";
    expect(result.observations.itemReady).toBe("no");
    expect(result.note).not.toContain("Changed later");
  });

  it("cannot save an unanswered review as a next-match task, but preserves remaining unknowns with a known obstacle", () => {
    expect(snapshot({ observations: initialDotaReplayDecisionObservations() })).toBeNull();
    expect(snapshot({ observations: { ...initialDotaReplayDecisionObservations(), alliesReady: "no" } })).toMatchObject({
      taskFocus: "allies", observations: { itemReady: "unknown", alliesReady: "no", threatState: "unknown" },
    });
    expect(snapshot({ observations: { ...answers(), itemReady: "yes" } })).toBeNull();
    expect(snapshot({ observations: { ...answers(), alliesReady: ["yes"] } as unknown as DotaReplayDecisionObservations })).toBeNull();
  });

  it("handles BKB threats, Blink vision and all-positive preparation without inventing an error", () => {
    expect(snapshot({ observations: { ...initialDotaReplayDecisionObservations(), threatState: "ready" } })?.taskFocus).toBe("threat");
    const blink = snapshot({ decision: candidate("blink"), observations: { ...initialDotaReplayDecisionObservations(), targetVisible: "no" }, lang: "en" });
    expect(blink).toMatchObject({ kind: "blink", itemKey: "blink", taskFocus: "vision", lang: "en" });
    expect(blink.task).toContain("check vision");
    expect(blink.note).not.toContain("Duel");
    const positive = snapshot({ observations: { itemReady: "yes", alliesReady: "yes", threatState: "answered", targetVisible: "unknown" }, lang: "en" });
    expect(positive.taskFocus).toBe("preserve");
    expect(positive.task).toContain("do not guarantee");
    expect(snapshot({ role: undefined, opponentSlot: undefined })).not.toHaveProperty("role");
  });

  it("rejects extra provider fields, invalid public context, incompatible bounds and coercible answers", () => {
    const base = snapshot();
    for (const patch of [
      { accountId: 42 }, { sourceUrl: "https://arbitrary.example/" }, { matchId: 1 }, { matchId: "8982871362" },
      { playerSlot: 5 }, { opponentSlot: 128 }, { role: "unknown" }, { heroId: 0 }, { heroName: "" },
      { startMinute: 34 }, { endMinute: Infinity }, { purchaseMinute: 27 }, { purchaseMinute: 35 },
      { kind: "blink" }, { checkedAt: "2026-02-31" }, { lang: "fr" }, { taskFocus: "verify" },
      { taskFocus: "preserve" }, { task: "" }, { note: "x".repeat(32_001) },
      { observations: { ...base.observations, targetVisible: "yes" } },
      { observations: { ...base.observations, itemReady: ["no"] } },
      { observations: { ...base.observations, privateNote: "do not store" } },
    ]) expect(isDotaReplayTaskSnapshot({ ...base, ...patch }), JSON.stringify(patch)).toBe(false);
    expect(buildDotaReplayTaskSnapshot({ matchId: 8982871362, playerSlot: 132, decision: null as unknown as DotaReplayDecision,
      observations: answers(), lang: "ru", heroName: names })).toBeNull();
  });
});

describe("Bounded local journal and immutable outcomes", () => {
  it("does not write on read and saves a detached round-trip only through an explicit mutation", () => {
    const store = memory();
    expect(readDotaReplayJournal(store.storage)).toEqual({ ok: true, records: [] });
    expect(store.writes()).toBe(0);
    const original = record();
    const result = addDotaReplayTask(store.storage, original);
    expect(result).toEqual({ ok: true, records: [original] });
    original.snapshot.task = "Changed caller state";
    if (result.ok) result.records[0]!.snapshot.observations.itemReady = "yes";
    expect(records(store.storage)[0]!.snapshot.task).not.toContain("Changed caller state");
    expect(records(store.storage)[0]!.snapshot.observations.itemReady).toBe("no");
  });

  it("prevents an identical open task from being saved again after reload, independent of key order", () => {
    const store = memory();
    const original = record();
    addDotaReplayTask(store.storage, original);
    expect(addDotaReplayTask(store.storage, original)).toEqual({ ok: false, error: "invalid" });
    const duplicate = { ...original, id: id(2), snapshot: Object.fromEntries(Object.entries(original.snapshot).reverse()) as unknown as typeof original.snapshot };
    expect(addDotaReplayTask(store.storage, duplicate)).toEqual({ ok: false, error: "duplicate" });
    expect(store.writes()).toBe(1);
  });

  it("rejects an unselected verify task at both storage boundaries even when its unknown answers match that focus", () => {
    const unselected = {
      ...record(),
      snapshot: { ...snapshot(), observations: initialDotaReplayDecisionObservations(), taskFocus: "verify" },
    };
    expect(isDotaReplayTaskSnapshot(unselected.snapshot)).toBe(false);
    expect(isDotaReplayTaskRecord(unselected)).toBe(false);
    const empty = memory();
    expect(addDotaReplayTask(empty.storage, unselected as DotaReplayTaskRecord)).toEqual({ ok: false, error: "invalid" });
    expect(empty.raw()).toBeNull();
    expect(empty.writes()).toBe(0);
    const raw = JSON.stringify({ schemaVersion: 1, records: [unselected] });
    const persisted = memory(raw);
    expect(readDotaReplayJournal(persisted.storage)).toEqual({ ok: false, error: "corrupt" });
    expect(addDotaReplayTask(persisted.storage, record(2))).toEqual({ ok: false, error: "corrupt" });
    expect(persisted.raw()).toBe(raw);
    expect(persisted.writes()).toBe(0);
  });

  it.each(["checked", "missed", "no-opportunity"] as const)("records %s as the player's report without rewriting the original intent", (status) => {
    const store = memory();
    const original = record();
    addDotaReplayTask(store.storage, original);
    const reported = outcome(status);
    expect(closeDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original), reported)).toEqual({ ok: true, records: [{ ...original, outcome: reported }] });
    reported.note = "Attempted later change";
    expect(records(store.storage)[0]!.snapshot).toEqual(original.snapshot);
    expect(records(store.storage)[0]!.outcome?.note).toBe("Проверил до входа");
    const closed = records(store.storage)[0]!;
    expect(closeDotaReplayTask(store.storage, closed.id, dotaReplayTaskToken(closed), outcome("missed"))).toEqual({ ok: false, error: "stale" });
    expect(records(store.storage)[0]!.outcome?.status).toBe(status);
  });

  it("rejects invalid outcomes and source mutations without writing", () => {
    const store = memory();
    const original = record();
    addDotaReplayTask(store.storage, original);
    for (const invalid of [null, { ...outcome(), status: "won" }, { ...outcome(), status: ["checked"] },
      { ...outcome(), note: "x".repeat(501) }, { ...outcome(), recordedAt: "2026-09-10T09:59:59.999Z" },
      { ...outcome(), matchId: 8982871363 }, { ...outcome(), recordedAt: "2026-02-31T11:00:00.000Z" }]) {
      expect(closeDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original), invalid as DotaReplayTaskOutcome)).toEqual({ ok: false, error: "invalid" });
    }
    expect(store.writes()).toBe(1);
    expect(isDotaReplayTaskRecord({ ...original, parentId: original.id })).toBe(false);
    expect(isDotaReplayTaskRecord({ ...original, providerResponse: {} })).toBe(false);
  });

  it("reads the latest record so a stale tab cannot overwrite an outcome or resurrect a deletion", () => {
    const store = memory();
    const original = record();
    addDotaReplayTask(store.storage, original);
    const staleToken = dotaReplayTaskToken(original);
    closeDotaReplayTask(store.storage, original.id, staleToken, outcome());
    expect(removeDotaReplayTask(store.storage, original.id, staleToken)).toEqual({ ok: false, error: "stale" });
    const closed = records(store.storage)[0]!;
    expect(removeDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(closed))).toEqual({ ok: true, records: [] });
    expect(closeDotaReplayTask(store.storage, original.id, staleToken, outcome())).toEqual({ ok: false, error: "stale" });
    expect(removeDotaReplayTask(store.storage, original.id, staleToken)).toEqual({ ok: false, error: "stale" });
    expect(records(store.storage)).toEqual([]);
  });

  it("repeats a closed attempt as a new open attempt with the same historical origin and language", () => {
    const store = memory();
    const original = record();
    addDotaReplayTask(store.storage, original);
    expect(repeatDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original), id(2), repeatedAt)).toEqual({ ok: false, error: "stale" });
    closeDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original), outcome("no-opportunity"));
    const closed = records(store.storage)[0]!;
    expect(repeatDotaReplayTask(store.storage, closed.id, dotaReplayTaskToken(closed), id(2), savedAt)).toEqual({ ok: false, error: "invalid" });
    const repeated = repeatDotaReplayTask(store.storage, closed.id, dotaReplayTaskToken(closed), id(2), repeatedAt);
    expect(repeated).toEqual({ ok: true, records: [{ id: id(2), createdAt: repeatedAt, snapshot: original.snapshot, outcome: null, parentId: original.id }, closed] });
    expect(repeatDotaReplayTask(store.storage, closed.id, dotaReplayTaskToken(closed), id(3), repeatedAt)).toEqual({ ok: false, error: "duplicate" });
    removeDotaReplayTask(store.storage, closed.id, dotaReplayTaskToken(closed));
    expect(records(store.storage)[0]).toMatchObject({ parentId: original.id, snapshot: original.snapshot });
  });

  it("enforces eight records for save and repeat without evicting history", () => {
    const store = memory();
    for (let n = 1; n <= DOTA_REPLAY_JOURNAL_LIMIT; n += 1) expect(addDotaReplayTask(store.storage, record(n)).ok).toBe(true);
    const full = store.raw();
    expect(addDotaReplayTask(store.storage, record(9))).toEqual({ ok: false, error: "limit" });
    expect(store.raw()).toBe(full);
    const original = records(store.storage)[0]!;
    closeDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original), outcome());
    const closed = records(store.storage)[0]!;
    expect(repeatDotaReplayTask(store.storage, closed.id, dotaReplayTaskToken(closed), id(9), repeatedAt)).toEqual({ ok: false, error: "limit" });
    expect(records(store.storage)).toHaveLength(8);
  });

  it("checks serialized capacity before writing and preserves the last readable journal", () => {
    const store = memory();
    for (let n = 1; n <= 4; n += 1) {
      const big = record(n); big.snapshot.note = '"'.repeat(32_000);
      expect(addDotaReplayTask(store.storage, big).ok).toBe(true);
    }
    const before = store.raw();
    const big = record(5); big.snapshot.note = '"'.repeat(32_000);
    expect(addDotaReplayTask(store.storage, big)).toEqual({ ok: false, error: "capacity" });
    expect(store.raw()).toBe(before);
    expect(records(store.storage)).toHaveLength(4);
  });

  it.each([
    ["malformed JSON", "not-json", "corrupt"],
    ["future schema", JSON.stringify({ schemaVersion: 2, records: [] }), "unsupported"],
    ["duplicate IDs", JSON.stringify({ schemaVersion: 1, records: [record(), record()] }), "corrupt"],
    ["unrelated payload", JSON.stringify({ schemaVersion: 1, records: [], privateProfile: {} }), "corrupt"],
    ["oversized payload", " ".repeat(DOTA_REPLAY_JOURNAL_STORAGE_LIMIT + 1), "corrupt"],
  ] as const)("preserves unreadable or future data across every operation (%s)", (_label, raw, error) => {
    const store = memory(raw);
    const original = record();
    expect(readDotaReplayJournal(store.storage)).toEqual({ ok: false, error });
    expect(addDotaReplayTask(store.storage, original)).toEqual({ ok: false, error });
    expect(closeDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original), outcome())).toEqual({ ok: false, error });
    expect(repeatDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original), id(2), repeatedAt)).toEqual({ ok: false, error });
    expect(removeDotaReplayTask(store.storage, original.id, dotaReplayTaskToken(original))).toEqual({ ok: false, error });
    expect(store.raw()).toBe(raw);
    expect(store.writes()).toBe(0);
  });

  it("never claims success when reading or writing storage is denied", () => {
    const deniedRead: DotaReplayJournalStorage = { getItem: () => { throw new Error("Denied"); }, setItem: () => { throw new Error("Must not write"); } };
    expect(readDotaReplayJournal(deniedRead)).toEqual({ ok: false, error: "unavailable" });
    expect(addDotaReplayTask(deniedRead, record())).toEqual({ ok: false, error: "unavailable" });
    const store = memory();
    const deniedWrite: DotaReplayJournalStorage = { getItem: store.storage.getItem, setItem: () => { throw new Error("Quota exceeded"); } };
    expect(addDotaReplayTask(deniedWrite, record())).toEqual({ ok: false, error: "unavailable" });
    expect(store.raw()).toBeNull();
    const quota: DotaReplayJournalStorage = { getItem: store.storage.getItem, setItem: () => {
      const error = new Error("Device is full"); error.name = "QuotaExceededError"; throw error;
    } };
    expect(addDotaReplayTask(quota, record())).toEqual({ ok: false, error: "capacity" });
    expect(store.raw()).toBeNull();
  });
});

describe("Local return and explicit original-match links", () => {
  it("puts only the random reference in a localized task URL", () => {
    const original = record();
    for (const lang of ["ru", "en"] as const) {
      const href = dotaReplayTaskHref(original, lang)!;
      const url = new URL(href, "https://themoneymeta.com");
      expect(url.search).toBe("");
      expect(url.pathname).toBe(`${lang === "en" ? "/en" : ""}/dota-2/tasks/`);
      expect(dotaReplayTaskIdFromHash(url.hash)).toBe(original.id);
      expect(href).not.toContain(String(original.snapshot.matchId));
      expect(href).not.toContain("itemReady");
    }
    for (const hash of ["", "#replay-task=", `#replay-task=${original.id}&match=8982871362`, "#replay-task=https://example.com/"]) expect(dotaReplayTaskIdFromHash(hash)).toBeNull();
    expect(dotaReplayTaskHref({ id: "https://example.com" }, "ru")).toBeNull();
  });

  it("opens the source audit with validated public identifiers and no automatic request or personal observations", () => {
    const base = snapshot();
    const url = new URL(dotaReplayTaskAuditHref(base, "en")!, "https://themoneymeta.com");
    expect(url.pathname).toBe("/en/dota-2/matches/audit/");
    expect(Object.fromEntries(url.searchParams)).toEqual({ match: "8982871362", slot: "132", role: "core", opponent: "0" });
    expect(url.hash).toBe("");
    expect(url.searchParams.has("autoload")).toBe(false);
    const unspecified = new URL(dotaReplayTaskAuditHref(snapshot({ role: undefined, opponentSlot: undefined }), "ru")!, url);
    expect([...unspecified.searchParams.keys()]).toEqual(["match", "slot"]);
    expect(dotaReplayTaskAuditHref({ ...base, matchId: -1 }, "ru")).toBeNull();
    expect(dotaReplayTaskAuditHref({ ...base, opponentSlot: 131 }, "ru")).toBeNull();
  });
});
