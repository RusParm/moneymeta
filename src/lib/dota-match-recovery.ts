import { createDotaMatchGoldSeries, hasDotaMatchTimeline, type DotaMatch } from "./dota-match";

/** Match totals are immutable; a cached thin response cannot erase replay evidence. */
export function canReplaceDotaMatch(current: DotaMatch, next: DotaMatch) {
  return current.matchId === next.matchId && current.players.length === next.players.length && current.players.every((player) => {
    const replacement = next.players.find((candidate) => candidate.playerSlot === player.playerSlot && candidate.heroId === player.heroId);
    return replacement && createDotaMatchGoldSeries(replacement).length >= createDotaMatchGoldSeries(player).length
      && replacement.purchases.length >= player.purchases.length;
  });
}

export type DotaRecoveryState = "requesting" | "waiting" | "checking" | "ready" | "pending" | "stopped" | "error";
interface RecoveryOptions {
  request: (matchId: number, signal: AbortSignal) => Promise<void>;
  read: (matchId: number, signal: AbortSignal) => Promise<DotaMatch>;
  apply: (match: DotaMatch) => void;
  state: (state: DotaRecoveryState, error?: unknown) => void;
  delays?: readonly number[];
}

/** Bounded reads after one deliberate submission. Never retries a provider write. */
export class DotaMatchRecovery {
  private controller: AbortController | null = null;
  private requested = new Set<number>();
  private options: RecoveryOptions;

  constructor(options: RecoveryOptions) { this.options = options; }
  wasRequested(matchId: number) { return this.requested.has(matchId); }
  get busy() { return this.controller !== null; }

  cancel(notify = true) {
    const active = this.controller;
    this.controller = null;
    active?.abort();
    if (active && notify) this.options.state("stopped");
  }

  async run(matchId: number, submit = false) {
    if (this.busy) return;
    const controller = new AbortController();
    this.controller = controller;
    const active = () => this.controller === controller && !controller.signal.aborted;
    try {
      if (submit && !this.requested.has(matchId)) {
        // An ambiguous timeout must not automatically duplicate the remote job.
        this.requested.add(matchId);
        this.options.state("requesting");
        await this.options.request(matchId, controller.signal);
        if (!active()) return;
      }
      const delays = submit ? (this.options.delays ?? [15_000, 20_000, 30_000]) : [0];
      for (const delay of delays) {
        if (delay > 0) {
          this.options.state("waiting");
          await new Promise<void>((resolve) => {
            const done = () => { clearTimeout(timer); controller.signal.removeEventListener("abort", done); resolve(); };
            const timer = setTimeout(done, delay);
            controller.signal.addEventListener("abort", done, { once: true });
          });
        }
        if (!active()) return;
        this.options.state("checking");
        const match = await this.options.read(matchId, controller.signal);
        if (!active()) return;
        if (match.matchId !== matchId) throw new Error("mismatch");
        this.options.apply(match);
        if (match.players.length === 10 && match.players.every(hasDotaMatchTimeline)) {
          this.controller = null;
          this.options.state("ready");
          return;
        }
      }
      if (active()) { this.controller = null; this.options.state("pending"); }
    } catch (error) {
      if (active()) { this.controller = null; this.options.state("error", error); }
    } finally {
      if (this.controller === controller) this.controller = null;
    }
  }
}
