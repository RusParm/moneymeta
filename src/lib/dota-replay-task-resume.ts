import { readDotaReplayJournal, dotaReplayTaskHref, DOTA_REPLAY_JOURNAL_CHANGE_EVENT } from "./dota-replay-journal";

/** Read-only return surface; opening a task never loads its source match. */
export function initializeDotaReplayTaskResumes(): void {
  const regions = [...document.querySelectorAll<HTMLElement>("[data-dota-task-resume]")];
  if (!regions.length) return;
  const render = () => {
    const journal = readDotaReplayJournal({ getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) });
    const records = journal.ok ? [...journal.records].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
    const record = records.find(entry => entry.outcome === null) ?? records[0];
    for (const region of regions) {
      region.hidden = !record;
      if (!record) continue;
      const lang = region.dataset.lang === "en" ? "en" : "ru";
      const ru = lang === "ru";
      const taskText = region.querySelector<HTMLElement>("[data-task-resume-text]")!;
      taskText.textContent = record.snapshot.task;
      taskText.lang = record.snapshot.lang;
      region.querySelector<HTMLElement>("[data-task-resume-context]")!.textContent = `${record.snapshot.heroName} · ${ru ? "Сохранённая задача" : "Saved task"} · ${record.snapshot.lang.toUpperCase()} · ${ru ? "Только в этом браузере" : "Only in this browser"}`;
      const link = region.querySelector<HTMLAnchorElement>("[data-task-resume-link]")!;
      const href = dotaReplayTaskHref(record, lang);
      if (!href) { region.hidden = true; continue; }
      link.href = href;
      link.textContent = record.outcome === null ? (ru ? "Открыть задачу и записать результат →" : "Open task and record outcome →") : (ru ? "Посмотреть результат и взять задачу ещё раз →" : "Review outcome and try the task again →");
    }
  };
  render();
  window.addEventListener("pageshow", render);
  window.addEventListener("storage", render);
  window.addEventListener(DOTA_REPLAY_JOURNAL_CHANGE_EVENT, render);
}
