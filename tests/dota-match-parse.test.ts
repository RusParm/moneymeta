import { afterEach, describe, expect, it, vi } from "vitest";
import parse from "../api/dota-match-parse";

const request = (body: unknown = { matchId: 8978544633, requestReplay: true }, headers: Record<string, string> = {}) => new Request("https://moneymeta.test/api/dota-match-parse", {
  method: "POST", headers: { Origin: "https://moneymeta.test", "Content-Type": "application/json", "X-Money-Meta-Parse": "dota-parse-v1", ...headers }, body: JSON.stringify(body)
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("explicit OpenDota parsing relay", () => {
  it("rejects ordinary loading, foreign origins and oversized or invalid input before any provider request", async () => {
    const upstream = vi.fn(); vi.stubGlobal("fetch", upstream);
    expect((await parse.fetch(new Request("https://moneymeta.test/api/dota-match-parse"))).status).toBe(405);
    expect((await parse.fetch(request({ matchId: 8978544633 }))).status).toBe(400);
    expect((await parse.fetch(request(undefined, { Origin: "https://other.test" }))).status).toBe(403);
    expect((await parse.fetch(request(undefined, { "X-Money-Meta-Parse": "" }))).status).toBe(403);
    expect((await parse.fetch(request({ matchId: "8978544633", requestReplay: true }))).status).toBe(400);
    expect((await parse.fetch(request({ matchId: 8978544633, requestReplay: true, extra: "x".repeat(200) }))).status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });

  it("submits exactly one allowlisted public ID and returns only a job receipt", async () => {
    const upstream = vi.fn().mockResolvedValue(new Response(JSON.stringify({ job: { jobId: "parse:8978544633", account_id: 123, detail: "not retained" }, extra: "not retained" })));
    vi.stubGlobal("fetch", upstream);
    const response = await parse.fetch(request());
    expect(response.status).toBe(202);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.json()).toEqual({ accepted: true, matchId: 8978544633, jobId: "parse:8978544633" });
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(upstream).toHaveBeenCalledWith("https://api.opendota.com/api/request/8978544633", expect.objectContaining({ method: "POST", credentials: "omit", cache: "no-store" }));
  });

  it("preserves provider restrictions without fabricating an accepted job", async () => {
    const upstream = vi.fn(); vi.stubGlobal("fetch", upstream);
    for (const status of [429, 403, 404]) {
      upstream.mockResolvedValueOnce(new Response(null, { status }));
      expect((await parse.fetch(request())).status).toBe(status);
    }
    upstream.mockResolvedValueOnce(new Response(JSON.stringify({ job: {} })));
    expect((await parse.fetch(request())).status).toBe(502);
  });
});
