const DAY_MS = 86_400_000;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/u;

function startOfUtcDay(date: string): number | null {
  if (!DATE_ONLY.test(date)) return null;
  const value = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(value) ? value : null;
}

export function isExpired(validThrough: string, asOf = new Date()): boolean {
  const start = startOfUtcDay(validThrough);
  if (start === null) return true;
  return asOf.getTime() >= start + DAY_MS;
}

export function isOlderThanDays(
  checkedAt: string,
  staleAfterDays: number,
  asOf = new Date()
): boolean {
  const start = startOfUtcDay(checkedAt);
  if (start === null || !Number.isFinite(staleAfterDays) || staleAfterDays < 0) return true;
  return asOf.getTime() >= start + staleAfterDays * DAY_MS;
}

