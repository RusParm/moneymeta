import { getScenarioTool, type ScenarioLocale } from "../data/scenario-tools";
import { readSavedScenarios, savedScenarioHref } from "./saved-scenarios";
import { readWowBatchJournal } from "./wow-batch-journal";

const preferenceKey = "money-meta:home-game:v1";

export function initializeHome() {
  const home = document.querySelector<HTMLElement>(".mm-home");
  if (!home) return;
  const lang: ScenarioLocale = home.dataset.homeLang === "en" ? "en" : "ru";
  const ru = lang === "ru";
  const tabs = [...home.querySelectorAll<HTMLAnchorElement>("[data-home-game-tab]")];
  const panels = [...home.querySelectorAll<HTMLElement>("[data-home-game-panel]")];
  const tablist = home.querySelector<HTMLElement>("[data-home-tabs]");
  let selected = tabs[0];
  if (!selected || !tablist) return;

  function renderSaved() {
    const result = readSavedScenarios({ getItem: (key) => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) });
    home!.querySelectorAll<HTMLElement>("[data-home-resume]").forEach((region) => {
      const list = region.querySelector<HTMLElement>("[data-home-resume-list]")!;
      list.replaceChildren();
      const records = result.ok ? result.records
        .filter((record) => !record.reviewed && getScenarioTool(record.toolKey)?.game === region.dataset.gameId)
        .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 2) : [];
      region.hidden = records.length === 0;
      records.forEach((record) => {
        const href = savedScenarioHref(record, lang);
        if (!href) return;
        const link = document.createElement("a");
        link.href = href;
        const title = document.createElement("strong");
        title.textContent = record.name;
        const summary = document.createElement("span");
        const date = new Intl.DateTimeFormat(ru ? "ru-RU" : "en-GB", { day: "numeric", month: "short" }).format(new Date(record.createdAt));
        summary.textContent = `${date} · ${getScenarioTool(record.toolKey)?.title[lang] ?? ""} · ${record.summary[0]?.value ?? ""}`;
        const action = document.createElement("b");
        action.textContent = ru ? "Продолжить →" : "Resume →";
        link.append(title, summary, action);
        list.appendChild(link);
      });
    });
    const batchRegion = home!.querySelector<HTMLElement>("[data-home-batch-resume]");
    if (!batchRegion) return;
    const batchList = batchRegion.querySelector<HTMLElement>("[data-home-resume-list]")!;
    batchList.replaceChildren();
    const journal = readWowBatchJournal({ getItem: (key) => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value) });
    const batches = journal.ok ? [...journal.records].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
    const batch = batches.find((entry) => entry.actual === null) ?? batches[0];
    batchRegion.hidden = !batch;
    if (batch) {
      const link = document.createElement("a");
      link.href = `${ru ? "" : "/en"}/wow/tools/#batch=${batch.id}`;
      const title = document.createElement("strong");
      title.textContent = batch.name;
      const status = document.createElement("span");
      status.textContent = batch.actual === null
        ? (ru ? "План зафиксирован. Добавь результат продаж." : "Forecast recorded. Add the sales outcome.")
        : (ru ? "Продажи записаны. Проверь вводные следующей партии." : "Sales recorded. Review your next batch's assumptions.");
      const action = document.createElement("b");
      action.textContent = batch.actual === null ? (ru ? "Внести продажи →" : "Record sales →") : (ru ? "Следующая партия →" : "Next batch →");
      link.append(title, status, action);
      batchList.appendChild(link);
    }
  }

  function syncLanguage() {
    home!.querySelectorAll<HTMLAnchorElement>(".lang-switch a").forEach((link) => {
      const url = new URL(link.href);
      url.hash = `home-stage-${selected!.dataset.gameId}`;
      link.href = url.toString();
    });
  }

  function select(tab: HTMLAnchorElement, focus = false, persist = false) {
    selected = tab;
    tabs.forEach((candidate) => {
      candidate.setAttribute("aria-selected", String(candidate === tab));
      candidate.tabIndex = candidate === tab ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.gameId !== tab.dataset.gameId; });
    home!.querySelectorAll<HTMLElement>("[data-home-guide-group]").forEach((group) => {
      group.hidden = group.dataset.gameId !== tab.dataset.gameId;
    });
    home!.style.setProperty("--home-accent", tab.dataset.accent ?? "#39e3c6");
    home!.style.setProperty("--home-accent-rgb", tab.dataset.accentRgb ?? "57, 227, 198");
    syncLanguage();
    if (persist) {
      try { localStorage.setItem(preferenceKey, tab.dataset.gameId!); } catch { /* Selection still works without storage. */ }
      const url = new URL(location.href);
      url.hash = `home-stage-${tab.dataset.gameId}`;
      history.replaceState({}, "", url);
    }
    if (focus) tab.focus();
  }

  tablist.setAttribute("role", "tablist");
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", `home-stage-${tab.dataset.gameId}`);
    tab.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault(); select(tab, false, true);
    });
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else if (event.key === " ") { event.preventDefault(); select(tab, true, true); return; }
      else return;
      event.preventDefault(); select(tabs[next]!, true, true);
    });
  });
  panels.forEach((panel) => panel.setAttribute("role", "tabpanel"));
  const fromHash = () => tabs.find((tab) => location.hash === `#home-stage-${tab.dataset.gameId}`);
  let remembered: string | null = null;
  try { remembered = localStorage.getItem(preferenceKey); } catch { /* A first visit needs no storage. */ }
  select(fromHash() ?? tabs.find((tab) => tab.dataset.gameId === remembered) ?? selected);
  renderSaved();
  window.addEventListener("hashchange", () => { const tab = fromHash(); if (tab) select(tab); });
  window.addEventListener("pageshow", () => { renderSaved(); syncLanguage(); });
  window.addEventListener("storage", renderSaved);
}
