import type { ScenarioLocale } from "./scenario-tools";

type LocalizedLabel = Record<ScenarioLocale, string>;
export interface ScenarioResultMetric {
  valueSelector: string;
  /** Normal metrics inherit the label next to their value in the result. */
  label?: LocalizedLabel;
  /** A dynamic name, such as a compared item, preceding the explicit label. */
  labelPrefixSelector?: string;
  /** Do not mistake a no-result headline for a selected option. */
  requiresValueSelector?: string;
  mode?: "selected-options" | "text-list";
}
export interface ScenarioResultPriority {
  metrics: readonly ScenarioResultMetric[];
  /** Read only these existing verdicts, in order; no generated recommendation. */
  decisionSelectors?: readonly string[];
}

const metric = (attribute: string, key: string): ScenarioResultMetric => ({ valueSelector: `[${attribute}="${key}"]` });
const roles = (...keys: string[]) => keys.map((key) => metric("data-role", key));
const outputs = (attribute: string, ...keys: string[]) => keys.map((key) => metric(attribute, key));
const attribute = (name: string): ScenarioResultMetric => ({ valueSelector: `[${name}]` });
const named = (valueSelector: string, ru: string, en: string, mode?: ScenarioResultMetric["mode"]): ScenarioResultMetric => ({ valueSelector, label: { ru, en }, ...(mode ? { mode } : {}) });

const investment: ScenarioResultPriority = {
  metrics: outputs("data-model-output", "netValue", "paybackPeriods", "roiPercent", "riskAdjustedIncome"),
  decisionSelectors: ["[data-model-verdict]"]
};
const reserve: ScenarioResultPriority = {
  metrics: outputs("data-decision-output", "cashAtTarget", "lowestCash", "firstBreach", "maxAdded"),
  decisionSelectors: ["[data-decision-answer]", "[data-model-verdict]"]
};
const goal: ScenarioResultPriority = {
  metrics: outputs("data-runway-output", "gap", "periods", "required-rate", "projected"),
  decisionSelectors: ["[data-runway-status-title]", "[data-runway-status-text]"]
};

/**
 * An editorial contract for each named-save tool, independent of DOM order.
 * Keep four useful outcomes instead of taking whichever numbers render first.
 * Selectors refer to existing result markup; missing results are never invented.
 */
export const scenarioResultPriorities: Readonly<Record<string, ScenarioResultPriority>> = {
  "gta-next-move": {
    metrics: [{ ...named('[data-role="result-name"]', "Выбранный бизнес", "Selected business"), requiresValueSelector: '[data-role="result-setup"]' }, ...roles("result-payback", "result-income", "result-setup")],
    decisionSelectors: ['[data-role="result-reason"]']
  },
  "gta-business": {
    metrics: roles("payback", "hourly", "month", "net"),
    decisionSelectors: ['[data-role="scenario-name"]', '[data-role="scenario-reason"]']
  },
  "gta-portfolio": {
    metrics: [named('[data-role="portfolio-picks"] > span', "Бизнесы", "Businesses", "text-list"), ...roles("portfolio-cost", "portfolio-time", "portfolio-week")]
  },
  "gta-inline-roi": {
    metrics: outputs("data-roi-output", "payback", "hourly", "monthly", "net"),
    decisionSelectors: ["[data-roi-name]", "[data-roi-reason]"]
  },
  "gta-hours-goal": {
    metrics: outputs("data-goal-output", "weeks", "gap", "deployable", "progress"),
    decisionSelectors: ["[data-goal-name]"]
  },
  "gta-inline-portfolio": {
    metrics: [named("[data-portfolio-picks] > span", "Бизнесы", "Businesses", "text-list"), ...outputs("data-portfolio-output", "cost", "time", "weekly")]
  },
  "gta-session": {
    metrics: outputs("data-session-output", "cash", "solo-cash", "gain", "unused"),
    decisionSelectors: ["[data-session-decision]", "[data-session-reason]"]
  },
  "dota-midas": {
    metrics: roles("midas-payback", "midas-net", "midas-uses", "midas-roi"),
    decisionSelectors: ['[data-role="midas-decision"]']
  },
  "dota-buyback": {
    metrics: roles("buyback-cost", "buyback-gap", "buyback-surplus", "buyback-objective-gold"),
    decisionSelectors: ['[data-role="buyback-decision"]']
  },
  "dota-compare": {
    metrics: [0, 1].map((index) => ({
      valueSelector: `[data-compare-option="${index}"] [data-item-projected]`,
      labelPrefixSelector: `[data-compare-option="${index}"] [data-item-name]`,
      label: { ru: "прогноз, мин", en: "projected minute" }
    })),
    decisionSelectors: ["[data-compare-summary]"]
  },
  "dota-item-plan": {
    metrics: [
      named("select[data-role^='item']", "Покупки", "Purchases", "selected-options"),
      attribute("data-plan-finish"), attribute("data-plan-total-cost"), attribute("data-plan-count")
    ]
  },
  "wow-market-ledger": {
    metrics: outputs("data-ledger-output", "liquidCapitalNow", "expectedInventoryCash", "inventoryAtRisk", "postCycleCash"),
    decisionSelectors: ["[data-ledger-verdict]"]
  },
  "wow-crafting": {
    metrics: roles("craft-cash", "craft-batch", "craft-inventory", "craft-upfront"),
    decisionSelectors: ['[data-role="craft-decision"]', "[data-craft-action]"]
  },
  "wow-farm": {
    metrics: roles("farm-effective", "farm-session-gold", "farm-target-hours", "farm-inventory"),
    decisionSelectors: ['[data-role="farm-decision"]']
  },
  "wow-order": {
    metrics: roles("order-economic-profit", "order-minimum", "order-gph", "order-batch"),
    decisionSelectors: ['[data-role="order-decision"]']
  },
  "total-war-building-payback": investment,
  "total-war-war-reserve": reserve,
  "total-war-conquest-choice": {
    metrics: outputs("data-model-output", "winner", "advantage", "optionAValue", "optionBValue"),
    decisionSelectors: ["[data-model-verdict]"]
  },
  "ck3-domain-payback": investment,
  "ck3-war-chest": reserve,
  "ck3-succession-buffer": reserve,
  "civ7-building": {
    metrics: ["data-result-payback", "data-result-net", "data-result-return", "data-result-active"].map(attribute),
    decisionSelectors: ["[data-result-title]"]
  },
  "civ7-comparison": {
    metrics: ["data-comparison-yield-a", "data-comparison-yield-b", "data-comparison-cost-a", "data-comparison-cost-b"].map(attribute),
    decisionSelectors: ["[data-comparison-title]", "[data-comparison-tradeoff]"]
  },
  "civ7-settlement": {
    metrics: ["data-result-payback", "data-result-net", "data-result-increment", "data-result-gain"].map(attribute),
    decisionSelectors: ["[data-result-title]"]
  },
  "civ7-victory": {
    metrics: ["data-result-remaining", "data-result-projected", "data-result-gap", "data-result-coverage"].map(attribute),
    decisionSelectors: ["[data-result-title]"]
  },
  "gta-goal-runway": goal,
  "dota-goal-runway": goal,
  "wow-goal-runway": goal,
  "total-war-goal-runway": goal,
  "ck3-goal-runway": goal
};
