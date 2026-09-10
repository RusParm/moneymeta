import { addDotaReplayTask, buildDotaReplayTaskSnapshot, dotaReplayTaskHref, DOTA_REPLAY_JOURNAL_CHANGE_EVENT, type DotaReplayTaskRecord } from "./dota-replay-journal";

/** Explicit UI action only. The provider response never enters this store. */
export function saveDotaReplayTask(input: Parameters<typeof buildDotaReplayTaskSnapshot>[0]): { ok: boolean; message: string; href?: string } {
  const ru = input.lang === "ru";
  const failure = ru ? "Не удалось сохранить задачу в этом браузере. Можно скопировать заметку." : "The task could not be saved in this browser. You can copy the note instead.";
  try {
    const snapshot = buildDotaReplayTaskSnapshot(input);
    if (!snapshot) return { ok: false, message: ru ? "Сначала проверь обстоятельства в реплее, чтобы выбрать задачу." : "Check the replay circumstances first to select a task." };
    const record: DotaReplayTaskRecord = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), snapshot, outcome: null };
    const result = addDotaReplayTask({ getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) }, record);
    if (!result.ok) {
      const messages: Record<string, string> = ru ? {
        duplicate: "Такая задача уже сохранена. Открой её, чтобы записать результат.",
        limit: "В журнале уже 8 задач. Удали ненужную запись, чтобы сохранить новую.",
        corrupt: "Сохранённый журнал не удалось прочитать. Он не изменён; текущую заметку можно скопировать.",
        unsupported: "Этот журнал создан другой версией сайта. Он не изменён; текущую заметку можно скопировать.",
        capacity: "Для новой записи не хватило места. Старые задачи не изменены; текущую заметку можно скопировать.",
      } : {
        duplicate: "This task is already saved. Open it to record the outcome.",
        limit: "The journal already contains 8 tasks. Remove an unwanted record before saving another.",
        corrupt: "The saved journal could not be read. It was not changed; you can copy the current note.",
        unsupported: "This journal was created by another site version. It was not changed; you can copy the current note.",
        capacity: "There was not enough space for this record. Existing tasks were not changed; you can copy the current note.",
      };
      return { ok: false, message: messages[result.error] ?? failure, href: `${ru ? "" : "/en"}/dota-2/tasks/` };
    }
    window.dispatchEvent(new Event(DOTA_REPLAY_JOURNAL_CHANGE_EVENT));
    return { ok: true, message: ru ? "Задача сохранена в этом браузере. После игры открой «Мои задачи»." : "Task saved in this browser. Open My tasks after play.", href: dotaReplayTaskHref(record, input.lang) ?? undefined };
  } catch {
    return { ok: false, message: failure };
  }
}
