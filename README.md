# Money Meta

Money Meta превращает внутриигровые экономики в понятные решения: что купить следующим, как быстро окупится актив и какой результат можно получить при ограниченном времени.

Текущая версия `v1.1` — decision-платформа и контентный ресурс для трёх игровых экономик: GTA Online, Dota 2 и World of Warcraft Retail на русском и английском языках.

## Что уже работает

- Returner / Next Best Move — рекомендация по бюджету, времени, цели и допустимому friction.
- Model Lab — редактируемые исходные данные, чистая прибыль, vROI и окупаемость.
- Сравнение семи GTA Online-бизнесов по единой методике.
- Portfolio Optimizer — подбор комбинации активов под капитал и активное время.
- Dota 2 Midas ROI/payback — окупаемость с учётом упущенного bounty и оставшегося времени матча.
- Dota 2 Buyback Reserve — оценка ликвидности сейчас и к следующему objective.
- WoW Crafting Margin — прибыль после Auction House cut, sell-through и неудачных листингов.
- WoW Farm Liquidity — effective gold/hour вместо теоретической стоимости добытого инвентаря.
- Статусы происхождения и свежести данных.
- RU/EN-маршруты, SEO metadata, sitemap и robots.txt.
- Автоматические тесты расчётного ядра.
- Единая навигация между экономиками, локальное сохранение и shareable URL для сценариев.
- Локально подключённые variable fonts, адаптивный интерфейс и reduced-motion режим.
- Decision-first главная с тремя интерактивными baseline-кейсами и семью входами от вопросов игрока.
- Money Meta Field Notes: три flagship-разбора в RU/EN, каждый ведёт в пересчитываемую модель.

## Локальный запуск

Нужен Node.js 22.

```bash
npm install
npm run dev
```

После запуска открыть `http://localhost:4321`.

Проверка перед публикацией:

```bash
npm test
npm run build
```

## Основные маршруты

| Страница | Русский | English |
| --- | --- | --- |
| Главная | `/` | `/en/` |
| GTA Online Hub | `/gta-online/` | `/en/gta-online/` |
| Decision Toolkit | `/gta-online/calculators/business-roi/` | `/en/gta-online/calculators/business-roi/` |
| Dota 2 Economy Lab | `/dota-2/` | `/en/dota-2/` |
| WoW Economy Lab | `/wow/` | `/en/wow/` |
| Field Notes | `/insights/` | `/en/insights/` |

## Где менять данные

Все GTA-бизнесы и provenance находятся в `src/data/gta-businesses.ts`, Dota patch context — в `src/data/dota-economy.ts`, WoW market context — в `src/data/wow-economy.ts`. Формулы и decision logic находятся в `src/lib/`. Не дублируй числа внутри страниц: интерфейс должен получать их из единого набора данных.

Перед переводом статуса числа в `verified` нужно повторить проверку в игре и зафиксировать дату, версию и источник.

## Документация проекта

- `docs/PROJECT_CONTEXT.md` — позиционирование и продуктовые принципы.
- `docs/ROADMAP.md` — ближайшие релизы.
- `docs/DECISIONS.md` — архитектурные решения.
- `docs/CURRENT_STATUS.md` — актуальное состояние работ.
