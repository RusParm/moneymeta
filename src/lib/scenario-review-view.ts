import { localizeScenarioPath, type ScenarioLocale } from "../data/scenario-tools";
import type { ScenarioReview } from "./scenario-review";

export function scenarioReviewView(review: ScenarioReview, lang: ScenarioLocale): HTMLElement {
  const ru = lang === "ru";
  const node = (tag: string, text: string) => { const el = document.createElement(tag); el.textContent = text; return el; };
  const box = document.createElement("details");
  box.className = "scenario-review";
  box.open = review.needsReview;
  box.append(node("summary", review.needsReview ? (ru ? "Перед повторным использованием нужна сверка" : "Review before reusing this plan") : (ru ? "Что проверить перед следующей игрой" : "What to check before playing again")));
  for (const reason of review.reasons) box.append(node("p", reason));
  const list = document.createElement("ul");
  for (const check of review.checks) list.append(node("li", check));
  box.append(list);
  if (review.sourcePath) {
    const link = document.createElement("a"); link.href = localizeScenarioPath(review.sourcePath, lang);
    link.textContent = ru ? "Посмотреть данные и источники →" : "View data and sources →"; box.append(link);
  }
  box.append(node("p", ru ? "Открой расчёт, обнови вводные и сохрани копию. Затем сравни её с исходным планом в «Мои расчёты»." : "Open the calculation, update inputs and save a copy. Then compare it with the original in My calculations."));
  return box;
}
