export type ScenarioLocale = "ru" | "en";
export type ScenarioGame = "gta" | "dota" | "wow" | "total-war" | "ck3" | "civ7";
export const scenarioGames: Record<ScenarioGame, { name: string; path: string }> = {
  gta: { name: "GTA Online", path: "/gta-online/" },
  dota: { name: "Dota 2", path: "/dota-2/" },
  wow: { name: "WoW Retail", path: "/wow/" },
  "total-war": { name: "Total War: Warhammer III", path: "/total-war/" },
  ck3: { name: "Crusader Kings III", path: "/crusader-kings-3/" },
  civ7: { name: "Civilization VII", path: "/civilization-7/" }
};

export interface ScenarioTool {
  key: string;
  game: ScenarioGame;
  path: string;
  anchor: string;
  title: Record<ScenarioLocale, string>;
}
const tool = (key: string, game: ScenarioGame, route: string, anchor: string, ru: string, en: string): ScenarioTool => ({
  key, game, path: `${scenarioGames[game].path}${route}/`, anchor, title: { ru, en }
});
export const scenarioTools: ScenarioTool[] = [
  tool("gta-next-move", "gta", "calculators/business-roi", "next-move", "Следующая покупка", "Next purchase"),
  tool("gta-business", "gta", "calculators/business-roi", "model-lab", "Окупаемость бизнеса", "Business payback"),
  tool("gta-portfolio", "gta", "calculators/business-roi", "portfolio", "Набор бизнесов", "Business portfolio"),
  tool("gta-inline-roi", "gta", "tools", "business-roi", "Доход и окупаемость бизнеса", "Business income and payback"),
  tool("gta-hours-goal", "gta", "tools", "hours-to-goal", "Время до покупки", "Time to purchase"),
  tool("gta-inline-portfolio", "gta", "tools", "portfolio-allocation", "Распределение бюджета", "Budget allocation"),
  tool("dota-midas", "dota", "tools", "midas-irr", "Окупаемость Hand of Midas", "Hand of Midas payback"),
  tool("dota-buyback", "dota", "tools", "buyback-reserve", "Резерв на выкуп", "Buyback reserve"),
  tool("dota-compare", "dota", "items/compare", "item-comparison", "Сравнение предметов", "Item comparison"),
  tool("dota-item-plan", "dota", "items/planner", "planner-model", "Очередь предметов", "Item purchase queue"),
  tool("wow-market-ledger", "wow", "economy", "market-ledger", "Золото и товарные запасы", "Cash and inventory"),
  tool("wow-crafting", "wow", "tools", "crafting-margin", "Прибыль от изготовления", "Crafting profit"),
  tool("wow-farm", "wow", "tools", "farm-liquidity", "Доход от фарма", "Farming income"),
  tool("wow-order", "wow", "tools", "order-floor", "Комиссия за заказ", "Work-order commission"),
  tool("total-war-building-payback", "total-war", "tools", "building-payback", "Постройка перед войной", "Build before war"),
  tool("total-war-war-reserve", "total-war", "tools", "war-reserve", "Запас на армию", "Army reserve"),
  tool("total-war-conquest-choice", "total-war", "tools", "conquest-choice", "Разграбить или занять", "Sack or occupy"),
  tool("ck3-domain-payback", "ck3", "tools", "domain-payback", "Вложение в домен", "Domain investment"),
  tool("ck3-war-chest", "ck3", "tools", "war-chest", "Казна на войну", "War chest"),
  tool("ck3-succession-buffer", "ck3", "tools", "succession-buffer", "Резерв наследника", "Heir reserve"),
  tool("civ7-building", "civ7", "tools", "building-payback", "Окупаемость постройки", "Building payback"),
  tool("civ7-settlement", "civ7", "tools", "settlement-choice", "Развитие поселения", "Settlement development"),
  tool("civ7-victory", "civ7", "tools", "victory-gap", "Путь к экономической победе", "Economic Victory gap"),
  ...(["gta", "dota", "wow", "total-war", "ck3"] as const).map((game) =>
    tool(`${game}-goal-runway`, game, "goal-planner", "goal-runway", "План достижения цели", "Goal plan"))
];

export const getScenarioTool = (key: string) => scenarioTools.find((entry) => entry.key === key);
export const localizeScenarioPath = (path: string, lang: ScenarioLocale) => lang === "en" ? `/en${path}` : path;
export const getSavedScenariosPath = (lang: ScenarioLocale) => localizeScenarioPath("/saved/", lang);
export const scenarioToolPath = (entry: ScenarioTool, lang: ScenarioLocale) => `${localizeScenarioPath(entry.path, lang)}#${entry.anchor}`;
