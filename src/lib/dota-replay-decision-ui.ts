import { getDotaReplayDecisionCopy } from "../data/dota-replay-decision-copy";
import {
  buildDotaReplayDecisionNote,
  evaluateDotaReplayDecision,
  initialDotaReplayDecisionObservations,
  type DotaReplayDecision,
  type DotaReplayDecisionObservationKey,
} from "./dota-replay-decision";

type Language = "ru" | "en";

export interface DotaReplayDecisionRenderOptions {
  lang: Language;
  heroName: (id: number) => string;
  openDraft: () => void;
  copyText: (text: string) => Promise<boolean>;
  onNoteChange: (note: string, nextMatchTask?: string) => void;
}

let renderSequence = 0;

const clock = (minute: number): string => {
  const seconds = Math.round(minute * 60);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/** Each render owns fresh, page-only observations. Updating an answer replaces
 * result text, never the active controls or their focus. No match data is edited.
 */
export function renderDotaReplayDecision(
  root: HTMLElement,
  decision: DotaReplayDecision | null,
  options: DotaReplayDecisionRenderOptions,
): void {
  root.replaceChildren();
  root.classList.add("match-replay-decision");
  root.hidden = !decision;
  root.removeAttribute("aria-labelledby");
  delete root.dataset.decisionKind;
  delete root.dataset.decisionId;
  delete root.dataset.observationStatus;
  options.onNoteChange("");
  if (!decision) return;

  const { lang, heroName } = options;
  const ru = lang === "ru";
  const copy = getDotaReplayDecisionCopy(lang);
  const prefix = `replay-decision-${++renderSequence}`;
  const observations = initialDotaReplayDecisionObservations();
  let observationRevision = 0;
  const controls = new Map<DotaReplayDecisionObservationKey, HTMLSelectElement>();
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string): HTMLElementTagNameMap[K] => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  root.dataset.decisionKind = decision.kind;
  root.dataset.decisionId = decision.id;

  const heading = make("h5", copy.title);
  heading.id = `${prefix}-title`;
  root.setAttribute("aria-labelledby", heading.id);
  root.append(heading, make("p", copy.intro));
  const purchase = make("p", undefined, "match-decision-purchase");
  purchase.append(make("strong", `${heroName(decision.heroId)} · ${decision.itemTitle[lang]} · ${decision.purchaseClock}`));
  purchase.append(make("span", ` · ${decision.phase === "before" ? copy.beforeLabel : copy.duringLabel} (${clock(decision.startMinute)}-${clock(decision.endMinute)})`));
  root.append(purchase);

  const evidence = make("details", undefined, "match-decision-evidence");
  evidence.append(make("summary", copy.evidenceLabel));
  evidence.append(make("p", `${copy.patchLabel}: ${decision.patchFamily}. ${copy.checkedLabel}: ${decision.checkedAt}.`, "match-decision-note"));
  evidence.append(make("p", ru
    ? "Журнал подтверждает время покупки. Он не подтверждает доставку, готовность или применение предмета в выбранный момент."
    : "The log records a purchase time. It does not establish delivery, readiness or use at the selected moment.", "match-decision-note"));
  if (decision.threats.length) {
    const threats = make("ul");
    for (const threat of decision.threats) {
      const row = make("li");
      row.append(make("strong", `${heroName(threat.heroId)} · ${threat.ability}: `), make("span", threat.mechanic[lang]));
      threats.append(row);
    }
    evidence.append(threats);
  }
  const limitations = make("ul", undefined, "match-decision-limitations");
  evidence.append(limitations);
  const sources = make("div", undefined, "match-decision-sources");
  let sourceNumber = 0;
  for (const value of [...new Set(decision.sourceUrls)]) {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      const source = make("a", `${copy.sourceLabel} ${++sourceNumber} · ${url.hostname}`);
      source.href = url.href;
      sources.append(source);
    } catch {
      // Invalid evidence URLs remain text-free rather than creating unsafe links.
    }
  }
  if (sources.childElementCount) evidence.append(sources);
  const draftButton = make("button", copy.draftLinkLabel, "mini-action");
  draftButton.type = "button";
  draftButton.addEventListener("click", options.openDraft);
  evidence.append(draftButton);
  root.append(evidence);

  const fieldset = make("fieldset", undefined, "match-decision-observations");
  fieldset.append(make("legend", copy.observationLabel));
  const fields = make("div", undefined, "match-decision-fields");
  const observationScope = make("p", copy.observationScope, "match-decision-note");
  observationScope.id = `${prefix}-scope`;
  fieldset.setAttribute("aria-describedby", observationScope.id);
  const yesNoOptions = [["unknown", copy.unknown], ["yes", copy.yes], ["no", copy.no]] as const;

  const addField = (
    key: DotaReplayDecisionObservationKey,
    label: string,
    choices: ReadonlyArray<readonly [string, string]>,
    hint?: string,
  ): void => {
    const wrapper = make("div", undefined, "match-decision-field");
    const controlLabel = make("label", label);
    const input = make("select");
    input.id = `${prefix}-${key}`;
    input.name = `${prefix}-${key}`;
    controlLabel.htmlFor = input.id;
    wrapper.append(controlLabel);
    for (const [value, title] of choices) {
      const option = make("option", title);
      option.value = value;
      input.append(option);
    }
    input.value = "unknown";
    wrapper.append(input);
    if (hint) {
      const more = make("details", undefined, "match-decision-field-help");
      more.append(make("summary", ru ? "Как проверить весь список" : "How to check the full list"));
      const description = make("span", hint, "match-decision-field-hint");
      description.id = `${input.id}-hint`;
      input.setAttribute("aria-describedby", `${observationScope.id} ${description.id}`);
      more.append(description);
      wrapper.append(more);
    } else input.setAttribute("aria-describedby", observationScope.id);
    input.addEventListener("change", () => {
      if (key === "threatState") {
        observations.threatState = input.value === "ready" || input.value === "answered" ? input.value : "unknown";
      } else {
        observations[key] = input.value === "yes" || input.value === "no" ? input.value : "unknown";
      }
      renderResults();
    });
    controls.set(key, input);
    fields.append(wrapper);
  };
  addField("itemReady", `${decision.itemTitle[lang]}: ${copy.itemReadyLabel}`, yesNoOptions);
  addField("alliesReady", copy.alliesReadyLabel, yesNoOptions);
  if (decision.kind === "bkb") {
    const threats = decision.threats.map((threat) => `${heroName(threat.heroId)} · ${threat.ability}`).join(", ");
    addField("threatState", `${copy.threatStateLabel}${threats ? ` (${threats})` : ""}`, [
      ["unknown", copy.unknown], ["ready", copy.threatReady], ["answered", copy.threatAnswered],
    ], copy.threatStateHint);
  } else {
    addField("targetVisible", copy.targetVisibleLabel, yesNoOptions);
  }
  fieldset.append(fields, observationScope);
  root.append(fieldset);

  const results = make("div", undefined, "match-decision-results");
  const summary = make("p", undefined, "match-decision-status");
  summary.setAttribute("role", "status");
  summary.setAttribute("aria-live", "polite");
  summary.setAttribute("aria-atomic", "true");
  const alternatives = make("div", undefined, "match-decision-alternatives");
  const task = make("section", undefined, "match-decision-task");
  const taskText = make("p");
  task.append(make("h6", copy.nextMatchTaskLabel), taskText);
  results.append(summary, make("h6", copy.alternativesLabel), alternatives, task, make("p", copy.boundary, "match-decision-note"));
  root.append(results);

  const actions = make("div", undefined, "match-decision-actions");
  const copyButton = make("button", copy.copyLabel, "mini-action");
  copyButton.type = "button";
  const resetButton = make("button", copy.resetLabel, "mini-action");
  resetButton.type = "button";
  const copyStatus = make("p", undefined, "match-decision-copy-status");
  copyStatus.setAttribute("role", "status");
  copyStatus.setAttribute("aria-live", "polite");
  actions.append(copyButton, resetButton, copyStatus);
  root.append(actions);

  function renderResults(): void {
    if (!decision) return;
    observationRevision += 1;
    const evaluation = evaluateDotaReplayDecision(decision, observations, lang, heroName);
    root.dataset.observationStatus = evaluation.status;
    summary.textContent = evaluation.summary;
    alternatives.replaceChildren();
    for (const alternative of evaluation.alternatives) {
      const card = make("article", undefined, "match-decision-alternative");
      card.dataset.status = alternative.status;
      const header = make("div", undefined, "match-decision-alternative-header");
      header.append(make("strong", alternative.title), make("span", copy[alternative.status], "match-decision-alternative-status"));
      const condition = make("p");
      condition.append(make("strong", `${copy.conditionLabel}: `), make("span", alternative.condition));
      const tradeoff = make("p");
      tradeoff.append(make("strong", `${copy.tradeoffLabel}: `), make("span", alternative.tradeoff));
      card.append(header, condition, tradeoff, make("p", alternative.reason, "match-decision-note"));
      alternatives.append(card);
    }
    taskText.textContent = evaluation.nextMatchTask;
    limitations.replaceChildren(...evaluation.limitations
      .filter((limit) => limit !== copy.observationScope && limit !== copy.boundary)
      .map((limit) => make("li", limit)));
    copyStatus.textContent = "";
    options.onNoteChange(buildDotaReplayDecisionNote(decision, observations, lang, heroName), evaluation.nextMatchTask);
  }

  resetButton.addEventListener("click", () => {
    Object.assign(observations, initialDotaReplayDecisionObservations());
    for (const control of controls.values()) control.value = "unknown";
    renderResults();
  });
  copyButton.addEventListener("click", async () => {
    const copiedRevision = observationRevision;
    copyButton.disabled = true;
    try {
      const succeeded = await options.copyText(buildDotaReplayDecisionNote(decision, observations, lang, heroName));
      if (copiedRevision === observationRevision) copyStatus.textContent = succeeded ? copy.copySucceeded : copy.copyFailed;
    } catch {
      if (copiedRevision === observationRevision) copyStatus.textContent = copy.copyFailed;
    } finally {
      copyButton.disabled = false;
    }
  });
  renderResults();
}
