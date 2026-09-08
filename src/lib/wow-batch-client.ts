import { wowBatchPlannerCopy } from "../data/wow-batch-planner-copy";
import { calculateWowBatchActual, calculateWowBatchPlan, nextWowBatchAssumptions, validWowBatchInput, type WowBatchInput } from "./wow-batch-planner";
import { addWowBatchForecast, closeWowBatchForecast, readWowBatchJournal, removeWowBatchRecord, wowBatchRecordToken, WOW_BATCH_STORE_KEY, type WowBatchRecord } from "./wow-batch-journal";

export const wowBatchFieldRoles = {
  materialCostPerCraft: "craft-materials", outputUnits: "craft-output", salePricePerUnit: "craft-price",
  auctionHouseCutPercent: "craft-cut", depositPerListing: "craft-deposit", sellThroughPercent: "craft-sellthrough",
  crafts: "craft-count", walletGold: "craft-wallet", reserveGold: "craft-reserve", observedSoldUnits: "craft-sales-cap"
} as const;

export function readWowBatchInput(root: HTMLElement): WowBatchInput | null {
  const values: Record<string, number | string> = {};
  for (const [key, role] of Object.entries(wowBatchFieldRoles)) {
    const control = root.querySelector<HTMLInputElement>(`[data-role='${role}']`);
    if (!control || !control.value.trim() || !control.validity.valid || !Number.isFinite(Number(control.value))) return null;
    values[key] = Number(control.value);
  }
  values.salesMode = root.querySelector<HTMLSelectElement>("[data-role='craft-sales-mode']")?.value ?? "";
  return validWowBatchInput(values) ? values : null;
}

export function initializeWowBatchPlanner(root: HTMLElement) {
  if (root.dataset.batchPlannerReady === "true") return;
  root.dataset.batchPlannerReady = "true";
  const lang = root.dataset.lang === "en" ? "en" : "ru";
  const ru = lang === "ru";
  const c = wowBatchPlannerCopy[lang];
  const q = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const format = new Intl.NumberFormat(ru ? "ru-RU" : "en-US", { maximumFractionDigits: 2 });
  const gold = (n: number) => `${format.format(n)} ${c.gold}`;
  const storage = { getItem: (key: string) => window.localStorage.getItem(key), setItem: (key: string, value: string) => window.localStorage.setItem(key, value) };
  const journal = q<HTMLDetailsElement>("[data-batch-journal]");
  const select = q<HTMLSelectElement>("[data-batch-select]");
  let selected: WowBatchRecord | undefined;
  let expected = "";
  let stale = false;
  const say = (message: string) => { q("[data-batch-journal-status]").textContent = message; };
  const failure = (error: string) => say(error === "stale" ? c.stale : error === "limit" ? c.limit : error === "invalid" ? c.invalid : c.storage);
  const clearActual = () => root.querySelectorAll<HTMLInputElement>("[data-batch-actual]").forEach((control) => { control.value = ""; });

  function updateChanged() {
    const current = readWowBatchInput(root);
    q("[data-batch-changed]").hidden = !selected || (current !== null && JSON.stringify(current) === JSON.stringify(selected.forecast));
  }

  function renderPlan() {
    const observed = q<HTMLSelectElement>("[data-role='craft-sales-mode']").value === "observed";
    q("[data-batch-cap-field]").hidden = !observed;
    q<HTMLInputElement>("[data-role='craft-sellthrough']").closest<HTMLElement>(".field")!.hidden = observed;
    // An unused hidden field must not trap the new mode in an invalid state.
    // No active sales assumption is changed by this neutral placeholder.
    const unused = q<HTMLInputElement>(observed ? "[data-role='craft-sellthrough']" : "[data-role='craft-sales-cap']");
    if (!unused.value.trim() || !unused.validity.valid || !Number.isFinite(Number(unused.value))) {
      unused.value = "0";
      unused.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const input = readWowBatchInput(root);
    const plan = input ? calculateWowBatchPlan(input) : null;
    q<HTMLButtonElement>("[data-batch-save]").disabled = !plan?.fits;
    const resize = q<HTMLButtonElement>("[data-batch-use-size]");
    resize.hidden = !plan || plan.fits || plan.feasibleCrafts === 0;
    resize.disabled = !plan || plan.fits || plan.feasibleCrafts === 0;
    updateChanged();
    if (!input || !plan) return;
    q("[data-batch-plan-decision]").textContent = plan.reserveAlreadyShort ? c.noCash : plan.feasibleCrafts === 0 ? c.noCraft : plan.fits ? c.fits : c.tooLarge;
    q("[data-batch-max]").textContent = plan.affordableCrafts === null ? c.unlimited
      : plan.affordableLimitReached ? ru
        ? `Доступное число изготовлений: не меньше ${format.format(plan.affordableCrafts)}. Это предел расчёта: до 1 000 000 ед. товара в партии.`
        : `The budget can fund at least ${format.format(plan.affordableCrafts)} crafts. This reaches the calculation limit: 1,000,000 output units per batch.`
      : ru ? `Бюджет на материалы и залог: ${gold(plan.budgetGold)} Максимальное число изготовлений: ${format.format(plan.affordableCrafts)}.`
        : `Materials and deposit budget: ${gold(plan.budgetGold)}. It can fund at most ${format.format(plan.affordableCrafts)} crafts.`;
    for (const [side, crafts, cashAfter, endCash, metrics] of [
      ["requested", input.crafts, plan.requestedCashAfterCraft, plan.requestedEndCash, plan.requested],
      ["feasible", plan.feasibleCrafts, plan.feasibleCashAfterCraft, plan.feasibleEndCash, plan.feasible]
    ] as const) {
      const values = { crafts: format.format(crafts), outlay: gold(metrics.upfrontGold), after: gold(cashAfter), sold: format.format(metrics.soldUnits), end: gold(endCash) };
      for (const [key, value] of Object.entries(values)) q(`[data-batch-${side}='${key}']`).textContent = value;
    }
  }

  function renderRecord() {
    const loaded = readWowBatchJournal(storage);
    if (!loaded.ok) { selected = undefined; q("[data-batch-record]").hidden = true; failure(loaded.error); return; }
    selected = loaded.records.find((record) => record.id === select.value);
    expected = selected ? wowBatchRecordToken(selected) : "";
    stale = false;
    clearActual();
    q<HTMLInputElement>("[data-batch-next-wallet]").value = "";
    q("[data-batch-remove-confirm]").hidden = true;
    q("[data-batch-record]").hidden = !selected;
    if (!selected) return;
    const plan = calculateWowBatchPlan(selected.forecast)!;
    const stamp = new Intl.DateTimeFormat(ru ? "ru-RU" : "en-GB", { dateStyle: "medium" }).format(new Date(selected.createdAt));
    q("[data-batch-original]").textContent = ru
      ? `${selected.name} · ${stamp} · Число изготовлений: ${format.format(selected.forecast.crafts)}; выход: ${format.format(plan.requested.units)} ед.; продажи: ${format.format(plan.requested.soldUnits)} ед.; материалы: ${gold(plan.requested.materialOutlay)} и залог: ${gold(plan.requested.depositOutlay)}; изменение золота: ${gold(plan.requested.cashChange)}; кошелёк до партии: ${gold(selected.forecast.walletGold)}`
      : `${selected.name} · ${stamp}. ${format.format(selected.forecast.crafts)} crafts, ${format.format(plan.requested.units)} units; sales ${format.format(plan.requested.soldUnits)} units; materials ${gold(plan.requested.materialOutlay)} and deposit ${gold(plan.requested.depositOutlay)}; cash change ${gold(plan.requested.cashChange)}; initial wallet ${gold(selected.forecast.walletGold)}.`;
    q("[data-batch-actual-form]").hidden = selected.actual !== null;
    q("[data-batch-actual-result]").hidden = selected.actual === null;
    q<HTMLButtonElement>("[data-batch-close]").disabled = selected.actual !== null;
    q<HTMLButtonElement>("[data-batch-remove]").disabled = false;
    q<HTMLInputElement>("[data-batch-actual='soldUnits']").max = String(Math.min(1e6, plan.requested.units));
    q<HTMLInputElement>("[data-batch-actual='lostDeposits']").max = String(plan.requested.depositOutlay);
    if (selected.actual) {
      const actual = calculateWowBatchActual(selected.forecast, selected.actual)!;
      q("[data-batch-recorded]").textContent = ru
        ? `Записанный факт: продано ${format.format(selected.actual.soldUnits)} ед.; выручка после комиссии ${gold(selected.actual.netSaleProceeds)}; потерянный залог ${gold(selected.actual.lostDeposits)}`
        : `Recorded outcome: ${format.format(selected.actual.soldUnits)} units sold; proceeds after fees ${gold(selected.actual.netSaleProceeds)}; lost deposits ${gold(selected.actual.lostDeposits)}.`;
      q("[data-batch-actual-cash]").textContent = gold(actual.cashChange);
      q("[data-batch-actual-stock]").textContent = format.format(actual.inventoryUnits);
      q("[data-batch-actual-difference]").textContent = `${actual.cashDifference > 0 ? "+" : ""}${gold(actual.cashDifference)}`;
      q<HTMLButtonElement>("[data-batch-next]").disabled = false;
    }
    updateChanged();
  }

  function refreshJournal(id = select.value) {
    const result = readWowBatchJournal(storage);
    if (!result.ok) { failure(result.error); return; }
    select.replaceChildren();
    if (!result.records.length) select.add(new Option(c.none, ""));
    for (const record of result.records) select.add(new Option(`${record.name} · ${record.actual === null ? c.pending : c.closed}`, record.id));
    if (result.records.some((record) => record.id === id)) select.value = id;
    renderRecord();
  }

  q<HTMLButtonElement>("[data-batch-use-size]").addEventListener("click", () => {
    const input = readWowBatchInput(root);
    const plan = input ? calculateWowBatchPlan(input) : null;
    if (!plan || plan.feasibleCrafts <= 0) return;
    const count = q<HTMLInputElement>("[data-role='craft-count']");
    count.value = String(plan.feasibleCrafts);
    count.dispatchEvent(new Event("input", { bubbles: true }));
  });
  q<HTMLButtonElement>("[data-batch-save]").addEventListener("click", () => {
    const input = readWowBatchInput(root);
    const name = q<HTMLInputElement>("[data-batch-name]").value.trim();
    if (!input || !calculateWowBatchPlan(input)?.fits || !name || name.length > 80) { say(c.cannotSave); return; }
    const record: WowBatchRecord = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString(), forecast: { ...input }, actual: null };
    const result = addWowBatchForecast(storage, record);
    if (!result.ok) { failure(result.error); return; }
    refreshJournal(record.id); say(c.locked);
  });
  select.addEventListener("change", () => { renderRecord(); say(""); });
  q<HTMLButtonElement>("[data-batch-close]").addEventListener("click", () => {
    if (!selected || stale) { say(c.stale); return; }
    const actual: Record<string, number> = {};
    for (const control of root.querySelectorAll<HTMLInputElement>("[data-batch-actual]")) {
      if (!control.value.trim() || !control.validity.valid || !Number.isFinite(Number(control.value))) { say(c.invalid); control.focus(); return; }
      actual[control.dataset.batchActual!] = Number(control.value);
    }
    const result = closeWowBatchForecast(storage, selected.id, expected, {
      soldUnits: actual.soldUnits!, netSaleProceeds: actual.netSaleProceeds!, lostDeposits: actual.lostDeposits!, recordedAt: new Date().toISOString()
    });
    if (!result.ok) { failure(result.error); return; }
    refreshJournal(selected.id); say(c.actualSaved);
  });
  q<HTMLButtonElement>("[data-batch-next]").addEventListener("click", () => {
    if (!selected?.actual || stale) { say(c.stale); return; }
    const latest = readWowBatchJournal(storage);
    const record = latest.ok ? latest.records.find((r) => r.id === selected!.id) : undefined;
    if (!record || wowBatchRecordToken(record) !== expected) { say(c.stale); return; }
    const wallet = q<HTMLInputElement>("[data-batch-next-wallet]");
    if (!wallet.value.trim() || !wallet.validity.valid || !Number.isFinite(Number(wallet.value))) { say(c.nextWalletHint); wallet.focus(); return; }
    const next = nextWowBatchAssumptions(selected.forecast, selected.actual, Number(wallet.value));
    if (!next) return;
    const seeded = { ...selected.forecast, ...next };
    for (const [key, role] of Object.entries(wowBatchFieldRoles)) q<HTMLInputElement>(`[data-role='${role}']`).value = String(seeded[key as keyof typeof wowBatchFieldRoles]);
    const mode = q<HTMLSelectElement>("[data-role='craft-sales-mode']");
    mode.value = next.salesMode;
    mode.dispatchEvent(new Event("change", { bubbles: true }));
    q<HTMLInputElement>("[data-role='craft-wallet']").dispatchEvent(new Event("input", { bubbles: true }));
    say(c.seeded);
    q("[data-batch-plan-result]").scrollIntoView({ block: "start" });
  });
  q<HTMLButtonElement>("[data-batch-remove]").addEventListener("click", () => { q("[data-batch-remove-confirm]").hidden = false; });
  q<HTMLButtonElement>("[data-batch-cancel-remove]").addEventListener("click", () => { q("[data-batch-remove-confirm]").hidden = true; });
  q<HTMLButtonElement>("[data-batch-confirm-remove]").addEventListener("click", () => {
    if (!selected || stale) { say(c.stale); return; }
    const result = removeWowBatchRecord(storage, selected.id, expected);
    if (!result.ok) { failure(result.error); return; }
    refreshJournal(); say(c.removed);
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== WOW_BATCH_STORE_KEY && event.key !== null) return;
    stale = true;
    for (const selector of ["[data-batch-close]", "[data-batch-next]", "[data-batch-remove]"]) q<HTMLButtonElement>(selector).disabled = true;
    say(c.stale);
  });
  root.addEventListener("input", (event) => { if ((event.target as HTMLElement).hasAttribute("data-role")) renderPlan(); });
  q<HTMLSelectElement>("[data-role='craft-sales-mode']").addEventListener("change", renderPlan);
  function openFromHash() {
    const match = /^#batch=([0-9a-f-]{36})$/i.exec(window.location.hash);
    if (!match) return;
    journal.open = true;
    refreshJournal(match[1]);
    if (selected?.id !== match[1]) { say(c.stale); return; }
    root.querySelector<HTMLElement>("[data-scenario-key='wow-crafting']")?.dispatchEvent(new CustomEvent("money-meta:restore-scenario", { bubbles: true }));
    journal.scrollIntoView({ block: "start" });
    select.focus({ preventScroll: true });
    document.querySelectorAll<HTMLAnchorElement>(".lang-switch a").forEach((link) => { const url = new URL(link.href); url.hash = `batch=${selected!.id}`; link.href = url.toString(); });
  }
  renderPlan(); refreshJournal();
  // Module initialization may run before the shared tool-tab controller.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", openFromHash, { once: true });
  else queueMicrotask(openFromHash);
  window.addEventListener("hashchange", openFromHash);
}
