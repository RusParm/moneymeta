import { describe, expect, it, vi } from "vitest";
import { fetchJson, fetchJsonFromSources } from "../scripts/dota-items/fetch-json.mjs";
import { dotaItemsConfig } from "../scripts/dota-items/config.mjs";
import { createDotaItemQueries } from "../scripts/dota-items/queries.mjs";
import {
  calculateGoldEfficiency,
  calculateItemPlan,
  compareDotaItems,
  getComparableAttributes,
  hasReliableTiming,
  validateDotaItemsSnapshot,
  type DotaItemRecord
} from "../src/lib/dota-items";
import { dotaItemsSnapshot, getDotaItemPath, getDotaItemSlug } from "../src/data/dota-items";
import { sitemapPaths } from "../src/pages/sitemap.xml";

const atlasSource = Object.values(import.meta.glob("../src/components/DotaItemAtlasPage.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>)[0] ?? "";

const item = (overrides: Partial<DotaItemRecord> = {}): DotaItemRecord => ({
  id: 116,
  key: "black_king_bar",
  name: "Black King Bar",
  cost: 4_050,
  quality: "epic",
  image: "https://example.com/bkb.png",
  created: true,
  components: ["mithril_hammer", "ogre_axe"],
  attributes: [
    { key: "bonus_strength", label: "+ {value} Strength", value: "10" },
    { key: "bonus_damage", label: "+ {value} Damage", value: "24" },
    { key: "duration", label: "", value: "9 / 8 / 7" }
  ],
  abilities: [{ type: "active", title: "Avatar", description: "Applies a basic dispel." }],
  timings: {
    core: { n: 244, p25: 22.1, median: 26.2, p75: 30.8, purchaseRatePct: 18.1 },
    support: { n: 41, p25: 31, median: 36, p75: 40, purchaseRatePct: 4.2 }
  },
  ...overrides
});

describe("Dota item stat valuation", () => {
  it("prices only supported explicit stats and leaves active utility unpriced", () => {
    const result = calculateGoldEfficiency(item());

    expect(result.lines.map((line) => line.key)).toEqual(["bonus_strength", "bonus_damage"]);
    expect(result.pricedValue).toBeCloseTo(1_666.67, 1);
    expect(result.unpricedRemainder).toBeCloseTo(2_383.33, 1);
    expect(result.efficiencyPct).toBeCloseTo(41.15, 1);
  });

  it("expands one all-attribute point into three separately priced attributes", () => {
    const result = calculateGoldEfficiency(item({
      cost: 460,
      attributes: [{ key: "bonus_all_stats", label: "+ {value} All Attributes", value: "3" }]
    }));

    expect(result.pricedValue).toBeCloseTo(420, 5);
  });
});

describe("Dota source retrieval", () => {
  it("uses the same per-match role-quality gate for cohort totals and item timings", () => {
    const queries = createDotaItemQueries(dotaItemsConfig);
    const gate = `HAVING count(*) FILTER (WHERE np.fantasy_role IN (1, 2, 3, 4)) >= ${dotaItemsConfig.minimumClassifiedPlayersPerMatch}`;
    expect(queries.cohortSql).toContain(gate);
    expect(queries.timingSql).toContain(gate);
    expect(queries.cohortSql).toContain("FROM raw_cohort");
  });

  it("retries an upstream failure, then retrieves constants from the maintained fallback", async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response("", { status: 522 }))
      .mockResolvedValueOnce(new Response("", { status: 522 }))
      .mockResolvedValueOnce(Response.json({ blink: { cost: 2250 } }));
    const result = await fetchJsonFromSources(["https://api.example/items", "https://source.example/items"], "Item constants", { attempts: 2, retryDelayMs: 0, fetchImpl });
    expect(result.url).toBe("https://source.example/items");
    expect(result.data.blink.cost).toBe(2250);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("rejects a success response with the wrong shape before trying the fallback", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(Response.json({ error: "maintenance" })).mockResolvedValueOnce(Response.json([{ id: 1, name: "7.41" }]));
    const result = await fetchJsonFromSources(["https://api.example/patch", "https://source.example/patch"], "Patches", { attempts: 1, fetchImpl, validate: Array.isArray });
    expect(result.data).toEqual([{ id: 1, name: "7.41" }]);
  });

  it("fails closed when match statistics are unavailable", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("timeout"));
    await expect(fetchJson("https://api.example/explorer", "Match statistics", { attempts: 2, retryDelayMs: 0, fetchImpl })).rejects.toThrow("Match statistics failed after 2 attempts: timeout");
  });

  it("reports total constants failure instead of returning a fabricated response", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("", { status: 503 }));
    await expect(fetchJsonFromSources(["https://api.example/items", "https://source.example/items"], "Item constants", { attempts: 1, fetchImpl })).rejects.toThrow("all maintained sources failed");
  });
});

describe("Dota pro timing guard", () => {
  it("hides role timings below the 200-player threshold", () => {
    expect(hasReliableTiming(item(), "core")).toBe(true);
    expect(hasReliableTiming(item(), "support")).toBe(false);
  });
});

describe("Dota item alternatives", () => {
  const blink = item({ id: 1, key: "blink", name: "Blink Dagger", cost: 2_250, attributes: [] });
  const options = [blink, item()];
  const input = { itemKeys: ["blink", "black_king_bar"], availableGold: 1_000, goldPerMinute: 500, currentMinute: 10, role: "core" as const };

  it("compares independent purchases from the same budget, not a cumulative queue", () => {
    const [left, right] = compareDotaItems(options, input);
    expect(left?.goldNeeded).toBe(1_250);
    expect(left?.projectedMinute).toBe(12.5);
    expect(right?.goldNeeded).toBe(3_050);
    expect(right?.projectedMinute).toBe(16.1);
  });

  it("keeps an affordable item available at zero GPM and does not invent a wait for the other", () => {
    const [left, right] = compareDotaItems(options, { ...input, availableGold: 3_000, goldPerMinute: 0 });
    expect(left?.minutesToAfford).toBe(0);
    expect(left?.goldLeftNow).toBe(750);
    expect(right?.minutesToAfford).toBeNull();
    expect(right?.projectedMinute).toBeNull();
  });

  it("fails safely on invalid inputs and unknown item keys", () => {
    const rows = compareDotaItems(options, { ...input, itemKeys: ["missing", "blink"], availableGold: Number.NaN, goldPerMinute: -10, currentMinute: Infinity });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.goldNeeded).toBe(2_250);
    expect(rows[0]?.projectedMinute).toBeNull();
  });

  it("does not expose small role samples, even when a lower threshold is supplied", () => {
    const rows = compareDotaItems(options, { ...input, role: "support", minimumSample: 1 });
    expect(rows.every((row) => row.benchmark === null)).toBe(true);
  });

  it("compares explicit stats without assigning zero to an absent stat or pricing an active", () => {
    const rows = getComparableAttributes(options);
    expect(rows.map((row) => row.values)).toEqual([[null, "10"], [null, "24"]]);
  });
});

describe("Dota item sequence planner", () => {
  it("projects an absolute match minute and exposes the delay caused by earlier items", () => {
    const blink = item({ id: 1, key: "blink", name: "Blink Dagger", cost: 2_250, timings: { core: { n: 250, p25: 15, median: 19, p75: 24, purchaseRatePct: 30 } } });
    const bkb = item();
    const [first, second] = calculateItemPlan([blink, bkb], {
      role: "core",
      currentMinute: 10,
      goldPerMinute: 500,
      startingGold: 1_000,
      itemKeys: ["blink", "black_king_bar"]
    });

    expect(first?.projectedMinute).toBeCloseTo(12.5, 5);
    expect(second?.projectedMinute).toBeCloseTo(20.6, 5);
    expect(second?.moveFirstGainMinutes).toBeCloseTo(4.5, 5);
    expect(second?.deltaMinutes).toBeCloseTo(-5.6, 5);
  });

  it("returns no benchmark when the selected role has too few purchases", () => {
    const [row] = calculateItemPlan([item()], {
      role: "support",
      currentMinute: 20,
      goldPerMinute: 350,
      startingGold: 500,
      itemKeys: ["black_king_bar"]
    });

    expect(row?.benchmark).toBeNull();
    expect(row?.state).toBe("no-benchmark");
  });
});

describe("Dota snapshot shape", () => {
  it("rejects an empty or malformed snapshot", () => {
    expect(validateDotaItemsSnapshot({ schemaVersion: 1, provider: "opendota", items: [] })).toBe(false);
  });

  it("bundles a collected patch cohort instead of a development fixture", () => {
    expect(dotaItemsSnapshot.patch.label).toBe("7.41e");
    expect(dotaItemsSnapshot.cohort.rawMatches).toBeGreaterThanOrEqual(dotaItemsSnapshot.cohort.matches);
    expect(dotaItemsSnapshot.cohort.matches).toBeGreaterThanOrEqual(300);
    expect(dotaItemsSnapshot.cohort.roleCoveragePct).toBeGreaterThanOrEqual(80);
    expect(dotaItemsSnapshot.items.length).toBeGreaterThanOrEqual(150);
    expect("developmentFixture" in dotaItemsSnapshot).toBe(false);
  });

  it("keeps catalog and role metrics internally consistent", () => {
    const keys = new Set<string>();
    for (const catalogItem of dotaItemsSnapshot.items) {
      expect(catalogItem.cost).toBeGreaterThan(0);
      expect(catalogItem.key.startsWith("recipe_")).toBe(false);
      expect(keys.has(catalogItem.key)).toBe(false);
      keys.add(catalogItem.key);

      for (const role of ["core", "support"] as const) {
        const timing = catalogItem.timings[role];
        if (!timing) continue;
        expect(timing.p25).toBeLessThanOrEqual(timing.median);
        expect(timing.median).toBeLessThanOrEqual(timing.p75);
        expect(timing.purchaseRatePct).toBeGreaterThanOrEqual(0);
        expect(timing.purchaseRatePct).toBeLessThanOrEqual(100);
        expect(timing.n).toBeLessThanOrEqual(dotaItemsSnapshot.cohort.roles[role].players);
      }
    }
  });

  it("contains control items with plausible current role boundaries", () => {
    const bkb = dotaItemsSnapshot.items.find((candidate) => candidate.key === "black_king_bar");
    const arcaneBoots = dotaItemsSnapshot.items.find((candidate) => candidate.key === "arcane_boots");

    expect(bkb?.timings.core?.n).toBeGreaterThanOrEqual(200);
    expect(bkb?.timings.core?.median).toBeGreaterThan(15);
    expect(bkb?.timings.core?.median).toBeLessThan(40);
    expect(arcaneBoots?.timings.support?.n).toBeGreaterThanOrEqual(200);
    expect(arcaneBoots?.timings.support?.median).toBeGreaterThan(5);
    expect(arcaneBoots?.timings.support?.median).toBeLessThan(25);
  });

  it("publishes both localized atlas, planner and item routes in the sitemap", () => {
    expect(sitemapPaths).toContain("/dota-2/items/");
    expect(sitemapPaths).toContain("/en/dota-2/items/planner/");
    expect(sitemapPaths).toContain("/dota-2/items/compare/");
    expect(sitemapPaths).toContain("/en/dota-2/items/compare/");
    expect(sitemapPaths).toContain("/dota-2/items/black-king-bar/");
    expect(sitemapPaths).toContain("/en/dota-2/items/black-king-bar/");
    expect(new Set(sitemapPaths).size).toBe(sitemapPaths.length);
  });

  it("uses readable item slugs without changing internal planner keys", () => {
    expect(getDotaItemSlug("black_king_bar")).toBe("black-king-bar");
    expect(getDotaItemPath("black_king_bar", "ru")).toBe("/dota-2/items/black-king-bar/");
    expect(item().key).toBe("black_king_bar");
  });
});

describe("Dota atlas pagination contract", () => {
  it("renders twelve cards per page and force-hides every inactive card", () => {
    expect(atlasSource).toContain("hidden={itemIndex >= 12}");
    expect(atlasSource).toContain("const perPage = 12;");
    expect(atlasSource).toContain("{copy.pages} ·");
    expect(atlasSource).toContain("{copy.items}");
    expect(atlasSource).toMatch(/\[data-dota-atlas\]\s+\[hidden\]\s*\{[^}]*display:\s*none\s*!important;/u);
  });
});
