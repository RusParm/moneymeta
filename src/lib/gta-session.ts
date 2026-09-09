/** Exact cash comparison for sequential blocks of player-observed, complete cycles.
 * No production, interleaving, automatic cooldown or residual-time income model.
 */
export const GTA_SESSION_MAX_MINUTES = 240;
export const GTA_SESSION_KINDS = ["ready-sale", "mission", "contract", "other"] as const;
export type GtaSessionKind = typeof GTA_SESSION_KINDS[number];
export interface GtaSessionSource {
  kind: GtaSessionKind;
  available: boolean;
  cashPerRun: number;
  minutesPerRun: number;
  entryMinutes: number;
  maxRuns: number;
}
export interface GtaSessionInput { minutesAvailable: number; sources: GtaSessionSource[]; }
export interface GtaSessionBlock {
  sourceIndex: number;
  runs: number;
  entryMinutes: number;
  cycleMinutes: number;
  totalMinutes: number;
  cash: number;
}
export interface GtaSessionOption {
  cash: number;
  usedMinutes: number;
  unusedMinutes: number;
  counts: number[];
  blocks: GtaSessionBlock[];
}
export interface GtaSessionResult {
  best: GtaSessionOption;
  solo: GtaSessionOption;
  gainOverSolo: number;
  status: "mixed" | "single" | "no-positive-fit";
}
const integer = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= max;

export function validGtaSessionInput(value: unknown): value is GtaSessionInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const input = value as GtaSessionInput;
  return integer(input.minutesAvailable, 0, GTA_SESSION_MAX_MINUTES)
    && Array.isArray(input.sources) && input.sources.length >= 1 && input.sources.length <= 4
    && input.sources.every((source) => source && typeof source === "object"
      && GTA_SESSION_KINDS.includes(source.kind) && typeof source.available === "boolean"
      && integer(source.cashPerRun, -1_000_000_000, 1_000_000_000)
      && integer(source.minutesPerRun, 1, GTA_SESSION_MAX_MINUTES)
      && integer(source.entryMinutes, 0, GTA_SESSION_MAX_MINUTES)
      && integer(source.maxRuns, 0, source.kind === "ready-sale" ? 1 : GTA_SESSION_MAX_MINUTES));
}

interface State { cash: number; counts: number[]; blocks: number; }
const betterAtSameTime = (candidate: State, current: State | undefined) => !current
  || candidate.cash > current.cash || (candidate.cash === current.cash && candidate.blocks < current.blocks);

function option(input: GtaSessionInput, counts: number[]): GtaSessionOption {
  const blocks = counts.flatMap((runs, sourceIndex) => {
    if (!runs) return [];
    const source = input.sources[sourceIndex]!;
    const cycleMinutes = runs * source.minutesPerRun;
    return [{ sourceIndex, runs, entryMinutes: source.entryMinutes, cycleMinutes,
      totalMinutes: source.entryMinutes + cycleMinutes, cash: runs * source.cashPerRun }];
  });
  const usedMinutes = blocks.reduce((sum, block) => sum + block.totalMinutes, 0);
  return { cash: blocks.reduce((sum, block) => sum + block.cash, 0), usedMinutes,
    unusedMinutes: input.minutesAvailable - usedMinutes, counts: [...counts], blocks };
}

function betterOption(candidate: GtaSessionOption, current: GtaSessionOption) {
  return candidate.cash > current.cash || (candidate.cash === current.cash
    && (candidate.usedMinutes < current.usedMinutes || (candidate.usedMinutes === current.usedMinutes
      && candidate.blocks.length < current.blocks.length)));
}

export function calculateGtaSession(input: GtaSessionInput): GtaSessionResult | null {
  if (!validGtaSessionInput(input)) return null;
  const horizon = input.minutesAvailable;
  let states: Array<State | undefined> = Array.from({ length: horizon + 1 });
  states[0] = { cash: 0, counts: [], blocks: 0 };
  for (const source of input.sources) {
    const next: Array<State | undefined> = Array.from({ length: horizon + 1 });
    for (let elapsed = 0; elapsed <= horizon; elapsed += 1) {
      const previous = states[elapsed];
      if (!previous) continue;
      const skip = { ...previous, counts: [...previous.counts, 0] };
      if (betterAtSameTime(skip, next[elapsed])) next[elapsed] = skip;
      if (!source.available || source.cashPerRun <= 0) continue;
      const limit = Math.min(source.maxRuns, Math.floor((horizon - elapsed - source.entryMinutes) / source.minutesPerRun));
      for (let runs = 1; runs <= limit; runs += 1) {
        const minutes = elapsed + source.entryMinutes + runs * source.minutesPerRun;
        const candidate = { cash: previous.cash + runs * source.cashPerRun,
          counts: [...previous.counts, runs], blocks: previous.blocks + 1 };
        if (betterAtSameTime(candidate, next[minutes])) next[minutes] = candidate;
      }
    }
    states = next;
  }
  const empty = option(input, input.sources.map(() => 0));
  let best = empty;
  for (const state of states) {
    if (!state) continue;
    const candidate = option(input, state.counts);
    if (betterOption(candidate, best)) best = candidate;
  }
  let solo = empty;
  input.sources.forEach((source, index) => {
    if (!source.available || source.cashPerRun <= 0) return;
    const runs = Math.max(0, Math.min(source.maxRuns, Math.floor((horizon - source.entryMinutes) / source.minutesPerRun)));
    const candidate = option(input, input.sources.map((_, i) => i === index ? runs : 0));
    if (betterOption(candidate, solo)) solo = candidate;
  });
  return { best, solo, gainOverSolo: best.cash - solo.cash,
    status: best.blocks.length > 1 ? "mixed" : best.blocks.length === 1 ? "single" : "no-positive-fit" };
}
