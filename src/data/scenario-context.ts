import { dotaItemPatch } from "./dota-item-patch";
// Build-time metadata. Do not import the full game datasets into the browser.
import { version } from "../../package.json";
import { getHubFreshnessPolicy, hubPortals } from "./hub-portals";
import { civilizationHub } from "./frontier-hubs";
import { gtaBusinesses } from "./gta-businesses";
import { DOTA_SNAPSHOT_MAX_AGE_HOURS, dotaItemsSnapshot } from "./dota-items";
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
    if (tool.key === "gta-session") {
      label = lang === "ru"
        ? "Личные наблюдения · последовательные полные циклы · модель 1"
        : "Personal observations · sequential complete runs · model 1";
    }
    if (tool.key === "dota-compare" || tool.key === "dota-item-plan") {
      label = `${dotaItemPatch.patch} · ${dotaItemPatch.checkedAt} · OpenDota ${dotaItemsSnapshot.patch.label} · ${dotaItemsSnapshot.fetchedAt.slice(0, 10)}`;
    }
    if (tool.key === "wow-crafting") {
      label = lang === "ru"
        ? "Личные вводные · запас и новая партия · модель 2"
        : "Personal inputs · existing stock and new batch · model 2";
    }
    return [tool.key, label];
  }));
}

// These policies identify a due source review, not a confirmed balance change.
export function scenarioReviewSources(): Record<string, import("../lib/scenario-review").ScenarioReviewSource> {
  return Object.fromEntries(scenarioTools.flatMap((tool) => {
    // Personal-input models cannot be certified by a game-news date.
    if (tool.key === "gta-session" || tool.key === "wow-crafting") return [];
    const path = tool.game === "dota" && ["dota-compare", "dota-item-plan"].includes(tool.key)
      ? "/dota-2/items/" : tool.path;
    const policy = tool.game === "dota" && ["dota-compare", "dota-item-plan"].includes(tool.key)
      ? { checkedAt: dotaItemsSnapshot.fetchedAt, maxAgeHours: DOTA_SNAPSHOT_MAX_AGE_HOURS }
      : tool.game === "gta"
        ? { checkedAt: gtaBusinesses[0]!.provenance.checkedAt, staleAfterDays: 30 }
        : tool.game === "civ7"
          ? { checkedAt: civilizationHub.checkedAt, staleAfterDays: civilizationHub.staleAfterDays }
          : getHubFreshnessPolicy(tool.game);
    return [[tool.key, { policy, path }]];
  }));
}
