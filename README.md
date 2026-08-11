# Money Meta

Money Meta превращает внутриигровые экономики в понятные решения: что купить следующим, как быстро окупится актив и какой результат можно получить при ограниченном времени.

Текущая версия `v0.3` — GTA Online-first foundation с русской и английской версиями сайта.

## Что уже работает

- Returner / Next Best Move — рекомендация по бюджету, времени, цели и допустимому friction.
- Model Lab — редактируемые исходные данные, чистая прибыль, vROI и окупаемость.
- Сравнение семи GTA Online-бизнесов по единой методике.
- Portfolio Optimizer — подбор комбинации активов под капитал и активное время.
- Статусы происхождения и свежести данных.
- RU/EN-маршруты, SEO metadata, sitemap и robots.txt.
- Автоматические тесты расчётного ядра.

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

## Где менять данные

Все GTA-бизнесы и provenance находятся в `src/data/gta-businesses.ts`. Формулы и decision logic — в `src/lib/economy.ts`. Не дублируй числа внутри страниц: интерфейс должен получать их из единого набора данных.

Перед переводом статуса числа в `verified` нужно повторить проверку в игре и зафиксировать дату, версию и источник.

## Документация проекта

- `docs/PROJECT_CONTEXT.md` — позиционирование и продуктовые принципы.
- `docs/ROADMAP.md` — ближайшие релизы.
- `docs/DECISIONS.md` — архитектурные решения.
- `docs/CURRENT_STATUS.md` — актуальное состояние работ.
