import type { DotaDraftFinding, DotaDraftPurchaseEvent, DotaDraftReview } from "./dota-draft";

type DraftLanguage = "ru" | "en";
type DraftHero = { name: string; image?: string };

/** Renders model evidence without inferring strength from hero counts or purchases. */
export function renderDotaDraftReview(
  root: HTMLElement,
  review: DotaDraftReview,
  lang: DraftLanguage,
  heroFor: (id: number) => DraftHero,
): void {
  const ru = lang === "ru";
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string): HTMLElementTagNameMap[K] => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const ownLabel = ru ? "Твоя команда" : "Your team";
  const enemyLabel = ru ? "Соперники" : "Opponents";
  const heroNames = (ids: number[]): string => [...new Set(ids)].map((id) => heroFor(id).name).join(", ");
  const httpUrl = (value: string): URL | null => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" ? url : null;
    } catch {
      return null;
    }
  };
  const badge = (id: number): HTMLElement => {
    const hero = heroFor(id);
    const node = make("span", undefined, "match-draft-hero");
    if (hero.image && ((hero.image.startsWith("/") && !hero.image.startsWith("//")) || httpUrl(hero.image))) {
      const portrait = make("img");
      portrait.src = hero.image;
      portrait.alt = "";
      portrait.width = 36;
      portrait.height = 24;
      portrait.loading = "lazy";
      portrait.addEventListener("error", () => { portrait.hidden = true; }, { once: true });
      node.append(portrait);
    }
    node.append(make("span", hero.name));
    return node;
  };
  const teamRoster = (ids: number[], label: string, side: "own" | "enemy"): HTMLElement => {
    const team = make("section", undefined, "match-draft-team");
    team.dataset.side = side;
    const heroes = make("div", undefined, "match-draft-heroes");
    heroes.append(...ids.map(badge));
    team.append(make("h4", label), heroes);
    return team;
  };
  const findingCard = (finding: DotaDraftFinding, side: "own" | "enemy"): HTMLElement => {
    const card = make("article", undefined, "match-draft-finding");
    card.dataset.side = side;
    card.append(make("h5", finding.title[lang]));
    if (finding.heroIds.length) card.append(make("p", heroNames(finding.heroIds), "match-draft-finding-heroes"));
    card.append(make("p", finding.explanation[lang]));
    const condition = make("p", undefined, "match-draft-condition");
    condition.append(make("strong", ru ? "Когда это работает: " : "When it works: "), make("span", finding.condition[lang]));
    const action = make("p", undefined, "match-draft-action");
    action.append(make("strong", ru ? "Что проверить в игре: " : "What to review: "), make("span", finding.action[lang]));
    card.append(condition, action);
    if (finding.evidence?.length) {
      const evidence = make("details", undefined, "match-draft-ability-evidence");
      evidence.append(make("summary", ru ? "На чём основано" : "Ability evidence"));
      finding.evidence.forEach((entry) => {
        const item = make("p");
        item.append(make("strong", `${heroFor(entry.heroId).name} · ${entry.ability}: `), make("span", entry.text[lang]));
        evidence.append(item);
      });
      card.append(evidence);
    }
    return card;
  };
  const findingsColumn = (findings: DotaDraftFinding[], side: "own" | "enemy"): HTMLElement => {
    const column = make("section", undefined, "match-draft-findings-column");
    column.dataset.side = side;
    column.append(make("h4", side === "own"
      ? (ru ? "Ваши возможности" : "Your opportunities")
      : (ru ? "Что учитывать у соперника" : "Opponent threats")));
    if (!findings.length) {
      column.append(make("p", ru
        ? "Для этого состава пока нет проверенного сочетания в базе. Это не означает, что у команды нет сильных сторон."
        : "No reviewed combination is available for this lineup yet. This does not mean the team has no strengths.", "match-draft-empty"));
      return column;
    }
    column.append(...findings.slice(0, 2).map((finding) => findingCard(finding, side)));
    if (findings.length > 2) {
      const more = make("details", undefined, "match-draft-more");
      more.append(make("summary", ru ? `Ещё выводы (${findings.length - 2})` : `More findings (${findings.length - 2})`));
      more.append(...findings.slice(2).map((finding) => findingCard(finding, side)));
      column.append(more);
    }
    return column;
  };
  const minuteLabel = (minute: number): string => {
    const seconds = Math.round(Math.abs(minute) * 60);
    return `${minute < 0 ? "−" : ""}${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  };
  const purchaseRow = (event: DotaDraftPurchaseEvent): HTMLLIElement => {
    const row = make("li", undefined, "match-draft-purchase");
    row.dataset.side = event.isOwnTeam ? "own" : "enemy";
    const stamp = make("span", minuteLabel(event.minute), "match-draft-purchase-time");
    stamp.setAttribute("aria-label", `${ru ? "Время матча" : "Match time"}: ${minuteLabel(event.minute)}`);
    const content = make("div", undefined, "match-draft-purchase-content");
    const meta = make("div", undefined, "match-draft-purchase-meta");
    meta.append(make("span", event.isOwnTeam ? ownLabel : enemyLabel, "match-draft-side"), make("span", heroFor(event.heroId).name));
    content.append(meta, make("strong", event.title[lang]), make("p", event.explanation[lang]));
    if (event.context) {
      const context = make("p", undefined, "match-draft-purchase-context");
      context.append(make("strong", ru ? "В этом матче: " : "In this match: "));
      const names = event.context.abilities?.length
        ? event.context.abilities.map((entry) => `${heroFor(entry.heroId).name} · ${entry.ability}`).join(", ")
        : heroNames(event.context.heroIds);
      if (names) context.append(make("span", `${names}. `));
      context.append(make("span", event.context.text[lang]));
      content.append(context);
    }
    row.append(stamp, content);
    return row;
  };

  const container = make("section", undefined, "match-draft-review");
  container.dataset.status = review.status;
  const header = make("header", undefined, "match-draft-header");
  const intro = make("div");
  intro.append(make("p", ru ? "Условия преимущества" : "Conditions for an advantage", "match-draft-kicker"));
  intro.append(make("h3", ru ? "Сила составов" : "Draft strengths"));
  intro.append(make("p", ru
    ? "Какие возможности создают герои обеих команд и что нужно для их реализации."
    : "What both lineups make possible and what each team needs to make it work."));
  const total = review.ownHeroIds.length + review.enemyHeroIds.length;
  const reviewed = review.coverage.own + review.coverage.enemy;
  const coverage = make("span", ru ? `Профили героев: ${reviewed}/${total}` : `Hero profiles: ${reviewed}/${total}`, "match-draft-coverage");
  header.append(intro, coverage);
  container.append(header);

  if (review.status !== "ready") {
    const status = make("div", undefined, "match-draft-status");
    if (review.status === "partial") {
      status.append(make("strong", ru ? "Частичное сравнение" : "Partial comparison"));
      status.append(make("p", ru
        ? "Выводы учитывают только героев с проверенными профилями. Сильные стороны остальных героев могут изменить сравнение."
        : "Findings cover only heroes with reviewed profiles. Other heroes may change the comparison."));
    } else if (review.status === "patch-mismatch") {
      status.append(make("strong", ru ? "Для патча этого матча нужна отдельная проверка" : "This match patch needs a separate review"));
      status.append(make("p", ru
        ? `Профили проверены для ${review.patchFamily}. Совпадение с патчем матча не подтверждено, поэтому выводы о силе составов не показаны.`
        : `Profiles were reviewed for ${review.patchFamily}. A matching game patch is not confirmed, so draft findings are not shown.`));
    } else {
      status.append(make("strong", total !== 10
        ? (ru ? "Не удалось сопоставить две пятёрки" : "Two five-hero lineups could not be matched")
        : (ru ? "Сравнение состава недоступно" : "Draft comparison is unavailable")));
      status.append(make("p", ru
        ? "Для сравнения этих составов пока не хватает данных. Ниже можно проверить героев и доступные источники."
        : "There is not enough reviewed information to compare these lineups. Check the heroes and available sources below."));
    }
    if (review.uncoveredHeroIds.length) status.append(make("p", `${ru ? "Пока без профиля" : "Profiles not yet available"}: ${heroNames(review.uncoveredHeroIds)}.`));
    container.append(status);
  }

  const rosters = make("div", undefined, "match-draft-rosters");
  rosters.append(teamRoster(review.ownHeroIds, ownLabel, "own"), teamRoster(review.enemyHeroIds, enemyLabel, "enemy"));
  container.append(rosters);

  const hasFindings = review.status === "ready" || review.status === "partial";
  if (hasFindings) {
    const columns = make("div", undefined, "match-draft-findings");
    columns.append(findingsColumn(review.opportunities, "own"), findingsColumn(review.threats, "enemy"));
    container.append(columns);
  }

  const purchases = review.purchases.filter((event) => Number.isFinite(event.minute)).slice().sort((a, b) => a.minute - b.minute);
  const purchaseSection = make("section", undefined, "match-draft-purchases");
  purchaseSection.append(make("h4", ru ? "Ключевые покупки обеих команд" : "Key purchases on both teams"));
  purchaseSection.append(make("p", ru
    ? "Покупки из журнала матча. Они открывают возможности, но не доказывают использование предмета или превосходство команды в этот момент."
    : "Purchases from the match log. They create options but do not establish item use or a team advantage at that moment.", "match-draft-note"));
  purchaseSection.append(make("p", ru
    ? `Журналы покупок доступны для ${review.purchaseLogHeroCount} из ${total} героев. Ниже выбраны предметы, связанные с условиями боя.`
    : `Purchase logs are available for ${review.purchaseLogHeroCount} of ${total} heroes. Items below relate to fight conditions.`, "match-draft-log-coverage"));
  const periods = [
    { value: "all", title: ru ? "Весь матч" : "Entire match", start: -Infinity, end: Infinity },
      { value: "0", title: ru ? "0-10 мин" : "0-10 min", start: 0, end: 10 },
      { value: "10", title: ru ? "10-20 мин" : "10-20 min", start: 10, end: 20 },
      { value: "20", title: ru ? "20-30 мин" : "20-30 min", start: 20, end: 30 },
      { value: "30", title: ru ? "30-40 мин" : "30-40 min", start: 30, end: 40 },
    { value: "40", title: ru ? "С 40-й минуты" : "40 min onward", start: 40, end: Infinity },
  ];
  const filter = make("label", undefined, "match-draft-purchase-filter");
  filter.append(make("span", ru ? "Отрезок матча" : "Match period"));
  const periodSelect = make("select");
  periods.forEach((period) => {
    const option = make("option", period.title);
    option.value = period.value;
    periodSelect.append(option);
  });
  filter.append(periodSelect);
  const count = make("p", undefined, "match-draft-purchase-count");
  count.setAttribute("role", "status");
  count.setAttribute("aria-live", "polite");
  count.setAttribute("aria-atomic", "true");
  const results = make("div", undefined, "match-draft-purchase-results");
  const renderPurchases = (): void => {
    const period = periods.find((option) => option.value === periodSelect.value) ?? periods[0]!;
    const selected = purchases.filter((event) => event.minute >= period.start && event.minute < period.end);
    count.textContent = ru
      ? `${period.title}. Найдено покупок: ${selected.length}.`
      : `${period.title}. Purchases found: ${selected.length}.`;
    results.replaceChildren();
    if (selected.length) {
      const list = make("ol", undefined, "match-draft-purchase-list");
      list.append(...selected.slice(0, 6).map(purchaseRow));
      results.append(list);
      if (selected.length > 6) {
        const more = make("details", undefined, "match-draft-more");
        more.append(make("summary", ru ? `Ещё покупки в этом отрезке (${selected.length - 6})` : `More purchases in this period (${selected.length - 6})`));
        const rest = make("ol", undefined, "match-draft-purchase-list");
        rest.start = 7;
        rest.append(...selected.slice(6).map(purchaseRow));
        more.append(rest);
        results.append(more);
      }
      return;
    }
    const empty = review.purchaseLogHeroCount === 0
      ? (ru
        ? "Журнал покупок недоступен. По финальным слотам нельзя восстановить время покупки."
        : "Purchase logs are unavailable. Final inventory slots cannot establish purchase times.")
      : period.value !== "all"
        ? (ru
          ? "В этом отрезке доступного журнала нет покупок для сравнения. Выбери другой период или весь матч."
          : "The available log has no purchases for this comparison in this period. Select another period or the entire match.")
        : (ru
          ? "В доступном журнале не найдены покупки для этого сравнения. Финальные слоты не позволяют определить время покупки."
          : "The available log contains no purchases for this comparison. Final inventory slots do not establish purchase times.");
    results.append(make("p", empty, "match-draft-empty"));
  };
  periodSelect.addEventListener("change", renderPurchases);
  renderPurchases();
  purchaseSection.append(filter, count, results);
  container.append(purchaseSection);

  if (hasFindings) {
    if (review.axes.length) {
      const comparison = make("details", undefined, "match-draft-details");
      comparison.append(make("summary", ru ? "Сравнить возможности составов" : "Compare lineup capabilities"));
      comparison.append(make("p", ru
        ? "Наличие способности не равно преимуществу. Для каждой задачи важны сочетание героев, доступные ресурсы и условия боя."
        : "Having a capability does not establish an advantage. Each task depends on hero combinations, available resources and fight conditions.", "match-draft-note"));
      const axes = make("div", undefined, "match-draft-axes");
      review.axes.forEach((axis) => {
        const card = make("section", undefined, "match-draft-axis");
        card.append(make("h4", axis.title[lang]));
        const teams = make("dl");
        const teamEvidence: Array<[string, number[]]> = [[ownLabel, axis.ownHeroIds], [enemyLabel, axis.enemyHeroIds]];
        teamEvidence.forEach(([label, ids]) => {
          const entry = make("div");
          const names = heroNames(ids);
          entry.append(make("dt", label), make("dd", names || (ru ? "Нет отметки в проверенных профилях" : "Not listed in reviewed profiles")));
          teams.append(entry);
        });
        card.append(teams, make("p", axis.explanation[lang]));
        axes.append(card);
      });
      comparison.append(axes);
      container.append(comparison);
    }
  }

  const evidence = make("details", undefined, "match-draft-details match-draft-evidence");
  evidence.append(make("summary", ru ? "На чём основан разбор" : "Evidence and coverage"));
  evidence.append(make("p", ru
    ? `Версия профилей: ${review.patchFamily}. Проверка: ${review.checkedAt}. Твоя команда: ${review.coverage.own}/${review.ownHeroIds.length}; соперники: ${review.coverage.enemy}/${review.enemyHeroIds.length}.`
    : `Profile version: ${review.patchFamily}. Reviewed: ${review.checkedAt}. Your team: ${review.coverage.own}/${review.ownHeroIds.length}; opponents: ${review.coverage.enemy}/${review.enemyHeroIds.length}.`));
  evidence.append(make("p", ru
    ? "Это разбор условий, при которых состав может получить преимущество. Здесь нет расчёта вероятности победы, оценки исполнения или фиксированного пика силы по минутам. Уровни, предметы, выбранные улучшения и действия игроков могут менять картину."
    : "This review explains conditions under which a lineup can gain an advantage. It does not calculate win probability, grade execution or assign a fixed power peak by minute. Levels, items, chosen upgrades and player decisions may change the picture."));
  evidence.append(make("p", ru
    ? "Это редакционная оценка механик. Роли, рейтинг игроков и взаимодействия выбранных аспектов в ней не моделируются."
    : "This is an editorial assessment of mechanics. It does not model roles, player rank or interactions between selected facets."));
  const sources = [...new Set([
    ...review.sourceUrls,
    ...review.opportunities.flatMap((finding) => finding.sourceUrls),
    ...review.threats.flatMap((finding) => finding.sourceUrls),
  ])].flatMap((value) => { const url = httpUrl(value); return url ? [url] : []; });
  if (sources.length) {
    const links = make("ul", undefined, "match-draft-sources");
    sources.forEach((url) => {
      const item = make("li");
      const label = url.hostname === "api.github.com" && url.pathname.includes("dotaconstants")
        ? (ru ? "OpenDota: проверенный снимок способностей" : "OpenDota: reviewed ability snapshot")
        : url.hostname === "api.opendota.com"
          ? (ru ? "OpenDota: свойства предметов" : "OpenDota: item properties")
          : url.hostname.endsWith("dota2.com") && url.pathname === "/newfrontiers"
            ? (ru ? "Valve: невосприимчивость к эффектам" : "Valve: debuff immunity")
            : url.hostname.endsWith("dota2.com")
              ? (ru ? "Valve: версия игры" : "Valve: game version")
              : url.hostname.replace(/^www\./, "");
      const link = make("a", label);
      link.href = url.href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      item.append(link);
      links.append(item);
    });
    evidence.append(links);
  }
  container.append(evidence);
  root.replaceChildren(container);
}
