import { dotaDraftHeroProfiles, dotaDraftProfileSnapshot, type DotaDraftHeroProfile, type DotaDraftTrait } from "../data/dota-draft-profiles";
import { dotaDraftRules, dotaDraftAxes } from "../data/dota-draft-rules";
import { dotaDraftPurchaseContexts } from "../data/dota-draft-purchases";
import type { DotaMatch, DotaMatchPlayer } from "./dota-match";

type Copy = { ru: string; en: string };
export interface DotaDraftFinding {
  id: string;
  title: Copy;
  explanation: Copy;
  condition: Copy;
  action: Copy;
  heroIds: number[];
  sourceUrls: string[];
  evidence: Array<{ heroId: number; ability: string; text: Copy }>;
}
export interface DotaDraftPurchaseEvent {
  heroId: number;
  isOwnTeam: boolean;
  key: string;
  minute: number;
  title: Copy;
  explanation: Copy;
  sourceUrl: string;
  context?: { heroIds: number[]; text: Copy; abilities?: Array<{ heroId: number; ability: string }> };
}
export interface DotaDraftReview {
  status: "ready" | "partial" | "unavailable" | "patch-mismatch";
  coverage: { own: number; enemy: number; total: number };
  ownHeroIds: number[];
  enemyHeroIds: number[];
  uncoveredHeroIds: number[];
  patchFamily: string;
  checkedAt: string;
  axes: Array<{ id: string; title: Copy; ownHeroIds: number[]; enemyHeroIds: number[]; explanation: Copy }>;
  opportunities: DotaDraftFinding[];
  threats: DotaDraftFinding[];
  purchases: DotaDraftPurchaseEvent[];
  purchaseLogHeroCount: number;
  sourceUrls: string[];
}

const profiles = new Map(dotaDraftHeroProfiles.map((profile) => [profile.heroId, profile]));
const purchaseContexts = new Map(dotaDraftPurchaseContexts.map((item) => [item.key, item]));
const has = (profile: DotaDraftHeroProfile, trait: DotaDraftTrait) => profile.evidence.some((entry) => entry.trait === trait);
const unique = <T>(values: T[]) => [...new Set(values)];

function validLineup(match: DotaMatch, player: DotaMatchPlayer): boolean {
  if (match.players.length !== 10 || new Set(match.players.map((row) => row.heroId)).size !== 10
    || new Set(match.players.map((row) => row.playerSlot)).size !== 10) return false;
  if (!match.players.every((row) => Number.isInteger(row.heroId) && row.heroId > 0
    && Number.isInteger(row.playerSlot) && (row.isRadiant ? row.playerSlot >= 0 && row.playerSlot <= 4 : row.playerSlot >= 128 && row.playerSlot <= 132))) return false;
  return match.players.filter((row) => row.isRadiant).length === 5
    && match.players.some((row) => row.playerSlot === player.playerSlot && row.heroId === player.heroId && row.isRadiant === player.isRadiant);
}

// Match distinct heroes to traits, rather than counting a hero's own kit as synergy.
function assignTraits(team: DotaDraftHeroProfile[], traits: DotaDraftTrait[], requiresDamageFollowup = false, chosen: DotaDraftHeroProfile[] = []): DotaDraftHeroProfile[] | null {
  if (!traits.length) return chosen;
  for (const profile of team) {
    const eligible = profile.evidence.some((entry) => entry.trait === traits[0] && (!requiresDamageFollowup || !entry.blocksAllyDamage));
    if (chosen.some((candidate) => candidate.heroId === profile.heroId) || !eligible) continue;
    const result = assignTraits(team, traits.slice(1), requiresDamageFollowup, [...chosen, profile]);
    if (result) return result;
  }
  return null;
}

function findingsFor(team: DotaDraftHeroProfile[], opponent: DotaDraftHeroProfile[]): DotaDraftFinding[] {
  return dotaDraftRules.flatMap((rule): DotaDraftFinding[] => {
    const assigned = assignTraits(team, rule.traits, rule.requiresDamageFollowup);
    if (!assigned || rule.enemyTraits && !rule.enemyTraits.some((trait) => opponent.some((profile) => has(profile, trait)))) return [];
    return [{
      id: rule.id, title: rule.title, explanation: rule.explanation, condition: rule.condition, action: rule.action,
      heroIds: assigned.map((profile) => profile.heroId),
      sourceUrls: unique(assigned.map((profile) => profile.sourceUrl)),
      evidence: assigned.map((profile, index) => {
        const entry = profile.evidence.find((evidence) => evidence.trait === rule.traits[index] && (!rule.requiresDamageFollowup || !evidence.blocksAllyDamage))!;
        return { heroId: profile.heroId, ability: entry.ability, text: entry.text };
      })
    }];
  });
}

function purchaseEvents(match: DotaMatch, player: DotaMatchPlayer, patchMatches: boolean): DotaDraftPurchaseEvent[] {
  if (!Number.isFinite(match.durationSeconds) || match.durationSeconds <= 0) return [];
  return match.players.flatMap((row) => {
    const first = new Map<string, number>();
    for (const purchase of row.purchases) {
      if (!purchaseContexts.has(purchase.key) || !Number.isFinite(purchase.time) || purchase.time < 0 || purchase.time > match.durationSeconds) continue;
      if (!first.has(purchase.key) || purchase.time < first.get(purchase.key)!) first.set(purchase.key, purchase.time);
    }
    return [...first].map(([key, seconds]): DotaDraftPurchaseEvent => {
      const item = purchaseContexts.get(key)!;
      const event: DotaDraftPurchaseEvent = {
        heroId: row.heroId, isOwnTeam: row.isRadiant === player.isRadiant, key, minute: seconds / 60,
        title: item.title, sourceUrl: item.sourceUrl,
        explanation: patchMatches ? item.explanation : {
          ru: "Покупка зафиксирована в журнале. Для этой версии матча свойства предмета здесь не оценивались.",
          en: "The purchase is recorded in the log. This match version's item effects have not been evaluated here."
        }
      };
      if (patchMatches) {
        const otherSide = match.players.filter((candidate) => candidate.isRadiant !== row.isRadiant);
        const allies = match.players.filter((candidate) => candidate.isRadiant === row.isRadiant && candidate.heroId !== row.heroId);
        const heroesWith = (players: DotaMatchPlayer[], trait: DotaDraftTrait) => players.filter((candidate) => {
          const profile = profiles.get(candidate.heroId);
          return profile && has(profile, trait);
        }).map((candidate) => candidate.heroId).sort((a, b) => a - b);
        if (key === "black_king_bar") {
          const ids = heroesWith(otherSide, "immunityControl");
          if (ids.length) event.context = { heroIds: ids, abilities: ids.flatMap((id) => profiles.get(id)!.evidence.filter((entry) => entry.trait === "immunityControl").map((entry) => ({ heroId: id, ability: entry.ability }))), text: {
            ru: "У этих противников есть проверенная способность контроля, проходящая сквозь невосприимчивость к эффектам. При разборе входа важно проверить её готовность.",
            en: "These enemies have a reviewed control ability that pierces debuff immunity. Check whether it was available when reviewing the entry."
          } };
        } else if (key === "pipe") {
          const ids = heroesWith(otherSide, "magicBurst");
          if (ids.length) event.context = { heroIds: ids, text: {
            ru: "Сопоставь барьер с моментом урона заклинаниями этих противников. Покупка не означает, что защита была применена вовремя.",
            en: "Compare the barrier with the timing of these enemies' spell damage. The purchase does not establish timely protection."
          } };
        } else if (key === "assault" || key === "desolator") {
          const ids = heroesWith(allies, "physicalDamage");
          if (ids.length) event.context = { heroIds: ids, text: {
            ru: "В составе есть союзники с физическим уроном от способностей или усиленных атак. Проверь общую цель и возможность продолжить наносить физический урон.",
            en: "Allies have physical-damage abilities or empowered attacks. Check the shared target and their ability to follow up with physical damage."
          } };
        } else if (key === "lotus_orb" || key === "sphere") {
          const ids = heroesWith(otherSide, "targetedSpell");
          if (ids.length) event.context = { heroIds: ids, text: {
            ru: "У этих противников отмечены направленные заклинания. Проверь совместимость защиты с конкретной способностью и порядок её применения.",
            en: "These enemies have reviewed unit-targeted spells. Check protection against the specific ability and the order of casts."
          } };
        }
      }
      return event;
    });
  }).sort((a, b) => a.minute - b.minute || a.heroId - b.heroId || a.key.localeCompare(b.key));
}

/** Mechanic-based conditions, not a win predictor or a causal performance grade.
 * Draft findings read only hero identity, side and patch. Match outcomes, final items,
 * economy, inferred positions and post-match performance never enter draft rules.
 * Purchase events are a separately labeled observation layer.
 */
export function buildDotaDraftReview(match: DotaMatch, player: DotaMatchPlayer): DotaDraftReview {
  const own = match.players.filter((row) => row.isRadiant === player.isRadiant).map((row) => row.heroId).sort((a, b) => a - b);
  const enemy = match.players.filter((row) => row.isRadiant !== player.isRadiant).map((row) => row.heroId).sort((a, b) => a - b);
  const ownProfiles = own.flatMap((id) => profiles.has(id) ? [profiles.get(id)!] : []);
  const enemyProfiles = enemy.flatMap((id) => profiles.has(id) ? [profiles.get(id)!] : []);
  const valid = validLineup(match, player);
  const patchMatches = match.patchId === dotaDraftProfileSnapshot.patchId && match.startTime !== null
    && Number.isFinite(match.startTime) && match.startTime >= Date.parse(dotaDraftProfileSnapshot.supportedSince) / 1000;
  const covered = ownProfiles.length + enemyProfiles.length;
  const review: DotaDraftReview = {
    status: !valid ? "unavailable" : !patchMatches ? "patch-mismatch" : covered === 10 ? "ready" : covered > 0 ? "partial" : "unavailable",
    coverage: { own: ownProfiles.length, enemy: enemyProfiles.length, total: covered },
    ownHeroIds: own, enemyHeroIds: enemy,
    uncoveredHeroIds: unique([...own, ...enemy].filter((id) => !profiles.has(id))),
    patchFamily: dotaDraftProfileSnapshot.patchLabel, checkedAt: dotaDraftProfileSnapshot.checkedAt,
    axes: [], opportunities: [], threats: [], purchases: [], purchaseLogHeroCount: 0,
    sourceUrls: [...dotaDraftProfileSnapshot.sourceUrls]
  };
  if (!valid) return review;
  review.purchases = purchaseEvents(match, player, patchMatches);
  review.purchaseLogHeroCount = match.players.filter((row) => row.purchases.some((purchase) => Number.isFinite(purchase.time) && purchase.time >= 0 && purchase.time <= match.durationSeconds)).length;
  review.sourceUrls = unique([...review.sourceUrls, ...review.purchases.map((purchase) => purchase.sourceUrl)]);
  if (!patchMatches || !covered) return review;
  review.axes = dotaDraftAxes.map((axis) => ({
    id: axis.id, title: axis.title, explanation: axis.explanation,
    ownHeroIds: ownProfiles.filter((profile) => axis.traits.some((trait) => has(profile, trait))).map((profile) => profile.heroId),
    enemyHeroIds: enemyProfiles.filter((profile) => axis.traits.some((trait) => has(profile, trait))).map((profile) => profile.heroId)
  }));
  review.opportunities = findingsFor(ownProfiles, enemyProfiles);
  review.threats = findingsFor(enemyProfiles, ownProfiles);
  return review;
}
