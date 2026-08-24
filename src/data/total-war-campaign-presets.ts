import type { Localized, StrategyLocale } from "./strategy-hubs";
import type { CampaignCapitalInput } from "../lib/total-war-campaign";

const t = (ru: string, en: string): Localized => ({ ru, en });

export interface TotalWarCampaignPreset {
  id: "cathay-provinces" | "frontier-mobilization" | "post-conquest" | "late-two-front";
  code: string;
  mark: string;
  scope: "faction" | "phase";
  label: Localized;
  title: Localized;
  question: Localized;
  when: Localized;
  decisionRule: Localized;
  stopRule: Localized;
  sourceLabel: Localized;
  sourceUrl: string;
  sourceBoundary: Localized;
  inputs: CampaignCapitalInput;
  checks: Array<{ label: Localized; text: Localized }>;
}

export const totalWarCampaignContext = {
  checkedAt: "2026-08-24",
  staleAfterDays: 31,
  currentVersion: t("Хотфикс 8.1.1 · экономика патча 8.1", "Hotfix 8.1.1 · Patch 8.1 economy"),
  nextReview: "2026-09-24",
  sources: {
    patch81: {
      label: t("Creative Assembly · патч 8.1", "Creative Assembly · Patch 8.1"),
      url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101"
    },
    update80: {
      label: t("Creative Assembly · обновление 8.0", "Creative Assembly · Update 8.0"),
      url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/98"
    },
    hotfix811: {
      label: t("Creative Assembly · хотфикс 8.1.1", "Creative Assembly · Hotfix 8.1.1"),
      url: "https://community.creative-assembly.com/total-war/total-war-warhammer/forums/7-patch-notes-amp-announcements/threads/14865"
    },
    endTimes: {
      label: t("Creative Assembly · релиз 24 сентября", "Creative Assembly · September 24 release"),
      url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/102"
    }
  }
} as const;

export const totalWarCampaignPresets: TotalWarCampaignPreset[] = [
  {
    id: "cathay-provinces",
    code: "TW-P01",
    mark: "P",
    scope: "faction",
    label: t("Grand Cathay · развитие", "Grand Cathay · development"),
    title: t("Окно развития провинции", "Province development window"),
    question: t("Можно ли вложиться в провинцию до следующего военного окна?", "Can the province absorb capital before the next war window?"),
    when: t("Выбери этот режим, когда ядро защищено, а главное решение находится между развитием провинции и сохранением казны.", "Use this mode when the core is protected and the real choice is provincial development versus treasury optionality."),
    decisionRule: t("Вкладывайся, только если стресс-сценарий сохраняет резерв и отдельная модель здания успевает вернуть цену до контрольного хода.", "Invest only when the stress case preserves the reserve and the building model repays before the review turn."),
    stopRule: t("Стоп: разведка показывает новый фронт, прирост дохода начинается слишком поздно или стройка использует военный остаток.", "Stop when scouting reveals another front, marginal income arrives too late or construction consumes the war floor."),
    sourceLabel: totalWarCampaignContext.sources.update80.label,
    sourceUrl: totalWarCampaignContext.sources.update80.url,
    sourceBoundary: t("Обновление 8.0 подтверждает отдельную ветку технологий Provinces у Cathay. Оно не задаёт стоимость, доход или оптимальную очередь для твоего сохранения.", "Update 8.0 confirms Cathay's separate Provinces technology branch. It does not define cost, income or an optimal order for your save."),
    inputs: { treasury: 8500, netIncomePerTurn: 2400, oneOffCost: 4000, additionalUpkeepPerTurn: 0, horizonTurns: 12, protectedReserve: 2500, incomeAtRiskPerTurn: 600, disruptionTurns: 2, emergencyCost: 1000 },
    checks: [
      { label: t("Прирост", "Delta"), text: t("Вводи только доход, который создаёт новое решение.", "Enter only the income created by the new decision.") },
      { label: t("Военное окно", "War window"), text: t("Горизонт заканчивается до следующего дорогого ответа.", "The horizon ends before the next expensive response.") },
      { label: t("Граница", "Frontier"), text: t("Проведи потерю дохода хотя бы одной уязвимой территории.", "Run the loss of at least one exposed income source.") }
    ]
  },
  {
    id: "frontier-mobilization",
    code: "TW-P02",
    mark: "A",
    scope: "phase",
    label: t("Любая фракция · перед войной", "Any faction · pre-war"),
    title: t("Пограничная мобилизация", "Frontier mobilization"),
    question: t("Выдержит ли казна найм, содержание и один плохой ответ противника?", "Can treasury fund recruitment, upkeep and one adverse enemy response?"),
    when: t("Используй перед объявлением войны или при появлении армии, которая может открыть новый фронт в ближайшие ходы.", "Use before declaring war or when an army can open another front within the next few turns."),
    decisionRule: t("Масштабируй найм по стресс-остатку, а не по цене покупки. У цели резерв должен оставаться отдельной строкой.", "Scale recruitment from stress cash, not purchase affordability. The reserve must remain a separate line at the objective."),
    stopRule: t("Стоп: дополнительное содержание уводит поток в минус без понятной даты следующей добычи или мира.", "Stop when added upkeep turns flow negative without a dated payout or peace point."),
    sourceLabel: totalWarCampaignContext.sources.patch81.label,
    sourceUrl: totalWarCampaignContext.sources.patch81.url,
    sourceBoundary: t("Патч 8.1 меняет приоритеты ИИ кампании. Он не даёт универсальную вероятность нападения и не определяет размер резерва.", "Patch 8.1 changes campaign AI priorities. It provides neither a universal attack probability nor a prescribed reserve."),
    inputs: { treasury: 12000, netIncomePerTurn: 2800, oneOffCost: 4800, additionalUpkeepPerTurn: 1250, horizonTurns: 8, protectedReserve: 3500, incomeAtRiskPerTurn: 900, disruptionTurns: 3, emergencyCost: 1500 },
    checks: [
      { label: t("Найм", "Recruitment"), text: t("Разовая цена не включает содержание похода.", "One-off price does not include campaign upkeep.") },
      { label: t("Цель", "Objective"), text: t("Задай ход, на котором армия должна решить задачу.", "Name the turn on which the army must solve the objective.") },
      { label: t("Плохой ответ", "Adverse response"), text: t("Добавь срочный платёж и временную потерю дохода.", "Add one emergency cost and temporary income loss.") }
    ]
  },
  {
    id: "post-conquest",
    code: "TW-P03",
    mark: "C",
    scope: "phase",
    label: t("Любая фракция · после захвата", "Any faction · post-conquest"),
    title: t("Закрепление новой границы", "Post-conquest consolidation"),
    question: t("Новая территория создаёт капитал или только новое обязательство?", "Does the new territory create capital or merely another commitment?"),
    when: t("Выбирай сразу после захвата, когда добыча уже получена, но расходы на восстановление, гарнизон и следующую границу ещё не разложены.", "Use immediately after conquest, when loot is visible but recovery, defence and the next frontier are not yet priced."),
    decisionRule: t("Сначала профинансируй стабилизацию и резерв ответа. Остаток можно направлять в развитие или следующую цель.", "Fund stabilization and response liquidity first. Only the remainder can finance development or the next objective."),
    stopRule: t("Стоп: удержание требует отдельной армии, а её содержание съедает ожидаемый поток территории на выбранном горизонте.", "Stop when holding requires another army whose upkeep consumes the territory's expected flow inside the horizon."),
    sourceLabel: totalWarCampaignContext.sources.patch81.label,
    sourceUrl: totalWarCampaignContext.sources.patch81.url,
    sourceBoundary: t("Официальный источник задаёт текущий патч и контекст ИИ. Восстановление, доход и цена обороны берутся только из конкретной кампании.", "The official source defines current patch and AI context. Recovery, income and defence cost come only from the campaign."),
    inputs: { treasury: 14500, netIncomePerTurn: 3200, oneOffCost: 3500, additionalUpkeepPerTurn: 900, horizonTurns: 10, protectedReserve: 4000, incomeAtRiskPerTurn: 1100, disruptionTurns: 3, emergencyCost: 2000 },
    checks: [
      { label: t("Восстановление", "Recovery"), text: t("Собери все разовые расходы первых ходов.", "Capture every one-off cost in the opening turns.") },
      { label: t("Оборона", "Defence"), text: t("Отнеси новую армию к цене удержания территории.", "Assign the new army to the cost of holding.") },
      { label: t("Следующая точка", "Next point"), text: t("Не растягивай доход за пределы реального пересмотра.", "Do not extend flow beyond the real review point.") }
    ]
  },
  {
    id: "late-two-front",
    code: "TW-P04",
    mark: "AI",
    scope: "phase",
    label: t("Любая фракция · поздняя игра", "Any faction · late game"),
    title: t("Два фронта и каскадный риск", "Two fronts and cascading risk"),
    question: t("Сохранит ли длинный план возможность ответить на второй фронт?", "Does the long plan preserve a response to a second front?"),
    when: t("Используй в большой империи, где один спокойный участок карты финансирует войну и его потеря может запустить каскад дефицита.", "Use in a large empire where one quiet region funds the war and its loss can trigger cascading deficit."),
    decisionRule: t("Новый долгий расход проходит только после временной потери пограничного дохода и одного срочного ответа.", "A new long-lived commitment passes only after temporary frontier income loss and one emergency response."),
    stopRule: t("Стоп: базовый сценарий красивый, но стресс-остаток ниже резерва или поток остаётся отрицательным после окна угрозы.", "Stop when the base case looks healthy but stress cash breaks the reserve or flow remains negative after the threat window."),
    sourceLabel: totalWarCampaignContext.sources.patch81.label,
    sourceUrl: totalWarCampaignContext.sources.patch81.url,
    sourceBoundary: t("Патч 8.1 подтверждает более активные поздние приоритеты ИИ. Вводные ниже являются стресс-сценарием Money Meta, а не прогнозом поведения ИИ.", "Patch 8.1 confirms more active late-game AI priorities. Inputs below are a Money Meta stress case, not an AI forecast."),
    inputs: { treasury: 26000, netIncomePerTurn: 5200, oneOffCost: 7500, additionalUpkeepPerTurn: 2200, horizonTurns: 10, protectedReserve: 8000, incomeAtRiskPerTurn: 1800, disruptionTurns: 4, emergencyCost: 3500 },
    checks: [
      { label: t("Зависимый доход", "Dependent flow"), text: t("Выдели поток, потеря которого ломает весь план.", "Identify the flow whose loss breaks the plan.") },
      { label: t("Второй фронт", "Second front"), text: t("Цена ответа должна быть отдельной от текущей войны.", "Response cost must stay separate from the active war.") },
      { label: t("Выход", "Exit"), text: t("Задай момент сокращения расхода или окончания войны.", "Set the turn when burn falls or the war ends.") }
    ]
  }
];

export function getTotalWarCampaignPresetsPath(lang: StrategyLocale): string {
  return `${lang === "en" ? "/en" : ""}/total-war/tools/campaign-presets/`;
}
