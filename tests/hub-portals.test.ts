import { describe, expect, it } from "vitest";
import { HUB_SECTION_SLUGS, getHubPath, hubPortalList, hubPortals } from "../src/data/hub-portals";
import { migrateHubHref } from "../src/lib/hub-links";

const portalSource = Object.values(import.meta.glob("../src/components/HubPortal.astro", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>)[0] ?? "";

describe("v1.9 hub portals", () => {
  it("ships five compact portals with five standalone destinations each", () => {
    expect(hubPortalList).toHaveLength(5);
    expect(HUB_SECTION_SLUGS).toEqual(["economy", "player-paths", "meta", "guides", "tools"]);

    hubPortalList.forEach((hub) => {
      expect(hub.sections.map((section) => section.slug)).toEqual(HUB_SECTION_SLUGS);
      expect(new Set(hub.sections.map((section) => section.code)).size).toBe(5);
      expect(hub.heading.ru).toBeTruthy();
      expect(hub.heading.en).toBeTruthy();
      expect(hub.valueText.ru.length).toBeGreaterThan(80);
      expect(hub.sourceUrl).toMatch(/^https:\/\//u);
      expect(hub.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/u);

      hub.sections.forEach((section) => {
        expect(section.question.ru).toBeTruthy();
        expect(section.payoff.en).toBeTruthy();
        expect(getHubPath(hub.id, "ru", section.slug)).toBe(`/${hub.slug}/${section.slug}/`);
        expect(getHubPath(hub.id, "en", section.slug)).toBe(`/en/${hub.slug}/${section.slug}/`);
      });
    });
  });

  it("uses publisher media only with explicit credit and source", () => {
    hubPortalList.flatMap((hub) => hub.media).forEach((media) => {
      expect(media.src).toMatch(/^https:\/\//u);
      expect(media.sourceUrl).toMatch(/^https:\/\//u);
      expect(media.sourceLabel).toBeTruthy();
      expect(media.alt.ru).toBeTruthy();
      expect(media.caption.en).toBeTruthy();
    });
  });

  it("migrates legacy anchors and scenario URLs into focused pages", () => {
    expect(migrateHubHref("dota", "ru", "#midas-irr")).toBe("/dota-2/tools/#midas-irr");
    expect(migrateHubHref("dota", "en", "/en/dota-2/#role-lenses")).toBe("/en/dota-2/player-paths/#role-lenses");
    expect(migrateHubHref("wow", "ru", "/wow/?batch=20#crafting-margin")).toBe("/wow/tools/?batch=20#crafting-margin");
    expect(migrateHubHref("gta", "en", "#conditional-rankings")).toBe("/en/gta-online/meta/#conditional-rankings");
  });

  it("keeps current context explicit for all games", () => {
    expect(hubPortals.dota.version.ru).toContain("7.41e");
    expect(hubPortals["total-war"].version.ru).toContain("8.1");
    expect(hubPortals.ck3.version.ru).toContain("1.19");
    expect(hubPortals.gta.version.ru).toContain("Brand Wars");
    expect(hubPortals.wow.version.ru).toContain("Ula’tek");
  });

  it("keeps root hubs as compact routers instead of full duplicated documents", () => {
    expect(portalSource).toContain("hub-portal-v14");
    expect(portalSource).toContain("portal-command-center");
    expect(portalSource).toContain("<HubDecisionGateway");
    expect(portalSource).not.toContain("<HubJourneyRail");
    expect(portalSource).not.toContain("<HubGuideLibrary");
    expect(portalSource).not.toContain("portal-destinations");
    expect(portalSource).not.toContain("portal-media-section");
    expect(portalSource).not.toContain("portal-source-rail");
  });
});
