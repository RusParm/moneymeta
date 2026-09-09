import { gtaSessionCopy } from "../data/gta-session-copy";
import { calculateGtaSession, type GtaSessionInput, type GtaSessionKind, type GtaSessionSource } from "./gta-session";

type Control = HTMLInputElement | HTMLSelectElement;
export function initializeGtaSession(root: HTMLElement) {
  if (root.dataset.sessionReady) return;
  root.dataset.sessionReady = "true";
  const lang = root.dataset.lang === "ru" ? "ru" : "en";
  const c = gtaSessionCopy[lang];
  const query = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const field = (role: string) => query<Control>(`[data-role='${role}']`);
  const format = new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US");
  const money = (value: number) => `GTA$${format.format(value)}`;
  const sourceName = (source: GtaSessionSource, index: number) => `${index + 1}. ${c.kinds[source.kind]}`;

  function render() {
    const count = Number(field("sources").value);
    queryAllSources().forEach((section, i) => {
      section.hidden = i >= count;
      if (i >= count) {
        // Removed activities keep valid observations. An unfinished hidden edit
        // becomes its neutral default so it cannot block saving the active plan.
        section.querySelectorAll<HTMLInputElement>("input[data-role]").forEach((control) => {
          if (!control.value.trim() || !control.validity.valid) control.value = String(Math.min(Number(control.max), Math.max(Number(control.min), Number(control.defaultValue))));
        });
      }
      const limit = query<HTMLInputElement>(`[data-role='s${i}-runs']`);
      limit.max = field(`s${i}-kind`).value === "ready-sale" ? "1" : "240";
    });
    const activeControls = [...root.querySelectorAll<Control>("[data-role]")].filter((control) => {
      const parent = control.closest<HTMLElement>("[data-session-source]");
      return !parent?.hidden;
    });
    const complete = activeControls.every((control) => control.value.trim()
      && (control instanceof HTMLSelectElement || (control.validity.valid && Number.isFinite(Number(control.value)))));
    const input: GtaSessionInput = { minutesAvailable: Number(field("minutes").value),
      sources: Array.from({ length: count }, (_, i): GtaSessionSource => ({
        kind: field(`s${i}-kind`).value as GtaSessionKind,
        available: field(`s${i}-available`).value === "yes",
        cashPerRun: Number(field(`s${i}-cash`).value), minutesPerRun: Number(field(`s${i}-duration`).value),
        entryMinutes: Number(field(`s${i}-entry`).value), maxRuns: Number(field(`s${i}-runs`).value)
      })) };
    const result = complete ? calculateGtaSession(input) : null;
    root.dataset.scenarioValid = String(result !== null);
    query("[data-session-error]").hidden = result !== null;
    query("[data-session-result]").hidden = result === null;
    if (!result) return;
    const title = result.status === "no-positive-fit" ? c.noFit
      : result.status === "single" ? c.single : result.gainOverSolo > 0 ? c.mixed
        : lang === "ru" ? "Сочетание оставляет больше свободного времени" : "A mix leaves more time free";
    query("[data-session-decision]").textContent = title;
    query("[data-session-reason]").textContent = result.status === "no-positive-fit" ? c.noFitText
      : result.gainOverSolo > 0 ? c.mixedText : c.sameText;
    const metrics = { cash: money(result.best.cash), "solo-cash": money(result.solo.cash), gain: money(result.gainOverSolo), unused: format.format(result.best.unusedMinutes) };
    for (const [name, value] of Object.entries(metrics)) query(`[data-session-output='${name}']`).textContent = value;
    const blocks = query<HTMLOListElement>("[data-session-blocks]");
    blocks.replaceChildren();
    for (const block of result.best.blocks) {
      const row = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = `${sourceName(input.sources[block.sourceIndex]!, block.sourceIndex)} × ${block.runs}`;
      const values = document.createElement("span");
      values.textContent = `${block.totalMinutes} ${c.min} · ${money(block.cash)}`;
      const entry = document.createElement("small");
      entry.textContent = `${c.entryNote}: ${block.entryMinutes} ${c.min}`;
      row.append(name, values, entry); blocks.append(row);
    }
    query("[data-session-blocks-wrap]").hidden = result.best.blocks.length === 0;
    const solo = result.solo.blocks[0];
    query("[data-session-solo]").textContent = solo
      ? `${sourceName(input.sources[solo.sourceIndex]!, solo.sourceIndex)} × ${solo.runs} · ${solo.totalMinutes} ${c.min} · ${money(solo.cash)}`
      : c.soloNone;
  }
  const queryAllSources = () => [...root.querySelectorAll<HTMLElement>("[data-session-source]")];
  root.querySelector("form")!.addEventListener("submit", (event) => event.preventDefault());
  // Capture updates dependent fields before the shared scenario listeners save
  // the edited control, so changing type/count cannot save an intermediate state.
  root.addEventListener("input", (event) => { if ((event.target as HTMLElement).hasAttribute("data-role")) render(); }, true);
  root.addEventListener("change", (event) => {
    const control = event.target as Control;
    if (!control.hasAttribute("data-role")) return;
    const match = /^s(\d)-kind$/.exec(control.dataset.role ?? "");
    if (match && control.value === "ready-sale") {
      const runs = field(`s${match[1]}-runs`);
      if (Number(runs.value) > 1) runs.value = "1";
    }
    render();
  }, true);
  render();
}
