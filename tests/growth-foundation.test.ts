import { describe, expect, it } from "vitest";
import { weeklyMeta } from "../src/data/gta-businesses";
import { hubPortals } from "../src/data/hub-portals";
import { insights } from "../src/data/insights";
import { sitemapPaths } from "../src/pages/sitemap.xml";

describe("growth foundation routes", () => {
  it("publishes localized update, weekly and inventory-turn destinations", () => {
    expect(sitemapPaths).toEqual(expect.arrayContaining([
      "/updates/",
      "/en/updates/",
      "/gta-online/weekly/",
      "/en/gta-online/weekly/",
      "/wow/tools/inventory-turn/",
      "/en/wow/tools/inventory-turn/"
    ]));
  });

  it("does not present the expired VIP Work window as a current action", () => {
    const vip = weeklyMeta.opportunities.find((item) => item.id === "vip-work-weekend");
    expect(weeklyMeta.checkedAt).toBe("2026-08-24");
    expect(vip?.signal.ru).toContain("завершено");
    expect(vip?.decision.en).toContain("expired multiplier");
  });

  it("connects the WoW batch analysis to the dedicated fifth model", () => {
    const batchGuide = insights.find((item) => item.slug === "wow-batch-size-inventory-trap");
    expect(hubPortals.wow.stats.some((stat) => stat.value === "5")).toBe(true);
    expect(batchGuide?.toolPath).toEqual({
      ru: "/wow/tools/inventory-turn/",
      en: "/en/wow/tools/inventory-turn/"
    });
  });
});
