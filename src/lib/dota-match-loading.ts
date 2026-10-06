/** One deliberate read at a time. A failed or cancelled read never replaces the
 * displayed analysis, and an old response cannot win a later request's race. */
export class DotaMatchLoader<T> {
  private controller: AbortController | null = null;
  private matchId: number | null = null;
  constructor(private options: {
    read: (matchId: number, signal: AbortSignal) => Promise<T>;
    apply: (value: T) => void;
    state: (state: "loading" | "ready" | "error" | "stopped", matchId: number, error?: unknown) => void;
  }) {}
  get busy() { return this.controller !== null; }
  cancel(notify = true) {
    const controller = this.controller;
    const matchId = this.matchId;
    this.controller = null;
    this.matchId = null;
    controller?.abort();
    if (controller && matchId !== null && notify) this.options.state("stopped", matchId);
  }
  async run(matchId: number) {
    if (this.busy) return;
    const controller = new AbortController();
    this.controller = controller;
    this.matchId = matchId;
    const active = () => this.controller === controller && !controller.signal.aborted;
    try {
      this.options.state("loading", matchId);
      const value = await this.options.read(matchId, controller.signal);
      if (!active()) return;
      this.options.apply(value);
      this.controller = null;
      this.matchId = null;
      this.options.state("ready", matchId);
    } catch (error) {
      if (!active()) return;
      this.controller = null;
      this.matchId = null;
      this.options.state("error", matchId, error);
    } finally {
      if (this.controller === controller) { this.controller = null; this.matchId = null; }
    }
  }
}

/** Only allowlisted relay codes become user-facing categories. Upstream HTML,
 * arbitrary error messages and identifiers are never copied to the page. */
export async function dotaResponseFailure(response: Response): Promise<string> {
  if (response.status === 404) return "not-found";
  if (response.status === 429) return "rate-limit";
  if (response.status === 504) return "timeout";
  let code: unknown;
  try { code = (await response.json())?.code; } catch { /* Non-JSON deployment or gateway error. */ }
  if (code === "malformed_upstream") return "malformed";
  if (code === "upstream_timeout") return "timeout";
  if (code === "upstream_failed" || code === "upstream_unreachable") return "provider-unavailable";
  if (code === "provider_restricted") return "provider-restricted";
  return "request-failed";
}
