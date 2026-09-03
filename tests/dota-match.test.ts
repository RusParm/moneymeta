import { describe, expect, it } from "vitest";
import { dotaHeroes } from "../src/data/dota-heroes";
import { dotaMatchAuditConfig, getDotaMatchAuditPath } from "../src/data/dota-match";
import { sitemapPaths } from "../src/pages/sitemap.xml";
import {
  buildDotaMatchAudit,
  createDotaMatchCheckpoints,
  inferredDotaMatchRole,
  parseDotaMatchId,
  sanitizeDotaMatchResponse,
  type DotaMatchPlayer
} from "../src/lib/dota-match";
import type { DotaItemRecord } from "../src/lib/dota-items";

const auditSource = Object.values(import.meta.glob("../src/components/DotaMatchAuditPage.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>)[0] ?? "";

const rawPlayer = (overrides: Record<string, unknown> = {}) => ({
  hero_id: 36,
  player_slot: 0,
  isRadiant: true,
  win: 0,
  kills: 3,
  deaths: 7,
  assists: 6,
  last_hits: 359,
  denies: 5,
  gold_per_min: 564,
  xp_per_min: 707,
  net_worth: 15_721,
  total_gold: 18_706,
  gold_spent: 16_000,
  buyback_count: 1,
  position_est: 1,
  times: [0, 600, 1200, 1800, 1980],
  gold_t: [0, 4_000, 9_000, 13_000, 14_000],
  lh_t: [0, 67, 228, 341, 359],
  purchase_log: [
    { time: 618, key: "relic" },
    { time: 810, key: "radiance" },
    { time: 978, key: "travel_boots" },
    { time: 1_000, key: "<script>" }
  ],
  account_id: 123,
  personaname: "private profile label",
  ...overrides
});

const rawMatch = (overrides: Record<string, unknown> = {}) => ({
  match_id: dotaMatchAuditConfig.demoMatchId,
  duration: 1_990,
  start_time: 1_788_318_551,
  radiant_win: false,
  version: 22,
  patch: dotaMatchAuditConfig.currentPatchId,
  chat: [{ key: "not retained" }],
  players: [rawPlayer(), rawPlayer({ hero_id: 82, player_slot: 128, isRadiant: false, win: 1, position_est: 4 })],
  ...overrides
});

const item = (overrides: Partial<DotaItemRecord> = {}): DotaItemRecord => ({
  id: 137,
  key: "radiance",
  name: "Radiance",
  cost: 4_700,
  quality: "epic",
  image: "https://example.com/radiance.png",
  created: true,
  components: ["relic", "talisman_of_evasion"],
  attributes: [],
  abilities: [],
  timings: { core: { n: 250, p25: 15, median: 18, p75: 22, purchaseRatePct: 10 } },
  ...overrides
});

describe("Dota match ID input", () => {
  it("accepts a raw ID and normal match URLs without guessing from arbitrary text", () => {
    expect(parseDotaMatchId("8978544633")).toBe(8_978_544_633);
    expect(parseDotaMatchId("https://www.opendota.com/matches/8978544633/overview")).toBe(8_978_544_633);
    expect(parseDotaMatchId("https://example.com/?match_id=8978544633&tab=economy")).toBe(8_978_544_633);
    expect(parseDotaMatchId("look at 8978544633 please")).toBeNull();
    expect(parseDotaMatchId("javascript:8978544633")).toBeNull();
  });
});

describe("Dota match privacy boundary", () => {
  it("retains only fields used by the economy audit", () => {
    const match = sanitizeDotaMatchResponse(rawMatch());
    expect(match?.players).toHaveLength(2);
    expect(match?.players[0]?.purchases).toEqual([
      { time: 618, key: "relic" },
      { time: 810, key: "radiance" },
      { time: 978, key: "travel_boots" }
    ]);
    const serialized = JSON.stringify(match);
    expect(serialized).not.toContain("account_id");
    expect(serialized).not.toContain("personaname");
    expect(serialized).not.toContain("private profile label");
    expect(serialized).not.toContain("not retained");
    expect(serialized).not.toContain("<script>");
  });

  it("fails closed on malformed responses instead of fabricating players", () => {
    expect(sanitizeDotaMatchResponse({ match_id: 1, duration: 100, start_time: 1, players: [] })).toBeNull();
    expect(sanitizeDotaMatchResponse({ error: "rate limit" })).toBeNull();
  });

  it("drops a malformed timeline instead of shifting points out of alignment", () => {
    const match = sanitizeDotaMatchResponse(rawMatch({
      players: [
        rawPlayer({ gold_t: [0, "bad", 9_000] }),
        rawPlayer({ hero_id: 82, player_slot: 128, isRadiant: false })
      ]
    }));
    expect(match?.players[0]?.goldTimeline).toEqual([]);
    expect(buildDotaMatchAudit(match!, 0, [item()], "core", dotaMatchAuditConfig.currentPatchId)?.timelineAvailable).toBe(false);
  });
});

describe("Dota match economy model", () => {
  const match = sanitizeDotaMatchResponse(rawMatch())!;

  it("uses the parsed position only as a broad role default", () => {
    expect(inferredDotaMatchRole(match.players[0]!)).toBe("core");
    expect(inferredDotaMatchRole(match.players[1]!)).toBe("support");
    expect(inferredDotaMatchRole({ ...match.players[0]!, positionEstimate: null })).toBeNull();
  });

  it("builds transparent cumulative checkpoints and interval rates", () => {
    const checkpoints = createDotaMatchCheckpoints(match.players[0]!, match.durationSeconds);
    expect(checkpoints.map((row) => row.minute)).toEqual([10, 20, 30, 33]);
    expect(checkpoints[0]).toMatchObject({ totalGold: 4_000, lastHits: 67, intervalGoldPerMinute: 400, intervalLastHits: 67 });
    expect(checkpoints.at(-1)?.intervalGoldPerMinute).toBeCloseTo(333.33, 1);
  });

  it("shows completed major items, suppresses components and gates pro comparisons by patch and sample", () => {
    const items = [item(), item({ id: 52, key: "relic", name: "Sacred Relic", cost: 3_400, created: false, components: [], timings: {} }), item({ id: 48, key: "travel_boots", name: "Boots of Travel", cost: 2_500, timings: { core: { n: 50, p25: 15, median: 20, p75: 25, purchaseRatePct: 2 } } })];
    const audit = buildDotaMatchAudit(match, 0, items, "core", dotaMatchAuditConfig.currentPatchId)!;
    expect(audit.majorPurchases.map((purchase) => purchase.key)).toEqual(["radiance", "travel_boots"]);
    expect(audit.majorPurchases[0]?.deltaMinutes).toBeCloseTo(-4.5, 5);
    expect(audit.majorPurchases[1]?.benchmark).toBeNull();
    expect(audit.slowestWindow?.minute).toBe(33);

    const oldPatch = { ...match, patchId: dotaMatchAuditConfig.currentPatchId - 1 };
    expect(buildDotaMatchAudit(oldPatch, 0, items, "core", dotaMatchAuditConfig.currentPatchId)?.majorPurchases.every((purchase) => purchase.benchmark === null)).toBe(true);
  });

  it("keeps a final-stat audit usable when no parsed timeline exists", () => {
    const noTimelinePlayer: DotaMatchPlayer = { ...match.players[0]!, times: [], goldTimeline: [], lastHitTimeline: [], purchases: [] };
    const noTimeline = { ...match, parseVersion: null, players: [noTimelinePlayer, match.players[1]!] };
    const audit = buildDotaMatchAudit(noTimeline, 0, [item()], "core", dotaMatchAuditConfig.currentPatchId)!;
    expect(audit.timelineAvailable).toBe(false);
    expect(audit.checkpoints).toEqual([]);
    expect(audit.player.goldPerMinute).toBe(564);
  });
});

describe("Dota match reference data", () => {
  it("bundles the full current hero ID map and stable localized routes", () => {
    expect(dotaHeroes.length).toBeGreaterThanOrEqual(125);
    expect(new Set(dotaHeroes.map((hero) => hero.id)).size).toBe(dotaHeroes.length);
    expect(dotaHeroes.find((hero) => hero.id === 1)?.name).toBe("Anti-Mage");
    expect(getDotaMatchAuditPath("ru")).toBe("/dota-2/matches/audit/");
    expect(getDotaMatchAuditPath("en")).toBe("/en/dota-2/matches/audit/");
    expect(sitemapPaths).toContain("/dota-2/matches/audit/");
    expect(sitemapPaths).toContain("/en/dota-2/matches/audit/");
  });
});

describe("Dota match request UI contract", () => {
  it("starts a read-only provider request only from an explicit submit action", () => {
    const submitHandler = auditSource.indexOf('form.addEventListener("submit"');
    const fetchCall = auditSource.indexOf("await fetch(");
    expect(submitHandler).toBeGreaterThan(0);
    expect(fetchCall).toBeGreaterThan(submitHandler);
    expect(auditSource).toContain('method: "GET"');
    expect(auditSource).toContain('credentials: "omit"');
    expect(auditSource).not.toContain('method: "POST"');
    expect(auditSource).not.toContain("/request/");
    expect(auditSource).not.toContain("localStorage");
    expect(auditSource).not.toContain("account_id");
    expect(auditSource).not.toContain("personaname");
  });
});
