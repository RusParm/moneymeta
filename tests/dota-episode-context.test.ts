import { describe, expect, it } from "vitest";
import { dotaDraftProfileSnapshot } from "../src/data/dota-draft-profiles";
import { buildDotaDraftReview } from "../src/lib/dota-draft";
import { buildDotaEpisodeContext, selectDotaEpisodeOtherPurchases } from "../src/lib/dota-episode-context";
import { buildDotaEpisodeNote } from "../src/lib/dota-episode-context-ui";
import { sanitizeDotaMatchResponse, type DotaMatch } from "../src/lib/dota-match";

const window = { startMinute: 12, endMinute: 15 };
// Synthetic composition and observations. No real player's outcomes or account.
const matchFixture = (): DotaMatch => sanitizeDotaMatchResponse({
  match_id: 123456, duration: 2400, start_time: Date.parse("2026-08-01T00:00:00Z") / 1000,
  patch: dotaDraftProfileSnapshot.patchId,
  players: [28, 54, 53, 86, 9, 11, 128, 26, 121, 104].map((hero, index) => ({
    hero_id: hero, player_slot: index < 5 ? index : 128 + index - 5,
    purchase_log: hero === 28 ? [{ key: "blink", time: 540 }, { key: "black_king_bar", time: 720 }]
      : hero === 54 ? [{ key: "desolator", time: 899 }]
        : hero === 11 ? [{ key: "pipe", time: 900 }]
          : hero === 26 ? [{ key: "force_staff", time: 659 }]
            : hero === 121 ? [{ key: "blink", time: 700 }] : [],
  })),
})!;

const contextFor = (match = matchFixture(), slot = 0) => buildDotaEpisodeContext(
  buildDotaDraftReview(match, match.players.find((player) => player.playerSlot === slot)!), window,
)!;

describe("Draft evidence around an observed episode", () => {
  it("shows both teams and separates the three-minute lookback from purchases inside the episode", () => {
    const context = contextFor();
    expect(context).toMatchObject({ lookbackStartMinute: 9, startMinute: 12, endMinute: 15, status: "ready", purchaseLogHeroCount: 5, totalHeroCount: 10 });
    expect(context.own.before.map((event) => [event.heroId, event.key, event.minute])).toEqual([[28, "blink", 9]]);
    expect(context.own.during.map((event) => [event.heroId, event.key, event.minute])).toEqual([[28, "black_king_bar", 12], [54, "desolator", 899 / 60]]);
    expect(context.enemy.before.map((event) => event.heroId)).toEqual([26, 121]);
    expect(context.enemy.during.map((event) => [event.heroId, event.key, event.minute])).toEqual([[11, "pipe", 15]]);
  });

  it("never brings old or post-episode purchases into the episode evidence", () => {
    const match = matchFixture();
    match.players[0]!.purchases.push({ key: "lotus_orb", time: 539 }, { key: "sphere", time: 901 });
    const baseline = contextFor();
    expect(contextFor(match)).toEqual(baseline);
  });

  it("retains the upstream first-valid-purchase rule without treating a rebuy as a new power event", () => {
    const match = matchFixture();
    match.players[0]!.purchases = [{ key: "blink", time: 100 }, { key: "blink", time: 780 }];
    const context = contextFor(match);
    expect([...context.own.before, ...context.own.during].some((event) => event.key === "blink")).toBe(false);
  });

  it("names existing matchup-specific checks without calculating item readiness or an advantage", () => {
    const context = contextFor();
    expect(context.own.during[0]!.context?.abilities).toContainEqual({ heroId: 104, ability: "Duel" });
    expect(context.own.condition?.id).toBe("armor-focus");
    expect(context.own.condition?.heroIds).toEqual(expect.arrayContaining([28, 54]));
    expect(context.enemy.condition?.heroIds.some((id) => [11, 26, 121].includes(id))).toBe(true);
    expect(context).not.toHaveProperty("winner");
    expect(context).not.toHaveProperty("readyItems");
  });

  it("does not invent a nearby lineup condition when none of its heroes bought a selected item", () => {
    const match = matchFixture();
    match.players.forEach((player) => { player.purchases = []; });
    const context = contextFor(match);
    expect(context.purchaseLogHeroCount).toBe(0);
    expect(context.own).toEqual({ before: [], during: [], condition: null });
    expect(context.enemy).toEqual({ before: [], during: [], condition: null });
  });

  it("reverses perspective without changing observations, condition selection or chronological order", () => {
    const match = matchFixture();
    const own = contextFor(match);
    const enemy = contextFor(match, 128);
    const flip = (team: typeof own.own) => ({
      ...team,
      before: team.before.map((event) => ({ ...event, isOwnTeam: !event.isOwnTeam })),
      during: team.during.map((event) => ({ ...event, isOwnTeam: !event.isOwnTeam })),
    });
    expect(enemy.own).toEqual(flip(own.enemy));
    expect(enemy.enemy).toEqual(flip(own.own));
  });

  it("keeps historical purchase facts while suppressing current mechanics for unsupported versions", () => {
    const match = matchFixture();
    match.patchId = 1;
    const context = contextFor(match);
    expect(context.status).toBe("patch-mismatch");
    expect(context.own.during.map((event) => event.key)).toEqual(["black_king_bar", "desolator"]);
    expect(context.own.during.every((event) => !event.context)).toBe(true);
    expect(context.own.during[0]!.explanation.en).toContain("have not been evaluated");
    expect(context.own.condition).toBeNull();
    expect(context.enemy.condition).toBeNull();
  });

  it("preserves partial profile coverage without declaring that missing mechanics are weaknesses", () => {
    const match = matchFixture();
    match.players[4]!.heroId = 999;
    const context = contextFor(match);
    expect(context.status).toBe("partial");
    expect(context.uncoveredHeroIds).toEqual([999]);
    expect(context.own.condition?.id).toBe("armor-focus");
    expect(buildDotaEpisodeNote(context, "en", (id) => `Hero ${id}`)).toContain("does not establish that a team lacks an answer");
  });

  it("does not manufacture an episode from final-only data or an invalid window", () => {
    const match = matchFixture();
    const draft = buildDotaDraftReview(match, match.players[0]!);
    expect(match.players.every((player) => player.goldTimeline.length === 0)).toBe(true);
    for (const invalid of [null, { startMinute: -1, endMinute: 5 }, { startMinute: 5, endMinute: 5 }, { startMinute: 6, endMinute: 5 }, { startMinute: 0, endMinute: Infinity }, { startMinute: NaN, endMinute: 5 }]) {
      expect(buildDotaEpisodeContext(draft, invalid)).toBeNull();
    }
    expect(buildDotaEpisodeNote(null, "ru", String)).toBe("");
  });

  it("bounds the lookback at match start and retains an existing broad phase without narrowing it", () => {
    const match = matchFixture();
    match.players[0]!.purchases = [{ key: "blink", time: 0 }, { key: "black_king_bar", time: 120 }];
    const draft = buildDotaDraftReview(match, match.players[0]!);
    const early = buildDotaEpisodeContext(draft, { startMinute: 2, endMinute: 5 })!;
    expect(early.lookbackStartMinute).toBe(0);
    expect(early.own.before.map((event) => event.minute)).toEqual([0]);
    expect(early.own.during.map((event) => event.minute)).toEqual([2]);
    expect(buildDotaEpisodeContext(draft, { startMinute: 10, endMinute: 20 })).toMatchObject({ startMinute: 10, endMinute: 20, lookbackStartMinute: 7 });
  });

  it("does not use final inventory, outcome, performance or provider ordering to rewrite fixed-window context", () => {
    const match = matchFixture();
    const baseline = contextFor(match);
    match.radiantWin = false;
    match.players.reverse();
    match.players.forEach((player) => {
      player.won = !player.isRadiant; player.kills = 42; player.netWorth = 99999;
      player.goldTimeline = [0, 1000, 5000]; player.times = [0, 600, 1200];
      player.finalInventory = [{ area: "main", slot: 0, itemId: 123 }];
      player.purchases.reverse();
    });
    const before = structuredClone(match);
    expect(contextFor(match)).toEqual(baseline);
    expect(match).toEqual(before);
  });

  it("keeps malformed lineups unavailable", () => {
    const match = matchFixture();
    match.players.pop();
    const context = contextFor(match);
    expect(context.status).toBe("unavailable");
    expect(context.own).toEqual({ before: [], during: [], condition: null });
    expect(context.enemy).toEqual({ before: [], during: [], condition: null });
  });

  it("copies each team's bounded observations, named checks and data limitations in both languages", () => {
    const context = contextFor();
    for (const lang of ["ru", "en"] as const) {
      const note = buildDotaEpisodeNote(context, lang, (id) => `Hero ${id}`);
      expect(note).toContain("Hero 28 · Black King Bar");
      expect(note).toContain("Hero 11 · Pipe of Insight");
      expect(note).toContain("Hero 104 · Duel");
      expect(note).toContain("09:00".replace(/^0/, ""));
      expect(note).toContain("12:00");
      expect(note).toContain(lang === "ru" ? "перед эпизодом" : "before the episode");
      expect(note).toContain(lang === "ru" ? "Полнота журналов неизвестна" : "Log completeness is unknown");
      expect(note).toContain(lang === "ru" ? "не подтверждает доставку, готовность или применение" : "does not establish delivery, readiness or item use");
    }
  });

  it("preserves other observed major items, with boundaries and deduplication specific to the selected hero", () => {
    const purchases = [
      ["hand_of_midas", 13], ["radiance", 15], ["ultimate_scepter", 12],
      ["black_king_bar", 12], ["desolator", 14], ["pipe", 14],
      ["blink", 9], ["heart", 15.1],
    ].map(([key, minute]) => ({ key: String(key), minute: Number(minute), name: String(key), image: "", cost: 1000, benchmark: null, deltaMinutes: null }));
    const before = structuredClone(purchases);
    expect(selectDotaEpisodeOtherPurchases(contextFor(), 28, purchases).map((purchase) => purchase.key)).toEqual([
      "hand_of_midas", "radiance", "ultimate_scepter", "desolator", "pipe",
    ]);
    expect(purchases).toEqual(before);
    expect(selectDotaEpisodeOtherPurchases(null, 28, purchases)).toEqual([]);
  });
});
