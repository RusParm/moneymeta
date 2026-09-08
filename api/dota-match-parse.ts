// OpenDota contract checked 2026-09-07: odota/core svc/api/spec.ts,
// POST /request/{match_id} -> { job: { jobId } }. Submission is always explicit.
const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff"
};
const json = (body: unknown, status: number) => Response.json(body, { status, headers });

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") return json({ code: "method_not_allowed" }, 405);
    let sameOrigin = false;
    try {
      sameOrigin = new URL(request.headers.get("origin") ?? "").host === (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host);
    } catch { /* Missing and malformed origins are rejected. */ }
    if (!sameOrigin || request.headers.get("x-money-meta-parse") !== "dota-parse-v1") return json({ code: "origin_not_allowed" }, 403);
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ code: "unsupported_media_type" }, 415);
    if (Number(request.headers.get("content-length") ?? 0) > 100) return json({ code: "invalid_request" }, 400);
    let matchId: number;
    try {
      const body = await request.text();
      if (body.length > 100) return json({ code: "invalid_request" }, 400);
      const input = JSON.parse(body);
      matchId = input.matchId;
      if (input.requestReplay !== true || !Number.isSafeInteger(matchId) || !/^\d{6,12}$/u.test(String(matchId))) return json({ code: "invalid_request" }, 400);
    } catch { return json({ code: "invalid_request" }, 400); }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch(`https://api.opendota.com/api/request/${matchId}`, {
        method: "POST",
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (response.status === 429) return json({ code: "rate_limited" }, 429);
      if (response.status === 404) return json({ code: "not_found" }, 404);
      if (response.status === 401 || response.status === 403) return json({ code: "provider_restricted" }, 403);
      if (!response.ok) return json({ code: "upstream_failed" }, 502);
      const payload = await response.json();
      const jobId = payload?.job?.jobId;
      if ((typeof jobId !== "number" && typeof jobId !== "string") || !/^[a-zA-Z0-9:_-]{1,100}$/u.test(String(jobId))) return json({ code: "malformed_upstream" }, 502);
      return json({ accepted: true, matchId, jobId: String(jobId) }, 202);
    } catch {
      return json({ code: controller.signal.aborted ? "upstream_timeout" : "upstream_failed" }, controller.signal.aborted ? 504 : 502);
    } finally { clearTimeout(timer); }
  }
};
