import { getHubPath, type HubLocale, type HubPortalId, type HubSectionSlug } from "../data/hub-portals";

const anchorSections: Record<HubPortalId, Record<string, HubSectionSlug>> = {
  gta: {
    "economy-map": "economy",
    "player-paths": "player-paths",
    "weekly-pulse": "meta",
    "conditional-rankings": "meta",
    "research-library": "guides",
    "scenario-deck": "tools",
    "capital-lab": "tools",
    "business-roi": "tools",
    "hours-to-goal": "tools",
    "portfolio-allocation": "tools"
  },
  dota: {
    "economy-map": "economy",
    "player-paths": "player-paths",
    "role-lenses": "player-paths",
    "patch-pulse": "meta",
    "research-library": "guides",
    "decision-deck": "tools",
    "scenario-lab": "tools",
    "midas-irr": "tools",
    "buyback-reserve": "tools"
  },
  wow: {
    "market-ledger": "economy",
    "economy-map": "economy",
    "player-paths": "player-paths",
    "market-pulse": "meta",
    "market-rankings": "meta",
    "research-library": "guides",
    "decision-deck": "tools",
    "scenario-lab": "tools",
    "crafting-margin": "tools",
    "farm-liquidity": "tools",
    "order-floor": "tools"
  },
  "total-war": {
    "economy-map": "economy",
    "player-paths": "player-paths",
    "campaign-pulse": "meta",
    "economy-lenses": "meta",
    "research-library": "guides",
    "decision-deck": "tools",
    "scenario-lab": "tools",
    "building-payback": "tools",
    "war-reserve": "tools",
    "conquest-choice": "tools"
  },
  ck3: {
    "economy-map": "economy",
    "player-paths": "player-paths",
    "dynasty-pulse": "meta",
    "economy-lenses": "meta",
    "research-library": "guides",
    "decision-deck": "tools",
    "scenario-lab": "tools",
    "domain-payback": "tools",
    "war-chest": "tools",
    "succession-buffer": "tools"
  }
};

export function migrateHubHref(hub: HubPortalId, lang: HubLocale, href: string): string {
  if (!href || href.startsWith("http://") || href.startsWith("https://")) return href;

  const parsed = new URL(href, "https://themoneymeta.com");
  const anchor = parsed.hash.replace(/^#/, "");
  const section = anchorSections[hub][anchor];
  if (!section) return href;

  const base = getHubPath(hub, lang, section);
  return `${base}${parsed.search}${parsed.hash}`;
}
