import { getScenarioTool, scenarioGames, type ScenarioLocale } from "../data/scenario-tools";
import { addSavedScenario, deleteSavedScenario, editSavedScenario, readSavedScenarios, savedScenarioHref, savedScenariosKey, type SavedScenario, type ScenarioStorage } from "./saved-scenarios";
import { compareSavedScenarios, type ComparedScenarioInput } from "./saved-scenario-comparison";

const storage: ScenarioStorage = { getItem: (key) => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) };
const element = <K extends keyof HTMLElementTagNameMap>(tag: K, text = "", className = "") => {
  const node = document.createElement(tag); node.textContent = text; node.className = className; return node;
};
const button = (text: string, action: () => void) => { const node = element("button", text); node.type = "button"; node.addEventListener("click", action); return node; };

export function initializeSavedScenariosPage() {
  const root = document.querySelector<HTMLElement>("[data-saved-page]");
  if (!root) return;
  const lang: ScenarioLocale = document.documentElement.lang === "ru" ? "ru" : "en";
  const ru = lang === "ru";
  const contexts = JSON.parse(root.dataset.contexts ?? "{}") as Record<ScenarioLocale, Record<string, string>>;
  const list = root.querySelector<HTMLElement>("[data-saved-list]")!;
  const message = root.querySelector<HTMLElement>("[data-saved-message]")!;
  const game = root.querySelector<HTMLSelectElement>("[data-saved-game]")!;
  const state = root.querySelector<HTMLSelectElement>("[data-saved-state]")!;
  const empty = root.querySelector<HTMLElement>("[data-saved-empty]")!;
  const more = root.querySelector<HTMLButtonElement>("[data-saved-more]")!;
  const clear = root.querySelector<HTMLButtonElement>("[data-clear-filters]")!;
  const undo = root.querySelector<HTMLElement>("[data-saved-undo]")!;
  const comparison = root.querySelector<HTMLElement>("[data-saved-comparison]")!;
  const partner = root.querySelector<HTMLSelectElement>("[data-comparison-partner]")!;
  const comparisonContent = root.querySelector<HTMLElement>("[data-comparison-content]")!;
  const comparisonStatus = root.querySelector<HTMLElement>("[data-comparison-status]")!;
  const date = new Intl.DateTimeFormat(ru ? "ru-RU" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
  let shown = 12;
  let removed: SavedScenario | null = null;
  let comparisonIds: string[] = [];
  const error = () => { message.textContent = ru ? "Не удалось прочитать или изменить список. Проверь доступ к хранилищу браузера. Существующие записи не перезаписаны." : "Could not read or change the list. Check browser storage access. Existing records have not been overwritten."; };
  const params = new URLSearchParams(window.location.search);
  if ([...game.options].some((option) => option.value === params.get("game"))) game.value = params.get("game")!;
  if ([...state.options].some((option) => option.value === params.get("state"))) state.value = params.get("state")!;

  function historicalResult(record: SavedScenario) {
    const box = element("article", "", "saved-comparison-result");
    box.append(element("h3", record.name));
    const time = element("time", date.format(new Date(record.createdAt))); time.dateTime = record.createdAt; box.append(time);
    if (record.decision) box.append(element("p", record.decision, "saved-decision"));
    const results = element("dl", "", "saved-result");
    for (const row of record.summary) {
      const line = element("div"); line.append(element("dt", row.label), element("dd", row.value)); results.append(line);
    }
    box.append(results);
    if (record.lang !== lang) box.append(element("p", ru ? "Подписи сохранены на английском." : "Labels were saved in Russian.", "saved-context"));
    box.append(element("p", `${ru ? "Версия" : "Version"}: ${record.engineVersion}${record.context ? ` · ${record.context}` : ""}`, "saved-context"));
    const open = element("a", ru ? "Открыть расчёт" : "Open calculation", "saved-resume"); open.href = savedScenarioHref(record, lang)!;
    const actions = element("div", "", "saved-card-actions"); actions.append(open); box.append(actions);
    return box;
  }

  function inputRows(rows: ComparedScenarioInput[], names: [string, string]) {
    const table = element("table", "", "saved-input-comparison");
    const head = element("thead"); const titles = element("tr");
    names.forEach((name) => { const title = element("th", name); title.scope = "col"; titles.append(title); });
    head.append(titles); table.append(head);
    const body = element("tbody");
    rows.forEach((row) => {
      const line = element("tr");
      [row.left, row.right].forEach((input) => {
        const cell = element("td"); cell.append(element("span", input.label), element("strong", input.value || (ru ? "Не выбрано" : "Not selected"))); line.append(cell);
      });
      body.append(line);
    });
    table.append(body); return table;
  }

  function renderComparison(records: SavedScenario[]) {
    const first = records.find((record) => record.id === comparisonIds[0]);
    comparison.hidden = !first;
    comparisonContent.replaceChildren();
    if (!first) { comparisonIds = []; return; }
    const candidates = records.filter((record) => record.toolKey === first.toolKey && record.id !== first.id);
    const second = candidates.find((record) => record.id === comparisonIds[1]);
    comparisonIds = second ? [first.id, second.id] : [first.id];
    root!.querySelector<HTMLElement>("[data-comparison-base]")!.textContent = `${getScenarioTool(first.toolKey)!.title[lang]} · ${ru ? "Первый вариант" : "First variant"}: ${first.name}`;
    const placeholder = element("option", ru ? "Выбери сохранённый вариант" : "Choose a saved variant"); placeholder.value = "";
    partner.replaceChildren(placeholder, ...candidates.map((record) => {
      const option = element("option", `${record.name} · ${date.format(new Date(record.createdAt))}`); option.value = record.id; return option;
    }));
    partner.disabled = candidates.length === 0;
    partner.value = second?.id ?? "";
    comparisonStatus.textContent = candidates.length === 0
      ? (ru ? "Пока сохранён один вариант этой задачи. Открой расчёт, измени вводные и сохрани копию." : "Only one variant of this task is saved. Open it, change the inputs and save a copy.")
      : !second ? (ru ? "В списке доступны все сохранения этой задачи, включая уже проверенные в игре." : "The list includes every saved variant of this task, including those reviewed after playing.") : "";
    if (!second) {
      const open = element("a", ru ? "Открыть первый вариант" : "Open the first variant", "saved-resume"); open.href = savedScenarioHref(first, lang)!;
      const actions = element("div", "", "saved-card-actions"); actions.append(open); comparisonContent.append(actions); return;
    }
    const compared = compareSavedScenarios(first, second);
    if (!compared.ok) return;
    comparisonContent.append(element("p", ru ? "Результаты на момент сохранения. Разные сроки, ресурсы и допущения могут менять смысл сравнения." : "Results at the time of saving. Different deadlines, resources and assumptions can change what this comparison means.", "saved-context"));
    if (compared.differentEngine || compared.differentContext) comparisonContent.append(element("p", ru
      ? "Версии модели или сохранённые описания данных различаются. Разницу результатов нельзя объяснить только вводными. Открой оба расчёта, чтобы проверить их в текущей версии."
      : "Model versions or saved data descriptions differ. Inputs alone may not explain the result difference. Open both calculations to review them in the current version.", "saved-version-change"));
    const results = element("div", "", "saved-comparison-results"); results.append(historicalResult(first), historicalResult(second)); comparisonContent.append(results);
    comparisonContent.append(element("h3", ru ? "Что изменилось во вводных" : "Which inputs changed"));
    const names: [string, string] = [first.name, second.name];
    if (compared.changedInputs.length) {
      comparisonContent.append(inputRows(compared.changedInputs.slice(0, 6), names));
      if (compared.changedInputs.length > 6) {
        const extra = element("details", "", "saved-comparison-details");
        extra.append(element("summary", `${ru ? "Ещё изменённых вводных" : "More changed inputs"}: ${compared.changedInputs.length - 6}`), inputRows(compared.changedInputs.slice(6), names)); comparisonContent.append(extra);
      }
    } else if (!compared.missingLabels) comparisonContent.append(element("p", ru ? "Сохранённые вводные совпадают." : "The saved inputs are identical.", "saved-context"));
    if (compared.missingLabels) comparisonContent.append(element("p", ru
      ? "В одном из вариантов часть вводных сохранена без подписей. Для этих полей сравнение недоступно; исходные значения можно проверить через «Открыть расчёт»."
      : "Some inputs in one variant were saved without labels. Those fields cannot be compared here; use Open calculation to review their original values.", "saved-context"));
    if (compared.unchangedInputs.length) {
      const same = element("details", "", "saved-comparison-details");
      same.append(element("summary", `${ru ? "Одинаковые вводные" : "Identical inputs"}: ${compared.unchangedInputs.length}`), inputRows(compared.unchangedInputs, names)); comparisonContent.append(same);
    }
  }

  function card(record: SavedScenario) {
    const tool = getScenarioTool(record.toolKey)!;
    const article = element("article", "", "saved-card");
    article.dataset.savedId = record.id;
    const top = element("div", "", "saved-card-top");
    top.append(element("p", `${scenarioGames[tool.game].name} · ${tool.title[lang]}`, "saved-tool"));
    const time = element("time", date.format(new Date(record.createdAt))); time.dateTime = record.createdAt; top.append(time);
    article.append(top, element("h2", record.name));
    article.append(element("p", ru ? "Результат при сохранении" : "Result when saved", "saved-result-label"));
    if (record.decision) article.append(element("p", record.decision, "saved-decision"));
    const result = element("dl", "", "saved-result");
    record.summary.forEach((row) => { const line = element("div"); line.append(element("dt", row.label), element("dd", row.value)); result.append(line); });
    article.append(result);
    if (record.lang !== lang) article.append(element("p", ru ? "Подписи результата сохранены на английском." : "Result labels were saved in Russian.", "saved-context"));
    if (record.context) article.append(element("p", `${ru ? "Контекст при сохранении" : "Context when saved"}: ${record.context}`, "saved-context"));
    if (record.engineVersion !== root!.dataset.engine || record.context !== contexts[record.lang]?.[record.toolKey]) {
      article.append(element("p", ru ? "Модель или её данные обновились. Открой расчёт и проверь новый результат перед решением." : "The model or its data has changed. Reopen the calculation and check the new result before deciding.", "saved-version-change"));
    }
    if (record.note) {
      const note = element("div", "", "saved-outcome");
      note.append(element("strong", ru ? "После игры" : "After playing"), element("p", record.note)); article.append(note);
    }
    if (record.reviewed) article.append(element("p", ru ? "Отмечено тобой: проверено в игре" : "Marked by you: reviewed after playing", "saved-reviewed"));
    const actions = element("div", "", "saved-card-actions");
    const resume = element("a", ru ? "Открыть расчёт" : "Open calculation", "saved-resume"); resume.href = savedScenarioHref(record, lang)!;
    const editor = element("div", "", "saved-card-editor"); editor.hidden = true;
    const nameLabel = element("label", ru ? "Название" : "Name");
    const name = element("input"); name.type = "text"; name.maxLength = 80; name.value = record.name; nameLabel.append(name);
    const noteLabel = element("label", ru ? "Что получилось после игры" : "What happened after playing");
    const note = element("textarea"); note.maxLength = 500; note.rows = 3; note.value = record.note;
    note.placeholder = ru ? "Например: за два часа заработал 8 000; часть товара ещё не продана." : "For example: earned 8,000 in two hours; some stock has not sold yet."; noteLabel.append(note);
    const reviewedLabel = element("label", "", "saved-check"); const reviewed = element("input"); reviewed.type = "checkbox"; reviewed.checked = record.reviewed;
    reviewedLabel.append(reviewed, document.createTextNode(ru ? "Проверил этот план в игре" : "I reviewed this plan after playing"));
    const editorStatus = element("p"); editorStatus.setAttribute("role", "status");
    const edit = button(ru ? "Добавить итог / изменить" : "Add outcome / edit", () => {
      editor.hidden = !editor.hidden; edit.setAttribute("aria-expanded", String(!editor.hidden)); if (!editor.hidden) note.focus();
    }); edit.setAttribute("aria-expanded", "false");
    const save = button(ru ? "Сохранить заметку" : "Save note", () => {
      if (!name.value.trim()) { editorStatus.textContent = ru ? "Укажи название." : "Enter a name."; name.focus(); return; }
      const update = editSavedScenario(storage, record.id, { name: name.value.trim(), note: note.value.trim(), reviewed: reviewed.checked });
      if (!update.ok) { error(); return; }
      message.textContent = ru ? "Заметка сохранена. Первоначальный результат расчёта не изменён." : "Note saved. The original calculation result is unchanged.";
      render(); message.focus();
    });
    const cancel = button(ru ? "Отмена" : "Cancel", () => { name.value = record.name; note.value = record.note; reviewed.checked = record.reviewed; editor.hidden = true; edit.setAttribute("aria-expanded", "false"); edit.focus(); });
    const editorActions = element("div", "", "saved-card-actions"); editorActions.append(save, cancel);
    editor.append(nameLabel, noteLabel, reviewedLabel, editorActions, editorStatus);
    const remove = button(ru ? "Удалить" : "Remove", () => {
      const deletion = deleteSavedScenario(storage, record.id);
      if (!deletion.ok) { error(); return; }
      removed = deletion.removed!; undo.hidden = false; render(); undo.querySelector<HTMLButtonElement>("button")!.focus();
    });
    const compare = button(ru ? "Сравнить варианты" : "Compare variants", () => {
      const latest = readSavedScenarios(storage);
      if (!latest.ok) { error(); return; }
      if (!latest.records.some((item) => item.id === record.id)) { render(); message.textContent = ru ? "Этот расчёт уже удалён. Выбери другой." : "This calculation has been removed. Choose another."; return; }
      comparisonIds = [record.id]; renderComparison(latest.records);
      comparison.querySelector<HTMLElement>("h2")!.focus(); comparison.scrollIntoView({ block: "start" });
    });
    actions.append(resume, compare, edit, remove); article.append(actions, editor); return article;
  }

  function render() {
    const result = readSavedScenarios(storage);
    if (!result.ok) { error(); empty.hidden = true; more.hidden = true; comparison.hidden = true; return; }
    renderComparison(result.records);
    const records = result.records.filter((record) => (!game.value || getScenarioTool(record.toolKey)?.game === game.value)
      && (state.value === "all" || record.reviewed === (state.value === "reviewed"))).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    list.replaceChildren(...records.slice(0, shown).map(card));
    root!.querySelector<HTMLElement>("[data-saved-count]")!.textContent = `${Math.min(shown, records.length)} / ${records.length} · ${ru ? "всего сохранено" : "total saved"}: ${result.records.length} / 50`;
    empty.hidden = records.length > 0; more.hidden = records.length <= shown; clear.hidden = result.records.length === 0;
    empty.querySelector<HTMLElement>("[data-empty-title]")!.textContent = result.records.length ? (ru ? "По этим условиям пока нет расчётов" : "No calculations match these filters") : (ru ? "Сохрани первый план на следующую сессию" : "Save your first plan for the next session");
  }
  const filter = () => {
    shown = 12;
    const url = new URL(window.location.href);
    game.value ? url.searchParams.set("game", game.value) : url.searchParams.delete("game");
    state.value === "planned" ? url.searchParams.delete("state") : url.searchParams.set("state", state.value);
    history.replaceState({}, "", url); render();
  };
  game.addEventListener("change", filter); state.addEventListener("change", filter);
  clear.addEventListener("click", () => { game.value = ""; state.value = "all"; filter(); });
  more.addEventListener("click", () => { shown += 12; render(); });
  partner.addEventListener("change", () => {
    comparisonIds = partner.value ? [comparisonIds[0]!, partner.value] : [comparisonIds[0]!];
    const latest = readSavedScenarios(storage);
    if (!latest.ok) { error(); comparison.hidden = true; return; }
    renderComparison(latest.records);
  });
  root.querySelector<HTMLButtonElement>("[data-close-comparison]")!.addEventListener("click", () => {
    comparisonIds = []; comparison.hidden = true;
    message.textContent = ru ? "Сравнение закрыто. Сохранённые расчёты остаются в списке." : "Comparison closed. Your saved calculations remain in the list.";
    message.focus();
  });
  root.querySelector<HTMLButtonElement>("[data-undo-delete]")!.addEventListener("click", () => {
    if (!removed) return;
    if (!addSavedScenario(storage, removed).ok) { error(); return; }
    removed = null; undo.hidden = true; render(); message.textContent = ru ? "Расчёт восстановлен." : "Calculation restored."; message.focus();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== savedScenariosKey && event.key !== null) return;
    // Do not replace a note while the player is editing it in this tab.
    if (list.querySelector(".saved-card-editor:not([hidden])")) {
      message.textContent = ru ? "Список изменился в другой вкладке. Закончи заметку или обнови страницу." : "The list changed in another tab. Finish your note or reload this page.";
    } else render();
  });
  render();
}
