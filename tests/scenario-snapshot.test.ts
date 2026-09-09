import { describe, expect, it } from "vitest";
import { scenarioTools } from "../src/data/scenario-tools";
import { scenarioResultPriorities } from "../src/data/scenario-result-priorities";
import { captureScenarioSnapshot } from "../src/lib/scenario-snapshot";

/** A tiny read-only DOM fixture; snapshotting needs no browser or storage API. */
class FixtureElement {
  nodeType = 1;
  id = "";
  parentElement: FixtureElement | null = null;
  childNodes: Array<FixtureElement | { nodeType: number; textContent: string }> = [];
  selectors = new Map<string, FixtureElement[]>();
  attributes = new Map<string, string>();
  dataset: Record<string, string> = {};
  labels: FixtureElement[] = [];
  selectedOptions: FixtureElement[] = [];
  value = "";
  constructor(public tagName: string, text = "") { if (text) this.childNodes.push({ nodeType: 3, textContent: text }); }
  get children() { return this.childNodes.filter((node): node is FixtureElement => node instanceof FixtureElement); }
  get textContent(): string { return this.childNodes.map((node) => node.textContent).join(""); }
  append(...nodes: FixtureElement[]) { nodes.forEach((node) => { node.parentElement = this; this.childNodes.push(node); }); return this; }
  querySelectorAll(selector: string) { return this.selectors.get(selector) ?? []; }
  querySelector(selector: string) { return this.querySelectorAll(selector)[0] ?? null; }
  getAttribute(name: string) { return this.attributes.get(name) ?? null; }
  hasAttribute(name: string) { return this.attributes.has(name); }
  matches(_selector: string) { return this.attributes.has("data-hint") || this.attributes.get("class") === "hint"; }
  closest(_selector: string): FixtureElement | null {
    if (_selector === "fieldset") return this.tagName === "FIELDSET" ? this : this.parentElement?.closest(_selector) ?? null;
    return this.hasAttribute("hidden") || this.getAttribute("aria-hidden") === "true" ? this : this.parentElement?.closest(_selector) ?? null;
  }
  register(selector: string, ...nodes: FixtureElement[]) { this.selectors.set(selector, nodes); return this; }
}
const el = (tag: string, text = "") => new FixtureElement(tag.toUpperCase(), text);
const snapshot = (root: FixtureElement, key: string, lang: "ru" | "en" = "ru") => captureScenarioSnapshot(root as unknown as HTMLElement, key, lang);
const role = (key: string) => `[data-role="${key}"]`;
function metric(root: FixtureElement, selector: string, label: string, value: string, valueTag = "strong") {
  const target = el(valueTag, value);
  const row = el("div").append(el(valueTag === "dd" ? "dt" : "span", label), target);
  root.append(row).register(selector, target);
  return target;
}
function control(key: string, label: FixtureElement, value: string, tag = "input") {
  const input = el(tag);
  input.dataset.role = key;
  input.value = value;
  input.labels = [label];
  label.append(input);
  return input;
}
const registerInputs = (root: FixtureElement, ...inputs: FixtureElement[]) => root.register("input[data-role], select[data-role]", ...inputs);

describe("saved scenario result contracts", () => {
  it("covers every named-save tool and the session planner with at most four explicit priorities", () => {
    for (const key of [...scenarioTools.map((tool) => tool.key), "gta-session"]) {
      expect(scenarioResultPriorities[key], key).toBeDefined();
      expect(scenarioResultPriorities[key]!.metrics.length, key).toBeGreaterThan(0);
      expect(scenarioResultPriorities[key]!.metrics.length, key).toBeLessThanOrEqual(4);
      expect(new Set(scenarioResultPriorities[key]!.metrics.map((entry) => entry.valueSelector)).size, key).toBe(scenarioResultPriorities[key]!.metrics.length);
    }
  });

  it("keeps Midas payback even when it is the fifth result in the page", () => {
    const root = el("section");
    ["uses", "incremental", "gross", "net", "payback", "roi"].forEach((name, index) => metric(root, role(`midas-${name}`), name, String(index + 1)));
    expect(snapshot(root, "dota-midas").summary.map((row) => row.label)).toEqual(["payback", "net", "uses", "roi"]);
    expect(snapshot(root, "dota-midas").summary[0]?.value).toBe("5");
  });

  it("preserves session income, target time and unsold inventory for WoW farming", () => {
    const root = el("section");
    ["listed", "effective", "rate", "haircut", "inventory", "session-gold", "target-hours"].forEach((name) => metric(root, role(`farm-${name}`), name, name === "target-hours" ? "∞" : "1 000 зол."));
    expect(snapshot(root, "wow-farm").summary.map((row) => row.label)).toEqual(["effective", "session-gold", "target-hours", "inventory"]);
    expect(snapshot(root, "wow-farm").summary[2]?.value).toBe("∞");
  });

  it("captures the actual chosen business, but not a no-fit headline", () => {
    const root = el("section").register(role("result-name"), el("div", "Acid Lab"));
    metric(root, role("result-payback"), "Окупаемость", "15 ч");
    metric(root, role("result-income"), "Доход", "$ 50 000");
    metric(root, role("result-setup"), "Стоимость", "$ 750 000");
    expect(snapshot(root, "gta-next-move").summary[0]).toEqual({ label: "Выбранный бизнес", value: "Acid Lab" });
    const empty = el("section").register(role("result-name"), el("div", "Nothing fits yet"));
    metric(empty, role("result-setup"), "Cost", "-");
    expect(snapshot(empty, "gta-next-move", "en").summary).toEqual([]);
  });

  it("keeps both item names and projected minutes instead of matching option positions across saves", () => {
    const root = el("section");
    ["Blink Dagger", "Force Staff"].forEach((name, index) => {
      root.register(`[data-compare-option="${index}"] [data-item-name]`, el("h2", name));
      root.register(`[data-compare-option="${index}"] [data-item-projected]`, el("dd", `${15 + index}`));
    });
    expect(snapshot(root, "dota-compare", "en").summary).toEqual([
      { label: "Blink Dagger · projected minute", value: "15" },
      { label: "Force Staff · projected minute", value: "16" }
    ]);
  });

  it("preserves queue order and stays within four results", () => {
    const root = el("section");
    const items = ["Black King Bar · 4,050", "Blink Dagger · 2,250", "Optional"].map((name, index) => {
      const select = el("select"); select.value = index < 2 ? String(index) : ""; select.selectedOptions = [el("option", name)]; return select;
    });
    root.register("select[data-role^='item']", ...items);
    metric(root, "[data-plan-finish]", "Готовность, мин", "20.6");
    metric(root, "[data-plan-total-cost]", "Стоимость", "6300");
    metric(root, "[data-plan-count]", "Предметов", "2");
    const result = snapshot(root, "dota-item-plan");
    expect(result.summary).toHaveLength(4);
    expect(result.summary[0]).toEqual({ label: "Покупки", value: "Black King Bar → Blink Dagger" });
  });

  it("does not capture hidden stale results or arbitrary first metrics for unknown tools", () => {
    const root = el("section");
    const stale = metric(root, role("craft-cash"), "Cash", "900");
    stale.parentElement!.attributes.set("hidden", "");
    metric(root, role("craft-batch"), "Profit", "-");
    root.register(role("craft-decision"), el("div", "-")).register("[data-craft-action]", el("p", " "));
    expect(snapshot(root, "wow-crafting")).toEqual({ summary: [], inputs: [] });
    expect(snapshot(root, "future-tool").summary).toEqual([]);
  });

  it("saves existing reserve decisions without unrelated explanatory text", () => {
    const root = el("section");
    root.register("[data-decision-answer]", el("p", " Отложи найм. \n Проверка на 8 ходов. "));
    root.register("[data-model-verdict]", el("div", "Резерв сохранится"));
    root.register("p", el("p", "Do not capture every paragraph"));
    expect(snapshot(root, "ck3-war-chest").decision).toBe("Отложи найм. Проверка на 8 ходов. Резерв сохранится");
  });

  it.each([
    ["Одного занятия достаточно", "Одного занятия достаточно."],
    ["Одного занятия достаточно.", "Одного занятия достаточно."],
    ["Одного занятия достаточно?", "Одного занятия достаточно?"]
  ])("separates saved decision fragments after %s", (heading, sentence) => {
    const root = el("section");
    root.register("[data-session-decision]", el("h4", heading));
    root.register("[data-session-reason]", el("p", "Сочетание не увеличивает поступление."));
    expect(snapshot(root, "gta-session").decision).toBe(`${sentence} Сочетание не увеличивает поступление.`);
  });
});

describe("saved input labels", () => {
  it("reads associated label text and selected option, leaving original DOM untouched", () => {
    const root = el("section");
    const label = el("label").append(el("span", "Стоимость, золото"), el("small", "Long explanatory hint"));
    const cost = control("cost", label, "4000");
    const modeLabel = el("label").append(el("span", "Режим продажи"));
    const mode = control("mode", modeLabel, "sold", "select");
    const selected = el("option", "Уже продано");
    mode.append(el("option", "План продажи"), selected);
    mode.selectedOptions = [selected];
    registerInputs(root, cost, mode);
    const before = label.textContent + modeLabel.textContent;
    expect(snapshot(root, "wow-crafting").inputs).toEqual([
      { key: "cost", label: "Стоимость, золото", value: "4000" },
      { key: "mode", label: "Режим продажи", value: "Уже продано" }
    ]);
    expect(label.textContent + modeLabel.textContent).toBe(before);
    expect(mode.value).toBe("sold");
  });

  it("excludes described hints, range outputs, optional notes, and unrelated controls", () => {
    const root = el("section");
    const hint = el("span", "Do not use the displayed price as a guaranteed sale"); hint.id = "price-hint";
    const label = el("label").append(el("span", "Вероятность продажи, %"), hint, el("output", "55%"), el("small", "Optional"));
    const input = control("chance", label, "55"); input.attributes.set("aria-describedby", "price-hint");
    const unknown = el("input"); unknown.dataset.role = "technical-key"; unknown.value = "9";
    registerInputs(root, input, unknown);
    expect(snapshot(root, "civ7-building").inputs).toEqual([{ key: "chance", label: "Вероятность продажи, %", value: "55" }]);
  });

  it("retains zero and optional empty values without replacing them with technical keys", () => {
    const root = el("section");
    registerInputs(root, control("zero", el("label", "Расходы"), "0"), control("empty", el("label", "Резерв"), ""));
    expect(snapshot(root, "gta-business").inputs).toEqual([{ key: "zero", label: "Расходы", value: "0" }, { key: "empty", label: "Резерв", value: "" }]);
  });

  it("keeps the option or activity name when grouped controls repeat the same label", () => {
    const root = el("section");
    const a = control("costA", el("label", "Стоимость, производство"), "100");
    const b = control("costB", el("label", "Стоимость, производство"), "200");
    root.append(el("fieldset").append(el("legend", "Вариант A"), a.labels[0]!));
    root.append(el("fieldset").append(el("legend", "Вариант B"), b.labels[0]!));
    registerInputs(root, a, b);
    expect(snapshot(root, "civ7-comparison").inputs).toEqual([
      { key: "costA", label: "Вариант A · Стоимость, производство", value: "100" },
      { key: "costB", label: "Вариант B · Стоимость, производство", value: "200" }
    ]);
  });

  it("bounds all displayed snapshot fields and avoids duplicate input rows", () => {
    const root = el("section");
    const inputs = Array.from({ length: 45 }, (_, index) => control(`input-${index}`, el("label", "l".repeat(200)), "v".repeat(300)));
    registerInputs(root, inputs[0]!, inputs[0]!, ...inputs.slice(1));
    metric(root, role("midas-payback"), "a".repeat(200), "b".repeat(300));
    root.register(role("midas-decision"), el("div", "c".repeat(500)));
    const result = snapshot(root, "dota-midas");
    expect(result.inputs).toHaveLength(40);
    expect(result.inputs.every((row) => row.label.length === 120 && row.value.length === 160)).toBe(true);
    expect(result.summary[0]?.label).toHaveLength(120);
    expect(result.summary[0]?.value).toHaveLength(160);
    expect(result.decision).toHaveLength(360);
  });
});
