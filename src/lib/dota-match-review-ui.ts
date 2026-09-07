import type { DotaFinalFinding, DotaFinalReview } from "./dota-match-summary";

export interface DotaReviewMessage { title: string; evidence: string; action: string; }

export function dotaReviewMessage(review: DotaFinalReview, finding: DotaFinalFinding | undefined, lang: "ru" | "en", opponentName: string): DotaReviewMessage {
  const ru = lang === "ru";
  const n = new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: 1 });
  const i = new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: 0 });
  const amount = (value: number | null) => value === null ? (ru ? "нет данных" : "unavailable") : i.format(value);
  const pct = (value: number | null) => value === null ? (ru ? "нет данных" : "unavailable") : `${n.format(value)}%`;
  const p = review.player;
  const c = review.contribution;
  const gap = review.incomeGapGpm ?? 0;
  const income = ru
    ? `Твой темп: ${amount(p.goldPerMinute)} GPM, ${opponentName}: ${amount(review.counterpart?.goldPerMinute ?? null)} GPM. Разница: ${gap > 0 ? "+" : ""}${amount(gap)} GPM${review.incomeGapPct === null ? "" : ` (${review.incomeGapPct > 0 ? "+" : ""}${pct(review.incomeGapPct)})`}.`
    : `Your pace: ${amount(p.goldPerMinute)} GPM; ${opponentName}: ${amount(review.counterpart?.goldPerMinute ?? null)} GPM. Difference: ${gap > 0 ? "+" : ""}${amount(gap)} GPM${review.incomeGapPct === null ? "" : ` (${review.incomeGapPct > 0 ? "+" : ""}${pct(review.incomeGapPct)})`}.`;
  switch (finding) {
    case "income-behind": return {
      title: ru ? `Темп дохода ниже, чем у ${opponentName}` : `Income pace trails ${opponentName}`,
      evidence: income,
      action: ru ? "В повторе сравни два периода без фарма: после смерти и после перемещения. Найди, где можно было вернуться к волне раньше, а где время ушло на полезное действие для команды." : "Compare two farm interruptions in the replay: after a death and after moving across the map. Find where you could return to a wave sooner and where the time produced value for the team."
    };
    case "income-ahead": return {
      title: ru ? (p.won === false ? "Доход выше, но матч проигран" : `По доходу ты опередил ${opponentName}`) : (p.won === false ? "Higher income, but a lost match" : `Your income outpaced ${opponentName}`),
      evidence: income,
      action: ru ? "Открой первую драку после ключевой покупки. Проверь, успел ли герой использовать преимущество предмета и какую цель команда получила следом." : "Review the first fight after a key purchase. Check whether the hero used the item advantage and which objective the team secured afterward."
    };
    case "resources-and-pressure": return {
      title: ru ? "Доля дохода выше доли видимого урона" : "Income share exceeds visible damage share",
      evidence: ru ? `${pct(c.incomeSharePct)} командного GPM, ${pct(c.heroDamageSharePct)} урона героям, ${pct(c.towerDamageSharePct)} урона строениям. Участие в убийствах: ${pct(c.killParticipationPct)}. Это вопрос к использованию ресурсов, а не доказательство плохой игры.` : `${pct(c.incomeSharePct)} of team GPM, ${pct(c.heroDamageSharePct)} of hero damage and ${pct(c.towerDamageSharePct)} of building damage. Kill participation: ${pct(c.killParticipationPct)}. This raises a resource-use question; it does not prove poor play.`,
      action: ru ? "После первой крупной покупки проверь выбор: продолжать фарм, давить линию или идти с командой. Был ли доступен полезный выход и подходил ли для него купленный предмет?" : "After your first major purchase, review the choice between more farm, lane pressure and joining the team. Was there a useful opening, and did the item suit it?"
    };
    case "objectives": return {
      title: ru ? `На тебе ${pct(c.towerDamageSharePct)} урона строениям` : `You dealt ${pct(c.towerDamageSharePct)} of building damage`,
      evidence: ru ? `${amount(p.towerDamage)} урона строениям при ${pct(c.incomeSharePct)} командного GPM. Доля урона не равна числу разрушенных башен.` : `${amount(p.towerDamage)} building damage with ${pct(c.incomeSharePct)} of team GPM. Damage share is not a count of towers destroyed.`,
      action: ru ? "Найди удачное давление на строение. Отметь, что его обеспечило: волна, отсутствие врага или выигранная драка. Это условие стоит повторять в следующей игре." : "Find a successful moment of building pressure. Identify what enabled it: a wave, an absent enemy or a won fight. Look to repeat that condition next game."
    };
    case "fight-presence": return {
      title: ru ? "Участвовал в большинстве убийств команды" : "Involved in most of the team’s kills",
      evidence: ru ? `${amount(c.killInvolvements)} из ${amount(c.teamKills)} убийств: ${pct(c.killParticipationPct)}. Твоя доля командного GPM: ${pct(c.incomeSharePct)}.` : `Involved in ${amount(c.killInvolvements)} of ${amount(c.teamKills)} kills: ${pct(c.killParticipationPct)}. Your share of team GPM: ${pct(c.incomeSharePct)}.`,
      action: ru ? "Выбери две выигранные драки. Проверь, удалось ли после них забрать цель или доступ к фарму, пока соперники возрождались." : "Choose two won fights. Check whether they led to an objective or access to farm while enemies were respawning."
    };
    case "deaths": return {
      title: ru ? "Начни проверку с последних двух смертей" : "Start with the final two deaths",
      evidence: ru ? `${amount(p.deaths)} смертей, ${pct(c.deathSharePct)} от смертей команды. Итоговый счёт не показывает, были ли они оправданны.` : `${amount(p.deaths)} deaths, ${pct(c.deathSharePct)} of the team’s deaths. The final count does not show whether they were justified.`,
      action: ru ? "Для каждой из последних двух смертей запиши: какая цель была доступна, что получила команда и какой безопасный вариант оставался. Не считай любую смерть ошибкой." : "For each of the final two deaths, note the available objective, what the team gained and the safer alternative. Do not treat every death as a mistake."
    };
    case "healing": return {
      title: ru ? "Лечение было заметной частью вклада" : "Healing was a visible part of your contribution",
      evidence: ru ? `${amount(p.heroHealing)} лечения героев, ${pct(c.healingSharePct)} от командного показателя. Один урон не описывает такую игру.` : `${amount(p.heroHealing)} hero healing, ${pct(c.healingSharePct)} of the team total. Damage alone does not describe this contribution.`,
      action: ru ? "Открой затяжную драку. Проверь, кому досталось лечение и помогло ли оно герою остаться в бою до нужной способности или предмета." : "Review a prolonged fight. Check who received healing and whether it kept a hero in the fight until a useful ability or item became available."
    };
    case "comparison": return {
      title: ru ? "Сравнение дохода за весь матч" : "Income comparison across the match",
      evidence: income,
      action: ru ? "Средний GPM скрывает смену преимущества. Запроси разбор реплея ниже, чтобы проверить отдельные фазы и момент изменения разрыва." : "Average GPM hides changes in advantage. Request replay analysis below to inspect individual phases and where the gap changed."
    };
    case "participation": return {
      title: ru ? `Участие в ${pct(c.killParticipationPct)} убийств команды` : `Involved in ${pct(c.killParticipationPct)} of team kills`,
      evidence: ru ? `${amount(c.killInvolvements)} из ${amount(c.teamKills)} убийств при ${amount(p.goldPerMinute)} GPM. Это доля убийств, не доля всех драк и не оценка роли.` : `${amount(c.killInvolvements)} of ${amount(c.teamKills)} kills at ${amount(p.goldPerMinute)} GPM. This is a share of kills, not all fights or a role rating.`,
      action: ru ? "Выбери драку, в которой не участвовал. Сравни результат команды с тем, что герой получил в другой части карты: фарм, строение или важный предмет." : "Choose a fight you did not join. Compare the team’s outcome with what your hero gained elsewhere: farm, building pressure or an important item."
    };
    default: return {
      title: ru ? "Начни с соперника по роли" : "Start with a comparable opponent",
      evidence: ru ? `Твой средний доход: ${amount(p.goldPerMinute)} GPM. Финальная ценность героя: ${amount(p.netWorth)} золота. Выбери соперника выше, чтобы увидеть разницу в доходе и итогах.` : `Your average income: ${amount(p.goldPerMinute)} GPM. Final net worth: ${amount(p.netWorth)} gold. Choose an opponent above to compare income and the final outcome.`,
      action: ru ? "Выбери вражеского героя с сопоставимой задачей. Затем запроси разбор реплея, чтобы перейти от итогов к конкретным эпизодам." : "Choose an enemy hero with a comparable job. Then request replay analysis to move from totals to individual episodes."
    };
  }
}

export function renderDotaFinalReview(root: HTMLElement, review: DotaFinalReview, lang: "ru" | "en", heroName: (id: number) => string, finalOnly: boolean) {
  const ru = lang === "ru";
  const number = new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: 1 });
  const integer = new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: 0 });
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
  const format = (value: number | null, percent = false) => value === null ? (ru ? "нет данных" : "unavailable") : percent ? `${number.format(value)}%` : integer.format(value);
  const c = review.contribution;
  const container = root.querySelector<HTMLDetailsElement>("[data-final-review]")!;
  container.open = finalOnly;
  const shares: Array<[string, number | null]> = [[ru ? "Доля командного GPM" : "Share of team GPM", c.incomeSharePct], [ru ? "Доля урона героям" : "Share of hero damage", c.heroDamageSharePct], [ru ? "Доля урона строениям" : "Share of building damage", c.towerDamageSharePct]];
  root.querySelector<HTMLElement>("[data-contribution-bars]")!.replaceChildren(...shares.flatMap(([label, share]) => {
    if (share === null) return [];
    const row = make("div"); const bar = make("span"); bar.className = "match-contribution-track"; bar.setAttribute("aria-hidden", "true");
    const fill = make("i"); fill.style.width = `${share}%`; bar.append(fill);
    row.append(make("span", label), make("strong", format(share, true)), bar); return [row];
  }));
  const findings = finalOnly ? review.findings.slice(1) : review.findings;
  const opponentName = review.counterpart ? heroName(review.counterpart.heroId) : "";
  root.querySelector<HTMLElement>("[data-final-findings]")!.replaceChildren(...findings.map((finding) => {
    const message = dotaReviewMessage(review, finding, lang, opponentName);
    const article = make("article"); article.append(make("h4", message.title), make("p", message.evidence), make("strong", ru ? "Что проверить" : "What to review"), make("p", message.action)); return article;
  }));
  const table = make("table"); const head = make("thead"); const heading = make("tr");
  [ru ? "Показатель" : "Metric", heroName(review.player.heroId), opponentName || (ru ? "Выбери соперника" : "Choose an opponent")].forEach((label) => { const th = make("th", label); th.scope = "col"; heading.append(th); }); head.append(heading);
  const p = review.player; const o = review.counterpart;
  const rows: Array<[string, number | null, number | null, boolean?]> = [
    ["GPM", p.goldPerMinute, o?.goldPerMinute ?? null], ["XPM", p.xpPerMinute, o?.xpPerMinute ?? null],
    [ru ? "Финальная ценность" : "Final net worth", p.netWorth, o?.netWorth ?? null],
    [ru ? "Добивания" : "Last hits", p.lastHits, o?.lastHits ?? null],
    [ru ? "Участие в убийствах своей команды" : "Own-team kill participation", c.killParticipationPct, review.counterpartContribution?.killParticipationPct ?? null, true],
    [ru ? "Урон героям" : "Hero damage", p.heroDamage, o?.heroDamage ?? null],
    [ru ? "Урон строениям" : "Building damage", p.towerDamage, o?.towerDamage ?? null],
    [ru ? "Лечение героев" : "Hero healing", p.heroHealing, o?.heroHealing ?? null],
    [ru ? "Смерти" : "Deaths", p.deaths, o?.deaths ?? null]
  ];
  const body = make("tbody"); rows.filter(([, a, b]) => a !== null || b !== null).forEach(([label, a, b, percent]) => { const row = make("tr"); const title = make("th", label); title.scope = "row"; row.append(title, make("td", format(a, percent)), make("td", format(b, percent))); body.append(row); });
  table.append(head, body); root.querySelector<HTMLElement>("[data-final-comparison]")!.replaceChildren(table);
  root.querySelector<HTMLElement>("[data-final-comparison-note]")!.textContent = ru ? "Разные герои решают разные задачи. Выбранная пара помогает проверить вопрос, но не определяет, кто сыграл лучше." : "Different heroes have different jobs. The selected comparison helps investigate a question; it does not determine who played better.";
}
