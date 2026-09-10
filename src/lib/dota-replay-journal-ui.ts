import { getDotaReplayJournalCopy } from "../data/dota-replay-journal-copy";
import {
  DOTA_REPLAY_JOURNAL_KEY,
  DOTA_REPLAY_JOURNAL_LIMIT,
  DOTA_REPLAY_JOURNAL_CHANGE_EVENT,
  closeDotaReplayTask,
  dotaReplayTaskAuditHref,
  dotaReplayTaskHref,
  dotaReplayTaskIdFromHash,
  dotaReplayTaskToken,
  readDotaReplayJournal,
  removeDotaReplayTask,
  repeatDotaReplayTask,
  type DotaReplayJournalResult,
  type DotaReplayJournalStorage,
  type DotaReplayTaskRecord,
  type DotaReplayTaskOutcome,
} from "./dota-replay-journal";

const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const clock = (minute: number): string => {
  const seconds = Math.round(minute * 60);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/** Historical text is rendered as text only. Reads never load a match or send notes. */
export function initializeDotaReplayJournalPage(): void {
  const root = document.querySelector<HTMLElement>("[data-replay-journal]");
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = "true";
  const lang = root.dataset.lang === "en" ? "en" : "ru";
  const copy = getDotaReplayJournalCopy(lang);
  const message = root.querySelector<HTMLElement>("[data-journal-message]")!;
  const count = root.querySelector<HTMLElement>("[data-journal-count]")!;
  const empty = root.querySelector<HTMLElement>("[data-journal-empty]")!;
  const openSection = root.querySelector<HTMLElement>("[data-journal-open-section]")!;
  const noOpen = root.querySelector<HTMLElement>("[data-journal-no-open]")!;
  const openList = root.querySelector<HTMLElement>("[data-journal-open]")!;
  const history = root.querySelector<HTMLDetailsElement>("[data-journal-history]")!;
  const historyLabel = root.querySelector<HTMLElement>("[data-journal-history-label]")!;
  const closedList = root.querySelector<HTMLElement>("[data-journal-closed]")!;
  const full = root.querySelector<HTMLElement>("[data-journal-full]")!;
  const storage: DotaReplayJournalStorage = {
    getItem: (key) => window.localStorage.getItem(key),
    setItem: (key, value) => window.localStorage.setItem(key, value),
  };
  const date = (iso: string): string => new Date(iso).toLocaleString(lang === "ru" ? "ru-RU" : "en-GB", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const tell = (text: string, focus = false): void => {
    message.textContent = text;
    if (focus) message.focus();
  };

  function updateLanguageLinks(): void {
    const id = dotaReplayTaskIdFromHash(window.location.hash);
    for (const link of root!.querySelectorAll<HTMLAnchorElement>(".lang-switch a")) {
      const targetLang = link.textContent?.trim() === "EN" ? "en" : "ru";
      link.href = id ? dotaReplayTaskHref({ id }, targetLang)! : `${targetLang === "en" ? "/en" : ""}/dota-2/tasks/`;
    }
  }

  function focusRecord(id: string, updateHash = false): boolean {
    const card = [...root!.querySelectorAll<HTMLElement>("[data-task-id]")].find((entry) => entry.dataset.taskId === id);
    if (!card) return false;
    if (card.closest("[data-journal-history]")) history.open = true;
    for (const entry of root!.querySelectorAll<HTMLElement>("[data-task-id]")) entry.dataset.selected = String(entry === card);
    if (updateHash) {
      const href = dotaReplayTaskHref({ id }, lang);
      if (href) window.history.replaceState(null, "", href);
      updateLanguageLinks();
    }
    card.querySelector<HTMLElement>("h3")?.focus();
    return true;
  }

  function applyResult(result: DotaReplayJournalResult, success: string, id?: string): void {
    if (!result.ok) {
      tell(copy.errors[result.error], true);
      return;
    }
    render(result.records);
    tell(success, !id);
    if (id) focusRecord(id, true);
    window.dispatchEvent(new CustomEvent(DOTA_REPLAY_JOURNAL_CHANGE_EVENT));
  }

  function renderRecord(record: DotaReplayTaskRecord): HTMLElement {
    const { snapshot, outcome } = record;
    const token = dotaReplayTaskToken(record);
    const card = make("article", undefined, "replay-journal-card");
    card.dataset.taskId = record.id;
    card.dataset.taskState = outcome ? "closed" : "open";
    const heading = make("h3", `${snapshot.heroName} · ${snapshot.kind === "bkb" ? "Black King Bar" : "Blink Dagger"}`);
    heading.tabIndex = -1;
    const top = make("div", undefined, "replay-journal-card-top");
    const saved = make("time", `${copy.created}: ${date(record.createdAt)}`);
    saved.dateTime = record.createdAt;
    top.append(heading, saved);
    const task = make("p", snapshot.task, "replay-journal-task");
    task.lang = snapshot.lang;
    const language = make("p", `${copy.originalLanguage}: ${snapshot.lang === "ru" ? copy.russian : copy.english}`, "replay-journal-note");
    card.append(top, task, language);
    if (record.parentId) card.append(make("p", copy.repeated, "replay-journal-note"));

    const source = make("details", undefined, "replay-journal-source");
    source.append(make("summary", copy.source));
    source.append(make("p", copy.historical, "replay-journal-boundary"));
    source.append(make("p", `${copy.episode}: ${clock(snapshot.startMinute)}-${clock(snapshot.endMinute)} · ${copy.patch}: ${snapshot.patchFamily} · ${copy.checkedAt}: ${snapshot.checkedAt}`, "replay-journal-note"));
    const note = make("div", snapshot.note, "replay-journal-snapshot");
    note.lang = snapshot.lang;
    note.setAttribute("aria-label", copy.historicalLabel);
    source.append(note);
    const sourceHref = dotaReplayTaskAuditHref(snapshot, lang);
    if (sourceHref) {
      const sourceLink = make("a", copy.sourceMatch, "replay-journal-action");
      sourceLink.href = sourceHref;
      source.append(sourceLink, make("p", copy.sourceLoad, "replay-journal-note"));
    }
    card.append(source);

    if (!outcome) {
      const editor = make("details", undefined, "replay-journal-editor");
      editor.append(make("summary", copy.record));
      const form = make("form");
      form.noValidate = true;
      const field = make("div", undefined, "replay-journal-field");
      const selectId = `replay-outcome-${record.id}`;
      const label = make("label", copy.outcomeLabel);
      label.htmlFor = selectId;
      const select = make("select");
      select.id = selectId;
      select.name = "outcome";
      select.required = true;
      select.dataset.journalOutcome = "";
      for (const value of ["", "checked", "missed", "no-opportunity"] as const) {
        const option = make("option", value ? copy[value] : copy.choose);
        option.value = value;
        select.append(option);
      }
      select.value = "";
      field.append(label, select);
      const noteField = make("div", undefined, "replay-journal-field");
      const noteId = `replay-outcome-note-${record.id}`;
      const noteLabel = make("label", copy.noteLabel);
      noteLabel.htmlFor = noteId;
      const input = make("textarea");
      input.id = noteId;
      input.name = "note";
      input.maxLength = 500;
      input.rows = 3;
      const hint = make("p", copy.noteHint, "replay-journal-note");
      hint.id = `${noteId}-hint`;
      input.setAttribute("aria-describedby", hint.id);
      noteField.append(noteLabel, input, hint);
      const closeHint = make("p", copy.closeHint, "replay-journal-note");
      const boundary = make("p", copy.outcomeBoundary, "replay-journal-boundary");
      const feedback = make("p", undefined, "replay-journal-feedback");
      feedback.setAttribute("role", "status");
      const submit = make("button", copy.saveOutcome, "replay-journal-primary");
      submit.type = "submit";
      form.append(field, noteField, boundary, closeHint, submit, feedback);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!["checked", "missed", "no-opportunity"].includes(select.value)) {
          feedback.textContent = copy.outcomeRequired;
          select.focus();
          return;
        }
        if (input.value.length > 500) {
          feedback.textContent = copy.noteTooLong;
          input.focus();
          return;
        }
        const result = closeDotaReplayTask(storage, record.id, token, {
          status: select.value as DotaReplayTaskOutcome["status"], note: input.value.trim(), recordedAt: new Date().toISOString(),
        });
        applyResult(result, copy.saved, record.id);
      });
      editor.append(form);
      card.append(editor);
    } else {
      const result = make("section", undefined, "replay-journal-outcome");
      result.append(make("h4", copy.outcomeTitle), make("strong", copy[outcome.status]));
      const recorded = make("time", `${copy.recorded}: ${date(outcome.recordedAt)}`);
      recorded.dateTime = outcome.recordedAt;
      result.append(recorded);
      if (outcome.note) result.append(make("p", outcome.note, "replay-journal-player-note"));
      result.append(make("p", outcome.status === "checked" ? copy.checkedNext : outcome.status === "missed" ? copy.missedNext : copy.noOpportunityNext));
      result.append(make("p", copy.outcomeBoundary, "replay-journal-note"));
      const repeat = make("button", copy.repeat, "replay-journal-primary");
      repeat.type = "button";
      repeat.addEventListener("click", () => {
        try {
          const id = crypto.randomUUID();
          applyResult(repeatDotaReplayTask(storage, record.id, token, id, new Date().toISOString()), copy.repeatedSuccess, id);
        } catch {
          tell(copy.errors.unavailable, true);
        }
      });
      result.append(make("p", copy.repeatHint, "replay-journal-note"), repeat);
      card.append(result);
    }

    const remove = make("div", undefined, "replay-journal-remove");
    const removeButton = make("button", copy.remove);
    removeButton.type = "button";
    const confirmation = make("div", undefined, "replay-journal-remove-confirm");
    confirmation.hidden = true;
    const confirmText = make("p", copy.removeQuestion);
    confirmText.id = `replay-remove-${record.id}`;
    const confirmButton = make("button", copy.removeConfirm);
    confirmButton.type = "button";
    confirmButton.setAttribute("aria-describedby", confirmText.id);
    const cancel = make("button", copy.cancel);
    cancel.type = "button";
    confirmation.append(confirmText, confirmButton, cancel);
    removeButton.addEventListener("click", () => {
      confirmation.hidden = false;
      removeButton.hidden = true;
      cancel.focus();
    });
    cancel.addEventListener("click", () => {
      confirmation.hidden = true;
      removeButton.hidden = false;
      removeButton.focus();
    });
    confirmButton.addEventListener("click", () => {
      const result = removeDotaReplayTask(storage, record.id, token);
      if (result.ok && dotaReplayTaskIdFromHash(window.location.hash) === record.id) {
        window.history.replaceState(null, "", `${lang === "en" ? "/en" : ""}/dota-2/tasks/`);
        updateLanguageLinks();
      }
      applyResult(result, copy.removed);
    });
    remove.append(removeButton, confirmation);
    card.append(remove);
    return card;
  }

  function render(records: DotaReplayTaskRecord[]): void {
    const sorted = [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const opened = sorted.filter((record) => !record.outcome);
    const closed = sorted.filter((record) => record.outcome);
    count.textContent = copy.count(opened.length, records.length);
    empty.hidden = records.length > 0;
    openSection.hidden = records.length === 0;
    noOpen.hidden = opened.length > 0;
    history.hidden = closed.length === 0;
    full.hidden = records.length < DOTA_REPLAY_JOURNAL_LIMIT;
    historyLabel.textContent = `${copy.history} (${closed.length})`;
    openList.replaceChildren(...opened.map(renderRecord));
    closedList.replaceChildren(...closed.map(renderRecord));
  }

  function refresh(): void {
    const result = readDotaReplayJournal(storage);
    if (!result.ok) {
      openList.replaceChildren();
      closedList.replaceChildren();
      empty.hidden = true;
      openSection.hidden = true;
      history.hidden = true;
      full.hidden = true;
      count.textContent = "";
      tell(copy.errors[result.error]);
      return;
    }
    render(result.records);
    tell("");
    const id = dotaReplayTaskIdFromHash(window.location.hash);
    if (id && !focusRecord(id)) tell(copy.missing);
    updateLanguageLinks();
  }
  root.querySelector<HTMLButtonElement>("[data-journal-refresh]")!.addEventListener("click", refresh);
  window.addEventListener("storage", (event) => {
    if (event.key === DOTA_REPLAY_JOURNAL_KEY || event.key === null) tell(copy.changed);
  });
  window.addEventListener("hashchange", () => {
    updateLanguageLinks();
    const id = dotaReplayTaskIdFromHash(window.location.hash);
    if (id && !focusRecord(id)) tell(copy.missing);
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) tell(copy.changed);
  });
  refresh();
}
