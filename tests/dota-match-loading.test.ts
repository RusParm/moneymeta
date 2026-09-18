import { describe, expect, it, vi } from "vitest";
import { DotaMatchLoader, dotaResponseFailure } from "../src/lib/dota-match-loading";

const deferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

describe("Dota explicit loading without losing a review", () => {
  it("keeps the current decision through a failed read, with no automatic retry", async () => {
    const current = { matchId: 1, hero: "Slardar", observations: { alliesReady: "no" } };
    let displayed = current;
    const request = deferred<typeof current>();
    const read = vi.fn(() => request.promise);
    const state = vi.fn();
    const loader = new DotaMatchLoader({ read, apply: value => { displayed = value; }, state });
    const pending = loader.run(2);
    expect(displayed).toBe(current);
    await loader.run(2);
    expect(read).toHaveBeenCalledTimes(1);
    request.reject(new Error("provider-unavailable"));
    await pending;
    expect(displayed).toBe(current);
    expect(displayed.observations.alliesReady).toBe("no");
    expect(loader.busy).toBe(false);
    expect(state.mock.calls.map(call => call[0])).toEqual(["loading", "error"]);
    expect(read).toHaveBeenCalledTimes(1);
  });

  it("cancels immediately and ignores a late response after the next request succeeds", async () => {
    const first = deferred<number>();
    const second = deferred<number>();
    let oldSignal: AbortSignal | undefined;
    const read = vi.fn((_id, signal) => { oldSignal ??= signal; return read.mock.calls.length === 1 ? first.promise : second.promise; });
    const apply = vi.fn();
    const state = vi.fn();
    const loader = new DotaMatchLoader({ read, apply, state });
    const stale = loader.run(1);
    loader.cancel();
    expect(oldSignal?.aborted).toBe(true);
    expect(loader.busy).toBe(false);
    const current = loader.run(2);
    second.resolve(2);
    await current;
    first.resolve(1); // Provider ignores the aborted signal.
    await stale;
    expect(apply.mock.calls).toEqual([[2]]);
    expect(state.mock.calls.map(call => [call[0], call[1]])).toEqual([["loading", 1], ["stopped", 1], ["loading", 2], ["ready", 2]]);
  });

  it("does not let an old failure reset controls for a newer in-flight read", async () => {
    const a = deferred<number>();
    const b = deferred<number>();
    const state = vi.fn();
    const loader = new DotaMatchLoader({ read: id => id === 1 ? a.promise : b.promise, apply: vi.fn(), state });
    const first = loader.run(1);
    loader.cancel(false);
    const second = loader.run(2);
    a.reject(new Error("timeout"));
    await first;
    expect(loader.busy).toBe(true);
    expect(state.mock.calls.map(call => call[0])).toEqual(["loading", "loading"]);
    b.resolve(2);
    await second;
    expect(loader.busy).toBe(false);
  });

  it("reports a rejected replacement without claiming that loading succeeded", async () => {
    const state = vi.fn();
    const loader = new DotaMatchLoader({ read: async () => ({ purchases: [] }), apply: () => { throw new Error("stale"); }, state });
    await loader.run(1);
    expect(loader.busy).toBe(false);
    expect(state.mock.calls.map(call => call[0])).toEqual(["loading", "error"]);
    expect(state).toHaveBeenLastCalledWith("error", 1, expect.objectContaining({ message: "stale" }));
  });
});

describe("Dota relay failures", () => {
  it.each([
    [404, {}, "not-found"], [429, {}, "rate-limit"], [504, {}, "timeout"],
    [502, { code: "upstream_failed" }, "provider-unavailable"],
    [502, { code: "upstream_unreachable" }, "provider-unavailable"],
    [502, { code: "malformed_upstream" }, "malformed"],
    [403, { code: "provider_restricted" }, "provider-restricted"],
    [403, { code: "origin_not_allowed" }, "request-failed"],
    [502, { code: "<script>untrusted</script>" }, "request-failed"]
  ])("classifies %s without relaying arbitrary provider text", async (status, payload, expected) => {
    expect(await dotaResponseFailure(Response.json(payload, { status }))).toBe(expected);
  });
  it("handles a non-JSON deployment error without mislabeling the match as missing", async () => {
    expect(await dotaResponseFailure(new Response("gateway unavailable", { status: 502 }))).toBe("request-failed");
  });
});
