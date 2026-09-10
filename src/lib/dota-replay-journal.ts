import {
  buildDotaReplayDecisionNote,
  evaluateDotaReplayDecision,
  type DotaReplayDecision,
  type DotaReplayDecisionEvaluation,
  type DotaReplayDecisionObservations,
} from "./dota-replay-decision";
import { dotaEpisodeLookbackMinutes } from "./dota-episode-context";

export const DOTA_REPLAY_JOURNAL_KEY = "money-meta:dota-replay-tasks:v1";
export const DOTA_REPLAY_JOURNAL_CHANGE_EVENT = "money-meta:replay-journal-change";
export const DOTA_REPLAY_JOURNAL_LIMIT = 8;
export const DOTA_REPLAY_JOURNAL_STORAGE_LIMIT = 300_000;
type Language = "ru" | "en";
type TaskFocus = Exclude<DotaReplayDecisionEvaluation["taskFocus"], "verify">;
export interface DotaReplayTaskSnapshot {
  matchId: number;
  playerSlot: number;
  role?: "core" | "support";
  opponentSlot?: number;
  heroId: number;
  heroName: string;
  kind: "bkb" | "blink";
  itemKey: "black_king_bar" | "blink";
  purchaseMinute: number;
  startMinute: number;
  endMinute: number;
  patchFamily: string;
  checkedAt: string;
  lang: Language;
  note: string;
  task: string;
  taskFocus: TaskFocus;
  observations: DotaReplayDecisionObservations;
}
export interface DotaReplayTaskOutcome {
  status: "checked" | "missed" | "no-opportunity";
  note: string;
  recordedAt: string;
}
export interface DotaReplayTaskRecord {
  id: string;
  createdAt: string;
  snapshot: DotaReplayTaskSnapshot;
  outcome: DotaReplayTaskOutcome | null;
  parentId?: string;
}
export interface DotaReplayJournalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export type DotaReplayJournalError = "unavailable" | "corrupt" | "unsupported" | "capacity" | "limit" | "invalid" | "stale" | "duplicate";
export type DotaReplayJournalResult = { ok: true; records: DotaReplayTaskRecord[] }
  | { ok: false; error: DotaReplayJournalError };

const object = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));
const keys = (value: Record<string, unknown>, required: string[], optional: string[] = []): boolean =>
  required.every((key) => Object.hasOwn(value, key)) && Object.keys(value).every((key) => required.includes(key) || optional.includes(key));
const text = (value: unknown, limit: number, required = true): value is string => typeof value === "string" && value.length <= limit && (!required || value.trim().length > 0);
const integer = (value: unknown, minimum: number, maximum: number): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= minimum && value <= maximum;
const minute = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10_000;
const slot = (value: unknown): value is number => integer(value, 0, 4) || integer(value, 128, 132);
const matchId = (value: unknown): value is number => integer(value, 100_000, 999_999_999_999);
const uuid = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
const iso = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const day = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const language = (value: unknown): value is Language => value === "ru" || value === "en";
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function observationsValid(value: unknown): value is DotaReplayDecisionObservations {
  if (!object(value) || !keys(value, ["itemReady", "alliesReady", "threatState", "targetVisible"])) return false;
  return [value.itemReady, value.alliesReady, value.targetVisible].every((answer) => typeof answer === "string" && ["yes", "no", "unknown"].includes(answer))
    && typeof value.threatState === "string" && ["ready", "answered", "unknown"].includes(value.threatState);
}

/** These schema-1 focus rules stay fixed; historical text is never recalculated. */
function focusMatches(value: DotaReplayTaskSnapshot): boolean {
  const a = value.observations;
  const expected = a.itemReady === "no" ? "item" : a.alliesReady === "no" ? "allies"
    : value.kind === "bkb" && a.threatState === "ready" ? "threat"
      : value.kind === "blink" && a.targetVisible === "no" ? "vision"
        : a.itemReady === "yes" && a.alliesReady === "yes"
          && (value.kind === "bkb" ? a.threatState === "answered" : a.targetVisible === "yes") ? "preserve" : "verify";
  return value.taskFocus === expected;
}

export function isDotaReplayTaskSnapshot(value: unknown): value is DotaReplayTaskSnapshot {
  if (!object(value) || !keys(value, ["matchId", "playerSlot", "heroId", "heroName", "kind", "itemKey", "purchaseMinute", "startMinute", "endMinute", "patchFamily", "checkedAt", "lang", "note", "task", "taskFocus", "observations"], ["role", "opponentSlot"])) return false;
  if (!matchId(value.matchId) || !slot(value.playerSlot) || !integer(value.heroId, 1, 10_000) || !text(value.heroName, 120)) return false;
  if (Object.hasOwn(value, "role") && value.role !== "core" && value.role !== "support") return false;
  if (Object.hasOwn(value, "opponentSlot") && (!slot(value.opponentSlot) || (value.opponentSlot < 128) === (value.playerSlot < 128))) return false;
  if ((value.kind !== "bkb" && value.kind !== "blink") || value.itemKey !== (value.kind === "bkb" ? "black_king_bar" : "blink")) return false;
  if (!minute(value.startMinute) || !minute(value.endMinute) || value.endMinute <= value.startMinute || !minute(value.purchaseMinute)
    || value.purchaseMinute < Math.max(0, value.startMinute - dotaEpisodeLookbackMinutes) || value.purchaseMinute > value.endMinute) return false;
  if (!text(value.patchFamily, 40) || !day(value.checkedAt) || !language(value.lang) || !text(value.note, 32_000) || !text(value.task, 2_000)) return false;
  if (typeof value.taskFocus !== "string" || !["item", "allies", "threat", "vision", "preserve"].includes(value.taskFocus)) return false;
  if (!observationsValid(value.observations)) return false;
  if (value.kind === "bkb" ? value.observations.targetVisible !== "unknown" : value.observations.threatState !== "unknown") return false;
  return focusMatches(value as unknown as DotaReplayTaskSnapshot);
}

function outcomeValid(value: unknown): value is DotaReplayTaskOutcome {
  return object(value) && keys(value, ["status", "note", "recordedAt"])
    && typeof value.status === "string" && ["checked", "missed", "no-opportunity"].includes(value.status) && text(value.note, 500, false) && iso(value.recordedAt);
}

export function isDotaReplayTaskRecord(value: unknown): value is DotaReplayTaskRecord {
  if (!object(value) || !keys(value, ["id", "createdAt", "snapshot", "outcome"], ["parentId"])) return false;
  return uuid(value.id) && iso(value.createdAt) && isDotaReplayTaskSnapshot(value.snapshot)
    && (!Object.hasOwn(value, "parentId") || (uuid(value.parentId) && value.parentId !== value.id))
    && (value.outcome === null || (outcomeValid(value.outcome) && value.outcome.recordedAt >= value.createdAt));
}

export interface BuildDotaReplayTaskSnapshotInput {
  matchId: number;
  playerSlot: number;
  role?: "core" | "support";
  opponentSlot?: number;
  decision: DotaReplayDecision;
  observations: DotaReplayDecisionObservations;
  lang: Language;
  heroName: (heroId: number) => string;
}

/** Construct only the selected intent. The provider response is never an input. */
export function buildDotaReplayTaskSnapshot(input: BuildDotaReplayTaskSnapshotInput): DotaReplayTaskSnapshot | null {
  if (!input || !input.decision || !observationsValid(input.observations) || !language(input.lang)) return null;
  try {
    const { decision, lang, heroName } = input;
    const observations = { ...input.observations,
      ...(decision.kind === "bkb" ? { targetVisible: "unknown" as const } : { threatState: "unknown" as const }) };
    const evaluation = evaluateDotaReplayDecision(decision, observations, lang, heroName);
    if (evaluation.taskFocus === "verify") return null;
    const snapshot: DotaReplayTaskSnapshot = {
      matchId: input.matchId, playerSlot: input.playerSlot,
      ...(input.role !== undefined ? { role: input.role } : {}),
      ...(input.opponentSlot !== undefined ? { opponentSlot: input.opponentSlot } : {}),
      heroId: decision.heroId, heroName: heroName(decision.heroId), kind: decision.kind, itemKey: decision.itemKey,
      purchaseMinute: decision.purchaseMinute, startMinute: decision.startMinute, endMinute: decision.endMinute,
      patchFamily: decision.patchFamily, checkedAt: decision.checkedAt, lang,
      note: buildDotaReplayDecisionNote(decision, observations, lang, heroName), task: evaluation.nextMatchTask,
      taskFocus: evaluation.taskFocus, observations,
    };
    return isDotaReplayTaskSnapshot(snapshot) ? snapshot : null;
  } catch { return null; }
}

export function readDotaReplayJournal(storage: DotaReplayJournalStorage): DotaReplayJournalResult {
  let raw: string | null;
  try { raw = storage.getItem(DOTA_REPLAY_JOURNAL_KEY); } catch { return { ok: false, error: "unavailable" }; }
  if (raw === null) return { ok: true, records: [] };
  if (raw.length > DOTA_REPLAY_JOURNAL_STORAGE_LIMIT) return { ok: false, error: "corrupt" };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!object(parsed)) return { ok: false, error: "corrupt" };
    if (parsed.schemaVersion !== 1) return { ok: false, error: "unsupported" };
    if (!keys(parsed, ["schemaVersion", "records"]) || !Array.isArray(parsed.records) || parsed.records.length > DOTA_REPLAY_JOURNAL_LIMIT
      || !parsed.records.every(isDotaReplayTaskRecord) || new Set(parsed.records.map((record) => record.id)).size !== parsed.records.length) return { ok: false, error: "corrupt" };
    return { ok: true, records: parsed.records };
  } catch { return { ok: false, error: "corrupt" }; }
}

function write(storage: DotaReplayJournalStorage, records: DotaReplayTaskRecord[]): DotaReplayJournalResult {
  try {
    const raw = JSON.stringify({ schemaVersion: 1, records });
    if (raw.length > DOTA_REPLAY_JOURNAL_STORAGE_LIMIT) return { ok: false, error: "capacity" };
    storage.setItem(DOTA_REPLAY_JOURNAL_KEY, raw);
    return { ok: true, records: clone(records) };
  } catch (error) {
    const quota = object(error) && (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return { ok: false, error: quota ? "capacity" : "unavailable" };
  }
}

const canonical = (value: unknown): unknown => object(value)
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])])) : value;
const sameOpenSnapshot = (records: DotaReplayTaskRecord[], snapshot: DotaReplayTaskSnapshot): boolean =>
  records.some((record) => record.outcome === null && JSON.stringify(canonical(record.snapshot)) === JSON.stringify(canonical(snapshot)));

export function addDotaReplayTask(storage: DotaReplayJournalStorage, record: DotaReplayTaskRecord): DotaReplayJournalResult {
  const latest = readDotaReplayJournal(storage);
  if (!latest.ok) return latest;
  if (!isDotaReplayTaskRecord(record) || record.outcome !== null || record.parentId !== undefined
    || latest.records.some((entry) => entry.id === record.id)) return { ok: false, error: "invalid" };
  if (sameOpenSnapshot(latest.records, record.snapshot)) return { ok: false, error: "duplicate" };
  if (latest.records.length >= DOTA_REPLAY_JOURNAL_LIMIT) return { ok: false, error: "limit" };
  return write(storage, [record, ...latest.records]);
}

export const dotaReplayTaskToken = (record: DotaReplayTaskRecord): string => JSON.stringify(record);

export function closeDotaReplayTask(storage: DotaReplayJournalStorage, id: string, expected: string, outcome: DotaReplayTaskOutcome): DotaReplayJournalResult {
  const latest = readDotaReplayJournal(storage);
  if (!latest.ok) return latest;
  const record = latest.records.find((entry) => entry.id === id);
  if (!record || record.outcome !== null || dotaReplayTaskToken(record) !== expected) return { ok: false, error: "stale" };
  const closed = { ...record, outcome };
  if (!isDotaReplayTaskRecord(closed) || outcome === null) return { ok: false, error: "invalid" };
  return write(storage, latest.records.map((entry) => entry.id === id ? closed : entry));
}

export function repeatDotaReplayTask(storage: DotaReplayJournalStorage, id: string, expected: string, newId: string, createdAt: string): DotaReplayJournalResult {
  const latest = readDotaReplayJournal(storage);
  if (!latest.ok) return latest;
  const record = latest.records.find((entry) => entry.id === id);
  if (!record || record.outcome === null || dotaReplayTaskToken(record) !== expected) return { ok: false, error: "stale" };
  const repeated: DotaReplayTaskRecord = { id: newId, createdAt, snapshot: clone(record.snapshot), outcome: null, parentId: record.id };
  if (!isDotaReplayTaskRecord(repeated) || createdAt < record.outcome.recordedAt || latest.records.some((entry) => entry.id === newId)) return { ok: false, error: "invalid" };
  if (sameOpenSnapshot(latest.records, repeated.snapshot)) return { ok: false, error: "duplicate" };
  if (latest.records.length >= DOTA_REPLAY_JOURNAL_LIMIT) return { ok: false, error: "limit" };
  return write(storage, [repeated, ...latest.records]);
}

export function removeDotaReplayTask(storage: DotaReplayJournalStorage, id: string, expected: string): DotaReplayJournalResult {
  const latest = readDotaReplayJournal(storage);
  if (!latest.ok) return latest;
  const record = latest.records.find((entry) => entry.id === id);
  if (!record || dotaReplayTaskToken(record) !== expected) return { ok: false, error: "stale" };
  return write(storage, latest.records.filter((entry) => entry.id !== id));
}

/** Return links contain a random local reference, never observations or a match ID. */
export function dotaReplayTaskHref(record: Pick<DotaReplayTaskRecord, "id">, lang: Language): string | null {
  return uuid(record.id) && language(lang) ? `${lang === "en" ? "/en" : ""}/dota-2/tasks/#replay-task=${record.id}` : null;
}

export function dotaReplayTaskIdFromHash(hash: string): string | null {
  const candidate = hash.startsWith("#replay-task=") ? hash.slice(13) : "";
  return uuid(candidate) ? candidate : null;
}

/** Opening the historical audit pre-fills public context; it never adds autoload. */
export function dotaReplayTaskAuditHref(snapshot: DotaReplayTaskSnapshot, lang: Language): string | null {
  if (!isDotaReplayTaskSnapshot(snapshot) || !language(lang)) return null;
  const query = new URLSearchParams({ match: String(snapshot.matchId), slot: String(snapshot.playerSlot) });
  if (snapshot.role) query.set("role", snapshot.role);
  if (snapshot.opponentSlot !== undefined) query.set("opponent", String(snapshot.opponentSlot));
  return `${lang === "en" ? "/en" : ""}/dota-2/matches/audit/?${query.toString()}`;
}
