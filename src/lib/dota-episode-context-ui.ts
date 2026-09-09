import type { DotaDraftPurchaseEvent } from "./dota-draft";
import type { DotaEpisodeContext, DotaEpisodeTeamContext } from "./dota-episode-context";

type Language = "ru" | "en";

const clock = (minute: number): string => {
  const seconds = Math.round(minute * 60);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};
const period = (start: number, end: number): string => `${clock(start)}-${clock(end)}`;
const boundary = (lang: Language): string => lang === "ru"
  ? "Время покупки не подтверждает доставку, готовность или применение предмета. По этим записям нельзя определить, кто был сильнее или почему изменился разрыв."
  : "Purchase time does not establish delivery, readiness or item use. These records cannot determine who was stronger or why the gold gap changed.";
const coverage = (context: DotaEpisodeContext, lang: Language): string => lang === "ru"
  ? `Записи покупок есть у ${context.purchaseLogHeroCount} из ${context.totalHeroCount} героев за весь матч. Полнота журналов неизвестна.`
  : `Purchase records exist for ${context.purchaseLogHeroCount} of ${context.totalHeroCount} heroes across the match. Log completeness is unknown.`;
const namesFor = (event: DotaDraftPurchaseEvent, heroName: (id: number) => string): string => event.context?.abilities?.length
  ? event.context.abilities.map((entry) => `${heroName(entry.heroId)} · ${entry.ability}`).join(", ")
  : event.context?.heroIds.map(heroName).join(", ") ?? "";

/** Text and DOM share the same bounded observations and explicit caveats. */
export function buildDotaEpisodeNote(context: DotaEpisodeContext | null, lang: Language, heroName: (id: number) => string): string {
  if (!context || context.status === "unavailable") return "";
  const ru = lang === "ru";
  const lines = [ru ? "Покупки и условия боя" : "Purchases and fight conditions",
    `${ru ? "Эпизод" : "Episode"}: ${period(context.startMinute, context.endMinute)}. ${ru ? "Покупки перед ним" : "Preceding purchases"}: ${period(context.lookbackStartMinute, context.startMinute)}.`,
    coverage(context, lang), boundary(lang)];
  for (const [team, label] of [[context.own, ru ? "Твоя команда" : "Your team"], [context.enemy, ru ? "Соперники" : "Opponents"]] as const) {
    const add = (event: DotaDraftPurchaseEvent, when: string) => {
      lines.push(`${label} · ${when} · ${clock(event.minute)} · ${heroName(event.heroId)} · ${event.title[lang]}`);
      lines.push(event.context ? `${namesFor(event, heroName)}. ${event.context.text[lang]}` : event.explanation[lang]);
    };
    team.before.forEach((event) => add(event, ru ? "перед эпизодом" : "before the episode"));
    team.during.forEach((event) => add(event, ru ? "в эпизоде" : "inside the episode"));
    if (team.condition) lines.push(`${label} · ${ru ? "Условие для проверки" : "Condition to verify"}: ${team.condition.heroIds.map(heroName).join(" + ")} · ${team.condition.condition[lang]} ${team.condition.action[lang]}`);
  }
  if (context.status === "partial") lines.push(ru
    ? `Профили не проверены: ${context.uncoveredHeroIds.map(heroName).join(", ")}. Отсутствие вывода не означает отсутствие ответа у команды.`
    : `Unreviewed profiles: ${context.uncoveredHeroIds.map(heroName).join(", ")}. A missing finding does not establish that a team lacks an answer.`);
  if (context.status === "patch-mismatch") lines.push(ru
    ? "Версия матча не подтверждена для проверенных механик. Показаны только исторические записи покупок."
    : "The match version is not confirmed for the reviewed mechanics. Only historical purchase records are shown.");
  return lines.join("\n");
}

export function renderDotaEpisodeContext(
  root: HTMLElement,
  context: DotaEpisodeContext | null,
  lang: Language,
  heroName: (id: number) => string,
  openDraft: () => void,
): void {
  root.replaceChildren();
  root.hidden = !context;
  if (!context) return;
  const ru = lang === "ru";
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string): HTMLElementTagNameMap[K] => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  root.dataset.status = context.status;
  root.append(make("h5", ru ? "Покупки и условия боя" : "Purchases and fight conditions"));
  if (context.status === "unavailable") {
    root.append(make("p", ru
      ? "Для этих составов сравнение пока недоступно. Сопоставить покупки обеих команд с проверенными условиями боя нельзя."
      : "A comparison is unavailable for these lineups. Purchases on both teams cannot be connected to reviewed fight conditions."));
    return;
  }
  root.append(make("p", boundary(lang), "match-episode-note"));
  root.append(make("p", coverage(context, lang), "match-episode-note"));
  if (context.status === "patch-mismatch") root.append(make("p", ru
    ? `Версия матча не подтверждена для механик ${context.patchFamily}. Показаны только записи покупок, без оценки свойств предметов.`
    : `The match version is not confirmed for ${context.patchFamily} mechanics. Purchase records are shown without interpreting item effects.`, "match-episode-status"));
  if (context.status === "partial") root.append(make("p", ru
    ? `Профили не проверены: ${context.uncoveredHeroIds.map(heroName).join(", ")}. Отсутствие вывода не означает отсутствие ответа у команды.`
    : `Unreviewed profiles: ${context.uncoveredHeroIds.map(heroName).join(", ")}. A missing finding does not establish that a team lacks an answer.`, "match-episode-status"));

  const purchase = (event: DotaDraftPurchaseEvent): HTMLLIElement => {
    const row = make("li", undefined, "match-episode-purchase");
    row.append(make("span", clock(event.minute), "match-episode-time"), make("strong", `${heroName(event.heroId)} · ${event.title[lang]}`));
    const check = event.context ? `${namesFor(event, heroName)}. ${event.context.text[lang]}` : event.explanation[lang];
    row.append(make("p", check));
    return row;
  };
  const list = (events: DotaDraftPurchaseEvent[]): HTMLOListElement => {
    const node = make("ol", undefined, "match-episode-purchases");
    node.append(...events.map(purchase));
    return node;
  };
  const column = (team: DotaEpisodeTeamContext, isOwn: boolean): HTMLElement => {
    const node = make("section", undefined, "match-episode-team");
    node.dataset.side = isOwn ? "own" : "enemy";
    node.append(make("h6", isOwn ? (ru ? "Твоя команда" : "Your team") : (ru ? "Соперники" : "Opponents")));
    node.append(make("p", `${ru ? "В эпизоде" : "Inside the episode"} · ${period(context.startMinute, context.endMinute)}`, "match-episode-period"));
    if (team.during.length) {
      node.append(list(team.during.slice(0, 2)));
      if (team.during.length > 2) {
        const rest = make("details");
        rest.append(make("summary", ru ? `Ещё покупки в эпизоде (${team.during.length - 2})` : `More purchases in the episode (${team.during.length - 2})`), list(team.during.slice(2)));
        node.append(rest);
      }
    } else node.append(make("p", ru
      ? "В доступном журнале нет выбранных ключевых покупок в этом эпизоде. Остальные покупки и готовность предметов неизвестны."
      : "The available log has no selected key purchases inside this episode. Other purchases and item readiness are unknown.", "match-episode-empty"));

    if (context.lookbackStartMinute < context.startMinute) {
      const before = make("details", undefined, "match-episode-before");
      before.append(make("summary", `${ru ? "Перед эпизодом" : "Before the episode"} · ${period(context.lookbackStartMinute, context.startMinute)} · ${team.before.length}`));
      before.append(make("p", ru
        ? "Только покупки за три минуты до начала, с учётом начала матча. Запись ровно на границе относится к самому эпизоду."
        : "Only purchases within three minutes before the start, bounded by match start. A purchase exactly at the boundary belongs to the episode.", "match-episode-note"));
      before.append(team.before.length ? list(team.before) : make("p", ru ? "Таких записей в доступном журнале нет." : "The available log contains no such records."));
      node.append(before);
    }
    if (team.condition) {
      const condition = make("details", undefined, "match-episode-condition");
      condition.append(make("summary", ru ? "Условие состава для проверки" : "Lineup condition to verify"));
      condition.append(make("strong", `${team.condition.heroIds.map(heroName).join(" + ")} · ${team.condition.title[lang]}`));
      condition.append(make("p", team.condition.condition[lang]), make("p", team.condition.action[lang]));
      condition.append(make("p", ru
        ? "Выбрано по участию героя с покупкой рядом с эпизодом. Совместное действие и его результат нужно проверить в повторе."
        : "Selected because an involved hero has a nearby purchase. Verify the coordinated action and its outcome in the replay.", "match-episode-note"));
      node.append(condition);
    }
    return node;
  };
  const teams = make("div", undefined, "match-episode-teams");
  teams.append(column(context.own, true), column(context.enemy, false));
  root.append(teams);
  const full = make("button", ru ? "Открыть все условия составов и источники" : "Open all lineup conditions and sources", "mini-action");
  full.type = "button";
  full.addEventListener("click", openDraft);
  root.append(full);
}
