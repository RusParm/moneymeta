import { describe, expect, it } from "vitest";
import { dotaDraftHeroProfiles, dotaDraftProfileSnapshot } from "../src/data/dota-draft-profiles";
import { dotaDraftPurchaseContexts } from "../src/data/dota-draft-purchases";
import { dotaDraftAxes, dotaDraftRules } from "../src/data/dota-draft-rules";
import { dotaHeroes } from "../src/data/dota-heroes";
import { dotaMatchItems } from "../src/data/dota-match-items";
import { buildDotaDraftReview, type DotaDraftReview } from "../src/lib/dota-draft";
import type { DotaMatch, DotaMatchPlayer } from "../src/lib/dota-match";

const player = (heroId: number, playerSlot: number): DotaMatchPlayer => ({
  heroId, playerSlot, isRadiant: playerSlot < 128,
  won: null, kills: null, deaths: null, assists: null, lastHits: null, denies: null,
  goldPerMinute: null, xpPerMinute: null, netWorth: null, totalGold: null, goldSpent: null,
  heroDamage: null, towerDamage: null, heroHealing: null, buybackCount: null,
  positionEstimate: null, laneRole: null, isRoaming: null,
  times: [], goldTimeline: [], lastHitTimeline: [], purchases: [], finalInventory: []
});

// A synthetic composition, without a real match ID, profile or performance data.
const matchFixture = (): DotaMatch => ({
  matchId: 123456, durationSeconds: 2400, startTime: Date.parse("2026-08-01T00:00:00Z") / 1000,
  radiantWin: null, parseVersion: null, patchId: dotaDraftProfileSnapshot.patchId,
  players: [
    ...[11, 128, 26, 121, 104].map((id, index) => player(id, index)),
    ...[86, 9, 53, 54, 28].map((id, index) => player(id, 128 + index))
  ]
});

const selected = (match: DotaMatch, heroId = 28) => match.players.find((row) => row.heroId === heroId)!;
const review = (match: DotaMatch) => buildDotaDraftReview(match, selected(match));
const findings = (result: DotaDraftReview) => [...result.opportunities, ...result.threats];
const purchaseFacts = (result: DotaDraftReview) => result.purchases.map(({ heroId, isOwnTeam, key, minute, title, sourceUrl }) => ({ heroId, isOwnTeam, key, minute, title, sourceUrl }));
const expectNoClaims = (result: DotaDraftReview) => {
  expect(result.axes).toEqual([]);
  expect(result.opportunities).toEqual([]);
  expect(result.threats).toEqual([]);
};
const expectCopy = (copy: { ru: string; en: string }) => {
  expect(copy.ru.trim().length).toBeGreaterThan(0);
  expect(copy.en.trim().length).toBeGreaterThan(0);
};
const expectHttps = (value: string) => {
  expect(new URL(value).protocol).toBe("https:");
  expect(new URL(value).hostname.length).toBeGreaterThan(0);
};

describe("Dota draft context", () => {
  it("explains both compositions with attributable conditions, without declaring a winner or a fixed power peak", () => {
    const result = review(matchFixture());
    expect(result.status).toBe("ready");
    expect(result.coverage).toEqual({ own: 5, enemy: 5, total: 10 });
    expect(result.opportunities.find((row) => row.id === "armor-focus")?.heroIds).toEqual(expect.arrayContaining([28, 54]));
    expect(result.opportunities.some((row) => row.id === "global-pressure")).toBe(true);
    expect(result.threats.find((row) => row.id === "bound-targets")?.heroIds).toEqual(expect.arrayContaining([121, 26]));
    expect(result.threats.find((row) => row.id === "immunity-control")?.heroIds).toContain(104);
    for (const [rows, side] of [[result.opportunities, result.ownHeroIds], [result.threats, result.enemyHeroIds]] as const) {
      for (const row of rows) {
        expect(row.heroIds.every((id) => side.includes(id))).toBe(true);
        expectCopy(row.condition);
        expectCopy(row.action);
        expect(row.evidence.length).toBeGreaterThan(0);
        expect(row.evidence.every((evidence) => row.heroIds.includes(evidence.heroId) && evidence.ability.trim().length > 0)).toBe(true);
        expect(row.sourceUrls.length).toBeGreaterThan(0);
      }
    }
    const keys: string[] = [];
    JSON.stringify(result, (key, value: unknown) => { keys.push(key); return value; });
    expect(keys.some((key) => /winner|probability|win.?rate|power.?score|peak.?minute/i.test(key))).toBe(false);
  });

  it("keeps draft conclusions invariant when the winner, economy, final items and inferred roles change", () => {
    const match = matchFixture();
    const baseline = review(match);
    match.radiantWin = true;
    match.startTime = Date.parse("2026-08-02T00:00:00Z") / 1000;
    match.parseVersion = 22;
    match.players = match.players.map((row, index) => ({
      ...row, won: row.isRadiant, kills: index * 4, deaths: 25 - index, assists: index * 3,
      lastHits: index * 100, denies: index, goldPerMinute: 100 + index * 200,
      xpPerMinute: 2000 - index * 100, netWorth: 100000 - index * 5000,
      totalGold: 90000, goldSpent: 85000, heroDamage: index * 20000,
      towerDamage: index * 1000, heroHealing: index * 1500, buybackCount: index,
      positionEstimate: index % 5 + 1, laneRole: index % 4 + 1, isRoaming: index % 2 === 0,
      times: [0, 600, 1200], goldTimeline: [0, index * 1000, index * 3000],
      lastHitTimeline: [0, index * 20, index * 50],
      finalInventory: [{ area: "main" as const, slot: 0, itemId: 116 }]
    }));
    expect(review(match)).toEqual(baseline);
  });

  it("is independent of provider row order and leaves match inputs unchanged", () => {
    const match = matchFixture();
    selected(match).purchases = [{ key: "black_king_bar", time: 1800 }, { key: "blink", time: 900 }];
    const before = structuredClone(match);
    const baseline = review(match);
    expect(match).toEqual(before);
    const reordered = structuredClone(match);
    reordered.players.reverse();
    reordered.players.forEach((row) => row.purchases.reverse());
    expect(review(reordered)).toEqual(baseline);
  });

  it("reverses the perspective consistently and does not privilege Radiant or Dire", () => {
    const match = matchFixture();
    selected(match).purchases = [{ key: "blink", time: 900 }];
    selected(match, 104).purchases = [{ key: "blink", time: 1000 }];
    const own = review(match);
    const enemy = buildDotaDraftReview(match, selected(match, 104));
    expect(enemy.opportunities).toEqual(own.threats);
    expect(enemy.threats).toEqual(own.opportunities);
    expect(enemy.ownHeroIds).toEqual(own.enemyHeroIds);
    expect(enemy.enemyHeroIds).toEqual(own.ownHeroIds);
    expect(enemy.axes).toEqual(own.axes.map((axis) => ({ ...axis, ownHeroIds: axis.enemyHeroIds, enemyHeroIds: axis.ownHeroIds })));
    expect(enemy.purchases).toEqual(own.purchases.map((event) => ({ ...event, isOwnTeam: !event.isOwnTeam })));
    const flipped = structuredClone(match);
    flipped.players = flipped.players.map((row) => ({ ...row, isRadiant: !row.isRadiant, playerSlot: row.isRadiant ? row.playerSlot + 128 : row.playerSlot - 128 }));
    expect(review(flipped)).toEqual(own);
  });

  it("fails closed for incomplete, duplicate, invalid-slot or inconsistent-side lineups", () => {
    const mutations: Array<(match: DotaMatch) => void> = [
      (match) => { match.players.shift(); },
      (match) => { match.players.push(player(18, 5)); },
      (match) => { match.players[0]!.heroId = match.players[1]!.heroId; },
      (match) => { match.players[0]!.playerSlot = match.players[1]!.playerSlot; },
      (match) => { match.players[0]!.playerSlot = 5; },
      (match) => { match.players[5]!.playerSlot = 133; },
      (match) => { match.players[0]!.isRadiant = false; },
      (match) => { match.players[0]!.heroId = 0; },
      (match) => { match.players[0]!.heroId = 1.5; }
    ];
    for (const mutate of mutations) {
      const match = matchFixture();
      selected(match).purchases = [{ key: "blink", time: 900 }];
      mutate(match);
      const result = review(match);
      expect(result.status).toBe("unavailable");
      expectNoClaims(result);
      expect(result.purchases).toEqual([]);
      expect(result.purchaseLogHeroCount).toBe(0);
    }
  });

  it("does not analyze a selected player who is absent or contradicts the lineup", () => {
    const match = matchFixture();
    for (const outsider of [
      { ...selected(match), heroId: 9999 },
      { ...selected(match), playerSlot: 133 },
      { ...selected(match), isRadiant: true }
    ]) {
      const result = buildDotaDraftReview(match, outsider);
      expect(result.status).toBe("unavailable");
      expectNoClaims(result);
      expect(result.purchases).toEqual([]);
    }
  });

  it("retains known evidence under partial coverage and marks unreviewed heroes as unknown", () => {
    const match = matchFixture();
    selected(match, 86).heroId = 9001;
    selected(match, 9).heroId = 9002;
    const result = review(match);
    expect(result.status).toBe("partial");
    expect(result.coverage).toEqual({ own: 3, enemy: 5, total: 8 });
    expect(result.uncoveredHeroIds).toEqual(expect.arrayContaining([9001, 9002]));
    expect(result.ownHeroIds).toEqual(expect.arrayContaining([9001, 9002]));
    expect(result.opportunities.some((row) => row.id === "armor-focus")).toBe(true);
    expect(result.axes.find((axis) => axis.id === "map")?.ownHeroIds).toContain(53);
    expect(findings(result).flatMap((row) => row.heroIds)).not.toContain(9001);
    expect(findings(result).flatMap((row) => row.heroIds)).not.toContain(9002);
    for (const axis of result.axes) {
      expect(axis.ownHeroIds).not.toContain(9001);
      expect(axis.ownHeroIds).not.toContain(9002);
    }
  });

  it("reports unavailable capabilities when no heroes are reviewed while preserving factual logged purchases", () => {
    const match = matchFixture();
    match.players.forEach((row, index) => { row.heroId = 9000 + index; });
    match.players[0]!.purchases = [{ key: "blink", time: 600 }];
    const result = buildDotaDraftReview(match, match.players[0]!);
    expect(result.status).toBe("unavailable");
    expect(result.coverage.total).toBe(0);
    expect(result.uncoveredHeroIds).toHaveLength(10);
    expectNoClaims(result);
    expect(result.purchases).toMatchObject([{ heroId: 9000, key: "blink", minute: 10 }]);
  });

  it("requires another hero for synergy and emits each supported rule only once", () => {
    const match = matchFixture();
    selected(match, 54).heroId = 13;
    expect(review(match).opportunities.some((row) => row.id === "armor-focus")).toBe(false);
    selected(match, 13).heroId = 54;
    const result = review(match);
    expect(result.opportunities.some((row) => row.id === "armor-focus")).toBe(true);
    for (const rows of [result.opportunities, result.threats]) {
      expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
      for (const row of rows) expect(new Set(row.heroIds).size).toBe(row.heroIds.length);
    }
  });

  it("keeps Winter's Curse as area control without recommending allied spell damage into its protection", () => {
    const match = matchFixture();
    match.players = [
      ...match.players.filter((row) => row.isRadiant),
      ...[112, 25, 54, 53, 80].map((id, index) => player(id, 128 + index))
    ];
    const result = buildDotaDraftReview(match, selected(match, 112));
    expect(result.axes.find((axis) => axis.id === "area")?.ownHeroIds).toContain(112);
    expect(result.opportunities.some((row) => row.id === "area-followup")).toBe(false);
    const opponentView = buildDotaDraftReview(match, selected(match, 26));
    expect(opponentView.axes.find((axis) => axis.id === "area")?.enemyHeroIds).toContain(112);
    expect(opponentView.threats.some((row) => row.id === "area-followup")).toBe(false);
    const curse = dotaDraftHeroProfiles.find((profile) => profile.heroId === 112)!.evidence.find((entry) => entry.ability === "Winter's Curse");
    expect(curse?.blocksAllyDamage).toBe(true);
    selected(match, 112).heroId = 29;
    const compatible = buildDotaDraftReview(match, selected(match, 29));
    expect(compatible.opportunities.find((row) => row.id === "area-followup")?.heroIds).toEqual(expect.arrayContaining([29, 25]));
    expect(buildDotaDraftReview(match, selected(match, 26)).threats.find((row) => row.id === "area-followup")?.heroIds).toEqual(expect.arrayContaining([29, 25]));
  });

  it.each([
    { name: "Invoker", heroId: 74, retainedAxis: "map" },
    { name: "Monkey King", heroId: 114, retainedAxis: "physical" },
    { name: "Viper", heroId: 47, retainedAxis: "waves" }
  ])("keeps $name's recorded capability without treating remote damage or area damage as a free damage setup", ({ heroId, retainedAxis }) => {
    const match = matchFixture();
    match.players = [
      ...match.players.filter((row) => row.isRadiant),
      ...[heroId, 25, 54, 80, 44].map((id, index) => player(id, 128 + index))
    ];
    const result = buildDotaDraftReview(match, selected(match, heroId));
    expect(result.status).toBe("ready");
    expect(result.axes.find((axis) => axis.id === retainedAxis)?.ownHeroIds).toContain(heroId);
    expect(result.opportunities.some((row) => row.id === "area-followup")).toBe(false);
    if (heroId === 74) expect(result.opportunities.some((row) => row.id === "global-pressure")).toBe(false);
  });

  it("suppresses version-dependent draft claims for a different or unknown patch without losing purchase facts", () => {
    const match = matchFixture();
    selected(match).purchases = [{ key: "black_king_bar", time: 1800 }];
    const current = review(match);
    for (const patchId of [dotaDraftProfileSnapshot.patchId - 1, dotaDraftProfileSnapshot.patchId + 1, null]) {
      const result = review({ ...match, patchId });
      expect(result.status).toBe("patch-mismatch");
      expectNoClaims(result);
      expect(purchaseFacts(result)).toEqual(purchaseFacts(current));
      expect(result.purchases[0]!.explanation).not.toEqual(current.purchases[0]!.explanation);
      expect(result.purchases[0]!.context).toBeUndefined();
      expectCopy(result.purchases[0]!.explanation);
    }
  });

  it("requires a known start time within the reviewed minor patch even when the patch family matches", () => {
    const match = matchFixture();
    selected(match).purchases = [{ key: "black_king_bar", time: 1800 }];
    const current = review(match);
    const supportedSince = Date.parse(dotaDraftProfileSnapshot.supportedSince) / 1000;
    expect(review({ ...match, startTime: supportedSince }).status).toBe("ready");
    for (const startTime of [supportedSince - 1, 0, null, undefined, Number.NaN, Number.POSITIVE_INFINITY]) {
      const result = review({ ...match, startTime } as unknown as DotaMatch);
      expect(result.status).toBe("patch-mismatch");
      expectNoClaims(result);
      expect(purchaseFacts(result)).toEqual(purchaseFacts(current));
      expect(result.purchases[0]!.context).toBeUndefined();
      expect(result.purchases[0]!.explanation).not.toEqual(current.purchases[0]!.explanation);
    }
  });
});

describe("Dota draft purchase observations", () => {
  it("names Duel for an opposing Linken holder without extending Lotus or Soulbind eligibility", () => {
    const match = matchFixture();
    selected(match, 53).purchases = [{ key: "sphere", time: 1900 }, { key: "lotus_orb", time: 1950 }];
    selected(match, 104).purchases = [{ key: "sphere", time: 2000 }];
    const result = review(match);
    const sphere = result.purchases.find((event) => event.heroId === 53 && event.key === "sphere")!;
    expect(sphere.context?.heroIds).toEqual([26, 104]);
    expect(sphere.context?.abilities).toEqual(expect.arrayContaining([
      expect.objectContaining({ heroId: 26 }), { heroId: 104, ability: "Duel" }
    ]));
    expect(sphere.context?.text.ru).toContain("Duel");
    expect(sphere.context?.text.en).toContain("Duel");
    expect(sphere.context?.sourceUrls?.every((url) => result.sourceUrls.includes(url))).toBe(true);
    expect(result.purchases.find((event) => event.key === "lotus_orb")?.context?.heroIds).not.toContain(104);
    expect(result.purchases.find((event) => event.heroId === 104)?.context?.heroIds ?? []).not.toContain(104);
    expect(result.threats.find((finding) => finding.id === "bound-targets")?.heroIds).toEqual([121, 26]);
    match.startTime = Date.parse("2026-07-01T00:00:00Z") / 1000;
    expect(review(match).purchases.every((event) => !event.context)).toBe(true);
  });

  it("grounds item context in the holder's opponents or teammates and never the holder's own synergy", () => {
    const match = matchFixture();
    selected(match).purchases = [{ key: "black_king_bar", time: 1800 }, { key: "desolator", time: 2100 }];
    selected(match, 104).purchases = [{ key: "black_king_bar", time: 1900 }];
    const result = review(match);
    expect(result.purchases.find((event) => event.heroId === 28 && event.key === "black_king_bar")?.context?.heroIds).toEqual([104]);
    expect(result.purchases.find((event) => event.heroId === 104 && event.key === "black_king_bar")?.context?.heroIds).toEqual([28]);
    expect(result.purchases.find((event) => event.key === "desolator")?.context?.heroIds).toEqual([54]);
    const reversed = buildDotaDraftReview(match, selected(match, 104));
    expect(reversed.purchases.map((event) => event.context)).toEqual(result.purchases.map((event) => event.context));
    selected(match, 54).heroId = 13;
    expect(review(match).purchases.find((event) => event.key === "desolator")?.context).toBeUndefined();
  });

  it("rejects invalid timestamps and unknown keys while retaining zero and the final recorded second", () => {
    const match = matchFixture();
    selected(match).purchases = [
      { key: "blink", time: -1 }, { key: "blink", time: Number.NaN },
      { key: "black_king_bar", time: Number.POSITIVE_INFINITY },
      { key: "black_king_bar", time: match.durationSeconds + 1 },
      { key: "unreviewed_item", time: 100 }, { key: "recipe_blink", time: 100 },
      { key: "blink", time: 0 }, { key: "black_king_bar", time: match.durationSeconds }
    ];
    expect(review(match).purchases.map(({ key, minute }) => ({ key, minute }))).toEqual([
      { key: "blink", minute: 0 }, { key: "black_king_bar", minute: 40 }
    ]);
    for (const durationSeconds of [Number.NaN, Number.POSITIVE_INFINITY, -1, 0]) {
      expect(review({ ...match, durationSeconds }).purchases).toEqual([]);
    }
  });

  it("merges all recognized purchases from both teams chronologically, including later events beyond the first eight", () => {
    const match = matchFixture();
    match.players.forEach((row, index) => {
      row.purchases = [{ key: "blink", time: 900 + index * 30 }, { key: "black_king_bar", time: 1800 + index * 30 }];
    });
    const result = review(match);
    expect(result.purchases).toHaveLength(20);
    expect(result.purchaseLogHeroCount).toBe(10);
    expect(result.purchases.filter((event) => event.isOwnTeam)).toHaveLength(10);
    expect(result.purchases.filter((event) => !event.isOwnTeam)).toHaveLength(10);
    expect(result.purchases.map((event) => event.minute)).toEqual([...result.purchases.map((event) => event.minute)].sort((a, b) => a - b));
    expect(result.purchases.at(-1)).toMatchObject({ heroId: 28, key: "black_king_bar", minute: 34.5 });
  });

  it("keeps the earliest valid logged purchase for each hero and item without conflating different holders", () => {
    const match = matchFixture();
    selected(match).purchases = [
      { key: "blink", time: -10 }, { key: "blink", time: 1200 },
      { key: "blink", time: 900 }, { key: "blink", time: 900 },
      { key: "black_king_bar", time: 1800 }
    ];
    selected(match, 104).purchases = [{ key: "blink", time: 900 }];
    const result = review(match);
    expect(result.purchases).toHaveLength(3);
    expect(result.purchases.filter((event) => event.key === "blink")).toMatchObject([
      { heroId: 28, minute: 15, isOwnTeam: true }, { heroId: 104, minute: 15, isOwnTeam: false }
    ]);
    expect(result.purchaseLogHeroCount).toBe(2);
  });

  it("does not invent purchase timing from final inventory and distinguishes unreviewed logs from missing logs", () => {
    const match = matchFixture();
    selected(match).finalInventory = [{ area: "main", slot: 0, itemId: 1 }];
    expect(review(match).purchases).toEqual([]);
    expect(review(match).purchaseLogHeroCount).toBe(0);
    selected(match).purchases = [{ key: "unreviewed_item", time: 300 }];
    selected(match, 104).purchases = [{ key: "blink", time: -100 }];
    expect(review(match).purchases).toEqual([]);
    expect(review(match).purchaseLogHeroCount).toBe(1);
    expectNoClaims(review({ ...match, patchId: null }));
  });
});

describe("Dota draft editorial data", () => {
  it("identifies its reviewed version, date and sources and only profiles known, unique heroes", () => {
    expect(dotaDraftProfileSnapshot.patchFamily).toMatch(/^\d+\.\d+$/);
    expect(dotaDraftProfileSnapshot.patchLabel).toMatch(/^\d+\.\d+[a-z]$/);
    expect(dotaDraftProfileSnapshot.patchLabel.startsWith(dotaDraftProfileSnapshot.patchFamily)).toBe(true);
    expect(Number.isFinite(Date.parse(dotaDraftProfileSnapshot.supportedSince))).toBe(true);
    expect(Date.parse(dotaDraftProfileSnapshot.supportedSince)).toBeLessThanOrEqual(Date.parse(dotaDraftProfileSnapshot.checkedAt));
    expect(Number.isInteger(dotaDraftProfileSnapshot.patchId)).toBe(true);
    expect(dotaDraftProfileSnapshot.patchId).toBeGreaterThan(0);
    expect(dotaDraftProfileSnapshot.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isFinite(Date.parse(dotaDraftProfileSnapshot.checkedAt))).toBe(true);
    expect(dotaDraftProfileSnapshot.methodVersion.trim().length).toBeGreaterThan(0);
    expect(dotaDraftProfileSnapshot.sourceUrls.length).toBeGreaterThan(0);
    dotaDraftProfileSnapshot.sourceUrls.forEach(expectHttps);
    expect(new Set(dotaDraftHeroProfiles.map((row) => row.heroId)).size).toBe(dotaDraftHeroProfiles.length);
    const knownHeroes = new Set(dotaHeroes.map((row) => row.id));
    for (const profile of dotaDraftHeroProfiles) {
      expect(knownHeroes.has(profile.heroId)).toBe(true);
      expectHttps(profile.sourceUrl);
      expect(profile.evidence.length).toBeGreaterThan(0);
      for (const evidence of profile.evidence) {
        expect(evidence.ability.trim().length).toBeGreaterThan(0);
        expectCopy(evidence.text);
      }
    }
  });

  it("provides bilingual conditions and actions for unique rules backed by recorded traits", () => {
    const recordedTraits = new Set(dotaDraftHeroProfiles.flatMap((profile) => profile.evidence.map((evidence) => evidence.trait)));
    expect(recordedTraits.has("targetedSpell")).toBe(true);
    expect(new Set(dotaDraftRules.map((rule) => rule.id)).size).toBe(dotaDraftRules.length);
    expect(new Set(dotaDraftAxes.map((axis) => axis.id)).size).toBe(dotaDraftAxes.length);
    for (const rule of dotaDraftRules) {
      expect(rule.traits.length).toBeGreaterThan(0);
      [...rule.traits, ...(rule.enemyTraits ?? [])].forEach((trait) => expect(recordedTraits.has(trait)).toBe(true));
      [rule.title, rule.explanation, rule.condition, rule.action].forEach(expectCopy);
    }
    for (const axis of dotaDraftAxes) {
      expect(axis.traits.length).toBeGreaterThan(0);
      axis.traits.forEach((trait) => expect(recordedTraits.has(trait)).toBe(true));
      [axis.title, axis.explanation].forEach(expectCopy);
    }
  });

  it("uses unique known item keys with bilingual purchase context and attributable sources", () => {
    const knownKeys = new Set(dotaMatchItems.map((item) => item.key));
    expect(new Set(dotaDraftPurchaseContexts.map((item) => item.key)).size).toBe(dotaDraftPurchaseContexts.length);
    for (const item of dotaDraftPurchaseContexts) {
      expect(knownKeys.has(item.key)).toBe(true);
      [item.title, item.explanation].forEach(expectCopy);
      expectHttps(item.sourceUrl);
    }
  });
});
