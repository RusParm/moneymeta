import { describe, expect, it } from "vitest";
import { buildDotaMatchAudit, createDotaMatchPublicPayload, sanitizeDotaMatchResponse } from "../src/lib/dota-match";
import { buildDotaFinalReview, dotaFinalContribution } from "../src/lib/dota-match-summary";
import { dotaReviewMessage } from "../src/lib/dota-match-review-ui";

const fixture = () => sanitizeDotaMatchResponse({
  match_id: 8978544633, duration: 2400, start_time: 1788318551, radiant_win: false, patch: 60,
  players: Array.from({ length: 10 }, (_, index) => ({
    hero_id: index + 1, player_slot: index < 5 ? index : index + 123,
    kills: 4, assists: 8, deaths: 4, gold_per_min: index === 5 ? 650 : 450,
    net_worth: index === 5 ? 22000 : 17000, xp_per_min: 550,
    hero_damage: 20000, tower_damage: 1000, hero_healing: 0,
    account_id: 1, personaname: "not retained"
  }))
})!;

describe("match-end contribution review", () => {
  it("adds usable findings without gold samples, position estimates or purchases", () => {
    const match = fixture();
    const p = match.players[0]!;
    const review = buildDotaFinalReview(match, p, null, match.players[5]!);
    expect(review.incomeGapGpm).toBe(-200);
    expect(review.incomeGapPct).toBeCloseTo(-30.7692);
    expect(review.netWorthGap).toBe(-5000);
    expect(review.contribution).toMatchObject({ teamKills: 20, killInvolvements: 12, killParticipationPct: 60, incomeSharePct: 20, heroDamageSharePct: 20 });
    expect(review.findings[0]).toBe("income-behind");
    expect(buildDotaMatchAudit(match, p.playerSlot, [], "core", 60)?.economy.criticalWindow).toBeNull();
    for (const lang of ["ru", "en"] as const) {
      const message = dotaReviewMessage(review, review.findings[0], lang, "Necrophos");
      expect(message.evidence).toContain("450 GPM");
      expect(message.evidence).toContain("650 GPM");
      expect(message.action.length).toBeGreaterThan(40);
    }
  });

  it("preserves the three allowlisted contribution stats and discards identity fields", () => {
    const match = fixture();
    const payload = createDotaMatchPublicPayload(match);
    expect(sanitizeDotaMatchResponse(payload)?.players[0]).toMatchObject({ heroDamage: 20000, towerDamage: 1000, heroHealing: 0 });
    expect(JSON.stringify(payload)).not.toContain("account_id");
    expect(JSON.stringify(payload)).not.toContain("personaname");
  });

  it("requires a complete normal team for team shares, without removing direct comparisons", () => {
    const match = fixture();
    match.players.splice(4, 1);
    const review = buildDotaFinalReview(match, match.players[0]!, "core", match.players[4]!);
    expect(review.contribution.incomeSharePct).toBeNull();
    expect(review.contribution.killParticipationPct).toBeNull();
    expect(review.incomeGapGpm).toBe(-200);
    const wrongSlots = fixture();
    wrongSlots.players[4]!.playerSlot = 6;
    expect(dotaFinalContribution(wrongSlots, wrongSlots.players[0]!).heroDamageSharePct).toBeNull();
  });

  it("keeps zero damage distinct from missing damage and refuses an incomplete denominator", () => {
    const match = fixture(); const player = match.players[0]!;
    player.heroDamage = 0;
    expect(dotaFinalContribution(match, player).heroDamageSharePct).toBe(0);
    match.players[1]!.heroDamage = null;
    expect(dotaFinalContribution(match, player).heroDamageSharePct).toBeNull();
    expect(dotaFinalContribution(match, player).healingSharePct).toBeNull();
  });

  it("does not turn zero or inconsistent kill totals into an invented percentage", () => {
    const match = fixture(); const player = match.players[0]!;
    player.kills = 0; player.assists = 0;
    expect(dotaFinalContribution(match, player).killParticipationPct).toBe(0);
    match.players.forEach((p) => { p.kills = 0; });
    expect(dotaFinalContribution(match, player).killParticipationPct).toBeNull();
    match.players[1]!.kills = 1; player.assists = 10;
    expect(dotaFinalContribution(match, player).killParticipationPct).toBeNull();
  });

  it("requires a known core role and three complete observations for the resource-use question", () => {
    const match = fixture(); const player = match.players[0]!;
    player.goldPerMinute = 900; player.heroDamage = 1000; player.towerDamage = 0; player.assists = 0;
    expect(buildDotaFinalReview(match, player, "core", null).findings).toContain("resources-and-pressure");
    expect(buildDotaFinalReview(match, player, "support", null).findings).not.toContain("resources-and-pressure");
    expect(buildDotaFinalReview(match, player, null, null).findings).not.toContain("resources-and-pressure");
    match.players[2]!.towerDamage = null;
    expect(buildDotaFinalReview(match, player, "core", null).findings).not.toContain("resources-and-pressure");
  });

  it("recognizes support participation and building pressure without penalizing low GPM", () => {
    const match = fixture(); const player = match.players[0]!;
    player.goldPerMinute = 250; player.assists = 12; player.towerDamage = 6000;
    const review = buildDotaFinalReview(match, player, "support", null);
    expect(review.findings).toContain("fight-presence");
    expect(review.findings).toContain("objectives");
    expect(review.findings).not.toContain("resources-and-pressure");
  });

  it("cannot compare against a teammate, including a spoofed counterpart object", () => {
    const match = fixture(); const player = match.players[0]!;
    const review = buildDotaFinalReview(match, player, "core", { ...match.players[1]!, isRadiant: false });
    expect(review.counterpart).toBeNull();
    expect(review.incomeGapGpm).toBeNull();
  });

  it("keeps GPM and net worth separate and never divides by zero", () => {
    const match = fixture(); match.players[5]!.goldPerMinute = 0; match.players[0]!.netWorth = null;
    const review = buildDotaFinalReview(match, match.players[0]!, "core", match.players[5]!);
    expect(review.incomeGapPct).toBeNull(); expect(review.netWorthGap).toBeNull();
    expect(review.findings).not.toContain("income-ahead");
  });
});
