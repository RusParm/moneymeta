import type { DotaDraftFinding, DotaDraftPurchaseEvent, DotaDraftReview } from "./dota-draft";
import type { DotaEconomicWindow, DotaMatchItemPurchase } from "./dota-match";

/** A bounded search for nearby observations, not a reconstructed inventory. */
export const dotaEpisodeLookbackMinutes = 3;

export interface DotaEpisodeTeamContext {
  before: DotaDraftPurchaseEvent[];
  during: DotaDraftPurchaseEvent[];
  condition: DotaDraftFinding | null;
}

export interface DotaEpisodeContext {
  startMinute: number;
  endMinute: number;
  lookbackStartMinute: number;
  status: DotaDraftReview["status"];
  patchFamily: string;
  checkedAt: string;
  purchaseLogHeroCount: number;
  totalHeroCount: number;
  uncoveredHeroIds: number[];
  own: DotaEpisodeTeamContext;
  enemy: DotaEpisodeTeamContext;
}

/** Connect existing, version-gated draft evidence to an observed economic window.
 * Purchases before the start are kept separate from those inside the episode.
 * A matching condition is a question to verify, never evidence it was executed.
 * No future purchases, match outcome or final inventory enter this view.
 */
export function buildDotaEpisodeContext(
  draft: DotaDraftReview,
  window: Pick<DotaEconomicWindow, "startMinute" | "endMinute"> | null,
): DotaEpisodeContext | null {
  if (!window || !Number.isFinite(window.startMinute) || !Number.isFinite(window.endMinute)
    || window.startMinute < 0 || window.endMinute <= window.startMinute) return null;

  const { startMinute, endMinute } = window;
  const lookbackStartMinute = Math.max(0, startMinute - dotaEpisodeLookbackMinutes);
  const mechanicsAvailable = draft.status === "ready" || draft.status === "partial";
  const purchases = draft.status === "unavailable" ? [] : draft.purchases
    .filter((event) => Number.isFinite(event.minute) && event.minute >= lookbackStartMinute && event.minute <= endMinute)
    .slice().sort((a, b) => a.minute - b.minute || a.heroId - b.heroId || a.key.localeCompare(b.key));

  const team = (isOwnTeam: boolean, findings: DotaDraftFinding[]): DotaEpisodeTeamContext => {
    const events = purchases.filter((event) => event.isOwnTeam === isOwnTeam);
    const before = events.filter((event) => event.minute < startMinute);
    const during = events.filter((event) => event.minute >= startMinute);
    // Prefer a condition involving an in-episode purchaser. Editorial rule order
    // breaks ties; it does not rank the team's strength or explain the gold gap.
    const matching = (observations: DotaDraftPurchaseEvent[]) => findings.find((finding) =>
      finding.heroIds.some((heroId) => observations.some((event) => event.heroId === heroId)));
    return { before, during, condition: mechanicsAvailable ? matching(during) ?? matching(before) ?? null : null };
  };

  return {
    startMinute, endMinute, lookbackStartMinute,
    status: draft.status, patchFamily: draft.patchFamily, checkedAt: draft.checkedAt,
    purchaseLogHeroCount: draft.purchaseLogHeroCount,
    totalHeroCount: draft.ownHeroIds.length + draft.enemyHeroIds.length,
    uncoveredHeroIds: [...draft.uncoveredHeroIds],
    own: team(true, draft.opportunities), enemy: team(false, draft.threats),
  };
}

/** Preserve observed major items outside the reviewed strategic subset. */
export function selectDotaEpisodeOtherPurchases(
  context: DotaEpisodeContext | null,
  playerHeroId: number,
  purchases: DotaMatchItemPurchase[],
): DotaMatchItemPurchase[] {
  if (!context) return [];
  return purchases.filter((purchase) => Number.isFinite(purchase.minute)
    && purchase.minute >= context.startMinute && purchase.minute <= context.endMinute
    && !context.own.during.some((event) => event.heroId === playerHeroId && event.key === purchase.key));
}
