const providerEndpoint = "https://api.opendota.com/api/matches";
const upstreamTimeoutMs = 50_000;

type SanitizedPlayer = {
  hero_id: number;
  player_slot: number;
  times: number[];
  gold_t: number[];
  [key: string]: unknown;
};

type SanitizedMatch = {
  match_id: number;
  players: SanitizedPlayer[];
  [key: string]: unknown;
};

const responseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "Pragma": "no-cache",
  "X-Content-Type-Options": "nosniff"
};

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: responseHeaders });

const finiteInteger = (value: unknown, minimum: number, maximum: number): number | null => {
  const number = typeof value === "number" ? value : Number.NaN;
  return Number.isFinite(number) && Number.isInteger(number) && number >= minimum && number <= maximum ? number : null;
};

const finiteNumber = (value: unknown, minimum: number, maximum: number): number | null => {
  const number = typeof value === "number" ? value : Number.NaN;
  return Number.isFinite(number) && number >= minimum && number <= maximum ? number : null;
};

const numberArray = (value: unknown, minimum: number, maximum: number): number[] => {
  if (!Array.isArray(value)) return [];
  const numbers = value.slice(0, 360).map((entry) => finiteNumber(entry, minimum, maximum));
  return numbers.some((number) => number === null) ? [] : numbers as number[];
};

const sanitizeProviderMatch = (value: unknown): SanitizedMatch | null => {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const matchId = finiteInteger(raw.match_id, 1, Number.MAX_SAFE_INTEGER);
  const duration = finiteInteger(raw.duration, 0, 21_600);
  const startTime = finiteInteger(raw.start_time, 0, 4_102_444_800);
  if (matchId === null || duration === null || startTime === null || !Array.isArray(raw.players)) return null;

  const radiantWin = typeof raw.radiant_win === "boolean" ? raw.radiant_win : null;
  const inventoryKeys = [
    "item_0", "item_1", "item_2", "item_3", "item_4", "item_5",
    "backpack_0", "backpack_1", "backpack_2", "item_neutral", "item_neutral2"
  ] as const;

  const players = raw.players.slice(0, 12).flatMap((entry): SanitizedPlayer[] => {
    if (!entry || typeof entry !== "object") return [];
    const player = entry as Record<string, unknown>;
    const heroId = finiteInteger(player.hero_id, 1, 10_000);
    const playerSlot = finiteInteger(player.player_slot, 0, 255);
    if (heroId === null || playerSlot === null) return [];

    const purchases = Array.isArray(player.purchase_log)
      ? player.purchase_log.slice(0, 300).flatMap((purchase): Array<{ time: number; key: string }> => {
          if (!purchase || typeof purchase !== "object") return [];
          const row = purchase as Record<string, unknown>;
          const time = finiteInteger(row.time, -600, 21_600);
          const key = typeof row.key === "string" && /^[a-z0-9_]{1,80}$/u.test(row.key) ? row.key : null;
          return time === null || key === null ? [] : [{ time, key }];
        })
      : [];

    const inventory: Record<string, number> = {};
    for (const key of inventoryKeys) {
      const itemId = finiteInteger(player[key], 1, 100_000);
      if (itemId !== null) inventory[key] = itemId;
    }

    const isRadiant = typeof player.isRadiant === "boolean" ? player.isRadiant : playerSlot < 128;
    const win = finiteInteger(player.win, 0, 1);
    return [{
      hero_id: heroId,
      player_slot: playerSlot,
      isRadiant,
      win: win === null ? (radiantWin === null ? null : radiantWin === isRadiant ? 1 : 0) : win,
      kills: finiteInteger(player.kills, 0, 10_000),
      deaths: finiteInteger(player.deaths, 0, 10_000),
      assists: finiteInteger(player.assists, 0, 10_000),
      last_hits: finiteInteger(player.last_hits, 0, 100_000),
      denies: finiteInteger(player.denies, 0, 100_000),
      gold_per_min: finiteInteger(player.gold_per_min, 0, 100_000),
      xp_per_min: finiteInteger(player.xp_per_min, 0, 100_000),
      net_worth: finiteInteger(player.net_worth, 0, 10_000_000),
      total_gold: finiteInteger(player.total_gold, 0, 10_000_000),
      gold_spent: finiteInteger(player.gold_spent, 0, 10_000_000),
      buyback_count: finiteInteger(player.buyback_count, 0, 100),
      position_est: finiteInteger(player.position_est, 1, 5),
      lane_role: finiteInteger(player.lane_role, 1, 4),
      is_roaming: typeof player.is_roaming === "boolean" ? player.is_roaming : null,
      times: numberArray(player.times, 0, 21_600),
      gold_t: numberArray(player.gold_t, 0, 10_000_000),
      lh_t: numberArray(player.lh_t, 0, 100_000),
      purchase_log: purchases,
      ...inventory
    }];
  }).sort((left, right) => left.player_slot - right.player_slot);

  if (players.length < 2) return null;
  return {
    match_id: matchId,
    duration,
    start_time: startTime,
    radiant_win: radiantWin,
    version: finiteInteger(raw.version, 1, 10_000),
    patch: finiteInteger(raw.patch, 1, 10_000),
    players
  };
};

const sameOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originHost = new URL(origin).host;
    const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
    return originHost === requestHost;
  } catch {
    return false;
  }
};

const requestMatchId = async (request: Request): Promise<number | null> => {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > 80) return null;
  const text = await request.text();
  if (text.length > 80) return null;
  try {
    const value = JSON.parse(text) as { matchId?: unknown };
    return typeof value.matchId === "number" && Number.isSafeInteger(value.matchId) && value.matchId > 0
      ? value.matchId
      : null;
  } catch {
    return null;
  }
};

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") return json({ code: "method_not_allowed" }, 405);
    if (!sameOrigin(request)) return json({ code: "origin_not_allowed" }, 403);
    if (request.headers.get("x-money-meta-relay") !== "dota-match-v1") {
      return json({ code: "relay_header_required" }, 403);
    }
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json({ code: "unsupported_media_type" }, 415);
    }

    const matchId = await requestMatchId(request);
    if (matchId === null) return json({ code: "invalid_match_id" }, 400);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), upstreamTimeoutMs);
    const startedAt = Date.now();
    try {
      const upstream = await fetch(providerEndpoint + "/" + matchId, {
        method: "GET",
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      const responseDurationMs = Date.now() - startedAt;
      if (upstream.status === 404) return json({ code: "not_found" }, 404);
      if (upstream.status === 429) {
        console.warn("[dota-match-relay] provider rate limit", { durationMs: responseDurationMs });
        return json({ code: "rate_limited" }, 429);
      }
      if (!upstream.ok) {
        console.warn("[dota-match-relay] provider request failed", { durationMs: responseDurationMs, status: upstream.status });
        return json({ code: "upstream_failed" }, 502);
      }

      const match = sanitizeProviderMatch(await upstream.json());
      const durationMs = Date.now() - startedAt;
      if (!match || match.match_id !== matchId) {
        console.warn("[dota-match-relay] provider payload rejected", { durationMs });
        return json({ code: "malformed_upstream" }, 502);
      }

      console.info("[dota-match-relay] provider request complete", {
        durationMs,
        players: match.players.length,
        timeline: match.players.some((player) => player.times.length > 1 && player.gold_t.length > 1)
      });
      return json(match);
    } catch (error) {
      const aborted = controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError");
      console.warn("[dota-match-relay] provider request threw", {
        durationMs: Date.now() - startedAt,
        reason: aborted ? "timeout" : "network"
      });
      return json({ code: aborted ? "upstream_timeout" : "upstream_unreachable" }, aborted ? 504 : 502);
    } finally {
      clearTimeout(timer);
    }
  }
};
