import { calculateWowBatchActual, calculateWowBatchPlan, validWowBatchInput, type WowBatchActual, type WowBatchInput } from "./wow-batch-planner";

export const WOW_BATCH_STORE_KEY = "money-meta:wow-batches:v1";
export const WOW_BATCH_LIMIT = 8;
export interface WowBatchRecord {
  id: string;
  name: string;
  createdAt: string;
  forecast: WowBatchInput;
  actual: (WowBatchActual & { recordedAt: string }) | null;
}
export interface WowBatchStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; }
type Failure = { ok: false; error: "unavailable" | "corrupt" | "limit" | "invalid" | "stale" };
type Result = { ok: true; records: WowBatchRecord[] } | Failure;
const iso = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v) && Number.isFinite(Date.parse(v));
const uuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

function validRecord(value: unknown): value is WowBatchRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const r = value as WowBatchRecord;
  return uuid(r.id) && typeof r.name === "string" && r.name.trim().length > 0 && r.name.length <= 80 && iso(r.createdAt)
    && validWowBatchInput(r.forecast) && calculateWowBatchPlan(r.forecast)?.fits === true
    && (r.actual === null || (typeof r.actual === "object" && iso(r.actual.recordedAt)
      && r.actual.recordedAt >= r.createdAt && calculateWowBatchActual(r.forecast, r.actual) !== null));
}

export function readWowBatchJournal(storage: WowBatchStorage): Result {
  let raw: string | null;
  try { raw = storage.getItem(WOW_BATCH_STORE_KEY); } catch { return { ok: false, error: "unavailable" }; }
  if (raw === null) return { ok: true, records: [] };
  if (raw.length > 100_000) return { ok: false, error: "corrupt" };
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || !Array.isArray(data.records) || data.records.length > WOW_BATCH_LIMIT
      || !data.records.every(validRecord) || new Set(data.records.map((r: WowBatchRecord) => r.id)).size !== data.records.length) return { ok: false, error: "corrupt" };
    return { ok: true, records: data.records };
  } catch { return { ok: false, error: "corrupt" }; }
}

function write(storage: WowBatchStorage, records: WowBatchRecord[]): Result {
  try { storage.setItem(WOW_BATCH_STORE_KEY, JSON.stringify({ version: 1, records })); return { ok: true, records }; }
  catch { return { ok: false, error: "unavailable" }; }
}

export function addWowBatchForecast(storage: WowBatchStorage, record: WowBatchRecord): Result {
  const latest = readWowBatchJournal(storage);
  if (!latest.ok) return latest;
  if (!validRecord(record) || record.actual !== null || latest.records.some((r) => r.id === record.id)) return { ok: false, error: "invalid" };
  if (latest.records.length >= WOW_BATCH_LIMIT) return { ok: false, error: "limit" };
  return write(storage, [record, ...latest.records]);
}

/** The UI presents this exact historical record. An intervening edit or deletion
 * cannot be silently overwritten or resurrected by the stale form.
 */
export const wowBatchRecordToken = (record: WowBatchRecord) => JSON.stringify(record);

export function closeWowBatchForecast(storage: WowBatchStorage, id: string, expected: string, actual: WowBatchActual & { recordedAt: string }): Result {
  const latest = readWowBatchJournal(storage);
  if (!latest.ok) return latest;
  const record = latest.records.find((r) => r.id === id);
  if (!record || record.actual !== null || wowBatchRecordToken(record) !== expected) return { ok: false, error: "stale" };
  const closed = { ...record, actual };
  if (!validRecord(closed)) return { ok: false, error: "invalid" };
  return write(storage, latest.records.map((r) => r.id === id ? closed : r));
}

export function removeWowBatchRecord(storage: WowBatchStorage, id: string, expected: string): Result {
  const latest = readWowBatchJournal(storage);
  if (!latest.ok) return latest;
  const record = latest.records.find((r) => r.id === id);
  if (!record || wowBatchRecordToken(record) !== expected) return { ok: false, error: "stale" };
  return write(storage, latest.records.filter((r) => r.id !== id));
}
