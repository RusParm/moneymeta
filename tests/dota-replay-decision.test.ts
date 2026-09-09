import { describe, expect, it } from "vitest";
import { dotaDraftProfileSnapshot } from "../src/data/dota-draft-profiles";
import { getDotaReplayDecisionCopy } from "../src/data/dota-replay-decision-copy";
import { buildDotaDraftReview } from "../src/lib/dota-draft";
import { buildDotaEpisodeContext, type DotaEpisodeContext } from "../src/lib/dota-episode-context";
import { sanitizeDotaMatchResponse, type DotaMatch } from "../src/lib/dota-match";
import {
  buildDotaReplayDecision, evaluateDotaReplayDecision, buildDotaReplayDecisionNote,
  initialDotaReplayDecisionObservations, type DotaReplayDecisionObservations,
} from "../src/lib/dota-replay-decision";

const window = { startMinute: 12, endMinute: 15 };
const names = (id: number): string => id === 28 ? "Slardar" : id === 104 ? "Legion Commander" : `Hero ${id}`;
const matchFixture = (): DotaMatch => sanitizeDotaMatchResponse({
  match_id: 123456, duration: 2400, start_time: Date.parse("2026-08-01T00:00:00Z") / 1000,
  patch: dotaDraftProfileSnapshot.patchId,
  players: [28, 54, 53, 86, 9, 11, 128, 26, 121, 104].map((hero, index) => ({
    hero_id: hero, player_slot: index < 5 ? index : 128 + index - 5,
    purchase_log: hero === 28 ? [{ key: "blink", time: 540 }, { key: "black_king_bar", time: 720 }]
      : hero === 54 ? [{ key: "desolator", time: 899 }]
        : hero === 11 ? [{ key: "pipe", time: 900 }] : [],
  })),
})!;
const contextFor = (match = matchFixture()): DotaEpisodeContext => buildDotaEpisodeContext(
  buildDotaDraftReview(match, match.players.find((player) => player.playerSlot === 0)!), window,
)!;
const confirmedBkb: DotaReplayDecisionObservations = {
  itemReady: "yes", alliesReady: "yes", threatState: "answered", targetVisible: "unknown",
};

describe("Bounded replay decision evidence", () => {
  it("prefers the selected hero's BKB with an existing reviewed named opposing control", () => {
    const context = contextFor();
    const original = structuredClone(context);
    const decision = buildDotaReplayDecision(context, 28)!;
    expect(decision).toMatchObject({ kind: "bkb", heroId: 28, itemKey: "black_king_bar", purchaseMinute: 12,
      purchaseClock: "12:00", phase: "during", startMinute: 12, endMinute: 15,
      patchFamily: dotaDraftProfileSnapshot.patchLabel, checkedAt: dotaDraftProfileSnapshot.checkedAt });
    expect(decision.threats).toContainEqual(expect.objectContaining({ heroId: 104, ability: "Duel" }));
    expect(decision.threats.every((threat) => threat.mechanic.ru && threat.mechanic.en && decision.sourceUrls.includes(threat.sourceUrl))).toBe(true);
    expect(decision.sourceUrls).toContain("https://www.dota2.com/newfrontiers");
    expect(context).toEqual(original);
    expect(buildDotaReplayDecision(context, 28)?.id).toBe(decision.id);
  });

  it("falls back to an observed own Blink and retains the bounded lookback", () => {
    const match = matchFixture();
    match.players[0]!.purchases = [{ key: "blink", time: 540 }];
    const decision = buildDotaReplayDecision(contextFor(match), 28)!;
    expect(decision).toMatchObject({ kind: "blink", phase: "before", purchaseClock: "9:00", threats: [] });
    match.players[0]!.purchases = [{ key: "blink", time: 539 }];
    expect(buildDotaReplayDecision(contextFor(match), 28)).toBeNull();
  });

  it("rejects future purchases even if incorrectly placed in the passed episode context", () => {
    const context = contextFor();
    context.own.before = [];
    context.own.during[0]!.minute = 15.01;
    expect(buildDotaReplayDecision(context, 28)).toBeNull();
    context.own.during[0]!.minute = 8.99;
    context.lookbackStartMinute = 0; // Do not trust a widened caller bound.
    expect(buildDotaReplayDecision(context, 28)).toBeNull();
    context.own.during[0]!.minute = 15;
    expect(buildDotaReplayDecision(context, 28)?.purchaseMinute).toBe(15);
  });

  it("never uses final inventory, outcome or another hero's purchase as the selected hero's evidence", () => {
    const match = matchFixture();
    const base = buildDotaReplayDecision(contextFor(match), 28);
    match.radiantWin = false;
    match.players[0]!.netWorth = 99999;
    match.players[0]!.finalInventory = [{ area: "main", slot: 0, itemId: 116 }];
    expect(buildDotaReplayDecision(contextFor(match), 28)).toEqual(base);
    match.players[0]!.purchases = [];
    expect(buildDotaReplayDecision(contextFor(match), 28)).toBeNull();
    expect(buildDotaReplayDecision(contextFor(), 54)).toBeNull();
    expect(buildDotaReplayDecision(contextFor(), 104)).toBeNull();
  });

  it("rejects wrong-side records and contradictory selected-hero perspective", () => {
    const context = contextFor();
    context.own.before[0]!.isOwnTeam = false;
    context.own.during[0]!.isOwnTeam = false;
    expect(buildDotaReplayDecision(context, 28)).toBeNull();
    const contradictory = contextFor();
    contradictory.enemy.during.push({ ...contradictory.own.during[0]!, isOwnTeam: false });
    expect(buildDotaReplayDecision(contradictory, 28)).toBeNull();
  });

  it("does not invent BKB threats from an absent or unreviewed named context", () => {
    const context = contextFor();
    context.own.before = [];
    const bkb = context.own.during[0]!;
    delete bkb.context;
    expect(buildDotaReplayDecision(context, 28)).toBeNull();
    bkb.context = { heroIds: [104], abilities: [{ heroId: 104, ability: "Invented spell" }], text: { ru: "", en: "" } };
    expect(buildDotaReplayDecision(context, 28)).toBeNull();
    bkb.context.abilities = [{ heroId: 104, ability: "Duel" }];
    expect(buildDotaReplayDecision(context, 28)?.kind).toBe("bkb");
    context.own.during.push({ ...bkb, heroId: 104, key: "pipe" });
    expect(buildDotaReplayDecision(context, 28)).toBeNull();
  });

  it("keeps partial coverage explicit and suppresses unsupported match versions", () => {
    const match = matchFixture();
    match.players[4]!.heroId = 999;
    const decision = buildDotaReplayDecision(contextFor(match), 28)!;
    expect(decision.partialCoverage).toBe(true);
    expect(evaluateDotaReplayDecision(decision, confirmedBkb, "en", names).limitations.join(" ")).toContain("Not every hero profile is reviewed");
    match.patchId = 1;
    expect(buildDotaReplayDecision(contextFor(match), 28)).toBeNull();
    for (const status of ["patch-mismatch", "unavailable"] as const) {
      expect(buildDotaReplayDecision({ ...contextFor(), status }, 28)).toBeNull();
    }
    expect(buildDotaReplayDecision({ ...contextFor(), patchFamily: "historical" }, 28)).toBeNull();
  });

  it("requires a valid existing episode and selected hero", () => {
    expect(buildDotaReplayDecision(null, 28)).toBeNull();
    for (const id of [0, -1, NaN, 1.2]) expect(buildDotaReplayDecision(contextFor(), id)).toBeNull();
    for (const invalid of [{ startMinute: -1 }, { startMinute: NaN }, { endMinute: 12 }, { endMinute: Infinity }]) {
      expect(buildDotaReplayDecision({ ...contextFor(), ...invalid }, 28)).toBeNull();
    }
  });
});

describe("Player-confirmed conditional alternatives", () => {
  it("starts with exactly three active unknowns and treats unknown as unverified", () => {
    const decision = buildDotaReplayDecision(contextFor(), 28)!;
    const answers = initialDotaReplayDecisionObservations();
    const result = evaluateDotaReplayDecision(decision, answers, "en", names);
    expect(result.status).toBe("needs-observations");
    expect(result.unknownFields).toEqual(["itemReady", "alliesReady", "threatState"]);
    expect(result.alternatives.map((entry) => entry.status)).toEqual(["unverified", "unverified"]);
    expect(result.alternatives[0].reason).toContain("does not mean they were absent");
    expect(result).not.toHaveProperty("recommended");
    expect(result).not.toHaveProperty("winner");
    expect(result.taskFocus).toBe("verify");
    expect(result.nextMatchTask).toContain("task for the next match has not been selected");
    expect(result.nextMatchTask).toContain("Slardar");
    expect(answers).toEqual(initialDotaReplayDecisionObservations());
  });

  it("updates the comparison for a known unavailable item without changing unknown support to no", () => {
    const decision = buildDotaReplayDecision(contextFor(), 28)!;
    const result = evaluateDotaReplayDecision(decision, { ...initialDotaReplayDecisionObservations(), itemReady: "no" }, "en", names);
    expect(result.status).toBe("needs-observations");
    expect(result.unknownFields).toEqual(["alliesReady", "threatState"]);
    expect(result.alternatives[0].status).toBe("blocked");
    expect(result.alternatives[0].reason).toContain("item was unavailable");
    expect(result.alternatives[0].reason).not.toContain("Allies could not");
    expect(result.alternatives[1]).toMatchObject({ status: "conditional" });
    expect(result.alternatives[1].reason).toContain("whether the situation allowed time to wait");
  });

  it("does not call a BKB entry safe after all named threats are answered", () => {
    const decision = buildDotaReplayDecision(contextFor(), 28)!;
    const result = evaluateDotaReplayDecision(decision, confirmedBkb, "en", names);
    expect(result.unknownFields).toEqual([]);
    expect(result.status).toBe("conditional");
    expect(result.alternatives[0].status).toBe("conditional");
    expect(result.alternatives[0].reason).toContain("do not establish a safe entry");
    expect(result.limitations.join(" ")).toContain("does not rule out other threats");
    const threatened = evaluateDotaReplayDecision(decision, { ...confirmedBkb, threatState: "ready" }, "en", names);
    expect(threatened.alternatives[0].status).toBe("blocked");
    expect(threatened.alternatives[0].reason).toContain("even with BKB active");
    expect(threatened.nextMatchTask).toContain("Legion Commander · Duel");
    expect(threatened.taskFocus).toBe("threat");
  });

  it("uses target visibility instead of BKB threat state for the Blink case", () => {
    const context = contextFor();
    context.own.during = [];
    const decision = buildDotaReplayDecision(context, 28)!;
    const unknown = evaluateDotaReplayDecision(decision, initialDotaReplayDecisionObservations(), "en", names);
    expect(unknown.unknownFields).toEqual(["itemReady", "alliesReady", "targetVisible"]);
    const ready = { ...confirmedBkb, targetVisible: "yes" as const, threatState: "unknown" as const };
    expect(evaluateDotaReplayDecision(decision, ready, "en", names).status).toBe("conditional");
    const unseen = evaluateDotaReplayDecision(decision, { ...ready, targetVisible: "no" }, "en", names);
    expect(unseen.alternatives[0].reason).toContain("not visible");
    expect(unseen.alternatives[0].status).toBe("blocked");
    expect(unseen.nextMatchTask).toContain("check vision of the specific target");
    expect(unseen.taskFocus).toBe("vision");
    const unsupported = evaluateDotaReplayDecision(decision, { ...ready, alliesReady: "no" }, "en", names);
    expect(unsupported.alternatives[0].reason).toContain("Allies could not");
  });

  it("normalizes invalid answers to unknown instead of interpreting truthiness", () => {
    const decision = buildDotaReplayDecision(contextFor(), 28)!;
    const malformed = { itemReady: "false", alliesReady: true, threatState: "no", targetVisible: null } as unknown as DotaReplayDecisionObservations;
    const result = evaluateDotaReplayDecision(decision, malformed, "en", names);
    expect(result.unknownFields).toHaveLength(3);
    expect(result.alternatives[0].status).toBe("unverified");
  });

  it("chooses one task from the recorded obstacle and preserves good preparation without inventing an error", () => {
    const candidate = buildDotaReplayDecision(contextFor(), 28)!;
    for (const lang of ["ru", "en"] as const) {
      const evaluate = (answers: Partial<DotaReplayDecisionObservations>) => evaluateDotaReplayDecision(candidate, { ...confirmedBkb, ...answers }, lang, names);
      const item = evaluate({ itemReady: "no", alliesReady: "no", threatState: "ready" });
      expect(item.taskFocus).toBe("item");
      expect(item.nextMatchTask).toContain("Black King Bar");
      const allies = evaluate({ alliesReady: "no", threatState: "ready" });
      expect(allies.taskFocus).toBe("allies");
      expect(allies.nextMatchTask).toContain(lang === "ru" ? "конкретного союзника" : "one ally");
      const threat = evaluate({ threatState: "ready" });
      expect(threat.taskFocus).toBe("threat");
      expect(threat.nextMatchTask).toContain("Legion Commander · Duel");
      const preserve = evaluate({});
      expect(preserve.taskFocus).toBe("preserve");
      expect(preserve.nextMatchTask).toContain(lang === "ru" ? "сами по себе не указывают на ошибку" : "themselves indicate a mistake");
      expect(new Set([item, allies, threat, preserve].map((result) => result.nextMatchTask)).size).toBe(4);
      const unknownWithKnownObstacle = evaluate({ itemReady: "unknown", alliesReady: "no", threatState: "unknown" });
      expect(unknownWithKnownObstacle.taskFocus).toBe("allies");
      expect(unknownWithKnownObstacle.status).toBe("needs-observations");
    }
  });

  it("copies the same two alternatives, player inputs, narrow evidence and limits in both languages", () => {
    const decision = buildDotaReplayDecision(contextFor(), 28)!;
    for (const lang of ["ru", "en"] as const) {
      const c = getDotaReplayDecisionCopy(lang);
      const result = evaluateDotaReplayDecision(decision, confirmedBkb, lang, names);
      const note = buildDotaReplayDecisionNote(decision, confirmedBkb, lang, names);
      expect(note).toContain("12:00-15:00");
      expect(note).toContain("Legion Commander · Duel");
      expect(note).toContain(c.userAnswers);
      expect(note).toContain(c.threatAnswered);
      expect(note).toContain(result.nextMatchTask);
      expect(note).toContain(dotaDraftProfileSnapshot.checkedAt);
      for (const option of result.alternatives) {
        expect(note).toContain(option.condition);
        expect(note).toContain(option.tradeoff);
      }
      for (const url of decision.sourceUrls) expect(note).toContain(url);
      expect(c.intro).toContain(lang === "ru" ? "не доказывает" : "does not establish");
      expect(note).toContain(lang === "ru" ? "раньше записи покупки" : "precede the recorded purchase");
      expect(note).not.toContain("—");
    }
    expect(buildDotaReplayDecisionNote(null, confirmedBkb, "en", names)).toBe("");
    expect(Object.keys(getDotaReplayDecisionCopy("ru"))).toEqual(Object.keys(getDotaReplayDecisionCopy("en")));
  });
});
