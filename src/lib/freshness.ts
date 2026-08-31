const DAY_MS = 86_400_000;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/u;

function startOfUtcDay(date: string): number | null {
  if (!DATE_ONLY.test(date)) return null;
  const value = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(value) && new Date(value).toISOString().slice(0, 10) === date ? value : null;
}

export function isExpired(validThrough: string, asOf = new Date()): boolean {
  const start = startOfUtcDay(validThrough);
  if (start === null || !Number.isFinite(asOf.getTime())) return true;
  return asOf.getTime() >= start + DAY_MS;
}

export function isOlderThanDays(
  checkedAt: string,
  staleAfterDays: number,
  asOf = new Date()
): boolean {
  const start = startOfUtcDay(checkedAt);
  if (start === null || !Number.isFinite(asOf.getTime()) || start > asOf.getTime() || !Number.isFinite(staleAfterDays) || staleAfterDays < 0) return true;
  return asOf.getTime() >= start + staleAfterDays * DAY_MS;
}

/** A recent download describes collection freshness, not verification of a game mechanic. */
export function isOlderThanHours(fetchedAt: string, maxAgeHours: number, asOf = new Date()): boolean {
  const timestamp = Date.parse(fetchedAt);
  const now = asOf.getTime();
  if (!Number.isFinite(timestamp) || !Number.isFinite(now) || timestamp > now || !Number.isFinite(maxAgeHours) || maxAgeHours < 0) return true;
  return now - timestamp >= maxAgeHours * 3_600_000;
}

export interface FreshnessPolicy {
  checkedAt: string;
  validThrough?: string;
  staleAfterDays?: number;
  maxAgeHours?: number;
}

export function needsRefresh(policy: FreshnessPolicy, asOf = new Date()): boolean {
  if (policy.validThrough !== undefined) return isExpired(policy.validThrough, asOf);
  if (policy.maxAgeHours !== undefined) return isOlderThanHours(policy.checkedAt, policy.maxAgeHours, asOf);
  return isOlderThanDays(policy.checkedAt, policy.staleAfterDays ?? Number.NaN, asOf);
}
