import { describe, expect, it } from "vitest";
import {
  buildDotaEconomicAutopsy,
  buildDotaMatchAudit,
  createDotaMatchGoldSeries,
  parseDotaPlayerSlot,
  sanitizeDotaMatchResponse,
  type DotaMatch
} from "../src/lib/dota-match";

// A known 12–15 minute farm interruption: 300 gold and 3 last hits versus 1,200 and 15.
function minuteMatch(): DotaMatch {
  const times = Array.from({ length: 31 }, (_, minute) => minute * 60);
  return sanitizeDotaMatchResponse({
    match_id: 8978544633, duration: 1805, start_time: 1788318551, patch: 58,
    players: Array.from({ length: 10 }, (_, index) => ({
      hero_id: index + 1,
      player_slot: index < 5 ? index : 128 + index - 5,
      isRadiant: index < 5,
      position_est: index % 5 + 1,
      times,
      gold_t: times.map((_, minute) => 600 + minute * 400 - (index === 0 ? Math.max(0, Math.min(3, minute - 12)) * 300 : 0)),
      lh_t: times.map((_, minute) => minute * 5 - (index === 0 ? Math.max(0, Math.min(3, minute - 12)) * 4 : 0)),
      net_worth: 12000,
      purchase_log: [{ time: 810, key: "blink" }]
    }))
  })!;
}

describe("Observed replay episodes", () => {
  it("finds a real three-minute interval inside the material phase", () => {
    const audit = buildDotaEconomicAutopsy(minuteMatch(), 0)!;
    expect(audit.criticalWindow).toMatchObject({ startMinute: 10, endMinute: 20, roleGapChange: -900, kind: "personal" });
    expect(audit.replayFocus).toMatchObject({
      startMinute: 12, endMinute: 15, durationMinutes: 3,
      playerGoldGain: 300, counterpartGoldGain: 1200, roleGapChange: -900,
      playerLastHits: 3, counterpartLastHits: 15
    });
  });

  it("does not manufacture a minute-level episode from sparse endpoints", () => {
    const match = minuteMatch();
    const indices = [0, 10, 20, 30];
    match.players = match.players.map((player) => ({ ...player,
      times: indices.map((i) => player.times[i]!),
      goldTimeline: indices.map((i) => player.goldTimeline[i]!),
      lastHitTimeline: indices.map((i) => player.lastHitTimeline[i]!)
    }));
    const audit = buildDotaEconomicAutopsy(match, 0)!;
    expect(audit.criticalWindow?.roleGapChange).toBe(-900);
    expect(audit.replayFocus).toBeNull();
  });

  it("requires continuous opposing samples to narrow an episode", () => {
    const match = minuteMatch();
    const opponent = match.players[5]!;
    opponent.times.splice(14, 1);
    opponent.goldTimeline.splice(14, 1);
    opponent.lastHitTimeline.splice(14, 1);
    const audit = buildDotaEconomicAutopsy(match, 0)!;
    expect(audit.criticalWindow).not.toBeNull();
    expect(audit.replayFocus).toMatchObject({ startMinute: 10, endMinute: 13, roleGapChange: -300 });
  });

  it("keeps team pressure distinct when the selected opponent gap does not move", () => {
    const match = minuteMatch();
    match.players[0]!.goldTimeline = [...match.players[5]!.goldTimeline];
    for (const player of match.players.slice(6)) {
      player.goldTimeline = player.goldTimeline.map((gold, minute) => gold + Math.max(0, Math.min(3, minute - 12)) * 300);
    }
    const audit = buildDotaEconomicAutopsy(match, 0)!;
    expect(audit.criticalWindow?.kind).toBe("team");
    expect(audit.replayFocus).toMatchObject({ startMinute: 12, endMinute: 15, roleGapChange: 0, teamGapChange: -3600 });
    expect(audit.estimatedItemDelayMinutes).toBeNull();
  });

  it("does not flag a support simply because cores gain a larger team share", () => {
    const match = minuteMatch();
    match.players = match.players.map((player) => ({ ...player,
      goldTimeline: player.times.map((second) => 600 + second / 60 * (player.positionEstimate! >= 4 ? 100 : 600))
    }));
    const audit = buildDotaEconomicAutopsy(match, 4)!;
    expect(audit.windows[0]!.playerTeamShareChangePct).toBeLessThan(-1.5);
    expect(audit.criticalWindow).toBeNull();
    expect(audit.windows.every((window) => window.kind === "stable")).toBe(true);
  });
});

describe("Explicit comparison and incomplete evidence", () => {
  it("compares a manually chosen enemy when provider positions are missing", () => {
    const match = minuteMatch();
    match.players.forEach((player) => { player.positionEstimate = null; });
    expect(buildDotaEconomicAutopsy(match, 0)!.counterpart).toBeNull();
    const audit = buildDotaMatchAudit(match, 0, [], "core", 58, 200, 128)!;
    expect(audit.economy.comparisonBasis).toBe("manual");
    expect(audit.economy.counterpart?.playerSlot).toBe(128);
    expect(audit.economy.replayFocus?.roleGapChange).toBe(-900);
    expect(buildDotaEconomicAutopsy(match, 0, 1)!.counterpart).toBeNull();
    expect(buildDotaEconomicAutopsy(match, 0, 250)!.counterpart).toBeNull();
  });

  it("requires an unambiguous automatic pair on both teams", () => {
    const match = minuteMatch();
    expect(buildDotaEconomicAutopsy(match, 0)!.comparisonBasis).toBe("position");
    match.players[1]!.positionEstimate = 1;
    expect(buildDotaEconomicAutopsy(match, 0)!.comparisonBasis).toBe("unavailable");
    expect(buildDotaEconomicAutopsy(match, 0, 128)!.comparisonBasis).toBe("manual");
  });

  it("does not call absent comparison data stable", () => {
    const match = minuteMatch();
    match.players = [match.players[0]!, { ...match.players[5]!, times: [], goldTimeline: [], lastHitTimeline: [] }];
    const audit = buildDotaEconomicAutopsy(match, 0)!;
    expect(audit.windows.every((window) => window.kind === "unavailable")).toBe(true);
    expect(audit.criticalWindow).toBeNull();
    expect(audit.replayFocus).toBeNull();
    expect(audit.confidence).toBe("low");
  });

  it("never compares a hero's current checkpoint with an opponent's previous minute", () => {
    const match = minuteMatch();
    match.players = [match.players[0]!, match.players[5]!];
    const opponent = match.players[1]!;
    for (const index of [30, 20, 10]) {
      opponent.times.splice(index, 1); opponent.goldTimeline.splice(index, 1); opponent.lastHitTimeline.splice(index, 1);
    }
    const audit = buildDotaEconomicAutopsy(match, 0)!;
    expect(audit.checkpoints.every((checkpoint) => checkpoint.roleGap === null)).toBe(true);
    expect(audit.criticalWindow).toBeNull();
  });

  it("uses the gold timeline even when last-hit samples are unavailable", () => {
    const match = minuteMatch();
    match.players[0]!.lastHitTimeline = [];
    const audit = buildDotaMatchAudit(match, 0, [], "core", 58)!;
    expect(audit.timelineAvailable).toBe(true);
    expect(audit.series).toHaveLength(31);
    expect(audit.checkpoints[0]!.intervalLastHits).toBeNull();
    expect(audit.economy.replayFocus?.playerLastHits).toBeNull();
    expect(audit.economy.replayFocus?.roleGapChange).toBe(-900);
  });

  it("rejects non-monotonic sample times without shifting last-hit alignment", () => {
    const player = minuteMatch().players[0]!;
    player.times[10] = player.times[8]!;
    expect(createDotaMatchGoldSeries(player)).toEqual([]);
  });

  it("does not label a late or short-match sample as the ten-minute lane result", () => {
    const match = minuteMatch();
    match.durationSeconds = 8 * 60;
    expect(buildDotaEconomicAutopsy(match, 0)!.laneCheckpoint).toBeNull();
    expect(buildDotaEconomicAutopsy(match, 0)!.finalCheckpoint?.minute).toBe(8);
  });

  it("rejects duplicate player slots rather than computing incorrect team totals", () => {
    expect(sanitizeDotaMatchResponse({ match_id: 8978544633, duration: 1800, start_time: 1,
      players: [{ hero_id: 1, player_slot: 0 }, { hero_id: 2, player_slot: 0 }]
    })).toBeNull();
  });

  it("parses only valid player slots and never coerces missing URL values to zero", () => {
    for (const value of [null, "", " ", "5", "127", "133", "0.0", "-1", "Infinity"]) expect(parseDotaPlayerSlot(value)).toBeUndefined();
    expect(parseDotaPlayerSlot("0")).toBe(0);
    expect(parseDotaPlayerSlot("128")).toBe(128);
    expect(parseDotaPlayerSlot("132")).toBe(132);
  });
});
