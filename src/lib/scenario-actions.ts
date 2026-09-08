import { getScenarioTool, type ScenarioLocale } from "../data/scenario-tools";
import { addSavedScenario, readSavedScenarios, savedScenarioIdFromHash, type SavedScenario, type ScenarioStorage } from "./saved-scenarios";

type Control = HTMLInputElement | HTMLSelectElement;
export const browserScenarioStorage: ScenarioStorage = {
  getItem: (key) => window.localStorage.getItem(key),
  setItem: (key, value) => window.localStorage.setItem(key, value)
};
const clean = (text: string | null | undefined) => (text ?? "").replace(/\s+/g, " ").trim();

function resultSnapshot(root: HTMLElement, key: string, lang: ScenarioLocale): SavedScenario["summary"] {
  if (key === "dota-compare") {
    return [...root.querySelectorAll<HTMLElement>("[data-compare-option]")].map((option) => ({
      label: `${clean(option.querySelector("[data-item-name]")?.textContent)} · ${lang === "ru" ? "прогноз, мин" : "projected minute"}`,
      value: clean(option.querySelector("[data-item-projected]")?.textContent)
    })).filter((row) => row.value && row.value !== "-");
  }
  const nodes = root.querySelectorAll<HTMLElement>(key === "dota-item-plan"
    ? ".dota-planner-summary > div" : ".result-metric, [data-runway-result] dl > div, .civ-model-result dl > div");
  const rows = [...nodes].map((node) => ({
    label: clean(node.querySelector("dt, span")?.textContent).slice(0, 120),
    value: clean(node.querySelector("dd, strong")?.textContent).slice(0, 160)
  })).filter((row) => row.label && row.value && row.value !== "-").slice(0, 4);
  if (key === "dota-item-plan") {
    const items = [...root.querySelectorAll<HTMLSelectElement>("select[data-role^='item']")].filter((select) => select.value).map((select) => clean(select.selectedOptions[0]?.textContent).split(" · ")[0]);
    if (items.length) rows.push({ label: lang === "ru" ? "Покупки" : "Purchases", value: items.join(" → ").slice(0, 160) });
  }
  return rows;
}

export function initializeScenarioActions() {
  const lang: ScenarioLocale = document.documentElement.lang === "ru" ? "ru" : "en";
  const ru = lang === "ru";
  const requestedId = savedScenarioIdFromHash(window.location.hash);
  const saved = requestedId ? readSavedScenarios(browserScenarioStorage) : null;
  const requested = saved?.ok ? saved.records.find((entry) => entry.id === requestedId) : undefined;
  const params = new URLSearchParams(window.location.search);
  let missingReported = false;

  document.querySelectorAll<HTMLElement>("[data-scenario-root]").forEach((root) => {
    if (root.dataset.scenarioReady === "true") return;
    const key = root.dataset.scenarioKey ?? "";
    const tool = getScenarioTool(key);
    const actions = root.querySelector<HTMLElement>("[data-scenario-actions]");
    const controls = [...root.querySelectorAll<Control>("input[data-role], select[data-role]")];
    if (!tool || !actions || !controls.length) return;
    root.dataset.scenarioReady = "true";
    const feedback = actions.querySelector<HTMLElement>("[data-scenario-feedback]")!;
    const say = (value: string) => { feedback.textContent = value; };
    const unavailable = () => say(actions.dataset.storageUnavailable ?? "");
    const defaults = Object.fromEntries(controls.map((control) => [control.dataset.role!, control instanceof HTMLSelectElement
      ? ([...control.options].find((option) => option.defaultSelected) ?? control.options[0])?.value ?? ""
      : control.defaultValue || control.value]));
    const storageKey = `money-meta:scenario:${key}:v1`;
    const values = () => Object.fromEntries(controls.map((control) => [control.dataset.role!, control.value]));
    const saveDraft = () => {
      try { localStorage.setItem(storageKey, JSON.stringify(values())); } catch { unavailable(); }
    };
    const dispatch = (control: Control) => control.dispatchEvent(new Event(control instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
    const apply = (input: Record<string, string>) => {
      let complete = true;
      // Preset selections may reset dependent fields. Apply every numeric override afterward.
      const ordered = [...controls.filter((c) => c instanceof HTMLSelectElement), ...controls.filter((c) => c instanceof HTMLInputElement)];
      ordered.forEach((control) => {
        const value = input[control.dataset.role!];
        if (typeof value !== "string") { complete = false; return; }
        if (control instanceof HTMLSelectElement) {
          if (![...control.options].some((option) => option.value === value)) { complete = false; return; }
          control.value = value;
        } else {
          const number = Number(value);
          if (!value.trim() || !Number.isFinite(number)) { complete = false; return; }
          const bounded = Math.min(control.max === "" ? Infinity : Number(control.max), Math.max(control.min === "" ? -Infinity : Number(control.min), number));
          if (bounded !== number) complete = false;
          control.value = String(bounded);
        }
        dispatch(control);
      });
      return complete;
    };

    const fromUrl = Object.fromEntries(controls.map((control) => [control.dataset.role!, params.get(`${key}.${control.dataset.role}`)
      ?? (root.dataset.legacyParams === "true" ? params.get(control.dataset.role!) : null)] as const).filter((entry): entry is [string, string] => entry[1] !== null));
    let draft: Record<string, string> = {};
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) draft = parsed as Record<string, string>;
    } catch { /* A broken draft never prevents the calculation or named saves. */ }
    const normalRestore = Object.keys(fromUrl).length ? fromUrl : draft;
    if (Object.keys(normalRestore).length) apply(normalRestore);

    const isRequested = requested?.toolKey === key && window.location.pathname.replace(/^\/en\//, "/") === tool.path;
    if (isRequested) {
      root.dispatchEvent(new CustomEvent("money-meta:restore-scenario", { bubbles: true }));
      // Older named plans do not contain newly introduced comparison fields.
      // Clear unrelated draft assumptions before restoring that historical plan.
      apply(defaults);
      const complete = apply(requested.values);
      say(complete ? (ru ? `Открыт «${requested.name}». Изменения можно сохранить копией.` : `Opened “${requested.name}”. Save changes as a new copy.`)
        : (ru ? "Часть полей изменилась с момента сохранения. Проверь вводные перед новым решением." : "Some fields have changed since saving. Review the inputs before deciding."));
      root.tabIndex = -1;
      root.focus({ preventScroll: true });
      root.scrollIntoView({ block: "start" });
      document.querySelectorAll<HTMLAnchorElement>(".lang-switch a").forEach((link) => { const url = new URL(link.href); url.hash = `saved=${requestedId}`; link.href = url.toString(); });
    } else if (requestedId && !requested && !missingReported) {
      say(ru ? "Этого расчёта нет в данном браузере. Открой «Мои расчёты» на устройстве, где он сохранён." : "This calculation is not in this browser. Open My calculations on the device where you saved it.");
      missingReported = true;
    }
    controls.forEach((control) => { control.addEventListener("input", saveDraft); control.addEventListener("change", saveDraft); });
    if (Object.keys(normalRestore).length || isRequested) saveDraft();

    actions.querySelector<HTMLButtonElement>("[data-share-scenario]")!.addEventListener("click", async () => {
      const url = new URL(window.location.href);
      url.search = "";
      controls.forEach((control) => url.searchParams.set(`${key}.${control.dataset.role}`, control.value));
      url.hash = tool.anchor;
      try { await navigator.clipboard.writeText(url.toString()); say(ru ? "Ссылка скопирована" : "Link copied"); }
      catch { window.prompt(ru ? "Скопируй ссылку" : "Copy this link", url.toString()); say(actions.dataset.manualCopy ?? ""); }
    });
    actions.querySelector<HTMLButtonElement>("[data-reset-scenario]")!.addEventListener("click", () => {
      apply(defaults);
      try { localStorage.removeItem(storageKey); } catch { unavailable(); }
      const url = new URL(window.location.href);
      [...url.searchParams.keys()].filter((name) => name.startsWith(`${key}.`) || (root.dataset.legacyParams === "true" && controls.some((control) => control.dataset.role === name))).forEach((name) => url.searchParams.delete(name));
      if (isRequested) url.hash = tool.anchor;
      history.replaceState({}, "", url);
      say(ru ? "Исходные значения восстановлены. Сохранённые расчёты остаются в списке." : "Defaults restored. Your saved calculations remain in the list.");
    });

    const open = actions.querySelector<HTMLButtonElement>("[data-open-save]")!;
    const editor = actions.querySelector<HTMLElement>("[data-save-editor]")!;
    const name = editor.querySelector<HTMLInputElement>("[data-save-name]")!;
    const saveButton = editor.querySelector<HTMLButtonElement>("[data-save-calculation]")!;
    const editorStatus = editor.querySelector<HTMLElement>("[data-save-status]")!;
    const close = () => { editor.hidden = true; open.setAttribute("aria-expanded", "false"); open.focus(); };
    open.hidden = false;
    open.addEventListener("click", () => {
      editor.hidden = false; open.setAttribute("aria-expanded", "true");
      name.value = isRequested ? `${requested.name.slice(0, 67)} ${ru ? "(копия)" : "(copy)"}` : tool.title[lang];
      editorStatus.textContent = ""; name.focus(); name.select();
    });
    editor.querySelector<HTMLButtonElement>("[data-cancel-save]")!.addEventListener("click", close);
    editor.addEventListener("keydown", (event) => { if (event.key === "Escape") { event.preventDefault(); close(); } });
    name.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); saveButton.click(); } });
    saveButton.addEventListener("click", () => {
      const invalid = controls.find((control) => control instanceof HTMLInputElement && (!control.value.trim() || !Number.isFinite(Number(control.value)) || control.validity.rangeOverflow || control.validity.rangeUnderflow));
      const missingItems = key === "dota-item-plan" && controls.filter((control) => ["item1", "item2"].includes(control.dataset.role ?? "")).some((control) => !control.value);
      if (invalid || missingItems || root.dataset.scenarioValid === "false" || !name.value.trim()) {
        editorStatus.textContent = ru ? "Укажи название и заполни вводные расчёта допустимыми значениями." : "Enter a name and valid calculation inputs.";
        (invalid ?? name).focus(); return;
      }
      const summary = resultSnapshot(root, key, lang);
      if (!summary.length) { editorStatus.textContent = ru ? "Сначала дождись результата расчёта." : "Wait for the calculation result first."; return; }
      const now = new Date().toISOString();
      const context = (JSON.parse(actions.dataset.contexts ?? "{}") as Record<string, string>)[key] ?? "";
      const record: SavedScenario = { id: crypto.randomUUID(), toolKey: key, name: name.value.trim(), lang, createdAt: now, updatedAt: now, values: values(), summary,
        context, engineVersion: actions.dataset.engine ?? "", note: "", reviewed: false };
      const result = addSavedScenario(browserScenarioStorage, record);
      if (!result.ok) {
        editorStatus.textContent = result.error === "limit" ? (ru ? "Сохранено 50 расчётов. Удали ненужный в «Мои расчёты», чтобы добавить новый." : "50 calculations saved. Remove an unneeded one in My calculations to add another.")
          : (ru ? "Не удалось сохранить. Проверь доступ к хранилищу браузера. Существующие записи не изменены." : "Could not save. Check browser storage access. Existing records are unchanged.");
        return;
      }
      close(); say(ru ? `«${record.name}» сохранён в «Мои расчёты».` : `“${record.name}” saved in My calculations.`);
    });
  });
}
