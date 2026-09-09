import { describe, expect, it } from "vitest";
import { compareSavedScenarios } from "../src/lib/saved-scenario-comparison";
import type { SavedScenario } from "../src/lib/saved-scenarios";

const variant = (id = 1): SavedScenario => ({
  id: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`, toolKey: "wow-farm", name: `Вариант ${id}`, lang: "ru",
  createdAt: "2026-09-08T10:00:00.000Z", updatedAt: "2026-09-08T10:00:00.000Z", engineVersion: "1.31.0", context: "Retail",
  values: { units: "100", price: "2", choice: "herb" },
  inputs: [{ key: "units", label: "Товар за час", value: "100" }, { key: "price", label: "Цена, зол.", value: "2" }, { key: "choice", label: "Товар", value: "Трава" }],
  summary: [{ label: "Доход", value: "200 зол." }], note: "", reviewed: false
});

describe("Saved variant comparison", () => {
  it("compares only two different variants of the same task", () => {
    expect(compareSavedScenarios(variant(), variant())).toEqual({ ok: false, reason: "same-record" });
    expect(compareSavedScenarios(variant(), { ...variant(2), toolKey: "wow-crafting" })).toEqual({ ok: false, reason: "different-tool" });
  });
  it("shows the changed assumption separately from identical ones without recalculating historical results", () => {
    const left = variant();
    const right = { ...variant(2), values: { ...left.values, price: "3" }, inputs: variant().inputs!.map((row) => row.key === "price" ? { ...row, value: "3" } : row), summary: [{ label: "Доход", value: "300 зол." }] };
    const original = JSON.stringify([left, right]);
    const compared = compareSavedScenarios(left, right);
    expect(compared.ok && compared.changedInputs).toEqual([{ key: "price", left: { label: "Цена, зол.", value: "2" }, right: { label: "Цена, зол.", value: "3" } }]);
    expect(compared.ok && compared.unchangedInputs.map((row) => row.key)).toEqual(["units", "choice"]);
    expect(compared.ok && compared.missingLabels).toBe(0);
    expect(JSON.stringify([left, right])).toBe(original);
  });
  it("does not call a translated option a changed assumption", () => {
    const right = { ...variant(2), lang: "en" as const, inputs: variant().inputs!.map((row) => row.key === "choice" ? { ...row, label: "Item", value: "Herb" } : row) };
    const compared = compareSavedScenarios(variant(), right);
    expect(compared.ok && compared.changedInputs).toEqual([]);
    expect(compared.ok && compared.unchangedInputs.at(-1)?.right).toEqual({ label: "Item", value: "Herb" });
  });
  it("keeps old records usable without exposing their raw field names or option identifiers", () => {
    const { inputs: _labels, ...old } = variant();
    const compared = compareSavedScenarios(old, variant(2));
    expect(compared).toMatchObject({ ok: true, changedInputs: [], unchangedInputs: [], missingLabels: 3 });
    expect(JSON.stringify(compared)).not.toContain("herb");
    expect(JSON.stringify(compared)).not.toContain("price");
  });
  it("does not treat a field missing from an earlier model as an unchanged assumption", () => {
    const right = variant(2); right.values.deadline = "5"; right.inputs!.push({ key: "deadline", label: "Срок", value: "5" });
    const compared = compareSavedScenarios(variant(), right);
    expect(compared.ok && compared.missingLabels).toBe(1);
    expect(compared.ok && compared.unchangedInputs).toHaveLength(3);
  });
  it("flags different historical model versions and source descriptions independently", () => {
    expect(compareSavedScenarios(variant(), { ...variant(2), engineVersion: "1.32.0" })).toMatchObject({ ok: true, differentEngine: true, differentContext: false });
    expect(compareSavedScenarios(variant(), { ...variant(2), context: "Other patch" })).toMatchObject({ ok: true, differentEngine: false, differentContext: true });
  });
});
