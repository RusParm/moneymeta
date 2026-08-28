import { describe, expect, it } from "vitest";
import { isExpired, isOlderThanDays, isOlderThanHours, needsRefresh } from "../src/lib/freshness";

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
    expect(isExpired("2026-02-31", new Date("2026-02-01T00:00:00Z"))).toBe(true);
    expect(isOlderThanDays("2026-08-13", 30, new Date("2026-08-12T00:00:00Z"))).toBe(true);
    expect(isExpired("2026-08-12", new Date("invalid"))).toBe(true);
  });

  it("ages snapshots at the exact collection time rather than at UTC midnight", () => {
    expect(isOlderThanHours("2026-08-20T16:30:00Z", 48, new Date("2026-08-22T16:29:59Z"))).toBe(false);
    expect(isOlderThanHours("2026-08-20T16:30:00Z", 48, new Date("2026-08-22T16:30:00Z"))).toBe(true);
    expect(isOlderThanHours("invalid", 48)).toBe(true);
    expect(isOlderThanHours("2026-08-23T00:00:00Z", 48, new Date("2026-08-22T00:00:00Z"))).toBe(true);
  });

  it("shares one expiration decision between hub, homepage and data labels", () => {
    const now = new Date("2026-08-28T00:00:00Z");
    expect(needsRefresh({ checkedAt: "2026-08-19", validThrough: "2026-08-26" }, now)).toBe(true);
    expect(needsRefresh({ checkedAt: "2026-08-19", staleAfterDays: 30 }, now)).toBe(false);
    expect(needsRefresh({ checkedAt: "2026-08-20T12:00:00Z", maxAgeHours: 48 }, now)).toBe(true);
    expect(needsRefresh({ checkedAt: "2026-08-19" }, now)).toBe(true);
  });
});
