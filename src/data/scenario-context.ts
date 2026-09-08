// Build-time metadata. Do not import the full game datasets into the browser.
import { version } from "../../package.json";
import { hubPortals } from "./hub-portals";
import { civilizationHub } from "./frontier-hubs";
import { gtaBusinesses } from "./gta-businesses";
import { dotaItemsSnapshot } from "./dota-items";
import { scenarioTools, type ScenarioLocale } from "./scenario-tools";

export const scenarioEngineVersion = version;
export function scenarioContexts(lang: ScenarioLocale): Record<string, string> {
  return Object.fromEntries(scenarioTools.map((tool) => {
    const hub = tool.game === "civ7" ? civilizationHub : hubPortals[tool.game];
    let label = `${hub.version[lang]} · ${hub.checkedAt}`;
    if (tool.game === "gta") {
      const checkedAt = gtaBusinesses[0]!.provenance.checkedAt;
      label = `${lang === "ru" ? "Оценки бизнесов" : "Business estimates"} · ${checkedAt}`;
    }
    if (tool.key === "dota-compare" || tool.key === "dota-item-plan") {
      label = `${dotaItemsSnapshot.patch.label} · ${dotaItemsSnapshot.fetchedAt.slice(0, 10)}`;
    }
    return [tool.key, label];
  }));
}
