import type { APIRoute } from "astro";
import { getGoalPlannerPath } from "../data/goal-planners";
import { getHubJourneyPath, hubJourneyList } from "../data/hub-journeys";
import { HUB_SECTION_SLUGS, getHubPath, hubPortalList } from "../data/hub-portals";
import { insights } from "../data/insights";
import { dotaItems, getDotaItemPath, getDotaItemPlannerPath, getDotaItemsPath } from "../data/dota-items";

const corePaths = [
  "/",
  "/en/",
  "/dota-2/",
  "/en/dota-2/",
  "/wow/",
  "/en/wow/",
  "/wow/tools/inventory-turn/",
  "/en/wow/tools/inventory-turn/",
  "/total-war/",
  "/en/total-war/",
  "/crusader-kings-3/",
  "/en/crusader-kings-3/",
  "/gta-online/",
  "/en/gta-online/",
  "/gta-online/calculators/business-roi/",
  "/en/gta-online/calculators/business-roi/",
  "/gta-online/weekly/",
  "/en/gta-online/weekly/",
  "/gta-6/",
  "/en/gta-6/",
  "/gta-6/economy/",
  "/en/gta-6/economy/",
  "/gta-6/from-gta-online/",
  "/en/gta-6/from-gta-online/",
  "/gta-6/launch-watch/",
  "/en/gta-6/launch-watch/",
  "/updates/",
  "/en/updates/",
  "/insights/",
  "/en/insights/"
];

export const sitemapPaths = [...new Set([
  ...corePaths,
  ...(["ru", "en"] as const).flatMap((lang) => [getDotaItemsPath(lang), getDotaItemPlannerPath(lang)]),
  ...dotaItems.flatMap((item) => [getDotaItemPath(item, "ru"), getDotaItemPath(item, "en")]),
  ...hubPortalList.flatMap((hub) => HUB_SECTION_SLUGS.flatMap((section) => [
    getHubPath(hub.id, "ru", section),
    getHubPath(hub.id, "en", section)
  ])),
  ...hubPortalList.flatMap((hub) => [getGoalPlannerPath(hub.id, "ru"), getGoalPlannerPath(hub.id, "en")]),
  ...hubJourneyList.flatMap((journey) => [getHubJourneyPath(journey, "ru"), getHubJourneyPath(journey, "en")]),
  ...insights.flatMap((insight) => [`/insights/${insight.slug}/`, `/en/insights/${insight.slug}/`])
])];

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL("https://themoneymeta.com");
  const urls = sitemapPaths.map((path) => `<url><loc>${new URL(path, origin)}</loc></url>`).join("");
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
