import type { DotaMatch, DotaMatchPlayer, DotaMatchRole } from "./dota-match";

/** Review prompts, not a performance score or a causal model. */
export const dotaFinalReviewThresholds = {
  incomeGapGpm: 100,
  incomeGapPct: 15,
  shareGapPoints: 10,
  participationPct: 50,
  highParticipationPct: 70,
  minimumTeamKills: 10,
  objectiveSharePct: 35,
  minimumTowerDamage: 1_000,
  deathSharePct: 25,
  minimumDeaths: 8,
  healingSharePct: 50,
  minimumHealing: 1_000
} as const;

export type DotaFinalFinding = "income-behind" | "income-ahead" | "resources-and-pressure"
  | "fight-presence" | "objectives" | "deaths" | "healing" | "comparison" | "participation";

export interface DotaFinalContribution {
  teamKills: number | null;
  killInvolvements: number | null;
  killParticipationPct: number | null;
  incomeSharePct: number | null;
  heroDamageSharePct: number | null;
  towerDamageSharePct: number | null;
  healingSharePct: number | null;
  deathSharePct: number | null;
}

export interface DotaFinalReview {
  player: DotaMatchPlayer;
  counterpart: DotaMatchPlayer | null;
  contribution: DotaFinalContribution;
  counterpartContribution: DotaFinalContribution | null;
  incomeGapGpm: number | null;
  incomeGapPct: number | null;
  netWorthGap: number | null;
  findings: DotaFinalFinding[];
}

const fullTeam = (match: DotaMatch, player: DotaMatchPlayer) => {
  const team = match.players.filter((candidate) => candidate.isRadiant === player.isRadiant);
  const base = player.isRadiant ? 0 : 128;
  return team.length === 5 && [0, 1, 2, 3, 4].every((slot) => team.some((candidate) => candidate.playerSlot === base + slot))
    ? team : [];
};

const sum = (values: Array<number | null>): number | null => values.length > 0 && values.every((value) => value !== null)
  ? values.reduce<number>((total, value) => total + value!, 0) : null;

const share = (value: number | null, total: number | null) => value !== null && total !== null && total > 0 && value <= total
  ? value / total * 100 : null;

export function dotaFinalContribution(match: DotaMatch, player: DotaMatchPlayer): DotaFinalContribution {
  const team = fullTeam(match, player);
  const teamKills = sum(team.map((candidate) => candidate.kills));
  const killInvolvements = player.kills !== null && player.assists !== null ? player.kills + player.assists : null;
  return {
    teamKills,
    killInvolvements,
    killParticipationPct: share(killInvolvements, teamKills),
    incomeSharePct: share(player.goldPerMinute, sum(team.map((candidate) => candidate.goldPerMinute))),
    heroDamageSharePct: share(player.heroDamage, sum(team.map((candidate) => candidate.heroDamage))),
    towerDamageSharePct: share(player.towerDamage, sum(team.map((candidate) => candidate.towerDamage))),
    healingSharePct: share(player.heroHealing, sum(team.map((candidate) => candidate.heroHealing))),
    deathSharePct: share(player.deaths, sum(team.map((candidate) => candidate.deaths)))
  };
}

export function buildDotaFinalReview(match: DotaMatch, player: DotaMatchPlayer, role: DotaMatchRole | null, requestedCounterpart: DotaMatchPlayer | null): DotaFinalReview {
  const candidate = requestedCounterpart ? match.players.find((row) => row.playerSlot === requestedCounterpart.playerSlot) : null;
  const counterpart = candidate && candidate.isRadiant !== player.isRadiant ? candidate : null;
  const contribution = dotaFinalContribution(match, player);
  const incomeGapGpm = counterpart?.goldPerMinute != null && player.goldPerMinute !== null ? player.goldPerMinute - counterpart.goldPerMinute : null;
  const incomeGapPct = incomeGapGpm !== null && counterpart!.goldPerMinute! > 0 ? incomeGapGpm / counterpart!.goldPerMinute! * 100 : null;
  const netWorthGap = counterpart?.netWorth != null && player.netWorth !== null ? player.netWorth - counterpart.netWorth : null;
  const findings: DotaFinalFinding[] = [];
  const t = dotaFinalReviewThresholds;

  if (incomeGapGpm !== null && incomeGapPct !== null && Math.abs(incomeGapGpm) >= t.incomeGapGpm && Math.abs(incomeGapPct) >= t.incomeGapPct) {
    findings.push(incomeGapGpm < 0 ? "income-behind" : "income-ahead");
  }
  // A core-only review question needs three complete, separate observations.
  // Never equate damage with usefulness or mark a support's low gold share as failure.
  if (role === "core" && contribution.incomeSharePct !== null && contribution.heroDamageSharePct !== null
    && contribution.towerDamageSharePct !== null && contribution.killParticipationPct !== null
    && (contribution.teamKills ?? 0) >= t.minimumTeamKills
    && contribution.incomeSharePct - contribution.heroDamageSharePct >= t.shareGapPoints
    && contribution.incomeSharePct - contribution.towerDamageSharePct >= t.shareGapPoints
    && contribution.killParticipationPct < t.participationPct) findings.push("resources-and-pressure");

  if (contribution.towerDamageSharePct !== null && contribution.towerDamageSharePct >= t.objectiveSharePct
    && (player.towerDamage ?? 0) >= t.minimumTowerDamage) findings.push("objectives");
  if (contribution.killParticipationPct !== null && contribution.killParticipationPct >= t.highParticipationPct
    && (contribution.teamKills ?? 0) >= t.minimumTeamKills) findings.push("fight-presence");
  if ((player.deaths ?? 0) >= t.minimumDeaths && (contribution.deathSharePct ?? 0) >= t.deathSharePct) findings.push("deaths");
  if ((player.heroHealing ?? 0) >= t.minimumHealing && (contribution.healingSharePct ?? 0) >= t.healingSharePct) findings.push("healing");
  if (incomeGapGpm !== null && !findings.some((finding) => finding.startsWith("income-"))) findings.push("comparison");
  if (!findings.length && contribution.killParticipationPct !== null) findings.push("participation");

  return { player, counterpart, contribution, counterpartContribution: counterpart ? dotaFinalContribution(match, counterpart) : null, incomeGapGpm, incomeGapPct, netWorthGap, findings: findings.slice(0, 3) };
}
