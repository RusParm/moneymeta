import { describe, expect, it } from "vitest";
import { isExpired, isOlderThanDays } from "../src/lib/freshness";

describe("freshness guards", () => {
  it("keeps a dated event current through the end of its UTC day", () => {
    expect(isExpired("2026-08-12", new Date("2026-08-12T23:59:59Z"))).toBe(false);
    expect(isExpired("2026-08-12", new Date("2026-08-13T00:00:00Z"))).toBe(true);
  });

  it("removes current status when the review window ends", () => {
    expect(isOlderThanDays("2026-08-12", 30, new Date("2026-09-10T23:59:59Z"))).toBe(false);
    expect(isOlderThanDays("2026-08-12", 30, new Date("2026-09-11T00:00:00Z"))).toBe(true);
  });

  it("fails closed when freshness metadata is invalid", () => {
    expect(isExpired("12 August 2026", new Date("2026-08-12T00:00:00Z"))).toBe(true);
    expect(isOlderThanDays("invalid", 30, new Date("2026-08-12T00:00:00Z"))).toBe(true);
    expect(isOlderThanDays("2026-08-12", -1, new Date("2026-08-12T00:00:00Z"))).toBe(true);
  });
});

