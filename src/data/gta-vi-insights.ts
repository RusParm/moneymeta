import type { Insight } from "./insights";

const officialGameSource = {
  label: { ru: "Официальная страница GTA VI", en: "Official GTA VI page" },
  url: "https://www.rockstargames.com/VI"
};
const leonidaSource = {
  label: { ru: "Only in Leonida: персонажи и мир", en: "Only in Leonida: characters and world" },
  url: "https://www.rockstargames.com/VI/only-in-leonida"
};
const releaseSource = {
  label: { ru: "Официальное объявление даты выхода", en: "Official release-date announcement" },
  url: "https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026"
};
const preorderSource = {
  label: { ru: "Издания, цена и предварительная загрузка", en: "Editions, pricing and preload details" },
  url: "https://www.take2games.com/ir/news/rockstar-games-announces-pre-orders-grand-theft-auto-vi"
};

export const gtaViInsights: Insight[] = [
  {
    slug: "gta-vi-what-is-actually-confirmed-about-the-economy",
    game: "gta6",
    format: "guide",
    updatedAt: "2026-08-20",
    gameVersion: {
      ru: "GTA VI · дорелизное досье · 20.08.2026",
      en: "GTA VI · pre-release dossier · Aug 20, 2026"
    },
    evidenceStatus: "verified",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/gta-6/economy/", en: "/en/gta-6/economy/" },
    sources: [officialGameSource, leonidaSource, releaseSource, preorderSource],
    content: {
      ru: {
        title: "Что на самом деле подтверждено об экономике GTA VI",
        description: "Разделяем официальные факты, сюжетные экономические сигналы и механики, которых Rockstar пока не подтверждала.",
        kicker: "GTA VI · разбор доказательств",
        thesis: "Официальные материалы уже показывают мир бизнеса, ограблений, контрабанды, недвижимости и музыкального продвижения. Они задают экономические темы GTA VI, но пока не подтверждают, что игрок сможет покупать эти активы, управлять ими или получать от них регулярный доход.",
        readTime: "8 мин",
        takeaways: [
          "Подтверждены дата выхода 19 ноября 2026 года, PS5 и Xbox Series X|S, а также одиночный формат игры.",
          "Бизнесы и преступные доходы подтверждены как части мира и историй персонажей, но не как доступные игроку системы.",
          "Стартовые деньги, собственность, повторяемые выплаты, рынок акций и сетевой режим остаются неизвестными."
        ],
        sections: [
          {
            heading: "Твердая основа короче, чем кажется",
            paragraphs: [
              "Rockstar назначила выход GTA VI на 19 ноября 2026 года и указывает PlayStation 5 и Xbox Series X|S. Официальное сообщение Take-Two о предзаказах прямо называет игру одиночной. Это надежные свойства продукта, потому что для каждого есть первичный источник и дата проверки.",
              "Они важны и для будущей аналитики. Платформа и версия могут влиять на измерения, а одиночный формат не позволяет автоматически применять правила постоянно обновляемой GTA Online. Другие платформы и отдельный сетевой режим нельзя добавлять в текущий фактографический слой без нового объявления."
            ]
          },
          {
            heading: "Какие экономические темы уже видны",
            paragraphs: [
              "Официальные описания связывают Буби Айка с недвижимостью, стрип-клубом, студией и лейблом Only Raw Records. Dre'Quan развивает музыкальный бизнес, Real Dimez используют социальные сети для продвижения, а Брайан Хедер ведет контрабанду через лодочную мастерскую и предоставляет Джейсону жилье в обмен на работу.",
              "Отдельная линия касается риска. Джейсон и Люсия показаны на ограблении, а Рауль Баутиста ищет более крупный куш. Поэтому бизнесовые сети, обмен услугами, внимание и ограбления можно уверенно назвать темами мира GTA VI. Формулы дохода, владение и управление остаются за границей подтвержденного."
            ]
          },
          {
            heading: "Почему сюжетный бизнес еще не является активом игрока",
            paragraphs: [
              "Главная редакционная ошибка состоит в подмене уровня утверждения. Фраза «персонаж владеет недвижимостью» описывает героя и мир. Фраза «игрок сможет покупать недвижимость» уже описывает механику. Между ними нет логического перехода без прямого показа или подтверждения Rockstar.",
              "По той же причине нельзя обещать пассивный доход, цепочки поставок, управление сотрудниками или перенос системы предприятий GTA Online. Money Meta хранит сюжетный сигнал, отдельно записывает границу и заранее указывает, каким наблюдением после релиза можно будет закрыть вопрос."
            ]
          },
          {
            heading: "Что говорят издания и чего они не говорят",
            paragraphs: [
              "Take-Two указывает цену стандартного издания $79,99 в США и $99,99 для Ultimate Edition. В описании более дорогого издания перечислены цифровые транспорт, оружие, одежда и другие предметы. Это подтвержденная информация о комплекте покупки, а не прайс-лист внутренней экономики.",
              "Наличие премиальных предметов не раскрывает их игровую стоимость, редкость, влияние на прохождение или возможность получить аналоги обычным способом. Эти вопросы останутся в реестре неизвестного до прямого объяснения или проверки в самой игре."
            ]
          },
          {
            heading: "Как досье будет меняться",
            paragraphs: [
              "Каждое новое официальное событие сравнивается с текущим реестром утверждений. Новая сцена сама по себе не повышает статус механики. Нужна прямая формулировка, наблюдаемый интерфейс с однозначным смыслом или повторяемая проверка после релиза.",
              "Такой подход может выглядеть медленнее обычного пересказа трейлера, но он сохраняет главное: игрок всегда понимает, на каком основании сделан вывод и что может его изменить."
            ]
          }
        ],
        toolLabel: "Открыть реестр сигналов и неизвестного"
      },
      en: {
        title: "What is actually confirmed about the GTA VI economy",
        description: "Separate official facts, narrative economic signals and mechanics Rockstar has not confirmed.",
        kicker: "GTA VI · Evidence review",
        thesis: "Official material already presents a world of enterprise, robbery, smuggling, property and music promotion. Those are economic themes in GTA VI, but they do not yet prove that players can buy, operate or earn recurring income from those assets.",
        readTime: "8 min",
        takeaways: [
          "A November 19, 2026 release, PS5 and Xbox Series X|S, and a single-player product are confirmed.",
          "Businesses and criminal income are confirmed as parts of the world and character stories, not as player-operated systems.",
          "Starting cash, property ownership, repeatable payouts, a stock market and any online mode remain unknown."
        ],
        sections: [
          {
            heading: "The hard foundation is shorter than it looks",
            paragraphs: [
              "Rockstar has scheduled GTA VI for November 19, 2026 and lists PlayStation 5 and Xbox Series X|S. Take-Two's official preorder release explicitly describes a single-player game. These are reliable product properties because each has a primary source and a verification date.",
              "They matter to future analysis. Platform and version may affect measurements, while a single-player format does not justify importing the rules of the continuously updated GTA Online. Other platforms and a separate online mode cannot enter the fact layer without a new announcement."
            ]
          },
          {
            heading: "The economic themes already in view",
            paragraphs: [
              "Official descriptions connect Boobie Ike to real estate, a strip club, a recording studio and Only Raw Records. Dre'Quan is building a music business, Real Dimez use social media for promotion, and Brian Heder moves contraband through a boat yard while providing Jason housing in exchange for work.",
              "Risk is another visible line. Jason and Lucia are shown in a robbery, while Raul Bautista searches for bigger scores. Business networks, exchange, attention and robbery are therefore defensible themes of the world. Income formulas, ownership and operation remain outside the confirmed boundary."
            ]
          },
          {
            heading: "Why a story business is not yet a player asset",
            paragraphs: [
              "The central editorial error is changing the level of a claim. 'A character owns real estate' describes a person and a world. 'The player can buy real estate' describes a mechanic. There is no logical bridge between them without a direct statement or demonstration from Rockstar.",
              "The same rule blocks promises of passive income, supply chains, staff management or a copy of GTA Online enterprise systems. Money Meta stores the narrative signal, records its boundary separately and names the post-launch observation that could close the question."
            ]
          },
          {
            heading: "What the editions say and do not say",
            paragraphs: [
              "Take-Two lists the US Standard Edition at $79.99 and the Ultimate Edition at $99.99. The higher edition includes digital vehicles, weapons, apparel and other items. That is confirmed purchase-package information, not a price list for the internal economy.",
              "Premium items do not reveal their in-game value, rarity, progression effect or whether comparable items can be earned normally. Those questions stay in the unknown ledger until a direct explanation or a test in the released game exists."
            ]
          },
          {
            heading: "How the dossier will change",
            paragraphs: [
              "Every official event is compared against the current claim registry. A new scene does not automatically raise a mechanic's status. It needs a direct statement, an interface observation with unambiguous meaning or a repeatable post-launch test.",
              "That method may look slower than an ordinary trailer recap, but it preserves the essential promise: the reader can always see why a conclusion exists and what could change it."
            ]
          }
        ],
        toolLabel: "Open the signal and unknown registry"
      }
    }
  },
  {
    slug: "gta-vi-lessons-from-gta-online-without-predictions",
    game: "gta6",
    format: "guide",
    updatedAt: "2026-08-20",
    gameVersion: {
      ru: "GTA VI · дорелизное досье · 20.08.2026",
      en: "GTA VI · pre-release dossier · Aug 20, 2026"
    },
    evidenceStatus: "verified",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/gta-6/from-gta-online/", en: "/en/gta-6/from-gta-online/" },
    sources: [officialGameSource, preorderSource],
    content: {
      ru: {
        title: "Какие уроки GTA Online можно перенести в GTA VI без прогнозов",
        description: "Сохраняем полезные способы считать деньги, время и риск, но не выдаем механики одной игры за факты о другой.",
        kicker: "GTA VI · прецедент с границами",
        thesis: "GTA Online полезна не как шаблон будущей экономики, а как школа правильных вопросов. Чистый результат, время игрока, цена провала и открываемые возможности стоит измерять снова. Конкретные выплаты, таймеры и бизнесы переносить нельзя.",
        readTime: "7 мин",
        takeaways: [
          "Переносится аналитическая линза, а не значение цены, выплаты или таймера.",
          "Крупная покупка оценивается не только возвратом денег, но и доступом, временем и снижением риска.",
          "Любое сравнение обязано назвать различие между сетевой GTA Online и подтвержденной одиночной GTA VI."
        ],
        sections: [
          {
            heading: "Начать с единицы решения",
            paragraphs: [
              "В GTA Online громкая выплата часто скрывает закупку сырья, долю помощников, время подготовки и неудобную продажу. Поэтому полезной единицей становится завершенный цикл: все обязательные расходы и все время от решения начать до доступных денег.",
              "Эта логика не зависит от конкретного бизнеса. Если GTA VI предложит ограбление, услугу, торговлю или иной повторяемый источник денег, один и тот же вопрос останется честным: сколько чистых денег и новых возможностей осталось после полного цикла."
            ]
          },
          {
            heading: "Разделить возврат денег и доступ",
            paragraphs: [
              "Некоторые покупки в GTA Online ценны не прямой прибылью, а тем, что открывают задания, транспорт, хранилище или более удобный маршрут. Если считать только денежный поток, их польза исчезает из сравнения.",
              "В GTA VI нужно будет отдельно записывать цену доступа. Транспорт может экономить путь, оружие снижать вероятность провала, а недвижимость открывать новую точку карты. Но пока не подтверждено само существование покупаемых активов, нельзя присваивать им воображаемую доходность."
            ]
          },
          {
            heading: "Измерить внимание игрока",
            paragraphs: [
              "GTA Online показывает разницу между временем мира и ручной работой. Пассивное производство может идти долго, но требовать мало внимания. Другой маршрут может давать деньги быстрее, полностью занимая игрока.",
              "Для одиночной GTA VI ожидания о пассивных таймерах были бы домыслом. Сохраняется только способ измерения: активные минуты, путь, ожидание и повторная подготовка фиксируются отдельно. Тогда игрок видит не абстрактный доход в час, а реальную цену своего внимания."
            ]
          },
          {
            heading: "Включить неудачу в результат",
            paragraphs: [
              "Маршрут с высокой выплатой может быть слабым, если часто заканчивается потерей денег, боеприпасов или времени. Одна удачная запись завышает его надежность. Поэтому стоимость провала должна быть частью ожидаемого результата.",
              "Правила смерти, розыска, страховки и перезапуска в GTA VI пока неизвестны. Их нельзя брать из GTA Online. После выхода достаточно повторить одинаковый сценарий, записать последствия и показать диапазон, а не делать вывод по лучшей попытке."
            ]
          },
          {
            heading: "Где сравнение должно остановиться",
            paragraphs: [
              "GTA Online является сетевой игрой с многолетними обновлениями, недельными событиями и экономикой, которую Rockstar меняет со временем. Подтвержденная сейчас GTA VI является одиночной игрой. Это разные объекты анализа даже при общем названии серии.",
              "Поэтому Money Meta переносит четыре контрольных вопроса: чистый результат, цена доступа, время внимания и риск. Все конкретные механики начинают с нулевого статуса и получают фактический вес только после официального подтверждения или повторяемого наблюдения."
            ]
          }
        ],
        toolLabel: "Открыть матрицу прецедентов"
      },
      en: {
        title: "What GTA Online can teach us about GTA VI without predictions",
        description: "Keep the useful ways of measuring money, time and risk without presenting one game's mechanics as facts about another.",
        kicker: "GTA VI · bounded precedent",
        thesis: "GTA Online is useful not as a template for the future economy, but as a school of good questions. Net outcome, player time, failure cost and unlocked capability should be measured again. Specific payouts, timers and businesses should not carry.",
        readTime: "7 min",
        takeaways: [
          "Carry the analytical lens, not a price, payout or timer value.",
          "A major purchase should be judged by access, time and risk reduction as well as cash payback.",
          "Every comparison must name the difference between networked GTA Online and the confirmed single-player GTA VI product."
        ],
        sections: [
          {
            heading: "Start with the unit of decision",
            paragraphs: [
              "In GTA Online, a headline payout can hide supply purchases, participant cuts, setup time and an inconvenient sale. The useful unit becomes a completed loop: every required cost and every minute from the decision to start until the money is available.",
              "That logic does not depend on a specific business. If GTA VI offers a robbery, service, trade or another repeatable money source, the same honest question applies: how much net cash and new capability remain after the full loop."
            ]
          },
          {
            heading: "Separate cash payback from access",
            paragraphs: [
              "Some GTA Online purchases matter because they unlock missions, vehicles, storage or a more convenient route rather than direct income. A cash-flow-only comparison erases that utility.",
              "GTA VI analysis should record access value separately. A vehicle may save travel, a weapon may lower failure risk, and property may open a map location. Yet until purchasable assets are confirmed, none should receive an invented return figure."
            ]
          },
          {
            heading: "Measure player attention",
            paragraphs: [
              "GTA Online demonstrates the difference between world time and manual work. Passive production may take a long time while demanding little attention. Another route may pay faster while occupying the player completely.",
              "Assuming passive timers in the single-player GTA VI would be speculation. Only the measurement method carries: active minutes, travel, waiting and repeated setup are recorded separately. The reader then sees the true cost of attention rather than an abstract hourly-income claim."
            ]
          },
          {
            heading: "Include failure in the outcome",
            paragraphs: [
              "A high-payout route can be weak when it frequently loses cash, ammunition or time. One successful record overstates its reliability. Failure cost belongs inside the expected outcome.",
              "Death, wanted-level, insurance and restart rules in GTA VI remain unknown. GTA Online cannot supply them. After release, matched attempts and a visible range will reveal more than a conclusion built from the best run."
            ]
          },
          {
            heading: "Where comparison must stop",
            paragraphs: [
              "GTA Online is a networked game with years of updates, weekly events and an economy Rockstar changes over time. The currently confirmed GTA VI product is single-player. They are distinct analytical objects even when they share a series name.",
              "Money Meta therefore carries four control questions: net outcome, access cost, attention time and risk. Every concrete mechanic begins with zero factual weight and gains it only through official confirmation or repeatable observation."
            ]
          }
        ],
        toolLabel: "Open the precedent matrix"
      }
    }
  },
  {
    slug: "gta-vi-how-to-measure-the-first-72-hours",
    game: "gta6",
    format: "guide",
    updatedAt: "2026-08-20",
    gameVersion: {
      ru: "GTA VI · протокол до релиза · 20.08.2026",
      en: "GTA VI · pre-release protocol · Aug 20, 2026"
    },
    evidenceStatus: "verified",
    audiences: ["returner", "casual", "grinder"],
    toolPath: { ru: "/gta-6/launch-watch/", en: "/en/gta-6/launch-watch/" },
    sources: [officialGameSource, releaseSource],
    content: {
      ru: {
        title: "Как честно измерить экономику GTA VI за первые 72 часа",
        description: "Протокол от первой валюты до повторяемых выплат, крупных покупок и рекомендаций с понятной степенью уверенности.",
        kicker: "GTA VI · методика первого запуска",
        thesis: "Первые советы после релиза почти неизбежно смешают сюжетный прогресс, удачу и разные исходные условия. Надежный вывод начинается с журнала версии и контекста, повторных попыток и отдельного учета денег, времени, риска и открываемых возможностей.",
        readTime: "8 мин",
        takeaways: [
          "В первые шесть часов строится словарь системы, а не рейтинг способов заработка.",
          "Повторяемый маршрут требует минимум трех сопоставимых попыток и полного учета расходов.",
          "Крупная покупка получает оценку только после проверки денежного возврата и новых возможностей."
        ],
        sections: [
          {
            heading: "Почему ранняя таблица лидеров почти всегда хрупкая",
            paragraphs: [
              "Два игрока могут получить разные выплаты из-за этапа сюжета, героя, сложности, бонуса первого прохождения или случайного результата. Если эти условия не записаны, сравнение выглядит точным, но отвечает на неизвестный вопрос.",
              "Money Meta начнет с карты системы: какие валюты видны, общий ли баланс у героев, какие расходы обязательны и в какой момент открывается действие. До этой карты любое число остается наблюдением, а не советом."
            ]
          },
          {
            heading: "Зафиксировать условия до первой попытки",
            paragraphs: [
              "Запись получает платформу, версию игры, героя, этап сюжета, начальный баланс, оборудование и доступный транспорт. Затем отдельно отмечаются прямые расходы, путь, активные минуты, ожидание и последствия провала.",
              "Такой журнал нужен не ради бюрократии. Он позволяет повторить опыт и увидеть, какая именно переменная изменила результат. Без него даже честный скриншот выплаты не превращается в экономическое доказательство."
            ]
          },
          {
            heading: "Повторить полный денежный цикл",
            paragraphs: [
              "Один цикл начинается до подготовки и заканчивается, когда чистые деньги доступны для следующего решения. Покупка боеприпасов, доля участника, лечение, потерянный транспорт и обязательный путь входят в стоимость, если без них результат нельзя получить.",
              "Три сопоставимые попытки дают первый диапазон. Если результаты заметно расходятся, публикуется минимум, медиана и максимум, а причина остается открытым вопросом. Лучшая попытка не становится ожидаемым доходом."
            ]
          },
          {
            heading: "Проверить покупку двумя способами",
            paragraphs: [
              "Для имущества, транспорта или оборудования денежный возврат является только первой осью. Вторая ось показывает новые возможности: доступ к заданию, сокращение пути, рост надежности, дополнительное хранилище или изменение риска.",
              "Если покупка не создает доход напрямую, это не делает ее бесполезной. Money Meta покажет цену конкретного преимущества и не будет переводить удовольствие или стиль в выдуманную денежную сумму."
            ]
          },
          {
            heading: "Повысить статус вывода только после проверки",
            paragraphs: [
              "Первая запись имеет статус наблюдения. Повтор при одинаковых условиях делает ее рабочим диапазоном. Правило становится подтвержденным только после устойчивого воспроизведения или прямого объяснения разработчика.",
              "Если патч меняет выплату или поведение, старая запись остается в истории с собственной версией. Так игрок видит не только свежий совет, но и почему он считается свежим."
            ]
          }
        ],
        toolLabel: "Открыть протокол первых 72 часов"
      },
      en: {
        title: "How to measure the GTA VI economy honestly in the first 72 hours",
        description: "A protocol from the first currency observation to repeatable payouts, major purchases and recommendations with visible confidence.",
        kicker: "GTA VI · launch methodology",
        thesis: "Early advice will almost inevitably mix story progression, luck and different starting conditions. A durable conclusion begins with a versioned context log, repeated attempts and separate accounting for money, time, risk and unlocked capability.",
        readTime: "8 min",
        takeaways: [
          "The first six hours build a system glossary, not a ranking of money routes.",
          "A repeatable route needs at least three comparable attempts with every required cost included.",
          "A major purchase is judged only after testing both cash recovery and newly unlocked capability."
        ],
        sections: [
          {
            heading: "Why an early leaderboard is usually fragile",
            paragraphs: [
              "Two players may receive different payouts because of story stage, protagonist, difficulty, a first-completion bonus or random outcomes. If those conditions are missing, the comparison looks precise while answering an unknown question.",
              "Money Meta will begin with a system map: which currencies exist, whether protagonists share a balance, which expenses are mandatory and when an action unlocks. Until that map exists, a number remains an observation rather than advice."
            ]
          },
          {
            heading: "Capture conditions before the first attempt",
            paragraphs: [
              "A record receives platform, game version, protagonist, story stage, starting balance, equipment and available vehicle. Direct costs, travel, active minutes, waiting and failure consequences are then logged separately.",
              "This record is not bureaucracy for its own sake. It makes the experience reproducible and reveals which variable changed the result. Without it, even an honest payout screenshot is not economic evidence."
            ]
          },
          {
            heading: "Repeat the full cash loop",
            paragraphs: [
              "A loop begins before setup and ends when net cash is available for the next decision. Ammunition, participant cuts, recovery, lost vehicles and required travel enter the cost whenever the outcome cannot be obtained without them.",
              "Three comparable attempts produce the first range. If outcomes vary materially, the minimum, median and maximum are published while the cause remains an open question. The best attempt does not become expected income."
            ]
          },
          {
            heading: "Test a purchase on two axes",
            paragraphs: [
              "For property, vehicles or equipment, cash recovery is only the first axis. The second records new capability: mission access, reduced travel, higher reliability, extra storage or changed risk.",
              "A purchase that does not create income directly is not automatically useless. Money Meta will show the cost of a specific capability without converting enjoyment or style into invented cash value."
            ]
          },
          {
            heading: "Raise confidence only after verification",
            paragraphs: [
              "The first record is an observation. A repeat under matched conditions makes it a working range. A rule becomes confirmed only after stable reproduction or a direct developer explanation.",
              "If a patch changes payout or behavior, the old record remains in history with its own version. The player sees not only the latest advice, but why it qualifies as current."
            ]
          }
        ],
        toolLabel: "Open the first 72-hour protocol"
      }
    }
  }
];
