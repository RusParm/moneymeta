import { dotaMatchAuditConfig } from "../src/data/dota-match";
import { createDotaMatchPublicPayload, sanitizeDotaMatchResponse } from "../src/lib/dota-match";

const upstreamTimeoutMs = 50_000;

const responseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "Pragma": "no-cache",
  "X-Content-Type-Options": "nosniff"
};

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: responseHeaders });

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
      const upstream = await fetch(`${dotaMatchAuditConfig.endpoint}/${matchId}`, {
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

      const match = sanitizeDotaMatchResponse(await upstream.json());
      const durationMs = Date.now() - startedAt;
      if (!match || match.matchId !== matchId) {
        console.warn("[dota-match-relay] provider payload rejected", { durationMs });
        return json({ code: "malformed_upstream" }, 502);
      }

      console.info("[dota-match-relay] provider request complete", {
        durationMs,
        players: match.players.length,
        timeline: match.players.some((player) => player.times.length > 1 && player.goldTimeline.length > 1)
      });
      return json(createDotaMatchPublicPayload(match));
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
