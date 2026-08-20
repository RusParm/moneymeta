import { describe, expect, it } from "vitest";
import { getHubJourneyPath, getHubJourneyStepPath, hubJourneyList, hubJourneys } from "../src/data/hub-journeys";
import { HUB_SECTION_SLUGS, hubPortalList } from "../src/data/hub-portals";
import { insights } from "../src/data/insights";

describe("connected hub playbooks", () => {
  it("ships three complete routes for every game", () => {
    expect(hubJourneyList).toHaveLength(15);

    hubPortalList.forEach((hub) => {
      const journeys = hubJourneys[hub.id];
      expect(journeys).toHaveLength(3);
      expect(new Set(journeys.map((journey) => journey.slug)).size).toBe(3);

      journeys.forEach((journey) => {
        expect(journey.steps).toHaveLength(4);
        expect(journey.principles).toHaveLength(3);
        expect(journey.title.ru).toBeTruthy();
        expect(journey.title.en).toBeTruthy();
        expect(journey.startingPoint.ru).toBeTruthy();
        expect(journey.successSignal.en).toBeTruthy();

        journey.steps.forEach((step) => {
          expect(step.title.ru).toBeTruthy();
          expect(step.title.en).toBeTruthy();
          expect(step.instruction.ru).toBeTruthy();
          expect(step.checkpoint.en).toBeTruthy();
          expect(getHubJourneyStepPath(journey, step, "ru")).toMatch(/^\//u);
          expect(getHubJourneyStepPath(journey, step, "en")).toMatch(/^\/en\//u);
        });
      });
    });
  });

  it("connects every focused section and at least one goal planner per hub", () => {
    hubPortalList.forEach((hub) => {
      const journeys = hubJourneys[hub.id];
      const sections = new Set(journeys.flatMap((journey) => journey.steps.map((step) => step.destination.section)));
      HUB_SECTION_SLUGS.forEach((section) => expect(sections.has(section)).toBe(true));
      expect(journeys.some((journey) => journey.steps.some((step) => step.destination.kind === "planner"))).toBe(true);
    });
  });

  it("links only to published insights", () => {
    const slugs = new Set(insights.map((insight) => insight.slug));
    const linked = hubJourneyList.flatMap((journey) => journey.steps
      .filter((step) => step.destination.kind === "insight")
      .map((step) => step.destination.kind === "insight" ? step.destination.slug : ""));

    expect(linked).toHaveLength(15);
    linked.forEach((slug) => expect(slugs.has(slug)).toBe(true));
  });

  it("publishes stable localized playbook URLs", () => {
    const gta = hubJourneys.gta[0]!;
    const ck3 = hubJourneys.ck3[0]!;
    expect(getHubJourneyPath(gta, "ru")).toBe("/gta-online/playbooks/buy-without-reset/");
    expect(getHubJourneyPath(gta, "en")).toBe("/en/gta-online/playbooks/buy-without-reset/");
    expect(getHubJourneyPath(ck3, "ru")).toBe("/crusader-kings-3/playbooks/succession-ready-realm/");
  });
});
