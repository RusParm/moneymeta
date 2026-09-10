import { describe, expect, it } from "vitest";
import { calculateGtaSession, calculateGtaSessionTimeTradeoffs, validGtaSessionInput, type GtaSessionInput, type GtaSessionSource } from "../src/lib/gta-session";

const sale: GtaSessionSource = { kind: "ready-sale", available: true, cashPerRun: 200000, minutesPerRun: 35, entryMinutes: 5, maxRuns: 1 };
const mission: GtaSessionSource = { kind: "mission", available: true, cashPerRun: 140000, minutesPerRun: 25, entryMinutes: 5, maxRuns: 4 };
const plan = (minutesAvailable: number, sources = [sale, mission]) => calculateGtaSession({ minutesAvailable, sources })!;

describe("GTA session time choices", () => {
  it("finds the first higher-cash combination, including replacement of activities", () => {
    const result = calculateGtaSessionTimeTradeoffs({ minutesAvailable: 60, sources: [sale, mission] })!;
    expect(result).toMatchObject({ finishAt: 55, freeMinutes: 5, cash: 280000,
      next: { minutes: 70, extraMinutes: 10, extraCash: 60000, plan: { counts: [1, 1], cash: 340000, unusedMinutes: 0 } } });
    expect(plan(69).best.cash).toBe(280000);
    expect(plan(54).best.cash).toBeLessThan(result.cash);
  });

  it("does not interpolate cash while the next complete run is unfinished", () => {
    expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: 29, sources: [mission] })).toMatchObject({
      finishAt: 0, freeMinutes: 29, cash: 0, next: { minutes: 30, extraMinutes: 1, extraCash: 140000 },
    });
    expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: 75, sources: [sale, mission] })).toMatchObject({
      finishAt: 70, freeMinutes: 5, next: { minutes: 80, extraMinutes: 5, extraCash: 80000, plan: { counts: [0, 3] } },
    });
  });

  it("respects one stock sale, availability, repeat limits and the 240-minute bound", () => {
    for (const sources of [[sale], [{ ...mission, maxRuns: 2 }], [{ ...mission, available: false }], [{ ...mission, cashPerRun: -1 }]]) {
      expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: 100, sources })?.next).toBeNull();
    }
    expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: 239, sources: [{ ...mission, minutesPerRun: 240, entryMinutes: 0, maxRuns: 1 }] })?.next?.minutes).toBe(240);
    expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: 239, sources: [{ ...mission, minutesPerRun: 240, entryMinutes: 1, maxRuns: 1 }] })?.next).toBeNull();
    expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: 240, sources: [sale, mission] })?.next).toBeNull();
    expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: NaN, sources: [mission] })).toBeNull();
    expect(calculateGtaSessionTimeTradeoffs({ minutesAvailable: 60, sources: [{ ...sale, maxRuns: 2 }] })).toBeNull();
  });

  it("keeps both thresholds independent of source ordering", () => {
    const a = calculateGtaSessionTimeTradeoffs({ minutesAvailable: 60, sources: [sale, mission] })!;
    const b = calculateGtaSessionTimeTradeoffs({ minutesAvailable: 60, sources: [mission, sale] })!;
    expect([b.finishAt, b.cash, b.next?.minutes, b.next?.extraCash]).toEqual([a.finishAt, a.cash, a.next?.minutes, a.next?.extraCash]);
    expect(b.next?.plan.counts).toEqual([...a.next!.plan.counts].reverse());
  });

  it("matches an independent enumeration of all permitted combinations", () => {
    let seed = 917;
    const next = (limit: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % limit; };
    for (let trial = 0; trial < 40; trial += 1) {
      const input: GtaSessionInput = { minutesAvailable: next(100), sources: Array.from({ length: 1 + next(4) }, () => ({
        kind: "mission", available: next(4) !== 0, cashPerRun: next(100) - 10, minutesPerRun: 1 + next(45), entryMinutes: next(10), maxRuns: next(4),
      })) };
      const combinations: Array<{ cash: number; minutes: number }> = [];
      const enumerate = (index: number, cash: number, minutes: number) => {
        if (minutes > 240) return;
        if (index === input.sources.length) { combinations.push({ cash, minutes }); return; }
        const source = input.sources[index]!;
        for (let runs = 0; runs <= (source.available ? source.maxRuns : 0); runs += 1) {
          enumerate(index + 1, cash + runs * source.cashPerRun, minutes + (runs ? source.entryMinutes + runs * source.minutesPerRun : 0));
        }
      };
      enumerate(0, 0, 0);
      const cash = Math.max(...combinations.filter(c => c.minutes <= input.minutesAvailable).map(c => c.cash));
      const finishAt = Math.min(...combinations.filter(c => c.cash === cash && c.minutes <= input.minutesAvailable).map(c => c.minutes));
      const higher = combinations.filter(c => c.cash > cash);
      const boundary = Math.min(...higher.map(c => c.minutes));
      const result = calculateGtaSessionTimeTradeoffs(input)!;
      expect([result.cash, result.finishAt, result.freeMinutes]).toEqual([cash, finishAt, input.minutesAvailable - finishAt]);
      if (!higher.length) expect(result.next).toBeNull();
      else {
        const nextCash = Math.max(...higher.filter(c => c.minutes === boundary).map(c => c.cash));
        expect(result.next).toMatchObject({ minutes: boundary, extraMinutes: boundary - input.minutesAvailable,
          extraCash: nextCash - cash, plan: { cash: nextCash, usedMinutes: boundary, unusedMinutes: 0 } });
      }
    }
  });
});

describe("GTA complete-cycle session selection", () => {
  it("changes the decision when a ready sale and a mission fit together", () => {
    const short = plan(60);
    expect(short.best.counts).toEqual([0, 2]);
    expect(short.best.cash).toBe(280000);
    expect(short.best.usedMinutes).toBe(55);
    expect(short.best.unusedMinutes).toBe(5);
    expect(short.status).toBe("single");
    const longer = plan(75);
    expect(longer.best.counts).toEqual([1, 1]);
    expect(longer.best.cash).toBe(340000);
    expect(longer.best.usedMinutes).toBe(70);
    expect(longer.solo.cash).toBe(280000);
    expect(longer.gainOverSolo).toBe(60000);
    expect(longer.status).toBe("mixed");
  });

  it("requires a whole cycle including entry and counts entry only once", () => {
    expect(plan(29, [mission]).best.cash).toBe(0);
    expect(plan(30, [mission]).best.cash).toBe(140000);
    expect(plan(55, [mission]).best.cash).toBe(280000);
    expect(plan(54, [mission]).best.cash).toBe(140000);
    expect(plan(55, [mission]).best.blocks[0]).toMatchObject({ entryMinutes: 5, cycleMinutes: 50, totalMinutes: 55 });
  });

  it("charges entry separately for every used source without overlapping blocks", () => {
    expect(plan(69).best.counts).toEqual([0, 2]);
    expect(plan(70).best.counts).toEqual([1, 1]);
    const result = plan(70);
    expect(result.best.blocks.reduce((sum, block) => sum + block.totalMinutes, 0)).toBe(70);
  });

  it("never invents another stock sale, unavailable access or repeat limit", () => {
    expect(plan(240, [sale]).best.counts).toEqual([1]);
    expect(plan(240, [{ ...sale, available: false }, { ...mission, maxRuns: 2 }]).best.counts).toEqual([0, 2]);
    expect(plan(240, [{ ...mission, maxRuns: 0 }]).best.cash).toBe(0);
    expect(calculateGtaSession({ minutesAvailable: 240, sources: [{ ...sale, maxRuns: 2 }] })).toBeNull();
  });

  it("leaves unused time unpaid and prefers doing nothing to a nonpositive cycle", () => {
    const result = plan(240, [{ ...mission, maxRuns: 1 }]);
    expect(result.best.cash).toBe(140000);
    expect(result.best.unusedMinutes).toBe(210);
    for (const cashPerRun of [0, -10]) {
      expect(plan(240, [{ ...mission, cashPerRun }])).toMatchObject({ status: "no-positive-fit", gainOverSolo: 0,
        best: { cash: 0, usedMinutes: 0, unusedMinutes: 240, blocks: [] } });
    }
    expect(plan(0).best.unusedMinutes).toBe(0);
  });

  it("prefers less time for equal cash, then fewer separate blocks", () => {
    const long = { ...mission, cashPerRun: 100, minutesPerRun: 20, entryMinutes: 0, maxRuns: 1 };
    const short = { ...long, minutesPerRun: 10 };
    expect(plan(20, [long, short]).best.counts).toEqual([0, 1]);
    const whole = { ...long, cashPerRun: 200 };
    expect(plan(20, [short, short, whole]).best.counts).toEqual([0, 0, 1]);
  });

  it("may choose a mixture for equal cash when it saves time", () => {
    const two = { ...mission, cashPerRun: 100, minutesPerRun: 10, entryMinutes: 0, maxRuns: 1 };
    const solo = { ...two, cashPerRun: 200, minutesPerRun: 30 };
    const result = plan(30, [two, two, solo]);
    expect(result.best.counts).toEqual([1, 1, 0]);
    expect(result.gainOverSolo).toBe(0);
    expect(result.best.usedMinutes).toBe(20);
    expect(result.solo.usedMinutes).toBe(30);
  });

  it("keeps an equal result independent of source order", () => {
    const forward = plan(75);
    const reverse = plan(75, [mission, sale]);
    expect(reverse.best.cash).toBe(forward.best.cash);
    expect(reverse.best.usedMinutes).toBe(forward.best.usedMinutes);
    expect(reverse.best.counts).toEqual([...forward.best.counts].reverse());
  });

  it("rejects invalid counts, fractional time and unbounded cash before searching", () => {
    for (const minutesAvailable of [NaN, Infinity, -1, .5, 241]) expect(calculateGtaSession({ minutesAvailable, sources: [mission] })).toBeNull();
    for (const source of [
      { ...mission, minutesPerRun: 0 }, { ...mission, minutesPerRun: 1.5 }, { ...mission, entryMinutes: -1 },
      { ...mission, maxRuns: 1.5 }, { ...mission, cashPerRun: NaN }, { ...mission, cashPerRun: 1e9 + 1 },
      { ...mission, kind: "unknown" }, { ...mission, available: 1 }
    ]) expect(validGtaSessionInput({ minutesAvailable: 60, sources: [source] })).toBe(false);
    expect(validGtaSessionInput({ minutesAvailable: 60, sources: [] })).toBe(false);
    expect(validGtaSessionInput({ minutesAvailable: 60, sources: Array(5).fill(mission) })).toBe(false);
  });

  it("matches full enumeration for small varied inputs and preserves the budget", () => {
    let seed = 78123;
    const next = (limit: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % limit; };
    for (let trial = 0; trial < 100; trial += 1) {
      const input: GtaSessionInput = { minutesAvailable: next(35), sources: Array.from({ length: 1 + next(4) }, () => ({
        kind: "mission", available: next(4) !== 0, cashPerRun: next(20) - 3, minutesPerRun: 1 + next(10), entryMinutes: next(5), maxRuns: next(4)
      })) };
      let reference = { cash: 0, minutes: 0, blocks: 0 };
      const enumerate = (index: number, cash: number, minutes: number, blocks: number) => {
        if (minutes > input.minutesAvailable) return;
        if (index === input.sources.length) {
          if (cash > reference.cash || (cash === reference.cash && (minutes < reference.minutes || (minutes === reference.minutes && blocks < reference.blocks)))) reference = { cash, minutes, blocks };
          return;
        }
        const source = input.sources[index]!;
        for (let runs = 0; runs <= (source.available ? source.maxRuns : 0); runs += 1) enumerate(index + 1, cash + runs * source.cashPerRun,
          minutes + (runs ? source.entryMinutes + runs * source.minutesPerRun : 0), blocks + (runs ? 1 : 0));
      };
      enumerate(0, 0, 0, 0);
      const result = calculateGtaSession(input)!;
      expect({ cash: result.best.cash, minutes: result.best.usedMinutes, blocks: result.best.blocks.length }).toEqual(reference);
      expect(result.best.usedMinutes + result.best.unusedMinutes).toBe(input.minutesAvailable);
      expect(result.best.cash).toBeGreaterThanOrEqual(result.solo.cash);
      expect(result.best.blocks.every((block) => block.runs <= input.sources[block.sourceIndex]!.maxRuns)).toBe(true);
    }
  });
});
