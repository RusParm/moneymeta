import { describe, expect, it } from "vitest";
import { gtaBusinesses, weeklyMeta } from "../src/data/gta-businesses";
import { gtaEconomyNodes, gtaPlayerPaths, gtaScenarios } from "../src/data/gta-hub";
import { dotaPatchContext } from "../src/data/dota-economy";
import { dotaEconomyNodes, dotaPlayerPaths, dotaPulse, dotaRoleLenses, dotaScenarios } from "../src/data/dota-hub";
import { insights } from "../src/data/insights";
import { hubGateways } from "../src/data/hub-gateways";
import { crusaderKingsHub, totalWarHub } from "../src/data/strategy-hubs";
import { wowPatchContext } from "../src/data/wow-economy";
import { wowEconomyNodes, wowMarketRoutes, wowMarks, wowPlayerPaths, wowPulse, wowScenarios } from "../src/data/wow-hub";
const sourceFiles = import.meta.glob("../src/**/*.{astro,ts}", {
  eager: true,
  import: "default",
  query: "?raw"
}) as Record<string, string>;

describe("editorial style", () => {
  it("keeps long dash characters out of public source copy", () => {
    const offenders = Object.entries(sourceFiles).flatMap(([file, source]) =>
      source
        .split("\n")
        .map((line, index) => ({ file, line: index + 1, text: line.trim() }))
        .filter(({ text }) => /[—–]/u.test(text))
    );

    expect(offenders).toEqual([]);
  });

  it("keeps product jargon and untranslated prose out of Russian data", () => {
    const roots = {
      gtaBusinesses,
      weeklyMeta,
      gtaEconomyNodes,
      gtaPlayerPaths,
      gtaScenarios,
      dotaPatchContext,
      dotaEconomyNodes,
      dotaPlayerPaths,
      dotaPulse,
      dotaRoleLenses,
      dotaScenarios,
      wowPatchContext,
      wowMarks,
      wowEconomyNodes,
      wowPlayerPaths,
      wowPulse,
      wowMarketRoutes,
      wowScenarios,
      totalWarHub,
      crusaderKingsHub,
      insights,
      hubGateways
    };
    const forbidden = /\b(?:buyback|GPM|GPH|vROI|ROI|Net Worth|Business ROI|Profession Knowledge|Knowledge Points|Crafting Orders?|Capital lock-up|Editable baseline|Opportunity cost|Time \+ liquidity|Cross-asset|baseline|friction|inventory risk|Money Meta original|Craft All|Ledger|LIQ|CAP|ORD|CRF|KNO|GOAL|PF)\b/iu;
    const offenders: Array<{ path: string; text: string }> = [];

    const collectRussian = (value: unknown, path: string, inRussian = false): void => {
      if (typeof value === "string") {
        if (inRussian && !/^(?:https?:|\/|#)/u.test(value) && forbidden.test(value)) offenders.push({ path, text: value });
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item, index) => collectRussian(item, `${path}[${index}]`, inRussian));
        return;
      }
      if (!value || typeof value !== "object") return;

      Object.entries(value).forEach(([key, item]) => collectRussian(item, `${path}.${key}`, inRussian || key === "ru"));
    };

    collectRussian(roots, "content");
    expect(offenders).toEqual([]);
  });

  it("does not hard-code English labels into shared Russian interface markup", () => {
    const checks = [
      ["../src/pages/404.astro", /Lost transaction|Economy Hub|GTA Online Hub/u],
      ["../src/components/HomePage.astro", /<span>Money Meta \/ Economy Atlas<\/span>/u],
      ["../src/components/GtaCapitalLab.astro", /<div class="gta-business-mark">(?:ROI|GOAL|PF)<\/div>/u]
    ] as const;

    const offenders = checks.flatMap(([file, pattern]) => {
      const source = sourceFiles[file] ?? "";
      return pattern.test(source) ? [{ file, pattern: pattern.source }] : [];
    });

    expect(offenders).toEqual([]);
  });

  it("keeps decorative path media out of the reading layer", () => {
    const gtaPaths = sourceFiles["../src/components/GtaPlayerPaths.astro"] ?? "";
    const dotaPaths = sourceFiles["../src/components/DotaPlayerPaths.astro"] ?? "";
    const wowPaths = sourceFiles["../src/components/WowPlayerPaths.astro"] ?? "";
    const strategyHub = sourceFiles["../src/components/StrategyHub.astro"] ?? "";

    expect(gtaPaths).not.toMatch(/<GtaAssetMark[^>]*large\s*\/>/u);
    expect(wowPaths).not.toContain("wow-path-watermark");
    expect(strategyHub).not.toMatch(/<StrategyMark[^>]*large\s*\/>\s*<div class="path-panel-head">/u);
    expect(dotaPaths).toMatch(/<div class="path-panel-head">[\s\S]*?<div class="dota-path-portrait"/u);
  });
});
