import { getDotaReplayDecisionCopy } from "../data/dota-replay-decision-copy";
import { dotaDraftHeroProfiles, dotaDraftProfileSnapshot } from "../data/dota-draft-profiles";
import type { DotaDraftPurchaseEvent } from "./dota-draft";
import { dotaEpisodeLookbackMinutes, type DotaEpisodeContext } from "./dota-episode-context";

type Language = "ru" | "en";
type Copy = { ru: string; en: string };
export type DotaReplayDecisionObservationKey = "itemReady" | "alliesReady" | "threatState" | "targetVisible";
export type DotaReplayDecisionAnswer = "yes" | "no" | "unknown";
export interface DotaReplayDecisionObservations {
  itemReady: DotaReplayDecisionAnswer;
  alliesReady: DotaReplayDecisionAnswer;
  threatState: "ready" | "answered" | "unknown";
  targetVisible: DotaReplayDecisionAnswer;
}
export interface DotaReplayDecisionThreat {
  heroId: number;
  ability: string;
  mechanic: Copy;
  sourceUrl: string;
}
export interface DotaReplayDecision {
  id: string;
  kind: "bkb" | "blink";
  heroId: number;
  itemKey: "black_king_bar" | "blink";
  itemTitle: Copy;
  purchaseMinute: number;
  purchaseClock: string;
  phase: "before" | "during";
  startMinute: number;
  endMinute: number;
  threats: DotaReplayDecisionThreat[];
  patchFamily: string;
  checkedAt: string;
  sourceUrls: string[];
  partialCoverage: boolean;
  purchaseLogHeroCount: number;
  totalHeroCount: number;
}
export interface DotaReplayDecisionAlternative {
  id: "enter" | "prepare";
  title: string;
  condition: string;
  tradeoff: string;
  status: "unverified" | "blocked" | "conditional";
  reason: string;
}
export interface DotaReplayDecisionEvaluation {
  status: "needs-observations" | "conditional";
  summary: string;
  unknownFields: DotaReplayDecisionObservationKey[];
  alternatives: [DotaReplayDecisionAlternative, DotaReplayDecisionAlternative];
  nextMatchTask: string;
  taskFocus: "verify" | "item" | "allies" | "threat" | "vision" | "preserve";
  limitations: string[];
}

const profiles = new Map(dotaDraftHeroProfiles.map((profile) => [profile.heroId, profile]));
const unique = <T>(values: T[]): T[] => [...new Set(values)];
const clock = (minute: number): string => {
  const seconds = Math.round(minute * 60);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

export const initialDotaReplayDecisionObservations = (): DotaReplayDecisionObservations => ({
  itemReady: "unknown", alliesReady: "unknown", threatState: "unknown", targetVisible: "unknown",
});

/** A verified upstream BKB context names opponents. Recheck the exact named
 * ability against the existing reviewed trait instead of inventing a new trait.
 * Episode context has no full lineup: do not infer side from absent purchases.
 */
function reviewedThreats(event: DotaDraftPurchaseEvent, ownPurchasers: Set<number>): DotaReplayDecisionThreat[] {
  const seen = new Set<string>();
  return (event.context?.abilities ?? []).flatMap((named) => {
    if (!event.context?.heroIds.includes(named.heroId) || named.heroId === event.heroId || ownPurchasers.has(named.heroId)) return [];
    const profile = profiles.get(named.heroId);
    const mechanic = profile?.evidence.find((entry) => entry.trait === "immunityControl" && entry.ability === named.ability);
    const key = `${named.heroId}:${named.ability}`;
    if (!profile || !mechanic || seen.has(key)) return [];
    seen.add(key);
    return [{ heroId: named.heroId, ability: named.ability, mechanic: { ...mechanic.text }, sourceUrl: profile.sourceUrl }];
  }).sort((a, b) => a.heroId - b.heroId || a.ability.localeCompare(b.ability));
}

/** One bounded case for the selected hero, never an inferred decision timestamp.
 * No match result, final inventory, hero role or economic outcome is consumed.
 * The caller must rebuild on match, hero, episode or language changes.
 */
export function buildDotaReplayDecision(context: DotaEpisodeContext | null, selectedHeroId: number): DotaReplayDecision | null {
  if (!context || !["ready", "partial"].includes(context.status)
    || context.patchFamily !== dotaDraftProfileSnapshot.patchLabel
    || !Number.isInteger(selectedHeroId) || selectedHeroId <= 0
    || !Number.isFinite(context.startMinute) || !Number.isFinite(context.endMinute)
    || context.startMinute < 0 || context.endMinute <= context.startMinute) return null;
  const earliest = Math.max(0, context.startMinute - dotaEpisodeLookbackMinutes);
  const ownEvents = [...context.own.before, ...context.own.during].filter((event) => event.isOwnTeam);
  const enemyEvents = [...context.enemy.before, ...context.enemy.during];
  // An event copied to the wrong side cannot establish selected-hero eligibility.
  if (enemyEvents.some((event) => event.heroId === selectedHeroId)) return null;
  const ownPurchasers = new Set(ownEvents.map((event) => event.heroId));
  const candidates = ownEvents.filter((event) => event.heroId === selectedHeroId
    && (event.key === "black_king_bar" || event.key === "blink")
    && Number.isFinite(event.minute) && event.minute >= earliest && event.minute <= context.endMinute)
    .map((event) => ({ event, threats: event.key === "black_king_bar" ? reviewedThreats(event, ownPurchasers) : [] }))
    .filter(({ event, threats }) => event.key === "blink" || threats.length > 0)
    .sort((a, b) => Number(b.event.key === "black_king_bar") - Number(a.event.key === "black_king_bar")
      || a.event.minute - b.event.minute);
  const chosen = candidates[0];
  if (!chosen) return null;
  const { event, threats } = chosen;
  const itemKey = event.key as DotaReplayDecision["itemKey"];
  return {
    id: ["replay-decision-v1", selectedHeroId, itemKey, event.minute, context.startMinute, context.endMinute, context.patchFamily].join(":"),
    kind: itemKey === "black_king_bar" ? "bkb" : "blink",
    heroId: selectedHeroId, itemKey, itemTitle: { ...event.title },
    purchaseMinute: event.minute, purchaseClock: clock(event.minute),
    phase: event.minute < context.startMinute ? "before" : "during",
    startMinute: context.startMinute, endMinute: context.endMinute, threats,
    patchFamily: context.patchFamily, checkedAt: context.checkedAt,
    sourceUrls: unique([event.sourceUrl, ...threats.map((threat) => threat.sourceUrl), ...dotaDraftProfileSnapshot.sourceUrls]),
    partialCoverage: context.status === "partial" || context.uncoveredHeroIds.length > 0,
    purchaseLogHeroCount: context.purchaseLogHeroCount, totalHeroCount: context.totalHeroCount,
  };
}

/** Invalid/missing form values stay unknown. They must never become a "no". */
function normalizeObservations(input: DotaReplayDecisionObservations): DotaReplayDecisionObservations {
  const answer = (value: unknown): DotaReplayDecisionAnswer => value === "yes" || value === "no" ? value : "unknown";
  return {
    itemReady: answer(input?.itemReady), alliesReady: answer(input?.alliesReady), targetVisible: answer(input?.targetVisible),
    threatState: input?.threatState === "ready" || input?.threatState === "answered" ? input.threatState : "unknown",
  };
}

export function evaluateDotaReplayDecision(
  candidate: DotaReplayDecision,
  observations: DotaReplayDecisionObservations,
  lang: Language,
  heroName: (id: number) => string,
): DotaReplayDecisionEvaluation {
  const c = getDotaReplayDecisionCopy(lang);
  const answers = normalizeObservations(observations);
  const bkb = candidate.kind === "bkb";
  const fields: DotaReplayDecisionObservationKey[] = ["itemReady", "alliesReady", bkb ? "threatState" : "targetVisible"];
  const unknownFields = fields.filter((field) => answers[field] === "unknown");
  const obstacles = [
    answers.itemReady === "no" ? c.itemMissing : "",
    answers.alliesReady === "no" ? c.alliesMissing : "",
    bkb && answers.threatState === "ready" ? c.threatPresent : "",
    !bkb && answers.targetVisible === "no" ? c.targetMissing : "",
  ].filter(Boolean);
  const entryStatus = obstacles.length ? "blocked" : unknownFields.length ? "unverified" : "conditional";
  const threats = candidate.threats.map((threat) => `${heroName(threat.heroId)} · ${threat.ability}`).join(", ");
  // Editorial focus order prevents stacking several tasks. It does not rank
  // severity or establish which obstacle caused the observed outcome.
  const taskFocus: DotaReplayDecisionEvaluation["taskFocus"] = answers.itemReady === "no" ? "item"
    : answers.alliesReady === "no" ? "allies"
      : bkb && answers.threatState === "ready" ? "threat"
        : !bkb && answers.targetVisible === "no" ? "vision"
          : unknownFields.length ? "verify" : "preserve";
  const tasks: Record<DotaReplayDecisionEvaluation["taskFocus"], Copy> = {
    verify: {
      ru: `Сначала проверь один момент перед входом на ${heroName(candidate.heroId)} в этом реплее и заполни оставшиеся ответы. Пока обстоятельства неизвестны, задача для следующей игры не выбрана.`,
      en: `First check one instant before the entry on ${heroName(candidate.heroId)} in this replay and complete the remaining answers. A task for the next match has not been selected while these circumstances remain unknown.`,
    },
    item: {
      ru: `Перед следующим входом на ${heroName(candidate.heroId)} проверь, доставлен ли ${candidate.itemTitle.ru} и можно ли применить его прямо сейчас. После игры отметь, сделал ли ты эту проверку до входа.`,
      en: `Before your next entry on ${heroName(candidate.heroId)}, check whether ${candidate.itemTitle.en} has arrived and can be used right now. After the match, record whether you made that check before entering.`,
    },
    allies: {
      ru: `Перед следующим входом на ${heroName(candidate.heroId)} выбери конкретного союзника для продолжения и проверь, может ли он сразу помочь с его позиции и доступными способностями. После игры отметь, была ли поддержка готова в момент входа.`,
      en: `Before your next entry on ${heroName(candidate.heroId)}, identify one ally to follow up and check whether their position and available abilities let them help immediately. After the match, record whether that follow-up was ready when you entered.`,
    },
    threat: {
      ru: `Перед следующим входом с BKB на ${heroName(candidate.heroId)} проверь названный контроль противника: готов ли он и может ли достать тебя при входе. В этом реплее это ${threats}; в новой игре состав может быть другим. После игры отметь, учёл ли ты этот ответ до входа.`,
      en: `Before your next BKB entry on ${heroName(candidate.heroId)}, check the named enemy control: is it available and can it reach you as you enter? In this replay it is ${threats}; the next lineup may differ. After the match, record whether you considered that response before entering.`,
    },
    vision: {
      ru: `Перед следующим прыжком через Blink Dagger на ${heroName(candidate.heroId)} проверь обзор конкретной цели в момент входа. После игры отметь, видел ли ты её до прыжка, а не восстановил её положение задним числом.`,
      en: `Before your next Blink Dagger jump on ${heroName(candidate.heroId)}, check vision of the specific target at the instant of entry. After the match, record whether you saw it before jumping rather than reconstructing its position afterward.`,
    },
    preserve: {
      ru: `В следующей игре на ${heroName(candidate.heroId)} повтори эти три проверки перед похожим входом. После игры сопоставь готовые условия с тем, что произошло дальше. Выполненные проверки не гарантируют удачную драку и сами по себе не указывают на ошибку.`,
      en: `In your next match on ${heroName(candidate.heroId)}, repeat these three checks before a similar entry. After the match, compare the available conditions with what happened next. Completed checks do not guarantee a successful fight or themselves indicate a mistake.`,
    },
  };
  const nextMatchTask = tasks[taskFocus][lang];
  const limitations = [c.observationScope, c.boundary,
    lang === "ru"
      ? `Записи покупок есть у ${candidate.purchaseLogHeroCount} из ${candidate.totalHeroCount} героев за весь матч. Полнота журналов неизвестна.`
      : `Purchase records exist for ${candidate.purchaseLogHeroCount} of ${candidate.totalHeroCount} heroes across the match. Log completeness is unknown.`,
    ...(bkb ? [c.namedOnly] : []), ...(candidate.partialCoverage ? [c.partial] : []),
  ];
  return {
    status: unknownFields.length ? "needs-observations" : "conditional",
    summary: obstacles.length ? `${c.summaryBlocked}${unknownFields.length ? ` ${c.uncheckedReason}` : ""}`
      : unknownFields.length ? c.summaryUnknown : c.summaryComplete,
    unknownFields,
    alternatives: [
      { id: "enter", title: bkb ? c.bkbEntryTitle : c.blinkEntryTitle,
        condition: bkb ? c.bkbEntryCondition : c.blinkEntryCondition,
        tradeoff: bkb ? c.bkbEntryTradeoff : c.blinkEntryTradeoff,
        status: entryStatus, reason: obstacles.length ? obstacles.join(" ") : unknownFields.length ? c.uncheckedReason : c.entryConditional },
      { id: "prepare", title: bkb ? c.bkbPrepareTitle : c.blinkPrepareTitle,
        condition: bkb ? c.bkbPrepareCondition : c.blinkPrepareCondition,
        tradeoff: bkb ? c.bkbPrepareTradeoff : c.blinkPrepareTradeoff,
        status: obstacles.length ? "conditional" : "unverified",
        reason: obstacles.length ? c.preparationReason : c.preparationUnverified },
    ],
    nextMatchTask, taskFocus, limitations,
  };
}

/** Copied notes distinguish observed purchases from player-entered replay answers. */
export function buildDotaReplayDecisionNote(
  candidate: DotaReplayDecision | null,
  observations: DotaReplayDecisionObservations,
  lang: Language,
  heroName: (id: number) => string,
): string {
  if (!candidate) return "";
  const c = getDotaReplayDecisionCopy(lang);
  const answers = normalizeObservations(observations);
  const result = evaluateDotaReplayDecision(candidate, answers, lang, heroName);
  const label = (value: DotaReplayDecisionAnswer): string => c[value];
  const lines = [c.title, c.intro,
    `${heroName(candidate.heroId)} · ${clock(candidate.startMinute)}-${clock(candidate.endMinute)}`,
    `${c.evidenceLabel}: ${candidate.purchaseClock} · ${candidate.itemTitle[lang]} · ${candidate.phase === "before" ? c.beforeLabel : c.duringLabel}.`,
    `${c.patchLabel}: ${candidate.patchFamily}. ${c.checkedLabel}: ${candidate.checkedAt}.`,
    ...candidate.threats.map((threat) => `${heroName(threat.heroId)} · ${threat.ability}: ${threat.mechanic[lang]}`),
    c.userAnswers,
    `${c.itemReadyLabel} ${label(answers.itemReady)}`,
    `${c.alliesReadyLabel} ${label(answers.alliesReady)}`,
    candidate.kind === "bkb"
      ? `${c.threatStateLabel} ${answers.threatState === "ready" ? c.threatReady : answers.threatState === "answered" ? c.threatAnswered : c.unknown}`
      : `${c.targetVisibleLabel} ${label(answers.targetVisible)}`,
    result.summary,
    ...result.alternatives.flatMap((alternative) => [
      `${alternative.title} · ${c[alternative.status]}. ${alternative.reason}`,
      `${c.conditionLabel}: ${alternative.condition}`, `${c.tradeoffLabel}: ${alternative.tradeoff}`,
    ]),
    `${c.nextMatchTaskLabel}: ${result.nextMatchTask}`,
    ...result.limitations,
    ...candidate.sourceUrls.map((url) => `${c.sourceLabel}: ${url}`),
  ];
  return lines.join("\n");
}
