import { describe, expect, it, vi } from "vitest";
import { canReplaceDotaMatch, DotaMatchRecovery } from "../src/lib/dota-match-recovery";
import { sanitizeDotaMatchResponse } from "../src/lib/dota-match";

const match = (parsed = false, matchId = 8978544633) => sanitizeDotaMatchResponse({
  match_id: matchId, duration: 1800, start_time: 1788318551,
  players: Array.from({ length: 10 }, (_, index) => ({ hero_id: index + 1, player_slot: index < 5 ? index : index + 123,
    ...(parsed ? { times: [0, 60, 120], gold_t: [0, 200, 500] } : {}) }))
})!;

const setup = () => {
  const options = { request: vi.fn().mockResolvedValue(undefined), read: vi.fn().mockResolvedValue(match()), apply: vi.fn(), state: vi.fn(), delays: [0, 0, 0] };
  return { options, recovery: new DotaMatchRecovery(options) };
};

describe("explicit replay recovery", () => {
  it("allows enrichment but rejects stale timelines and mismatched heroes", () => {
    expect(canReplaceDotaMatch(match(), match(true))).toBe(true);
    expect(canReplaceDotaMatch(match(true), match())).toBe(false);
    const thin = match(true); thin.players[0]!.goldTimeline.pop();
    expect(canReplaceDotaMatch(match(true), thin)).toBe(false);
    const wrongHero = match(true); wrongHero.players[0]!.heroId = 100;
    expect(canReplaceDotaMatch(match(), wrongHero)).toBe(false);
  });
  it("does nothing on initialization and a manual refresh never submits a parse", async () => {
    const { recovery, options } = setup();
    expect(options.request).not.toHaveBeenCalled(); expect(options.read).not.toHaveBeenCalled();
    await recovery.run(8978544633);
    expect(options.request).not.toHaveBeenCalled(); expect(options.read).toHaveBeenCalledTimes(1);
    expect(options.state).toHaveBeenLastCalledWith("pending");
  });

  it("submits once, upgrades final-only data and stops once all timelines arrive", async () => {
    const { recovery, options } = setup();
    options.read.mockResolvedValueOnce(match()).mockResolvedValueOnce(match(true));
    await recovery.run(8978544633, true);
    expect(options.request).toHaveBeenCalledTimes(1); expect(options.read).toHaveBeenCalledTimes(2);
    expect(options.apply).toHaveBeenLastCalledWith(match(true));
    expect(options.state).toHaveBeenLastCalledWith("ready"); expect(recovery.busy).toBe(false);
  });

  it("stops after bounded reads and does not resubmit an accepted job", async () => {
    const { recovery, options } = setup();
    await recovery.run(8978544633, true);
    expect(options.read).toHaveBeenCalledTimes(3); expect(options.state).toHaveBeenLastCalledWith("pending");
    await recovery.run(8978544633, true);
    expect(options.request).toHaveBeenCalledTimes(1);
  });

  it("cannot overwrite a new match with a response from a cancelled request", async () => {
    const { recovery, options } = setup();
    let finish!: (value: ReturnType<typeof match>) => void;
    options.read.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve; }));
    const old = recovery.run(8978544633);
    recovery.cancel();
    options.read.mockResolvedValueOnce(match(true, 8978544634));
    await recovery.run(8978544634);
    finish(match(true)); await old;
    expect(options.apply).toHaveBeenCalledTimes(1);
    expect(options.apply).toHaveBeenCalledWith(match(true, 8978544634));
  });

  it("keeps the current result on provider errors and never retries an ambiguous write", async () => {
    const { recovery, options } = setup(); options.request.mockRejectedValueOnce(new Error("timeout"));
    await recovery.run(8978544633, true);
    expect(options.apply).not.toHaveBeenCalled(); expect(options.read).not.toHaveBeenCalled();
    expect(options.state).toHaveBeenLastCalledWith("error", expect.any(Error));
    await recovery.run(8978544633, true);
    expect(options.request).toHaveBeenCalledTimes(1);
  });

  it("rejects a mismatched match response before applying it", async () => {
    const { recovery, options } = setup(); options.read.mockResolvedValueOnce(match(true, 8978544634));
    await recovery.run(8978544633);
    expect(options.apply).not.toHaveBeenCalled(); expect(options.state).toHaveBeenLastCalledWith("error", expect.any(Error));
  });

  it("cancels a scheduled check without sending a read or another parse", async () => {
    vi.useFakeTimers();
    try {
      const options = { request: vi.fn().mockResolvedValue(undefined), read: vi.fn().mockResolvedValue(match()), apply: vi.fn(), state: vi.fn(), delays: [15000] };
      const recovery = new DotaMatchRecovery(options);
      const pending = recovery.run(8978544633, true);
      await Promise.resolve();
      expect(options.state).toHaveBeenLastCalledWith("waiting");
      recovery.cancel(); await pending;
      await vi.advanceTimersByTimeAsync(20000);
      expect(options.read).not.toHaveBeenCalled(); expect(options.request).toHaveBeenCalledTimes(1);
      expect(options.state).toHaveBeenLastCalledWith("stopped");
    } finally { vi.useRealTimers(); }
  });
});
