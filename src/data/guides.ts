import type { Insight } from "./insights";

export const guideInsights = [
  {
    slug: "gta-online-returner-30-minute-audit",
    game: "gta",
    format: "guide",
    featuredInHub: true,
    updatedAt: "2026-08-18",
    gameVersion: {
      ru: "GTA Online · Brand Wars · проверено 18 августа 2026",
      en: "GTA Online · Brand Wars · checked August 18, 2026"
    },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: {
      ru: "/gta-online/calculators/business-roi/#next-move",
      en: "/en/gta-online/calculators/business-roi/#next-move"
    },
    sources: [
      {
        label: { ru: "Rockstar Newswire · Brand Wars", en: "Rockstar Newswire · Brand Wars" },
        url: "https://www.rockstargames.com/newswire/article/9k2kok31k3a8k9/declare-your-allegiance-and-determine-who-owns-los-santos-in-the-brand"
      }
    ],
    content: {
      ru: {
        title: "Возвращение в GTA Online: аудит экономики за 30 минут",
        description: "Пошаговый способ разобрать банк, активы, недельное событие и следующий расход до первой большой покупки после перерыва.",
        kicker: "GTA Online · практический гайд",
        thesis: "Первый вечер после перерыва нужен не для покупки нового бизнеса, а для восстановления картины. За 30 минут можно отделить ликвидные GTA$ от замороженных активов, проверить текущий Brand Wars и сформулировать один следующий ход с резервом.",
        readTime: "9 мин",
        takeaways: [
          "Не оценивай состояние только по балансу: запиши работающие активы, незавершённые подготовки и обязательные расходы.",
          "До 26 августа бесплатный Hotring Sabre и 4X в свободном режиме являются отдельными возможностями, а не новой постоянной экономикой.",
          "Следующая покупка проходит только после проверки бюджета, времени на цикл и суммы, которая останется в резерве."
        ],
        sections: [
          {
            heading: "Минуты 0-7: восстанови фактический баланс",
            paragraphs: [
              "Открой банк и запиши не только доступные GTA$, но и деньги, которые уже обещаны подготовке, сырью или обязательному улучшению. Если часть капитала нужна для завершения начатого ограбления или продажи, она не является свободным бюджетом на новый актив.",
              "Рядом перечисли бизнесы, которые реально можно запустить сегодня. Купленный когда-то объект без улучшений, сырья или удобного маршрута продажи не равен готовому денежному потоку. Такая инвентаризация быстро убирает иллюзию большого портфеля."
            ]
          },
          {
            heading: "Минуты 7-15: отдели событие от постоянного цикла",
            paragraphs: [
              "В текущем Brand Wars бесплатный Declasse Hotring Sabre доступен до 26 августа. Забрать его можно до крупной покупки, но сэкономленная цена не становится регулярной прибылью, если автомобиль изначально не входил в твой план.",
              "4X GTA$/RP в испытаниях и событиях свободного режима стоит проверить на небольшой выборке. Запиши полное время от начала ожидания до выплаты. Отдельно пометь VIP Work с 5X с 21 по 23 августа: это короткое окно для готового доступа, а не причина покупать инфраструктуру вслепую."
            ]
          },
          {
            heading: "Минуты 15-23: найди главное ограничение",
            paragraphs: [
              "Если банк мал, главным ограничением является капитал. Если играть получается два коротких вечера, ограничением становится ручная нагрузка. Если уже есть несколько работающих бизнесов, проблема может быть не в доходе, а в том, что слишком много циклов требуют внимания одновременно.",
              "Выбери только одно ограничение для следующего решения. Новый актив должен либо снять его, либо заметно улучшить результат без ухудшения остальных условий. Покупка, которая добавляет ещё одну обязанность, не является улучшением только потому, что у неё большая сумма продажи."
            ]
          },
          {
            heading: "Минуты 23-30: зафиксируй один следующий ход",
            paragraphs: [
              "Введи свободный бюджет, доступное время и приемлемую рутину в инструмент следующего хода. После рекомендации проверь три вещи: сколько GTA$ останется, сколько ручных минут потребует цикл и какое условие сделает покупку ошибкой.",
              "Закончи аудит короткой записью: действие, причина, резерв и дата повторной проверки. Например, сначала провести два события свободного режима, сохранить резерв, а покупку сравнить после окончания Brand Wars. Такой план устойчивее списка из десяти дел."
            ]
          }
        ],
        toolLabel: "Провести аудит в инструменте следующего хода"
      },
      en: {
        title: "Returning to GTA Online: a 30-minute economy audit",
        description: "A practical sequence for bank, assets, the current event and the first major spending decision after a break.",
        kicker: "GTA Online · Field guide",
        thesis: "The first session back should restore the economic picture before it adds another business. Thirty minutes is enough to separate liquid GTA$ from committed capital, review Brand Wars and define one next move with a reserve.",
        readTime: "9 min",
        takeaways: [
          "Do not read the bank alone: record operational assets, unfinished setups and committed expenses.",
          "The free Hotring Sabre and 4X Freemode window through August 26 are separate opportunities, not a new permanent economy.",
          "A purchase passes only after budget, cycle time and the remaining reserve are visible."
        ],
        sections: [
          {
            heading: "Minutes 0-7: rebuild the real balance",
            paragraphs: [
              "Open the bank and record both available GTA$ and money already committed to setup work, supplies or a required upgrade. Capital needed to finish an existing heist or sale is not a free budget for another asset.",
              "List businesses that can actually operate today. An old property without upgrades, supplies or a practical sale route is not the same as working cash flow. This inventory removes the illusion of a large portfolio quickly."
            ]
          },
          {
            heading: "Minutes 7-15: separate the event from the permanent loop",
            paragraphs: [
              "Brand Wars makes the Declasse Hotring Sabre free through August 26. Claim it before a major purchase when it fits your plan, but do not call the saved sticker price recurring income when you never intended to buy the car.",
              "Sample 4X Freemode Challenges and Events with a small run and measure the full clock from waiting to payout. Mark the 5X VIP Work period from August 21 through 23 separately: it rewards existing access and does not justify blind infrastructure spending."
            ]
          },
          {
            heading: "Minutes 15-23: identify the binding constraint",
            paragraphs: [
              "A small bank makes capital the constraint. Two short weekly sessions make operating time the constraint. A developed account may have enough income but too many loops demanding attention at once.",
              "Choose one constraint for the next decision. A new asset should remove it or improve the result without making the other conditions materially worse. Another obligation is not progress merely because its sale screen shows a larger number."
            ]
          },
          {
            heading: "Minutes 23-30: commit to one next move",
            paragraphs: [
              "Enter free budget, available time and acceptable workload in Next Best Move. After it returns a route, check remaining cash, manual minutes per cycle and the condition that would make the recommendation fail.",
              "End with a one-line record containing action, reason, reserve and review date. Testing two Freemode events now and reconsidering the purchase after Brand Wars is a stronger plan than a list of ten unrelated chores."
            ]
          }
        ],
        toolLabel: "Run the audit in Next Best Move"
      }
    }
  },
  {
    slug: "dota-2-7-41e-first-20-minute-ledger",
    game: "dota",
    format: "guide",
    featuredInHub: true,
    updatedAt: "2026-08-18",
    gameVersion: { ru: "Dota 2 · патч 7.41e", en: "Dota 2 · Patch 7.41e" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/dota-2/#scenario-lab", en: "/en/dota-2/#scenario-lab" },
    sources: [
      {
        label: { ru: "Valve · патч 7.41e", en: "Valve · Patch 7.41e" },
        url: "https://www.dota2.com/patches/7.41e"
      }
    ],
    content: {
      ru: {
        title: "Первые 20 минут Dota 2 как журнал решений: гайд для патча 7.41e",
        description: "Как читать линию, ускоряющую покупку, время готовности предмета, ближайшую цель и запас на выкуп как одну систему.",
        kicker: "Dota 2 · практический гайд 7.41e",
        thesis: "Полезный разбор первых 20 минут не заканчивается общей стоимостью героя. Он показывает, откуда пришло золото, когда оно стало готовой силой, какую цель помогло забрать и какое действие было отложено ради этой покупки.",
        readTime: "10 мин",
        takeaways: [
          "Записывай четыре момента: начало накопления, покупку, доставку и первую цель после готовности предмета.",
          "В 7.41e Hand of Midas получил 40 к скорости атаки, но это не сдвигает денежную окупаемость автоматически.",
          "К 20-й минуте оцени не только предметы, но и доступ к карте, готовность команды и сохранённое золото на следующий риск."
        ],
        sections: [
          {
            heading: "0-5 минут: источник золота важнее итоговой цифры",
            paragraphs: [
              "Отметь добивания, вынужденные перемещения и потери времени на линии. Два героя могут подойти к пятой минуте с похожим золотом, но один сохранил расходники и контроль линии, а другой получил разовое убийство ценой пропущенной волны.",
              "Не пытайся превратить каждую секунду в универсальную цену. Нужна причинная запись: какой ресурс был устойчивым, какой случайным и что команда отдала за него на другой части карты."
            ]
          },
          {
            heading: "5-12 минут: покупка должна иметь адрес",
            paragraphs: [
              "Перед ускоряющим предметом назови доступный ресурс: безопасные линии, лагеря и время до обязательной драки. Без пространства предмет для роста конкурирует за золото с силой, которая нужна команде прямо сейчас.",
              "Патч 7.41e увеличил прибавку Hand of Midas к скорости атаки с 35 до 40. Это добавляет боевую пользу на подходящих героях, но не меняет автоматически золото от применения и не делает предмет правильным при любом состоянии карты."
            ]
          },
          {
            heading: "12-16 минут: время предмета заканчивается реализацией",
            paragraphs: [
              "Запиши не только минуту покупки, но и доставку, телепорт и первую позицию, где предмет реально использован. Золото в инвентаре курьера или предмет у героя на противоположной стороне карты ещё не создают давление на ближайшую цель.",
              "После готовности назови ожидаемую реализацию: башня, Рошан, Терзатель, контроль опасной линии или безопасный отрезок фарма. Если цель не названа, оценка времени предмета остаётся незавершённой."
            ]
          },
          {
            heading: "16-20 минут: сведи рост, цель и риск в один выбор",
            paragraphs: [
              "К двадцатой минуте сравни следующий компонент, запас золота и ближайшую командную цель. Компонент полезен только если его сила успевает появиться и реализоваться. Непотраченное золото полезно только если сохраняет реальную возможность выкупа или другой срочной реакции.",
              "В повторе измени одно решение, а не весь матч. Проверь покупку на две минуты раньше, отказ от одного жадного компонента или сохранённый запас перед Рошаном. Хорошая проверка показывает условие, при котором ответ меняется."
            ]
          }
        ],
        toolLabel: "Проверить время предмета и запас золота"
      },
      en: {
        title: "The first 20 minutes as a decision ledger: a Patch 7.41e guide",
        description: "Read lane income, acceleration, usable item timing, the next objective and liquidity as one match system.",
        kicker: "Dota 2 · Patch 7.41e field guide",
        thesis: "A useful first-20 review does not end at hero net worth. It records where gold came from, when it became usable power, which objective converted that power and which action was delayed to fund the purchase.",
        readTime: "10 min",
        takeaways: [
          "Record four moments: saving begins, purchase, delivery and the first objective after the item becomes usable.",
          "Patch 7.41e gives Hand of Midas 40 attack speed, but that does not move cash payback automatically.",
          "At minute 20, read items together with map access, team readiness and liquid gold for the next risk."
        ],
        sections: [
          {
            heading: "Minutes 0-5: the source matters more than the total",
            paragraphs: [
              "Mark last hits, forced movement and lost lane time. Two heroes can reach minute five with similar gold while one preserved consumables and lane control and the other traded a full wave for a one-off kill.",
              "Do not force a universal price onto every second. Build a causal record: which income was repeatable, which was accidental and what the team gave up elsewhere on the map."
            ]
          },
          {
            heading: "Minutes 5-12: an acceleration purchase needs an address",
            paragraphs: [
              "Name the resource before buying acceleration: safe waves, camps and time before a required fight. Without space, a growth item competes directly with power the team needs now.",
              "Patch 7.41e raised Hand of Midas attack speed from 35 to 40. That adds combat utility on relevant heroes, but it does not automatically change Transmute cash and does not make the item correct in every map state."
            ]
          },
          {
            heading: "Minutes 12-16: timing ends at conversion",
            paragraphs: [
              "Record purchase, delivery, teleport and the first position where the item is actually used. Gold on the courier or an item carried on the wrong side of the map has not yet pressured the next objective.",
              "Name the expected conversion after completion: tower, Roshan, Tormentor, control of a dangerous lane or a protected farming interval. Without a destination, the timing review is incomplete."
            ]
          },
          {
            heading: "Minutes 16-20: combine growth, objective and risk",
            paragraphs: [
              "At minute twenty, compare the next component, liquid gold and the nearest team objective. A component matters when its power arrives and converts in time. Held gold matters when it preserves a real buyback or another urgent response.",
              "Change one decision in the replay, not the whole match. Test an item two minutes earlier, one skipped greed component or preserved liquidity before Roshan. A good counterfactual reveals the condition that flips the answer."
            ]
          }
        ],
        toolLabel: "Test item timing and liquidity"
      }
    }
  },
  {
    slug: "wow-midnight-season-2-opening-week-market-plan",
    game: "wow",
    format: "guide",
    featuredInHub: true,
    updatedAt: "2026-08-18",
    gameVersion: { ru: "WoW Retail · Midnight: Curse of Ula’tek", en: "WoW Retail · Midnight: Curse of Ula’tek" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/wow/#crafting-margin", en: "/en/wow/#crafting-margin" },
    sources: [
      {
        label: { ru: "Blizzard · Curse of Ula’tek", en: "Blizzard · Curse of Ula’tek" },
        url: "https://worldofwarcraft.blizzard.com/news/24294370/curse-of-ulatek-now-live-journey-to-the-coiled-isle"
      },
      {
        label: { ru: "Blizzard · исправления от 17 августа", en: "Blizzard · August 17 hotfixes" },
        url: "https://worldofwarcraft.blizzard.com/news/24296142/hotfixes-august-17-2026"
      }
    ],
    content: {
      ru: {
        title: "Рыночный план для Curse of Ula’tek: от пробной партии до оборота",
        description: "Как вернуться на рынок WoW, проверить спрос малым объёмом и не заморозить всё золото в красивой расчётной марже.",
        kicker: "WoW Retail · практический рыночный гайд",
        thesis: "В начале нового контентного окна преимущество получает не тот, кто первым создаёт большую партию, а тот, кто быстрее превращает проверку спроса в повторяемый денежный цикл. Цена, маржа и объём имеют смысл только вместе со скоростью продажи.",
        readTime: "10 мин",
        takeaways: [
          "Начни с пробной партии, размер которой не мешает следующему циклу материалов.",
          "Считай прибыль после комиссии, неудачных размещений и фактической доли продаж.",
          "Сброс знаний профессии и снижение стоимости части декора требуют нового расчёта, но не гарантируют спрос."
        ],
        sections: [
          {
            heading: "Сначала зафиксируй ликвидное золото",
            paragraphs: [
              "Отдели золото на персонаже от реагентов, готовых предметов и выставленных лотов. Рыночная стоимость запасов не равна деньгам, которыми можно оплатить следующий цикл прямо сейчас.",
              "Заранее выбери неприкосновенный остаток. Он нужен для материалов, комиссии, повторного размещения и ошибки в оценке спроса. Если одна партия съедает этот остаток, она слишком велика для этапа проверки."
            ]
          },
          {
            heading: "Пробная партия должна отвечать на вопрос",
            paragraphs: [
              "Выбери один товар или узкую группу и сформулируй, что проверяешь: цену безубыточности, скорость продажи или чувствительность к объёму. Маленькая партия полезна не из-за скромности, а потому что даёт чистый сигнал без большого риска.",
              "Запиши стоимость материалов, выпуск, цену размещения и комиссию до создания предметов. После цикла добавь долю продаж и потерю от непроданного остатка. Так расчётная маржа превращается в наблюдаемую."
            ]
          },
          {
            heading: "Текущий патч меняет исходные данные, а не закон спроса",
            paragraphs: [
              "Curse of Ula’tek включает сброс знаний профессии, а Blizzard также снизила стоимость создания большей части декора для жилищ. Старые маршруты специализации и прежняя себестоимость требуют повторной проверки.",
              "Более дешёвое создание может привлечь больше продавцов и сжать цену. Сохранение фильтров аукциона уменьшает ручную нагрузку, но не создаёт прибыль само по себе. Последние исправления от 17 августа не дают универсальной формулы для рынка твоего региона."
            ]
          },
          {
            heading: "Масштабируй только подтверждённый оборот",
            paragraphs: [
              "Увеличивай следующую партию, когда первая продалась в выбранный срок без чрезмерного снижения цены. Если запас растёт быстрее фактических продаж, останови производство даже при положительной марже на единицу.",
              "Для повторяемого плана зафиксируй максимальную сумму в запасах, целевой срок продажи и условие остановки. Тогда профессия становится управляемым денежным циклом, а не складом товаров с неизвестной датой выхода."
            ]
          }
        ],
        toolLabel: "Проверить маржу пробной партии"
      },
      en: {
        title: "A Curse of Ula’tek market plan: from discovery batch to turnover",
        description: "Return to the WoW market, validate demand with limited volume and avoid freezing all gold in attractive modeled margin.",
        kicker: "WoW Retail · Market field guide",
        thesis: "At the start of a new content window, the edge belongs to the operator who converts demand testing into a repeatable cash cycle. Price, margin and batch size are useful only when sell-through is visible beside them.",
        readTime: "10 min",
        takeaways: [
          "Begin with a discovery batch that leaves enough liquid gold for the next material cycle.",
          "Measure profit after the Auction House cut, failed listings and realized sell-through.",
          "Profession Knowledge reset and lower decor costs require a new model, but they do not guarantee demand."
        ],
        sections: [
          {
            heading: "Start with liquid gold",
            paragraphs: [
              "Separate character gold from reagents, finished items and active listings. The market value of inventory is not cash available to fund the next cycle now.",
              "Set a protected balance for materials, fees, relisting and demand error. A discovery batch that consumes this balance is too large for the validation stage."
            ]
          },
          {
            heading: "A discovery batch should answer one question",
            paragraphs: [
              "Choose one item or narrow category and state what the batch tests: break-even, sale speed or sensitivity to volume. Small volume is useful because it creates a cleaner signal with limited downside.",
              "Record materials, output, list price and the Auction House cut before crafting. Add realized sell-through and the unsold balance after the cycle. Expected margin then becomes observable performance."
            ]
          },
          {
            heading: "The current patch changes inputs, not the law of demand",
            paragraphs: [
              "Curse of Ula’tek includes a Profession Knowledge reset, while Blizzard also reduced the cost of most crafted Housing decor. Old specialization routes and cost assumptions need a fresh check.",
              "Cheaper output can attract more sellers and compress price. Persistent Auction House filters lower operating work without creating profit by themselves. The August 17 hotfixes do not establish one universal market formula for your region."
            ]
          },
          {
            heading: "Scale confirmed turnover only",
            paragraphs: [
              "Increase the next batch when the first sells inside the chosen interval without an excessive markdown. Stop producing when stock grows faster than realized sales even if modeled unit margin remains positive.",
              "Set maximum inventory value, target sale time and a stop condition for a repeatable plan. The profession then becomes a managed cash cycle instead of a warehouse with no known exit date."
            ]
          }
        ],
        toolLabel: "Test discovery-batch margin"
      }
    }
  },
  {
    slug: "total-war-warhammer-3-8-1-frontier-reserve-playbook",
    game: "totalwar",
    format: "guide",
    featuredInHub: true,
    updatedAt: "2026-08-18",
    gameVersion: { ru: "Total War: Warhammer III · патч 8.1", en: "Total War: Warhammer III · Patch 8.1" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/total-war/#war-reserve", en: "/en/total-war/#war-reserve" },
    sources: [
      {
        label: { ru: "Creative Assembly · патч 8.1", en: "Creative Assembly · Patch 8.1" },
        url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/101"
      },
      {
        label: { ru: "Creative Assembly · выпуск 24 сентября", en: "Creative Assembly · September 24 release" },
        url: "https://community.creative-assembly.com/total-war/total-war-warhammer/blogs/102"
      }
    ],
    content: {
      ru: {
        title: "Пограничный резерв в патче 8.1: гайд для длинной кампании Total War",
        description: "Как связать доход провинции, срок окупаемости здания, стоимость новой армии и риск второго фронта в одном плане.",
        kicker: "Total War: Warhammer III · гайд по кампании",
        thesis: "В патче 8.1 поздний ИИ меньше склонен только обороняться и немного чаще направляет задачи против сил противника. Поэтому спокойный доход пограничной провинции нужно проверять сценарием внезапного фронта, а не считать равным доходу защищённого ядра.",
        readTime: "10 мин",
        takeaways: [
          "Раздели защищённое ядро и пограничный доход: одинаковая сумма имеет разную надёжность.",
          "Новая армия проходит проверку только вместе с наймом, содержанием и неприкосновенным резервом.",
          "Обновление, связанное с Lords of the End Times, заявлено на 24 сентября, но до релиза не входит в модель патча 8.1."
        ],
        sections: [
          {
            heading: "Собери снимок до следующей войны",
            paragraphs: [
              "Запиши текущую казну, доход за ход, постоянное содержание армий и сумму, которую нельзя тратить. Затем раздели провинции на защищённое ядро и границу, где поток может исчезнуть из-за осады, разграбления или необходимости срочно нанимать войска.",
              "Не пытайся найти универсальный процент риска для всех фракций. Введи отдельный сценарий для своей карты: сколько ходов может не работать пограничный доход и сколько стоит реакция."
            ]
          },
          {
            heading: "Проверь здание на военном горизонте",
            paragraphs: [
              "Для следующего здания используй фактическую стоимость и только прирост дохода от нового уровня. Вычти время строительства и сравни окупаемость с ожидаемым окном до большой войны.",
              "Патч 8.1 добавил особые постройки и технологии, поэтому старый общий порядок строительства нельзя переносить без проверки. Если поток находится на границе, уменьши его ожидаемую ценность в сценарии, а не выдавай поправку за скрытую игровую формулу."
            ]
          },
          {
            heading: "Оцени следующую армию как новый расход",
            paragraphs: [
              "Не дели общее содержание на число армий. Следующий выбор зависит от стоимости найма, дополнительного расхода за ход и угрозы, которую новый стек действительно снимает.",
              "В модели военного резерва проверь обычный сценарий и тяжёлый вариант со вторым фронтом. Если казна остаётся выше неприкосновенной суммы в обоих случаях, решение устойчиво. Если запас исчезает от одной задержки, расширение слишком хрупкое."
            ]
          },
          {
            heading: "Поставь границу между текущим патчем и будущим",
            paragraphs: [
              "Creative Assembly объявила Lords of the End Times и связанное крупное обновление на 24 сентября 2026 года. Это важная дата для повторной проверки кампании, но не источник новых значений для текущей модели.",
              "Сохрани снимок казны, доходов и фронтов до релиза. После обновления сначала проверь реальные изменения в игре и официальные примечания, затем повтори расчёты. Так будущая новость не превращается в выдуманную текущую мету."
            ]
          }
        ],
        toolLabel: "Проверить военный резерв кампании"
      },
      en: {
        title: "Frontier reserve in Patch 8.1: a long-campaign Total War guide",
        description: "Connect province income, building payback, the next army and second-front risk in one campaign plan.",
        kicker: "Total War: Warhammer III · Campaign guide",
        thesis: "Patch 8.1 reduces late-game defensive task priority and slightly raises targeting of enemy forces. Peaceful frontier income therefore needs a surprise-front stress case instead of being valued like protected core flow.",
        readTime: "10 min",
        takeaways: [
          "Separate protected core and frontier income because equal cash can have different reliability.",
          "The next army passes only after recruitment, upkeep and a protected reserve are modeled together.",
          "The Lords of the End Times update is announced for September 24 but remains outside the live Patch 8.1 model."
        ],
        sections: [
          {
            heading: "Capture the pre-war snapshot",
            paragraphs: [
              "Record treasury, per-turn income, recurring army upkeep and the amount that cannot be spent. Split provinces into a protected core and frontier flow that can disappear through siege, sack or urgent recruitment.",
              "Do not invent one risk percentage for every faction. Create a scenario from the actual map: how many turns frontier flow can fail and what the response costs."
            ]
          },
          {
            heading: "Test the building on a war horizon",
            paragraphs: [
              "Use actual cost and only the marginal income from the next level. Account for construction delay and compare payback with the expected interval before a major war.",
              "Patch 8.1 added landmarks and technologies, so an old universal build order needs a fresh check. Discount frontier flow inside the scenario without presenting that judgement as a hidden game formula."
            ]
          },
          {
            heading: "Price the next army as marginal burn",
            paragraphs: [
              "Do not divide total upkeep by army count. The next decision depends on recruitment cost, incremental per-turn burn and the threat the new stack actually removes.",
              "Run the reserve model once for the expected campaign and once for a second-front stress case. A treasury above the protected amount in both is resilient. A buffer erased by one delay is fragile expansion."
            ]
          },
          {
            heading: "Draw a line between live and announced",
            paragraphs: [
              "Creative Assembly announced Lords of the End Times and its major update for September 24, 2026. That is a recheck date, not a source of new values for the live model.",
              "Save treasury, flow and frontier snapshots before release. Review official notes and observed game changes first, then rerun the models. A future announcement should never masquerade as current meta."
            ]
          }
        ],
        toolLabel: "Stress-test the campaign reserve"
      }
    }
  },
  {
    slug: "ck3-1-19-succession-ledger-playbook",
    game: "ck3",
    format: "guide",
    featuredInHub: true,
    updatedAt: "2026-08-18",
    gameVersion: { ru: "Crusader Kings III · версия 1.19.0.6", en: "Crusader Kings III · Update 1.19.0.6" },
    evidenceStatus: "estimated",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/crusader-kings-3/#succession-buffer", en: "/en/crusader-kings-3/#succession-buffer" },
    sources: [
      {
        label: { ru: "Paradox · версия 1.19.0.6", en: "Paradox · Update 1.19.0.6" },
        url: "https://store.steampowered.com/news/app/1158310/view/677373278422041207"
      },
      {
        label: { ru: "Paradox · глава V", en: "Paradox · Chapter V" },
        url: "https://www.paradoxinteractive.com/games/crusader-kings-iii/add-ons/crusader-kings-iii-chapter-v"
      }
    ],
    content: {
      ru: {
        title: "Казна до и после наследования: гайд по Crusader Kings III 1.19",
        description: "Как использовать книгу учёта, сравнить здание с запасом золота и передать наследнику свободу действий, а не только титул.",
        kicker: "Crusader Kings III · гайд по династии",
        thesis: "Хорошее правление заканчивается не максимальной тратой старого правителя, а устойчивым стартом следующего. Версия 1.19 делает книгу учёта удобной точкой входа: из неё можно собрать доход, владения и военные потери, а затем проверить здание, войну и резерв на одном горизонте.",
        readTime: "10 мин",
        takeaways: [
          "Собери снимок домена и военных потерь до нового строительства или войны.",
          "Считай только прирост дохода здания и риск потерять владение при разделе наследства.",
          "Silk & Silver заявлен на IV квартал 2026 года, но его торговые формулы не входят в текущие расчёты."
        ],
        sections: [
          {
            heading: "Начни с книги учёта, а не с кнопки строительства",
            paragraphs: [
              "Зафиксируй ежемесячный доход, обычные расходы, состав основного домена и недавние военные потери. Версия 1.19 расширила сведения и действия в книге учёта, поэтому она подходит для быстрого снимка державы после перерыва.",
              "Отдельно отметь владения, которые с высокой вероятностью останутся у основной линии, и те, что могут уйти при наследовании. Одинаковое здание имеет разную ценность при разном горизонте владения."
            ]
          },
          {
            heading: "Сравни здание с сохранённой свободой действий",
            paragraphs: [
              "В расчёт здания вводи не весь доход владения, а только прирост от следующего уровня. Учти время строительства, срок владения и сценарную вероятность потери потока. Военные и другие неденежные модификаторы оставь отдельным экспертным выводом.",
              "Золото в казне не приносит доход само по себе, но сохраняет наёмников, подарки и реакцию на фракции. Перед дорогой активностью сравни её пользу не с нулём, а с возможностями, которые исчезнут после траты."
            ]
          },
          {
            heading: "Проведи тяжёлый сценарий наследования",
            paragraphs: [
              "Задай ожидаемый срок до передачи власти, текущий чистый баланс, временные расходы перехода и разовую цену кризиса. Затем посмотри, сколько золота останется наследнику сверх обязательного резерва.",
              "Повтори расчёт для слабого наследника, активной фракции или внешней войны. Если запас работает только при идеальном переходе, последнее здание или активность стоит отложить."
            ]
          },
          {
            heading: "Не смешивай текущую экономику с будущей торговлей",
            paragraphs: [
              "Paradox подтверждает для Silk & Silver семьи торговцев, экзотические товары, республики и монополии на маршрутах. Дополнение ожидается в IV квартале 2026 года, но точных живых доходов и проверенных формул пока нет.",
              "До релиза используй текущие модели домена, войны и наследования. После выхода сначала проверь механику в игре и официальные материалы, затем добавляй торговлю отдельным слоем. Такой порядок сохраняет доверие к каждому выводу."
            ]
          }
        ],
        toolLabel: "Рассчитать резерв наследника"
      },
      en: {
        title: "Treasury before and after succession: a Crusader Kings III 1.19 guide",
        description: "Use the Ledger, compare a building with liquidity and transfer optionality to the heir instead of only a title.",
        kicker: "Crusader Kings III · Dynasty guide",
        thesis: "A strong reign does not end with maximum spending by the old ruler. It funds a resilient opening for the next one. Update 1.19 makes the Ledger a useful starting point for income, holdings and war losses before building, war and succession share one horizon.",
        readTime: "10 min",
        takeaways: [
          "Capture domain and war-loss state before starting another building or war.",
          "Model only marginal building income and the risk of losing the holding under partition.",
          "Silk & Silver is announced for Q4 2026, but unreleased trade formulas stay outside current calculations."
        ],
        sections: [
          {
            heading: "Begin in the Ledger, not on the build button",
            paragraphs: [
              "Record monthly income, ordinary expenses, the core domain and recent war losses. Update 1.19 expanded Ledger values and actions, making it a practical returner snapshot.",
              "Separate holdings likely to remain with the primary line from those exposed to succession. The same building has a different value across different ownership horizons."
            ]
          },
          {
            heading: "Compare the building with retained optionality",
            paragraphs: [
              "Enter only the marginal income from the next building level. Account for construction time, ownership horizon and a scenario probability of losing the flow. Keep military and other non-cash modifiers in a separate judgement layer.",
              "Treasury cash produces no direct flow, but preserves mercenaries, gifts and a response to factions. Compare an expensive activity with the options that disappear after spending, not with zero."
            ]
          },
          {
            heading: "Run a hard succession case",
            paragraphs: [
              "Set expected time to succession, current net flow, temporary transition expenses and one-off crisis cost. Then read how much gold remains above the heir's required reserve.",
              "Repeat for a weak heir, active faction or external war. When the reserve works only under a perfect transfer, delay the final building or activity."
            ]
          },
          {
            heading: "Keep live economics separate from future trade",
            paragraphs: [
              "Paradox confirms merchant families, exotic goods, republic competition and route monopolies for Silk & Silver. The expansion is expected in Q4 2026, but verified live income and formulas are not available yet.",
              "Use current domain, war and succession models until release. Verify mechanics in game and against official material first, then add trade as a separate layer. That order keeps every conclusion auditable."
            ]
          }
        ],
        toolLabel: "Calculate the succession buffer"
      }
    }
  }
] satisfies Insight[];
