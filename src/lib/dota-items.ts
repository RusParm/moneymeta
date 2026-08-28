export type DotaItemRole = "core" | "support";

export interface DotaItemTiming {
  n: number;
  p25: number;
  median: number;
  p75: number;
  purchaseRatePct: number;
}

export interface DotaItemAttribute {
  key: string;
  label: string;
  value: string;
}

export interface DotaItemAbility {
  type: string;
  title: string;
  description: string;
}

export interface DotaItemRecord {
  id: number;
  key: string;
  name: string;
  cost: number;
  quality: string;
  image: string;
  created: boolean;
  components: string[];
  attributes: DotaItemAttribute[];
  abilities: DotaItemAbility[];
  timings: Partial<Record<DotaItemRole, DotaItemTiming>>;
}

export interface DotaItemsSnapshot {
  schemaVersion: 1;
  provider: "opendota";
  fetchedAt: string;
  dataUpdatedAt?: string;
  dataHash: string;
  patch: { label: string; family: string; startedAt: string; sourceUrl: string };
  cohort: {
    matches: number;
    players: number;
    classifiedPlayers: number;
    roleCoveragePct: number;
    firstMatchAt: string;
    lastMatchAt: string;
    roles: Record<DotaItemRole, { players: number; matches: number }>;
  };
  methodology: {
    minimumSample: number;
    cohortRule: string;
    roleRule: string;
    timingRule: string;
    purchaseRateRule: string;
    catalogRule: string;
  };
  sources: Array<{ label: string; url: string }>;
  items: DotaItemRecord[];
}

export interface StatValueLine {
  key: string;
  label: { ru: string; en: string };
  quantity: number;
  goldPerUnit: number;
  goldValue: number;
  baseline: string;
}

export interface GoldEfficiencyResult {
  pricedValue: number;
  unpricedRemainder: number;
  efficiencyPct: number | null;
  lines: StatValueLine[];
}

interface PricingRule {
  keys: string[];
  label: { ru: string; en: string };
  goldPerUnit: number;
  baseline: string;
  multiplier?: number;
}

export const statPricingRules: PricingRule[] = [
  { keys: ["bonus_strength"], label: { ru: "сила", en: "strength" }, goldPerUnit: 140 / 3, baseline: "Gauntlets of Strength" },
  { keys: ["bonus_agility"], label: { ru: "ловкость", en: "agility" }, goldPerUnit: 140 / 3, baseline: "Slippers of Agility" },
  { keys: ["bonus_intellect"], label: { ru: "интеллект", en: "intelligence" }, goldPerUnit: 140 / 3, baseline: "Mantle of Intelligence" },
  { keys: ["bonus_all_stats"], label: { ru: "все атрибуты", en: "all attributes" }, goldPerUnit: 140 / 3, multiplier: 3, baseline: "Gauntlets + Slippers + Mantle" },
  { keys: ["bonus_damage"], label: { ru: "урон", en: "damage" }, goldPerUnit: 450 / 9, baseline: "Blades of Attack" },
  { keys: ["bonus_attack_speed"], label: { ru: "скорость атаки", en: "attack speed" }, goldPerUnit: 450 / 20, baseline: "Gloves of Haste" },
  { keys: ["bonus_armor"], label: { ru: "броня", en: "armor" }, goldPerUnit: 175 / 2, baseline: "Ring of Protection" },
  { keys: ["bonus_health"], label: { ru: "здоровье", en: "health" }, goldPerUnit: 250 / 125, baseline: "Fluffy Hat" },
  { keys: ["bonus_mana"], label: { ru: "мана", en: "mana" }, goldPerUnit: 800 / 250, baseline: "Energy Booster" },
  { keys: ["movement_speed", "bonus_movement_speed", "bonus_movement"], label: { ru: "скорость передвижения", en: "movement speed" }, goldPerUnit: 225 / 15, baseline: "Wind Lace" },
  { keys: ["bonus_mana_regen", "mana_regen"], label: { ru: "восстановление маны", en: "mana regeneration" }, goldPerUnit: 175 / 0.7, baseline: "Sage's Mask" },
  { keys: ["bonus_health_regen", "health_regen"], label: { ru: "восстановление здоровья", en: "health regeneration" }, goldPerUnit: 175 / 1.25, baseline: "Ring of Regen" },
  { keys: ["tooltip_resist"], label: { ru: "сопротивление магии", en: "magic resistance" }, goldPerUnit: 900 / 18, baseline: "Cloak" },
  { keys: ["lifesteal_percent"], label: { ru: "вампиризм", en: "lifesteal" }, goldPerUnit: 900 / 18, baseline: "Morbid Mask" },
  { keys: ["bonus_evasion"], label: { ru: "уклонение", en: "evasion" }, goldPerUnit: 1300 / 15, baseline: "Talisman of Evasion" }
];

const firstNumber = (value: string) => {
  const match = value.replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
};

export function calculateGoldEfficiency(item: DotaItemRecord): GoldEfficiencyResult {
  const lines: StatValueLine[] = [];

  for (const rule of statPricingRules) {
    const attribute = rule.keys
      .map((key) => item.attributes.find((candidate) => candidate.key === key))
      .find(Boolean);
    if (!attribute) continue;
    const quantity = firstNumber(attribute.value);
    if (!Number.isFinite(quantity) || quantity <= 0) continue;
    const goldValue = quantity * rule.goldPerUnit * (rule.multiplier ?? 1);
    lines.push({
      key: attribute.key,
      label: rule.label,
      quantity,
      goldPerUnit: rule.goldPerUnit * (rule.multiplier ?? 1),
      goldValue,
      baseline: rule.baseline
    });
  }

  const pricedValue = lines.reduce((sum, line) => sum + line.goldValue, 0);
  return {
    pricedValue,
    unpricedRemainder: item.cost - pricedValue,
    efficiencyPct: item.cost > 0 && lines.length ? 100 * pricedValue / item.cost : null,
    lines
  };
}

export function hasReliableTiming(item: DotaItemRecord, role: DotaItemRole, minimumSample = 200) {
  const timing = item.timings[role];
  return Boolean(timing && timing.n >= minimumSample);
}

export interface ItemComparisonInput {
  itemKeys: string[];
  availableGold: number;
  goldPerMinute: number;
  currentMinute: number;
  role: DotaItemRole;
  minimumSample?: number;
}

export interface ItemComparisonOption {
  item: DotaItemRecord;
  goldNeeded: number;
  goldLeftNow: number;
  minutesToAfford: number | null;
  projectedMinute: number | null;
  benchmark: DotaItemTiming | null;
}

/** Each alternative starts with the same budget. This is not a purchase queue. */
export function compareDotaItems(items: DotaItemRecord[], input: ItemComparisonInput): ItemComparisonOption[] {
  const bounded = (value: number, maximum: number) => Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0;
  const gold = bounded(input.availableGold, 100_000);
  const gpm = bounded(input.goldPerMinute, 2_500);
  const minute = bounded(input.currentMinute, 180);
  const threshold = Math.max(200, Number.isFinite(input.minimumSample) ? input.minimumSample! : 200);
  const byKey = new Map(items.map((item) => [item.key, item]));
  return input.itemKeys.slice(0, 2).flatMap((key) => {
    const item = byKey.get(key);
    if (!item) return [];
    const goldNeeded = Math.max(0, item.cost - gold);
    const minutesToAfford = goldNeeded === 0 ? 0 : gpm > 0 ? goldNeeded / gpm : null;
    const timing = item.timings[input.role];
    return [{
      item,
      goldNeeded,
      goldLeftNow: Math.max(0, gold - item.cost),
      minutesToAfford,
      projectedMinute: minutesToAfford === null ? null : minute + minutesToAfford,
      benchmark: timing && timing.n >= threshold ? timing : null
    }];
  });
}

/** Missing explicit stats remain unknown; they are not converted to zero. */
export function getComparableAttributes(items: DotaItemRecord[]) {
  return statPricingRules.flatMap((rule) => {
    const values = items.map((item) => rule.keys.map((key) => item.attributes.find((attribute) => attribute.key === key)).find(Boolean)?.value ?? null);
    return values.some((value) => value !== null) ? [{ label: rule.label, values }] : [];
  });
}

export type ItemPlanState = "ahead" | "on-pace" | "late" | "no-benchmark";

export interface ItemPlanRow {
  item: DotaItemRecord;
  order: number;
  cumulativeCost: number;
  projectedMinute: number;
  benchmark: DotaItemTiming | null;
  deltaMinutes: number | null;
  moveFirstGainMinutes: number;
  state: ItemPlanState;
}

export interface ItemPlanInput {
  role: DotaItemRole;
  currentMinute: number;
  goldPerMinute: number;
  startingGold: number;
  itemKeys: string[];
  minimumSample?: number;
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

export function calculateItemPlan(items: DotaItemRecord[], input: ItemPlanInput): ItemPlanRow[] {
  const role = input.role;
  const currentMinute = clamp(Number.isFinite(input.currentMinute) ? input.currentMinute : 0, 0, 180);
  const goldPerMinute = clamp(Number.isFinite(input.goldPerMinute) ? input.goldPerMinute : 1, 1, 2_500);
  const startingGold = clamp(Number.isFinite(input.startingGold) ? input.startingGold : 0, 0, 100_000);
  const minimumSample = input.minimumSample ?? 200;
  const byKey = new Map(items.map((item) => [item.key, item]));
  const selected = input.itemKeys.slice(0, 5).map((key) => byKey.get(key)).filter((item): item is DotaItemRecord => Boolean(item));
  let cumulativeCost = 0;

  return selected.map((item, index) => {
    cumulativeCost += item.cost;
    const projectedMinute = currentMinute + Math.max(0, cumulativeCost - startingGold) / goldPerMinute;
    const movedFirstMinute = currentMinute + Math.max(0, item.cost - startingGold) / goldPerMinute;
    const timing = item.timings[role];
    const benchmark = timing && timing.n >= minimumSample ? timing : null;
    const deltaMinutes = benchmark ? projectedMinute - benchmark.median : null;
    const state: ItemPlanState = deltaMinutes === null
      ? "no-benchmark"
      : deltaMinutes < -2
        ? "ahead"
        : deltaMinutes > 2
          ? "late"
          : "on-pace";

    return {
      item,
      order: index + 1,
      cumulativeCost,
      projectedMinute,
      benchmark,
      deltaMinutes,
      moveFirstGainMinutes: Math.max(0, projectedMinute - movedFirstMinute),
      state
    };
  });
}

export function validateDotaItemsSnapshot(snapshot: unknown): snapshot is DotaItemsSnapshot {
  if (!snapshot || typeof snapshot !== "object") return false;
  const candidate = snapshot as Partial<DotaItemsSnapshot>;
  return candidate.schemaVersion === 1
    && candidate.provider === "opendota"
    && typeof candidate.fetchedAt === "string"
    && Boolean(candidate.patch?.label && candidate.patch?.family)
    && typeof candidate.cohort?.matches === "number"
    && Array.isArray(candidate.items)
    && candidate.items.length > 0
    && candidate.items.every((item) => Number.isInteger(item.id) && item.cost > 0 && Boolean(item.key) && Boolean(item.name));
}
