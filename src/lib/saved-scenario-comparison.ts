import type { SavedScenario } from "./saved-scenarios";

export interface ComparedScenarioInput {
  key: string;
  left: { label: string; value: string };
  right: { label: string; value: string };
}
export type SavedScenarioComparison =
  | { ok: false; reason: "same-record" | "different-tool" }
  | {
    ok: true;
    changedInputs: ComparedScenarioInput[];
    unchangedInputs: ComparedScenarioInput[];
    missingLabels: number;
    differentEngine: boolean;
    differentContext: boolean;
  };

/** Compare historical inputs only. Formatted results never become numeric claims. */
export function compareSavedScenarios(left: SavedScenario, right: SavedScenario): SavedScenarioComparison {
  if (left.id === right.id) return { ok: false, reason: "same-record" };
  if (left.toolKey !== right.toolKey) return { ok: false, reason: "different-tool" };
  const leftInputs = new Map(left.inputs?.map((row) => [row.key, row]));
  const rightInputs = new Map(right.inputs?.map((row) => [row.key, row]));
  const keys = [...new Set([...Object.keys(left.values), ...Object.keys(right.values)])];
  const changedInputs: ComparedScenarioInput[] = [];
  const unchangedInputs: ComparedScenarioInput[] = [];
  let missingLabels = 0;
  for (const key of keys) {
    const a = leftInputs.get(key);
    const b = rightInputs.get(key);
    // Raw select identifiers and old internal field names are not player-facing labels.
    if (!a || !b) { missingLabels++; continue; }
    const row: ComparedScenarioInput = { key, left: { label: a.label, value: a.value }, right: { label: b.label, value: b.value } };
    (left.values[key] === right.values[key] ? unchangedInputs : changedInputs).push(row);
  }
  return {
    ok: true, changedInputs, unchangedInputs, missingLabels,
    differentEngine: left.engineVersion !== right.engineVersion,
    // A translated source label alone is not evidence of a different source.
    // With no stable historical source identifier, expose both contexts conservatively.
    differentContext: left.context !== right.context
  };
}
