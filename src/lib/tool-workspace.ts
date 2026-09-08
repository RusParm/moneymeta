/** Enhance existing anchors: all models remain available when JavaScript is off. */
export function initializeToolWorkspace() {
  document.querySelectorAll<HTMLElement>("[data-tool-workspace]").forEach((nav) => {
    if (nav.dataset.ready) return;
    const tabs = [...nav.querySelectorAll<HTMLAnchorElement>("[data-tool-tab]")];
    const panels = tabs.map((tab) => document.getElementById(tab.dataset.toolTab!));
    if (!tabs.length || panels.some((panel) => !panel)) return;
    nav.dataset.ready = "true";
    nav.querySelector("[data-tool-tabs]")!.setAttribute("role", "tablist");
    nav.querySelector("[data-tool-tabs]")!.setAttribute("aria-label", nav.getAttribute("aria-label")!);
    const restoredTabs = new Map<string, number>();
    const syncLanguageLinks = (hash: string) => {
      document.querySelectorAll<HTMLAnchorElement>(".lang-switch a").forEach((link) => {
        const alternate = new URL(link.href);
        alternate.hash = hash;
        link.href = alternate.toString();
      });
    };
    const select = (index: number) => {
      tabs.forEach((tab, i) => {
        const panel = panels[i]!;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", panel.id);
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
        panel.dataset.toolPanel = "true";
        panel.hidden = i !== index;
      });
    };
    const fromHash = () => {
      const restoredIndex = restoredTabs.get(location.hash);
      if (restoredIndex !== undefined) { select(restoredIndex); syncLanguageLinks(location.hash); return; }
      let id: string;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      const index = panels.findIndex((panel) => !!target && panel!.contains(target));
      if (!id) { select(0); syncLanguageLinks(""); }
      else if (index >= 0) { select(index); syncLanguageLinks(location.hash); }
      // Old links may point into a folded example or a source section.
      for (let parent = target?.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
    };
    select(0);
    fromHash();
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        select(index);
        const url = new URL(location.href);
        url.hash = panels[index]!.id;
        history.pushState({}, "", url);
        syncLanguageLinks(url.hash);
      });
      tab.addEventListener("keydown", (event) => {
        if (event.key === " ") { event.preventDefault(); tab.click(); return; }
        const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
          : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length
          : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : -1;
        if (next < 0) return;
        event.preventDefault();
        tabs[next]!.focus();
        tabs[next]!.click();
      });
    });
    document.addEventListener("money-meta:restore-scenario", (event) => {
      const index = panels.findIndex((panel) => event.target instanceof Node && panel!.contains(event.target));
      if (index >= 0) {
        select(index);
        if (location.hash.startsWith("#saved=")) restoredTabs.set(location.hash, index);
        syncLanguageLinks(location.hash);
      }
    });
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("popstate", fromHash);
  });
}
