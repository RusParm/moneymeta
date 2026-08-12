import type { DecisionPriority, GtaBusiness } from "../data/gta-businesses";

export interface BusinessMetrics {
  grossSale: number;
  netPerCycle: number;
  profitPerProductionHour: number;
  paybackProductionHours: number;
  virtualRoi: number;
}

export interface RecommendationInput {
  budget: number;
  weeklyHours: number;
  priority: DecisionPriority;
  maxFriction: number;
}

export interface BusinessRecommendation {
  business: GtaBusiness;
  metrics: BusinessMetrics;
  score: number;
  affordable: boolean;
}

export interface PortfolioResult {
  businesses: GtaBusiness[];
  setupCost: number;
  activeHours: number;
  weeklyProfit: number;
}

export interface GoalRunwayInput {
  bank: number;
  target: number;
  weeklyProfit: number;
  reserve: number;
}

export interface GoalRunwayMetrics {
  deployableCapital: number;
  gap: number;
  weeks: number;
  months: number;
  weeklyProgressPercent: number;
  isFunded: boolean;
}

export type BusinessRankingLens = "first-buy" | "solo-efficiency" | "production-income";

export function calculateBusinessMetrics(
  business: Pick<GtaBusiness, "setupCost" | "fullSale" | "supplyCost" | "productionHours">,
  saleBonusPercent = 0
): BusinessMetrics {
  const grossSale = business.fullSale * (1 + Math.max(0, saleBonusPercent) / 100);
  const netPerCycle = grossSale - business.supplyCost;
  const profitPerProductionHour = business.productionHours > 0
    ? netPerCycle / business.productionHours
    : 0;
  const paybackProductionHours = profitPerProductionHour > 0
    ? business.setupCost / profitPerProductionHour
    : Number.POSITIVE_INFINITY;
  const virtualRoi = business.setupCost > 0 ? (netPerCycle / business.setupCost) * 100 : 0;

  return {
    grossSale,
    netPerCycle,
    profitPerProductionHour,
    paybackProductionHours,
    virtualRoi
  };
}

function normalized(values: number[], invert = false): number[] {
  const finite = values.filter(Number.isFinite);
  const min = finite.length ? Math.min(...finite) : 0;
  const max = finite.length ? Math.max(...finite) : 0;
  const range = max - min;

  if (range === 0) {
    return values.map((value) => Number.isFinite(value) ? 1 : 0);
  }

  return values.map((value) => {
    const safeValue = Number.isFinite(value) ? value : max + range;
    const score = Math.min(1, Math.max(0, (safeValue - min) / range));
    return invert ? 1 - score : score;
  });
}

export function scoreBusinesses(businesses: GtaBusiness[]): BusinessRecommendation[] {
  const metrics = businesses.map((business) => calculateBusinessMetrics(business));
  const roi = normalized(metrics.map((item) => item.virtualRoi));
  const payback = normalized(metrics.map((item) => item.paybackProductionHours), true);
  const friction = normalized(businesses.map((item) => item.friction), true);

  return businesses.map((business, index) => ({
    business,
    metrics: metrics[index]!,
    score: (roi[index]! * 0.4 + payback[index]! * 0.4 + friction[index]! * 0.2) * 100,
    affordable: true
  }));
}

export function rankBusinessesByLens(
  businesses: GtaBusiness[],
  lens: BusinessRankingLens
): BusinessRecommendation[] {
  const metrics = businesses.map((business) => calculateBusinessMetrics(business));
  const income = normalized(metrics.map((item) => item.profitPerProductionHour));
  const payback = normalized(metrics.map((item) => item.paybackProductionHours), true);
  const roi = normalized(metrics.map((item) => item.virtualRoi));
  const friction = normalized(businesses.map((item) => item.friction), true);
  const solo = normalized(businesses.map((item) => item.soloSuitability));

  return businesses.map((business, index) => {
    let score = 0;

    if (lens === "first-buy") {
      score = payback[index]! * 0.4 + roi[index]! * 0.3 + friction[index]! * 0.15 + solo[index]! * 0.15;
    } else if (lens === "solo-efficiency") {
      score = solo[index]! * 0.4 + friction[index]! * 0.35 + income[index]! * 0.25;
    } else {
      score = income[index]! * 0.6 + roi[index]! * 0.2 + solo[index]! * 0.1 + friction[index]! * 0.1;
    }

    return {
      business,
      metrics: metrics[index]!,
      score: score * 100,
      affordable: true
    };
  }).sort((a, b) => b.score - a.score);
}

export function recommendBusinesses(
  businesses: GtaBusiness[],
  input: RecommendationInput
): BusinessRecommendation[] {
  const candidates = businesses.filter((business) =>
    business.setupCost <= input.budget && business.friction <= input.maxFriction
  );

  if (!candidates.length) return [];

  const metrics = candidates.map((business) => calculateBusinessMetrics(business));
  const income = normalized(metrics.map((item) => item.profitPerProductionHour));
  const payback = normalized(metrics.map((item) => item.paybackProductionHours), true);
  const roi = normalized(metrics.map((item) => item.virtualRoi));
  const friction = normalized(candidates.map((item) => item.friction), true);
  const solo = normalized(candidates.map((item) => item.soloSuitability));

  const result = candidates.map((business, index) => {
    const limitedTimeBoost = input.weeklyHours <= 6 ? friction[index]! * 0.08 + solo[index]! * 0.07 : 0;
    let score = 0;

    if (input.priority === "fast-payback") {
      score = payback[index]! * 0.55 + roi[index]! * 0.25 + friction[index]! * 0.2;
    } else if (input.priority === "max-income") {
      score = income[index]! * 0.6 + roi[index]! * 0.2 + solo[index]! * 0.2;
    } else {
      score = friction[index]! * 0.5 + solo[index]! * 0.3 + income[index]! * 0.2;
    }

    return {
      business,
      metrics: metrics[index]!,
      score: Math.min(100, (score + limitedTimeBoost) * 100),
      affordable: true
    };
  });

  return result.sort((a, b) => b.score - a.score);
}

export function findBestPortfolio(
  businesses: GtaBusiness[],
  budget: number,
  activeHoursBudget: number
): PortfolioResult | null {
  let best: PortfolioResult | null = null;

  for (let mask = 1; mask < (1 << businesses.length); mask += 1) {
    const picks: GtaBusiness[] = [];
    let setupCost = 0;
    let activeHours = 0;
    let weeklyProfit = 0;

    businesses.forEach((business, index) => {
      if (mask & (1 << index)) {
        picks.push(business);
        setupCost += business.setupCost;
        activeHours += business.activeMinutesPerCycle / 60;
        weeklyProfit += calculateBusinessMetrics(business).netPerCycle;
      }
    });

    if (setupCost <= budget && activeHours <= activeHoursBudget) {
      if (!best || weeklyProfit > best.weeklyProfit) {
        best = { businesses: picks, setupCost, activeHours, weeklyProfit };
      }
    }
  }

  return best;
}

export function calculateGoalRunway(input: GoalRunwayInput): GoalRunwayMetrics {
  const bank = Math.max(0, input.bank);
  const target = Math.max(0, input.target);
  const weeklyProfit = Math.max(0, input.weeklyProfit);
  const reserve = Math.max(0, input.reserve);
  const deployableCapital = Math.max(0, bank - reserve);
  const gap = Math.max(0, target - deployableCapital);
  const weeks = gap <= 0 ? 0 : weeklyProfit > 0 ? gap / weeklyProfit : Number.POSITIVE_INFINITY;

  return {
    deployableCapital,
    gap,
    weeks,
    months: Number.isFinite(weeks) ? weeks / 4.345 : Number.POSITIVE_INFINITY,
    weeklyProgressPercent: target > 0 ? Math.min(100, (weeklyProfit / target) * 100) : 100,
    isFunded: gap <= 0
  };
}

export function isSnapshotStale(validThrough: string, asOf = new Date()): boolean {
  const endOfValidity = new Date(`${validThrough}T23:59:59Z`);
  return asOf.getTime() > endOfValidity.getTime();
}

export function gradeForScore(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}
