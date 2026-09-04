import type { DotaItemRecord, DotaItemRole, DotaItemTiming } from "./dota-items";
import type { DotaMatchItemReference } from "../data/dota-match-items";

export type DotaMatchRole = DotaItemRole;

export interface DotaMatchPurchase {
  time: number;
  key: string;
}

export type DotaMatchInventoryArea = "main" | "backpack" | "neutral";

export interface DotaMatchInventorySlot {
  area: DotaMatchInventoryArea;
  slot: number;
  itemId: number;
}

export interface DotaMatchInventoryItem extends DotaMatchInventorySlot {
  item: DotaMatchItemReference | null;
}

export interface DotaMatchPlayer {
  heroId: number;
  playerSlot: number;
  isRadiant: boolean;
  won: boolean | null;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  lastHits: number | null;
  denies: number | null;
  goldPerMinute: number | null;
  xpPerMinute: number | null;
  netWorth: number | null;
  totalGold: number | null;
  goldSpent: number | null;
  buybackCount: number | null;
  positionEstimate: number | null;
  laneRole: number | null;
  isRoaming: boolean | null;
  times: number[];
  goldTimeline: number[];
  lastHitTimeline: number[];
  purchases: DotaMatchPurchase[];
  finalInventory: DotaMatchInventorySlot[];
}

export interface DotaMatch {
  matchId: number;
  durationSeconds: number;
  startTime: number;
  radiantWin: boolean | null;
  parseVersion: number | null;
  patchId: number | null;
  players: DotaMatchPlayer[];
}

export interface DotaMatchCheckpoint {
  minute: number;
  totalGold: number;
  lastHits: number;
  intervalGoldPerMinute: number;
  intervalLastHits: number;
}

export interface DotaMatchItemPurchase {
  key: string;
  name: string;
  image: string;
  cost: number;
  minute: number;
  benchmark: DotaItemTiming | null;
  deltaMinutes: number | null;
}

export type DotaEconomicWindowKind = "personal" | "team" | "mixed" | "stable";
export type DotaEconomicConfidence = "high" | "medium" | "low";

export interface DotaEconomicCheckpoint {
  minute: number;
  playerGold: number;
  counterpartGold: number | null;
  roleGap: number | null;
  ownTeamGold: number | null;
  enemyTeamGold: number | null;
  teamGap: number | null;
  playerTeamSharePct: number | null;
  teamRank: number | null;
  matchRank: number | null;
}

export interface DotaEconomicWindow {
  startMinute: number;
  endMinute: number;
  durationMinutes: number;
  playerGoldGain: number;
  counterpartGoldGain: number | null;
  playerGoldPerMinute: number;
  counterpartGoldPerMinute: number | null;
  roleGapChange: number | null;
  ownTeamGoldGain: number | null;
  enemyTeamGoldGain: number | null;
  teamGapChange: number | null;
  playerTeamShareChangePct: number | null;
  kind: DotaEconomicWindowKind;
}

export interface DotaEconomicFinalSnapshot {
  playerNetWorth: number | null;
  counterpartNetWorth: number | null;
  roleGap: number | null;
  ownTeamNetWorth: number | null;
  enemyTeamNetWorth: number | null;
  teamGap: number | null;
  teamRank: number | null;
  matchRank: number | null;
}

export interface DotaEconomicAutopsy {
  counterpart: DotaMatchPlayer | null;
  counterpartSeries: Array<{ minute: number; totalGold: number }>;
  checkpoints: DotaEconomicCheckpoint[];
  windows: DotaEconomicWindow[];
  laneCheckpoint: DotaEconomicCheckpoint | null;
  finalCheckpoint: DotaEconomicCheckpoint | null;
  criticalWindow: DotaEconomicWindow | null;
  comparativeGoldSwing: number | null;
  estimatedItemDelayMinutes: number | null;
  confidence: DotaEconomicConfidence;
  timelinePlayerCount: number;
  final: DotaEconomicFinalSnapshot;
}

export interface DotaMatchAudit {
  player: DotaMatchPlayer;
  role: DotaMatchRole;
  timelineAvailable: boolean;
  checkpoints: DotaMatchCheckpoint[];
  series: Array<{ minute: number; totalGold: number; lastHits: number }>;
  majorPurchases: DotaMatchItemPurchase[];
  slowestWindow: DotaMatchCheckpoint | null;
  strongestItemDelta: DotaMatchItemPurchase | null;
  economy: DotaEconomicAutopsy;
}

/** Thresholds are exposed so every diagnosis remains inspectable and testable. */
export const dotaEconomicSignalThresholds = {
  roleGapGold: 750,
  teamGapGold: 1_500,
  teamSharePercentagePoints: 1.5
} as const;

const finiteInteger = (value: unknown, minimum: number, maximum: number): number | null => {
  const number = typeof value === "number" ? value : Number.NaN;
  return Number.isFinite(number) && Number.isInteger(number) && number >= minimum && number <= maximum ? number : null;
};

const finiteNumber = (value: unknown, minimum: number, maximum: number): number | null => {
  const number = typeof value === "number" ? value : Number.NaN;
  return Number.isFinite(number) && number >= minimum && number <= maximum ? number : null;
};

const numberArray = (value: unknown, minimum: number, maximum: number) => {
  if (!Array.isArray(value)) return [];
  const numbers = value.slice(0, 360).map((entry) => finiteNumber(entry, minimum, maximum));
  return numbers.some((number) => number === null) ? [] : numbers as number[];
};

const inventorySlot = (player: Record<string, unknown>, key: string, area: DotaMatchInventoryArea, slot: number): DotaMatchInventorySlot[] => {
  const itemId = finiteInteger(player[key], 1, 100_000);
  return itemId === null ? [] : [{ area, slot, itemId }];
};

/** Accept a raw match ID or a normal OpenDota, Dotabuff or Stratz match URL. */
export function parseDotaMatchId(value: string): number | null {
  const input = value.trim();
  const raw = input.match(/^\d{6,12}$/u)?.[0];
  const fromPath = input.match(/(?:\/matches\/|[?&]match_id=)(\d{6,12})(?:[/?&#]|$)/iu)?.[1];
  const candidate = raw ?? fromPath;
  if (!candidate) return null;
  const matchId = Number(candidate);
  return Number.isSafeInteger(matchId) && matchId > 0 ? matchId : null;
}

/** Strip account IDs, player names, chat and every field the economy audit does not use. */
export function sanitizeDotaMatchResponse(value: unknown): DotaMatch | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const matchId = finiteInteger(raw.match_id, 1, Number.MAX_SAFE_INTEGER);
  const durationSeconds = finiteInteger(raw.duration, 0, 21_600);
  const startTime = finiteInteger(raw.start_time, 0, 4_102_444_800);
  if (matchId === null || durationSeconds === null || startTime === null || !Array.isArray(raw.players)) return null;

  const players = raw.players.slice(0, 12).flatMap((entry): DotaMatchPlayer[] => {
    if (!entry || typeof entry !== "object") return [];
    const player = entry as Record<string, unknown>;
    const heroId = finiteInteger(player.hero_id, 1, 10_000);
    const playerSlot = finiteInteger(player.player_slot, 0, 255);
    if (heroId === null || playerSlot === null) return [];
    const purchases = Array.isArray(player.purchase_log)
      ? player.purchase_log.slice(0, 300).flatMap((purchase): DotaMatchPurchase[] => {
          if (!purchase || typeof purchase !== "object") return [];
          const row = purchase as Record<string, unknown>;
          const time = finiteInteger(row.time, -600, 21_600);
          const key = typeof row.key === "string" && /^[a-z0-9_]{1,80}$/u.test(row.key) ? row.key : null;
          return time === null || key === null ? [] : [{ time, key }];
        })
      : [];
    const isRadiant = typeof player.isRadiant === "boolean" ? player.isRadiant : playerSlot < 128;
    const win = finiteInteger(player.win, 0, 1);
    const finalInventory = [
      ...Array.from({ length: 6 }, (_, slot) => inventorySlot(player, `item_${slot}`, "main", slot)).flat(),
      ...Array.from({ length: 3 }, (_, slot) => inventorySlot(player, `backpack_${slot}`, "backpack", slot)).flat(),
      ...inventorySlot(player, "item_neutral", "neutral", 0),
      ...inventorySlot(player, "item_neutral2", "neutral", 1)
    ];

    return [{
      heroId,
      playerSlot,
      isRadiant,
      won: win === null ? (typeof raw.radiant_win === "boolean" ? raw.radiant_win === isRadiant : null) : win === 1,
      kills: finiteInteger(player.kills, 0, 10_000),
      deaths: finiteInteger(player.deaths, 0, 10_000),
      assists: finiteInteger(player.assists, 0, 10_000),
      lastHits: finiteInteger(player.last_hits, 0, 100_000),
      denies: finiteInteger(player.denies, 0, 100_000),
      goldPerMinute: finiteInteger(player.gold_per_min, 0, 100_000),
      xpPerMinute: finiteInteger(player.xp_per_min, 0, 100_000),
      netWorth: finiteInteger(player.net_worth, 0, 10_000_000),
      totalGold: finiteInteger(player.total_gold, 0, 10_000_000),
      goldSpent: finiteInteger(player.gold_spent, 0, 10_000_000),
      buybackCount: finiteInteger(player.buyback_count, 0, 100),
      positionEstimate: finiteInteger(player.position_est, 1, 5),
      laneRole: finiteInteger(player.lane_role, 1, 4),
      isRoaming: typeof player.is_roaming === "boolean" ? player.is_roaming : null,
      times: numberArray(player.times, 0, 21_600),
      goldTimeline: numberArray(player.gold_t, 0, 10_000_000),
      lastHitTimeline: numberArray(player.lh_t, 0, 100_000),
      purchases,
      finalInventory
    }];
  }).sort((left, right) => left.playerSlot - right.playerSlot);

  if (players.length < 2) return null;
  return {
    matchId,
    durationSeconds,
    startTime,
    radiantWin: typeof raw.radiant_win === "boolean" ? raw.radiant_win : null,
    parseVersion: finiteInteger(raw.version, 1, 10_000),
    patchId: finiteInteger(raw.patch, 1, 10_000),
    players
  };
}

/**
 * Convert an already-sanitized match back to the small provider-shaped payload
 * accepted by the browser sanitizer. The relay uses this boundary so account
 * IDs, player names, chat and unrelated replay data never reach the browser.
 */
export function createDotaMatchPublicPayload(match: DotaMatch): Record<string, unknown> {
  return {
    match_id: match.matchId,
    duration: match.durationSeconds,
    start_time: match.startTime,
    radiant_win: match.radiantWin,
    version: match.parseVersion,
    patch: match.patchId,
    players: match.players.map((player) => {
      const inventory = Object.fromEntries(player.finalInventory.map((entry) => {
        const key = entry.area === "main"
          ? `item_${entry.slot}`
          : entry.area === "backpack"
            ? `backpack_${entry.slot}`
            : entry.slot === 0 ? "item_neutral" : "item_neutral2";
        return [key, entry.itemId];
      }));
      return {
        hero_id: player.heroId,
        player_slot: player.playerSlot,
        isRadiant: player.isRadiant,
        win: player.won === null ? null : player.won ? 1 : 0,
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        last_hits: player.lastHits,
        denies: player.denies,
        gold_per_min: player.goldPerMinute,
        xp_per_min: player.xpPerMinute,
        net_worth: player.netWorth,
        total_gold: player.totalGold,
        gold_spent: player.goldSpent,
        buyback_count: player.buybackCount,
        position_est: player.positionEstimate,
        lane_role: player.laneRole,
        is_roaming: player.isRoaming,
        times: player.times,
        gold_t: player.goldTimeline,
        lh_t: player.lastHitTimeline,
        purchase_log: player.purchases,
        ...inventory
      };
    })
  };
}

export function inferredDotaMatchRole(player: DotaMatchPlayer): DotaMatchRole | null {
  if (player.positionEstimate === null) return null;
  return player.positionEstimate <= 3 ? "core" : "support";
}

export function resolveDotaMatchInventory(
  player: DotaMatchPlayer,
  references: readonly DotaMatchItemReference[]
): DotaMatchInventoryItem[] {
  const byId = new Map(references.map((item) => [item.id, item]));
  return player.finalInventory.map((slot) => ({ ...slot, item: byId.get(slot.itemId) ?? null }));
}

export function hasDotaMatchTimeline(player: DotaMatchPlayer) {
  return Math.min(player.times.length, player.goldTimeline.length, player.lastHitTimeline.length) >= 2;
}

const checkpointTargets = (endMinute: number) => {
  const wholeEnd = Math.max(1, Math.floor(endMinute));
  const standard = [10, 20, 30].filter((minute) => minute < wholeEnd);
  const candidates = standard.length >= 2 ? [...standard, wholeEnd] : [Math.max(1, Math.floor(wholeEnd / 2)), wholeEnd];
  return [...new Set(candidates)].sort((left, right) => left - right);
};

export function createDotaMatchSeries(player: DotaMatchPlayer) {
  const length = Math.min(player.times.length, player.goldTimeline.length, player.lastHitTimeline.length);
  return Array.from({ length }, (_, index) => ({
    minute: player.times[index]! / 60,
    totalGold: player.goldTimeline[index]!,
    lastHits: player.lastHitTimeline[index]!
  })).filter((point, index, rows) => point.minute >= 0 && (index === 0 || point.minute > rows[index - 1]!.minute));
}

export function createDotaMatchGoldSeries(player: DotaMatchPlayer) {
  const length = Math.min(player.times.length, player.goldTimeline.length);
  return Array.from({ length }, (_, index) => ({
    minute: player.times[index]! / 60,
    totalGold: player.goldTimeline[index]!
  })).filter((point, index, rows) => point.minute >= 0 && (index === 0 || point.minute > rows[index - 1]!.minute));
}

const pointAtOrBefore = (
  series: Array<{ minute: number; totalGold: number }>,
  minute: number,
  maximumLagMinutes = 1.1
) => {
  const point = series.findLast((candidate) => candidate.minute <= minute);
  return point && minute - point.minute <= maximumLagMinutes ? point : null;
};

const completeSum = (values: Array<number | null>) => values.length && values.every((value) => value !== null)
  ? values.reduce<number>((sum, value) => sum + value!, 0)
  : null;

const completeRank = (selected: number | null, values: Array<number | null>) => {
  if (selected === null || !values.length || values.some((value) => value === null)) return null;
  return 1 + values.filter((value) => value! > selected).length;
};

const directPositionCounterpart = (match: DotaMatch, player: DotaMatchPlayer) => {
  if (player.positionEstimate === null) return null;
  const candidates = match.players.filter((candidate) => (
    candidate.isRadiant !== player.isRadiant
    && candidate.positionEstimate === player.positionEstimate
  ));
  return candidates.length === 1 ? candidates[0]! : null;
};

const economicWindowKind = (
  roleGapChange: number | null,
  teamGapChange: number | null,
  playerTeamShareChangePct: number | null
): DotaEconomicWindowKind => {
  const personalSignal = (
    (roleGapChange !== null && roleGapChange <= -dotaEconomicSignalThresholds.roleGapGold)
    || (playerTeamShareChangePct !== null && playerTeamShareChangePct <= -dotaEconomicSignalThresholds.teamSharePercentagePoints)
  );
  const teamSignal = teamGapChange !== null && teamGapChange <= -dotaEconomicSignalThresholds.teamGapGold;
  if (personalSignal && teamSignal) return "mixed";
  if (personalSignal) return "personal";
  if (teamSignal) return "team";
  return "stable";
};

const finalEconomicSnapshot = (
  match: DotaMatch,
  player: DotaMatchPlayer,
  counterpart: DotaMatchPlayer | null
): DotaEconomicFinalSnapshot => {
  const ownTeam = match.players.filter((candidate) => candidate.isRadiant === player.isRadiant);
  const enemyTeam = match.players.filter((candidate) => candidate.isRadiant !== player.isRadiant);
  const ownValues = ownTeam.map((candidate) => candidate.netWorth);
  const enemyValues = enemyTeam.map((candidate) => candidate.netWorth);
  const allValues = match.players.map((candidate) => candidate.netWorth);
  const completeTeams = ownTeam.length === 5 && enemyTeam.length === 5 && match.players.length === 10;
  const ownTeamNetWorth = completeTeams ? completeSum(ownValues) : null;
  const enemyTeamNetWorth = completeTeams ? completeSum(enemyValues) : null;
  return {
    playerNetWorth: player.netWorth,
    counterpartNetWorth: counterpart?.netWorth ?? null,
    roleGap: player.netWorth !== null && counterpart && counterpart.netWorth !== null
      ? player.netWorth - counterpart.netWorth
      : null,
    ownTeamNetWorth,
    enemyTeamNetWorth,
    teamGap: ownTeamNetWorth !== null && enemyTeamNetWorth !== null ? ownTeamNetWorth - enemyTeamNetWorth : null,
    teamRank: completeTeams ? completeRank(player.netWorth, ownValues) : null,
    matchRank: completeTeams ? completeRank(player.netWorth, allValues) : null
  };
};

/**
 * Compare only facts contained in one match. A direct opponent is used only
 * when OpenDota explicitly assigns both players the same position estimate.
 */
export function buildDotaEconomicAutopsy(match: DotaMatch, playerSlot: number): DotaEconomicAutopsy | null {
  const player = match.players.find((candidate) => candidate.playerSlot === playerSlot);
  if (!player) return null;
  const counterpart = directPositionCounterpart(match, player);
  const seriesBySlot = new Map(match.players.map((candidate) => [candidate.playerSlot, createDotaMatchGoldSeries(candidate)]));
  const playerSeries = seriesBySlot.get(player.playerSlot)!;
  const counterpartSeries = counterpart ? seriesBySlot.get(counterpart.playerSlot)! : [];
  const ownTeam = match.players.filter((candidate) => candidate.isRadiant === player.isRadiant);
  const enemyTeam = match.players.filter((candidate) => candidate.isRadiant !== player.isRadiant);
  const completeTeams = ownTeam.length === 5 && enemyTeam.length === 5 && match.players.length === 10;
  const timelinePlayerCount = [...seriesBySlot.values()].filter((series) => series.length >= 2).length;
  const endMinute = playerSeries.length >= 2
    ? Math.min(match.durationSeconds / 60, playerSeries.at(-1)!.minute)
    : 0;

  const makeCheckpoint = (targetMinute: number): DotaEconomicCheckpoint | null => {
    const selectedPoint = pointAtOrBefore(playerSeries, targetMinute);
    if (!selectedPoint) return null;
    const minute = selectedPoint.minute;
    const goldFor = (candidate: DotaMatchPlayer) => pointAtOrBefore(seriesBySlot.get(candidate.playerSlot)!, minute)?.totalGold ?? null;
    const playerGold = selectedPoint.totalGold;
    const counterpartGold = counterpart ? goldFor(counterpart) : null;
    const ownValues = ownTeam.map(goldFor);
    const enemyValues = enemyTeam.map(goldFor);
    const allValues = match.players.map(goldFor);
    const ownTeamGold = completeTeams ? completeSum(ownValues) : null;
    const enemyTeamGold = completeTeams ? completeSum(enemyValues) : null;
    return {
      minute,
      playerGold,
      counterpartGold,
      roleGap: counterpartGold === null ? null : playerGold - counterpartGold,
      ownTeamGold,
      enemyTeamGold,
      teamGap: ownTeamGold !== null && enemyTeamGold !== null ? ownTeamGold - enemyTeamGold : null,
      playerTeamSharePct: ownTeamGold && ownTeamGold > 0 ? playerGold / ownTeamGold * 100 : null,
      teamRank: completeTeams ? completeRank(playerGold, ownValues) : null,
      matchRank: completeTeams ? completeRank(playerGold, allValues) : null
    };
  };

  const targets = endMinute > 0 ? checkpointTargets(endMinute) : [];
  const checkpoints = targets.flatMap((target): DotaEconomicCheckpoint[] => {
    const checkpoint = makeCheckpoint(target);
    return checkpoint ? [checkpoint] : [];
  }).filter((checkpoint, index, rows) => index === 0 || checkpoint.minute > rows[index - 1]!.minute);
  const baseline = playerSeries.length >= 2 ? makeCheckpoint(playerSeries[0]!.minute) : null;
  const windowPoints = baseline ? [baseline, ...checkpoints.filter((checkpoint) => checkpoint.minute > baseline.minute)] : checkpoints;
  const windows = windowPoints.slice(1).map((end, index): DotaEconomicWindow => {
    const start = windowPoints[index]!;
    const durationMinutes = Math.max(1 / 60, end.minute - start.minute);
    const playerGoldGain = end.playerGold - start.playerGold;
    const counterpartGoldGain = end.counterpartGold !== null && start.counterpartGold !== null
      ? end.counterpartGold - start.counterpartGold
      : null;
    const roleGapChange = end.roleGap !== null && start.roleGap !== null ? end.roleGap - start.roleGap : null;
    const ownTeamGoldGain = end.ownTeamGold !== null && start.ownTeamGold !== null ? end.ownTeamGold - start.ownTeamGold : null;
    const enemyTeamGoldGain = end.enemyTeamGold !== null && start.enemyTeamGold !== null ? end.enemyTeamGold - start.enemyTeamGold : null;
    const teamGapChange = end.teamGap !== null && start.teamGap !== null ? end.teamGap - start.teamGap : null;
    const playerTeamShareChangePct = end.playerTeamSharePct !== null && start.playerTeamSharePct !== null
      ? end.playerTeamSharePct - start.playerTeamSharePct
      : null;
    return {
      startMinute: start.minute,
      endMinute: end.minute,
      durationMinutes,
      playerGoldGain,
      counterpartGoldGain,
      playerGoldPerMinute: playerGoldGain / durationMinutes,
      counterpartGoldPerMinute: counterpartGoldGain === null ? null : counterpartGoldGain / durationMinutes,
      roleGapChange,
      ownTeamGoldGain,
      enemyTeamGoldGain,
      teamGapChange,
      playerTeamShareChangePct,
      kind: economicWindowKind(roleGapChange, teamGapChange, playerTeamShareChangePct)
    };
  });
  const deteriorationScore = (window: DotaEconomicWindow) => (
    Math.max(0, -(window.roleGapChange ?? 0)) / dotaEconomicSignalThresholds.roleGapGold
    + Math.max(0, -(window.teamGapChange ?? 0)) / dotaEconomicSignalThresholds.teamGapGold
    + Math.max(0, -(window.playerTeamShareChangePct ?? 0)) / dotaEconomicSignalThresholds.teamSharePercentagePoints
  );
  const criticalWindow = windows.reduce<DotaEconomicWindow | null>((critical, window) => {
    if (window.kind === "stable") return critical;
    return !critical || deteriorationScore(window) > deteriorationScore(critical) ? window : critical;
  }, null);
  const comparativeGoldSwing = criticalWindow?.roleGapChange !== null && criticalWindow?.roleGapChange !== undefined
    ? Math.max(0, -criticalWindow.roleGapChange)
    : null;
  const estimatedItemDelayMinutes = criticalWindow && comparativeGoldSwing && criticalWindow.playerGoldPerMinute > 0
    ? Math.round(comparativeGoldSwing / criticalWindow.playerGoldPerMinute * 10) / 10
    : null;
  const fullTimeline = completeTeams && timelinePlayerCount === 10;
  const completeComparison = checkpoints.length > 0 && checkpoints.every((checkpoint) => (
    checkpoint.counterpartGold !== null
    && checkpoint.ownTeamGold !== null
    && checkpoint.enemyTeamGold !== null
  ));
  const confidence: DotaEconomicConfidence = fullTimeline && completeComparison && counterpartSeries.length >= 2
    ? "high"
    : (counterpartSeries.length >= 2 || timelinePlayerCount >= 8) && playerSeries.length >= 2
      ? "medium"
      : "low";

  return {
    counterpart,
    counterpartSeries,
    checkpoints,
    windows,
    laneCheckpoint: checkpoints.find((checkpoint) => checkpoint.minute <= 10.1) ?? checkpoints[0] ?? null,
    finalCheckpoint: checkpoints.at(-1) ?? null,
    criticalWindow,
    comparativeGoldSwing,
    estimatedItemDelayMinutes,
    confidence,
    timelinePlayerCount,
    final: finalEconomicSnapshot(match, player, counterpart)
  };
}

export function createDotaMatchCheckpoints(player: DotaMatchPlayer, durationSeconds: number): DotaMatchCheckpoint[] {
  const series = createDotaMatchSeries(player);
  if (series.length < 2) return [];
  const endMinute = Math.min(durationSeconds / 60, series.at(-1)!.minute);
  const targets = checkpointTargets(endMinute);
  let previous = series[0]!;

  return targets.flatMap((target): DotaMatchCheckpoint[] => {
    const point = series.findLast((candidate) => candidate.minute <= target) ?? series[0]!;
    if (point.minute <= previous.minute && target !== targets[0]) return [];
    const minutes = Math.max(1 / 60, point.minute - previous.minute);
    const checkpoint = {
      minute: point.minute,
      totalGold: point.totalGold,
      lastHits: point.lastHits,
      intervalGoldPerMinute: Math.max(0, (point.totalGold - previous.totalGold) / minutes),
      intervalLastHits: Math.max(0, point.lastHits - previous.lastHits)
    };
    previous = point;
    return [checkpoint];
  });
}

const directMajorItems = new Set([
  "aghanims_shard",
  "blink",
  "gem",
  "hand_of_midas",
  "moon_shard",
  "rapier",
  "ultimate_scepter_2"
]);

export function getDotaMatchMajorPurchases(
  player: DotaMatchPlayer,
  items: DotaItemRecord[],
  role: DotaMatchRole,
  patchMatches: boolean,
  minimumSample = 200
): DotaMatchItemPurchase[] {
  const byKey = new Map(items.map((item) => [item.key, item]));
  const firstByKey = new Map<string, DotaMatchPurchase>();
  for (const purchase of player.purchases) {
    if (purchase.time < 0 || firstByKey.has(purchase.key)) continue;
    firstByKey.set(purchase.key, purchase);
  }

  return [...firstByKey.values()].flatMap((purchase): DotaMatchItemPurchase[] => {
    const item = byKey.get(purchase.key);
    if (!item || item.cost < 900 || (!item.created && !directMajorItems.has(item.key))) return [];
    const timing = item.timings[role];
    const benchmark = patchMatches && timing && timing.n >= Math.max(200, minimumSample) ? timing : null;
    const minute = purchase.time / 60;
    return [{
      key: item.key,
      name: item.name,
      image: item.image,
      cost: item.cost,
      minute,
      benchmark,
      deltaMinutes: benchmark ? minute - benchmark.median : null
    }];
  }).sort((left, right) => left.minute - right.minute).slice(0, 10);
}

export function buildDotaMatchAudit(
  match: DotaMatch,
  playerSlot: number,
  items: DotaItemRecord[],
  role: DotaMatchRole,
  currentPatchId: number,
  minimumSample = 200
): DotaMatchAudit | null {
  const player = match.players.find((candidate) => candidate.playerSlot === playerSlot);
  if (!player) return null;
  const timelineAvailable = hasDotaMatchTimeline(player);
  const checkpoints = timelineAvailable ? createDotaMatchCheckpoints(player, match.durationSeconds) : [];
  const majorPurchases = getDotaMatchMajorPurchases(player, items, role, match.patchId === currentPatchId, minimumSample);
  const reviewWindows = checkpoints.slice(1).length ? checkpoints.slice(1) : checkpoints;
  const slowestWindow = reviewWindows.length
    ? reviewWindows.reduce((slowest, checkpoint) => checkpoint.intervalGoldPerMinute < slowest.intervalGoldPerMinute ? checkpoint : slowest)
    : null;
  const comparable = majorPurchases.filter((purchase) => purchase.deltaMinutes !== null);
  const strongestItemDelta = comparable.length
    ? comparable.reduce((strongest, purchase) => Math.abs(purchase.deltaMinutes!) > Math.abs(strongest.deltaMinutes!) ? purchase : strongest)
    : null;
  const economy = buildDotaEconomicAutopsy(match, playerSlot);
  if (!economy) return null;

  return {
    player,
    role,
    timelineAvailable,
    checkpoints,
    series: timelineAvailable ? createDotaMatchSeries(player) : [],
    majorPurchases,
    slowestWindow,
    strongestItemDelta,
    economy
  };
}
