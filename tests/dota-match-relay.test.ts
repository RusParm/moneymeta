import { afterEach, describe, expect, it, vi } from "vitest";
import relay from "../api/dota-match";
import { sanitizeDotaMatchResponse } from "../src/lib/dota-match";

const relayRequest = (body: unknown, headers: Record<string, string> = {}) => new Request("https://moneymeta.test/api/dota-match", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Origin": "https://moneymeta.test",
    "X-Money-Meta-Relay": "dota-match-v1",
    ...headers
  },
  body: JSON.stringify(body)
});

const providerMatch = {
  match_id: 8_978_544_633,
  duration: 1_990,
  start_time: 1_788_318_551,
  radiant_win: false,
  version: 22,
  patch: 60,
  chat: [{ key: "discard me" }],
  players: [
    {
      hero_id: 36,
      player_slot: 0,
      win: 0,
      kills: 3,
      deaths: 7,
      assists: 6,
      gold_per_min: 564,
      item_0: 137,
      times: [0, 600],
      gold_t: [0, 4_000],
      lh_t: [0, 67],
      purchase_log: [{ time: 810, key: "radiance" }],
      account_id: 123,
      personaname: "discard me"
    },
    {
      hero_id: 82,
      player_slot: 128,
      win: 1,
      kills: 8,
      deaths: 2,
      assists: 16,
      gold_per_min: 678,
      item_0: 48,
      account_id: 456
    }
  ]
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("Dota match fallback relay", () => {
  it("accepts only a same-origin explicit JSON relay request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const getResponse = await relay.fetch(new Request("https://moneymeta.test/api/dota-match"));
    const foreignResponse = await relay.fetch(relayRequest({ matchId: 8_978_544_633 }, { Origin: "https://example.com" }));
    const missingHeader = await relay.fetch(relayRequest({ matchId: 8_978_544_633 }, { "X-Money-Meta-Relay": "" }));
    const invalidResponse = await relay.fetch(relayRequest({ matchId: "8978544633" }));

    expect(getResponse.status).toBe(405);
    expect(foreignResponse.status).toBe(403);
    expect(missingHeader.status).toBe(403);
    expect(invalidResponse.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns only the sanitized match payload with no-store headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(providerMatch), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "info").mockImplementation(() => undefined);

    const response = await relay.fetch(relayRequest({ matchId: 8_978_544_633 }));
    const payload = await response.json();
    const serialized = JSON.stringify(payload);

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(sanitizeDotaMatchResponse(payload)?.players).toHaveLength(2);
    expect(serialized).not.toContain("account_id");
    expect(serialized).not.toContain("personaname");
    expect(serialized).not.toContain("discard me");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.opendota.com/api/matches/8978544633",
      expect.objectContaining({ method: "GET", cache: "no-store", credentials: "omit" })
    );
  });

  it("preserves provider not-found and rate-limit states", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(new Response(null, { status: 429 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    expect((await relay.fetch(relayRequest({ matchId: 8_978_544_633 }))).status).toBe(404);
    expect((await relay.fetch(relayRequest({ matchId: 8_978_544_633 }))).status).toBe(429);
  });
});
