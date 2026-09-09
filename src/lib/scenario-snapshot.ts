import { scenarioResultPriorities, type ScenarioResultMetric } from "../data/scenario-result-priorities";
import type { ScenarioLocale } from "../data/scenario-tools";

export interface ScenarioSnapshot {
  summary: Array<{ label: string; value: string }>;
  inputs: Array<{ key: string; label: string; value: string }>;
  decision?: string;
}
type Control = HTMLInputElement | HTMLSelectElement;
const clean = (text: string | null | undefined, limit: number) => (text ?? "").replace(/\s+/g, " ").trim().slice(0, limit);
const hasValue = (value: string) => Boolean(value) && value !== "-";
const available = (node: Element | null): node is Element => Boolean(node && !node.closest('[hidden], [aria-hidden="true"]'));

/** Read a label without its nested input, option list, dynamic output or help. */
function labelText(node: Node, excludedIds: ReadonlySet<string>): string {
  if (node.nodeType === 3) return node.textContent ?? "";
  if (node.nodeType !== 1) return "";
  const element = node as Element;
  if (["INPUT", "SELECT", "TEXTAREA", "OPTION", "OUTPUT", "SMALL", "BUTTON", "SCRIPT", "STYLE"].includes(element.tagName)
    || element.hasAttribute("hidden") || element.getAttribute("aria-hidden") === "true"
    || excludedIds.has(element.id) || element.matches(".hint, .help, [data-hint], [role='tooltip']")) return "";
  return [...element.childNodes].map((child) => labelText(child, excludedIds)).join(" ");
}

function inputLabel(control: Control): string {
  const excludedIds = new Set((control.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean));
  const labels = [...(control.labels ?? [])];
  const associated = labels.map((label) => labelText(label, excludedIds)).join(" ");
  const label = clean(associated || control.getAttribute("aria-label"), 120);
  if (!label) return "";
  const fieldset = control.closest("fieldset");
  const legend = [...(fieldset?.children ?? [])].find((child) => child.tagName === "LEGEND");
  const group = legend ? clean(labelText(legend, excludedIds), 120) : "";
  return clean(group ? `${group} · ${label}` : label, 120);
}

function readMetric(root: HTMLElement, metric: ScenarioResultMetric, lang: ScenarioLocale): ScenarioSnapshot["summary"][number] | null {
  if (metric.requiresValueSelector) {
    const required = root.querySelector(metric.requiresValueSelector);
    if (!available(required) || !hasValue(clean(required.textContent, 160))) return null;
  }
  const nodes = [...root.querySelectorAll<HTMLElement>(metric.valueSelector)].filter(available);
  const node = nodes[0];
  if (!node) return null;
  let value: string;
  if (metric.mode === "selected-options") {
    value = nodes.filter((item) => item.tagName === "SELECT" && Boolean((item as HTMLSelectElement).value))
      .map((item) => clean((item as HTMLSelectElement).selectedOptions[0]?.textContent, 160).split(" · ")[0]).filter(Boolean).join(" → ");
  } else if (metric.mode === "text-list") {
    value = nodes.map((item) => clean(item.textContent, 160)).filter(hasValue).join(" · ");
  } else value = clean(node.textContent, 160);

  let label = metric.label?.[lang] ?? "";
  if (!label) {
    const siblingLabel = [...(node.parentElement?.children ?? [])].find((child) => child !== node && ["SPAN", "DT"].includes(child.tagName));
    label = clean(siblingLabel?.textContent, 120);
  }
  if (metric.labelPrefixSelector) {
    const prefixNode = root.querySelector(metric.labelPrefixSelector);
    const prefix = available(prefixNode) ? clean(prefixNode.textContent, 120) : "";
    if (!hasValue(prefix)) return null;
    label = `${prefix} · ${label}`;
  }
  const row = { label: clean(label, 120), value: clean(value, 160) };
  return row.label && hasValue(row.value) ? row : null;
}

/** Snapshot current visible results and labelled controls; no calculation or storage access. */
export function captureScenarioSnapshot(root: HTMLElement, key: string, lang: ScenarioLocale): ScenarioSnapshot {
  const priority = scenarioResultPriorities[key];
  const summary = (priority?.metrics ?? []).map((metric) => readMetric(root, metric, lang))
    .filter((row): row is ScenarioSnapshot["summary"][number] => row !== null).slice(0, 4);
  const inputs: ScenarioSnapshot["inputs"] = [];
  const seenKeys = new Set<string>();
  for (const control of root.querySelectorAll<Control>("input[data-role], select[data-role]")) {
    if (inputs.length >= 40) break;
    const inputKey = control.dataset.role ?? "";
    if (!inputKey || seenKeys.has(inputKey) || control.getAttribute("type") === "hidden") continue;
    const label = inputLabel(control);
    if (!label) continue;
    const value = clean(control.tagName === "SELECT" ? (control as HTMLSelectElement).selectedOptions[0]?.textContent : control.value, 160);
    inputs.push({ key: inputKey, label, value });
    seenKeys.add(inputKey);
  }
  const decisionParts = (priority?.decisionSelectors ?? []).map((selector) => {
    const node = root.querySelector(selector);
    return available(node) ? clean(node.textContent, 360) : "";
  }).filter(hasValue);
  const uniqueDecisionParts = [...new Set(decisionParts)];
  const decision = clean(uniqueDecisionParts.map((part, index) =>
    index < uniqueDecisionParts.length - 1 && !/[.!?…:;]["'»”’\])]*$/.test(part) ? `${part}.` : part
  ).join(" "), 360);
  return { summary, inputs, ...(decision ? { decision } : {}) };
}
