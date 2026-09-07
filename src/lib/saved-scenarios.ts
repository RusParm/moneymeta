import { getScenarioTool, localizeScenarioPath, type ScenarioLocale } from "../data/scenario-tools";

export const savedScenariosKey = "money-meta:saved-scenarios:v1";
export const savedScenarioLimit = 50;
export interface SavedScenario {
  id: string;
  toolKey: string;
  name: string;
  lang: ScenarioLocale;
  createdAt: string;
  updatedAt: string;
  values: Record<string, string>;
  summary: Array<{ label: string; value: string }>;
  context: string;
  engineVersion: string;
  note: string;
  reviewed: boolean;
}
export type ScenarioStorage = Pick<Storage, "getItem" | "setItem">;
export type SavedRead = { ok: true; records: SavedScenario[] } | { ok: false; error: "unavailable" | "corrupt" | "unsupported" };
export type SavedWrite = { ok: true; records: SavedScenario[]; removed?: SavedScenario } | { ok: false; error: "unavailable" | "corrupt" | "unsupported" | "limit" | "invalid" | "missing" };
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));
const isText = (value: unknown, maximum: number, nonempty = false): value is string => typeof value === "string" && value.length <= maximum && (!nonempty || value.trim().length > 0);
const date = (value: unknown): value is string => isText(value, 30, true) && Number.isFinite(Date.parse(value));
export const validScenarioId = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);

export function isSavedScenario(value: unknown): value is SavedScenario {
  if (!isObject(value) || !validScenarioId(value.id) || typeof value.toolKey !== "string" || !getScenarioTool(value.toolKey)) return false;
  if (!isText(value.name, 80, true) || (value.lang !== "ru" && value.lang !== "en") || !date(value.createdAt) || !date(value.updatedAt)) return false;
  if (Date.parse(value.updatedAt) < Date.parse(value.createdAt) || !isText(value.note, 500) || typeof value.reviewed !== "boolean") return false;
  if (!isText(value.context, 240) || !isText(value.engineVersion, 40, true) || !isObject(value.values)) return false;
  const fields = Object.entries(value.values);
  if (!fields.length || fields.length > 40 || !fields.every(([key, val]) => /^[a-zA-Z][a-zA-Z0-9-]{0,63}$/.test(key) && !["constructor", "prototype"].includes(key) && isText(val, 160))) return false;
  return Array.isArray(value.summary) && value.summary.length > 0 && value.summary.length <= 4
    && value.summary.every((row) => isObject(row) && isText(row.label, 120, true) && isText(row.value, 160, true));
}

export function readSavedScenarios(storage: ScenarioStorage): SavedRead {
  let raw: string | null;
  try { raw = storage.getItem(savedScenariosKey); } catch { return { ok: false, error: "unavailable" }; }
  if (raw === null) return { ok: true, records: [] };
  if (raw.length > 900_000) return { ok: false, error: "corrupt" };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) return { ok: false, error: "corrupt" };
    if (parsed.schemaVersion !== 1) return { ok: false, error: "unsupported" };
    if (!Array.isArray(parsed.records) || parsed.records.length > savedScenarioLimit || !parsed.records.every(isSavedScenario)) return { ok: false, error: "corrupt" };
    const records = parsed.records as SavedScenario[];
    if (new Set(records.map((record) => record.id)).size !== records.length) return { ok: false, error: "corrupt" };
    return { ok: true, records };
  } catch { return { ok: false, error: "corrupt" }; }
}

function write(storage: ScenarioStorage, records: SavedScenario[]): SavedWrite {
  try { storage.setItem(savedScenariosKey, JSON.stringify({ schemaVersion: 1, records })); }
  catch { return { ok: false, error: "unavailable" }; }
  return { ok: true, records };
}

export function addSavedScenario(storage: ScenarioStorage, record: SavedScenario): SavedWrite {
  if (!isSavedScenario(record)) return { ok: false, error: "invalid" };
  const existing = readSavedScenarios(storage);
  if (!existing.ok) return existing;
  if (existing.records.length >= savedScenarioLimit) return { ok: false, error: "limit" };
  if (existing.records.some((entry) => entry.id === record.id)) return { ok: false, error: "invalid" };
  return write(storage, [record, ...existing.records]);
}

export function editSavedScenario(storage: ScenarioStorage, id: string, input: Pick<SavedScenario, "name" | "note" | "reviewed">, now = new Date().toISOString()): SavedWrite {
  const existing = readSavedScenarios(storage);
  if (!existing.ok) return existing;
  const record = existing.records.find((item) => item.id === id);
  if (!record) return { ok: false, error: "missing" };
  const edited = { ...record, name: input.name, note: input.note, reviewed: input.reviewed, updatedAt: now };
  if (!isSavedScenario(edited)) return { ok: false, error: "invalid" };
  return write(storage, existing.records.map((item) => item.id === id ? edited : item));
}

export function deleteSavedScenario(storage: ScenarioStorage, id: string): SavedWrite {
  const existing = readSavedScenarios(storage);
  if (!existing.ok) return existing;
  const removed = existing.records.find((item) => item.id === id);
  if (!removed) return { ok: false, error: "missing" };
  const result = write(storage, existing.records.filter((item) => item.id !== id));
  return result.ok ? { ...result, removed } : result;
}

// Only a local random reference travels in the fragment. Inputs and notes never enter this URL.
export function savedScenarioHref(record: SavedScenario, lang: ScenarioLocale) {
  const tool = getScenarioTool(record.toolKey);
  return tool && validScenarioId(record.id) ? `${localizeScenarioPath(tool.path, lang)}#saved=${record.id}` : null;
}

export function savedScenarioIdFromHash(hash: string) {
  const value = hash.startsWith("#saved=") ? hash.slice(7) : "";
  return validScenarioId(value) ? value : null;
}
