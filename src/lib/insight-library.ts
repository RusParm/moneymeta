/** Local filtering only. Search text is not persisted, put in URLs or sent anywhere. */
export function initializeInsightLibrary() {
  const root = document.querySelector<HTMLElement>("[data-insight-library]");
  if (!root) return;
  const search = root.querySelector<HTMLInputElement>("[data-library-search]")!;
  const game = root.querySelector<HTMLSelectElement>("[data-library-game]")!;
  const status = root.querySelector<HTMLElement>("[data-library-status]")!;
  const more = root.querySelector<HTMLButtonElement>("[data-library-more]")!;
  const empty = root.querySelector<HTMLElement>("[data-library-empty]")!;
  const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase().replaceAll("ё", "е");
  const cards = [...root.querySelectorAll<HTMLAnchorElement>("[data-insight-card]")].map((node) => ({
    node, game: node.dataset.insightGame, text: normalize(node.dataset.insightSearch ?? "")
  }));
  const ru = document.documentElement.lang === "ru";
  const pageSize = 12;
  let limit = pageSize;
  const render = () => {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    const matching = cards.filter((card) => (game.value === "all" || game.value === card.game)
      && words.every((word) => card.text.includes(word)));
    const visible = new Set(matching.slice(0, limit).map((card) => card.node));
    cards.forEach((card) => { card.node.hidden = !visible.has(card.node); });
    status.textContent = ru ? `Показано ${visible.size} из ${matching.length} материалов.` : `Showing ${visible.size} of ${matching.length} notes.`;
    more.hidden = limit >= matching.length;
    empty.hidden = matching.length !== 0;
  };
  const resetPage = () => { limit = pageSize; render(); };
  search.addEventListener("input", resetPage);
  game.addEventListener("change", resetPage);
  root.querySelector<HTMLButtonElement>("[data-library-reset]")!.addEventListener("click", () => {
    search.value = ""; game.value = "all"; resetPage(); search.focus();
  });
  more.addEventListener("click", () => {
    const visibleBefore = cards.filter((card) => !card.node.hidden).length;
    limit += pageSize; render();
    cards.filter((card) => !card.node.hidden)[visibleBefore]?.node.focus({ preventScroll: true });
  });
  root.querySelector<HTMLElement>("[data-library-controls]")!.hidden = false;
  status.hidden = false;
  render();
}
