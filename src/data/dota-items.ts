import rawSnapshot from "./snapshots/dota-items-7.41e.json";
import { validateDotaItemsSnapshot, type DotaItemRecord, type DotaItemsSnapshot, type DotaItemRole } from "../lib/dota-items";

export type DotaItemsLocale = "ru" | "en";
export type LocalizedText = Record<DotaItemsLocale, string>;

if (!validateDotaItemsSnapshot(rawSnapshot)) throw new Error("The bundled Dota item snapshot is malformed");

export const dotaItemsSnapshot = rawSnapshot as DotaItemsSnapshot;
export const dotaItems = dotaItemsSnapshot.items;
export const dotaItemsByKey = new Map(dotaItems.map((item) => [item.key, item]));

export const getDotaItemsPath = (lang: DotaItemsLocale) => lang === "ru" ? "/dota-2/items/" : "/en/dota-2/items/";
export const getDotaItemPlannerPath = (lang: DotaItemsLocale) => `${getDotaItemsPath(lang)}planner/`;
export const getDotaItemPath = (item: Pick<DotaItemRecord, "key"> | string, lang: DotaItemsLocale) => `${getDotaItemsPath(lang)}${typeof item === "string" ? item : item.key}/`;

export const roleLabel: Record<DotaItemRole, LocalizedText> = {
  core: { ru: "коры", en: "cores" },
  support: { ru: "поддержка", en: "supports" }
};

export interface DotaItemEditorialNote {
  purpose: LocalizedText;
  bestWhen: LocalizedText;
  risk: LocalizedText;
  replayQuestion: LocalizedText;
}

const t = (ru: string, en: string): LocalizedText => ({ ru, en });
const note = (purpose: LocalizedText, bestWhen: LocalizedText, risk: LocalizedText, replayQuestion: LocalizedText): DotaItemEditorialNote => ({ purpose, bestWhen, risk, replayQuestion });

const editorialNotes: Record<string, DotaItemEditorialNote> = {
  blink: note(
    t("Доступ к позиции и первый ход в драке. Предмет не добавляет обычных характеристик, поэтому его ценность измеряется числом созданных стартов.", "Positioning access and the first move in a fight. It adds no ordinary stats, so its value is measured by the openings it creates."),
    t("Команда готова продолжить инициацию в ту же секунду, а на карте есть цель для выигранной позиции.", "The team can follow the initiation immediately and the map offers an objective for the position gained."),
    t("Поздний Blink без дыма, обзора или партнёра часто остаётся дорогим способом первым оказаться под фокусом.", "A late Blink without smoke, vision or follow-up can become an expensive way to arrive under focus first."),
    t("Сколько раз после покупки ты начал полезную драку, а сколько раз только сократил путь по карте?", "How often did the item start a useful fight, and how often did it merely shorten travel?")
  ),
  black_king_bar: note(
    t("Покупка права довести действие до конца под вражеским контролем. Это не предмет на максимальный урон, а страховка ключевого окна.", "A purchase of permission to finish an action through enemy control. It is not a maximum-damage item; it insures the key window."),
    t("Следующая драка решает объект, и без защиты герой не успевает использовать уже купленный урон или контроль.", "The next fight decides an objective and the hero cannot deploy already-owned damage or control without protection."),
    t("Если активируется после получения главного контроля или слишком рано до входа, значительная часть цены не работает.", "If activated after the decisive disable or too early before commitment, much of the purchase does no work."),
    t("Какая конкретная способность заставила нажать BKB и что команда получила до конца действия?", "Which exact spell forced the BKB use, and what did the team secure before it ended?")
  ),
  arcane_boots: note(
    t("Темп маны для нескольких героев. Сильнее всего предмет работает там, где один заряд возвращает команде ещё одну волну заклинаний.", "Team mana tempo. The item is strongest when one activation buys another full wave of spells for several heroes."),
    t("Линия или ранняя группа постоянно упирается в ману, а следующий выход происходит до естественного восстановления.", "The lane or early group is repeatedly mana-bound and the next move arrives before natural recovery."),
    t("Покупка ради личного запаса теряет часть командной ценности и может задержать более срочный сейв.", "Buying it only for personal mana leaves team value unused and can delay a more urgent save."),
    t("Сколько союзников получили ману перед следующим действием, а не уже после него?", "How many allies received mana before the next action rather than after it?")
  ),
  force_staff: note(
    t("Управляемое смещение, которое разрывает позиционную ошибку, спасает союзника или доводит героя до дистанции применения.", "Controlled displacement that breaks a positioning error, saves an ally or completes the distance to a cast."),
    t("Опасность зависит от позиции, замедления или непроходимого участка, а не от длинной цепочки жёсткого контроля.", "The threat depends on position, slows or terrain rather than a long chain of hard disables."),
    t("Без заранее выбранной цели актив легко тратится на удобство и отсутствует в момент настоящего сейва.", "Without a preselected target, the active is easily spent for convenience and missing for the real save."),
    t("Кого и из какой способности должен был вывести каждый заряд?", "Who was each charge supposed to move, and out of which spell?")
  ),
  glimmer_cape: note(
    t("Короткий защитный мост через магический урон и вражеский фокус. Требует чтения цели раньше, чем её здоровье уже исчезло.", "A short defensive bridge through magic damage and enemy focus. It rewards identifying the target before their health has already vanished."),
    t("У соперника ограничен True Sight, а основная угроза даёт окно для своевременного применения.", "Enemy True Sight is limited and the primary threat leaves a readable activation window."),
    t("Против постоянного обнаружения невидимость перестаёт быть выходом, поэтому предмет нельзя оценивать только по удачному первому сейву.", "Against persistent detection, invisibility stops being an exit, so the item cannot be judged by one successful early save."),
    t("Сколько применений изменили исход фокуса после того, как соперник купил обнаружение?", "How many uses changed a focus outcome after the opponent bought detection?")
  ),
  lotus_orb: note(
    t("Снятие части эффектов и цена за направленное заклинание. Покупка работает лучше, когда заранее известны цель и способность для отражения.", "A partial cleanse plus a tax on targeted spells. It works best when both the protected target and reflected spell are known in advance."),
    t("Вражеская инициация строится вокруг заметных направленных заклинаний, а защищаемый герой должен оставаться впереди.", "Enemy initiation relies on readable targeted spells and the protected hero must remain in front."),
    t("Реактивное применение после всей цепочки контроля оставляет актив красивым, но запоздалым.", "Reactive use after the disable chain leaves the active visible but late."),
    t("Какую способность соперник был вынужден придержать или направить в другую цель?", "Which enemy spell had to be held or redirected?")
  ),
  aghanims_shard: note(
    t("Недорогой доступ к уникальному изменению способности. Сравнивать нужно не Shard вообще, а конкретный эффект героя с ближайшим компонентом.", "Low-cost access to a unique ability change. Compare the hero's specific upgrade, not Shard in the abstract, with the next component."),
    t("Эффект сразу меняет ближайшую драку, фарм или контроль карты, а покупка доступна без разрушения обязательного запаса.", "The upgrade immediately changes the next fight, farm loop or map control without consuming the required reserve."),
    t("Автоматическая покупка на пятнадцатой минуте подменяет вопрос о ценности привычным таймером.", "An automatic minute-fifteen purchase replaces a value question with a habit."),
    t("Какое действие стало возможно только благодаря Shard в первые пять минут после покупки?", "What action became possible only because of the Shard in its first five minutes?")
  ),
  ultimate_scepter: note(
    t("Крупная ставка на способность героя. Четыре универсальных компонента дают промежуточные характеристики, но итог оправдан только влиянием улучшения.", "A large bet on a hero ability. Four general components provide intermediate stats, but the completion is justified only by the upgrade's impact."),
    t("Улучшение меняет условие драки или частоту ключевого действия сильнее, чем альтернативный предмет той же цены.", "The upgrade changes a fight condition or key-action frequency more than an alternative item at the same price."),
    t("Хорошие компоненты могут скрыть слабую цель сборки. Удобный путь покупки не доказывает силу завершения.", "Comfortable components can hide a weak completion goal. An easy build-up does not prove the final upgrade is strong."),
    t("Какая драка была выиграна именно улучшенной способностью, а не просто дополнительными характеристиками?", "Which fight was won by the upgraded ability rather than the extra stats alone?")
  ),
  manta: note(
    t("Снятие части эффектов, уклонение от момента урона, давление линий и увеличение урона для подходящих героев.", "A partial dispel, a dodge window, lane pressure and damage scaling for suitable heroes."),
    t("Иллюзии безопасно создают карту или усиливают основную механику героя, а диспел имеет конкретную цель.", "Illusions safely create map pressure or amplify the hero's core mechanic, and the dispel has a named target."),
    t("Если иллюзии быстро очищаются и диспел не нужен, дорогая универсальность превращается в слабый пик силы.", "If illusions are cleared quickly and the dispel is unnecessary, expensive versatility becomes a weak power spike."),
    t("Сколько волн и опасных эффектов реально обработал предмет между двумя командными целями?", "How many waves and dangerous effects did the item actually handle between two team objectives?")
  ),
  aeon_disk: note(
    t("Страховка от одного взрывного входа, когда герой должен пережить первый фокус и успеть сделать работу после срабатывания.", "Insurance against one burst entry when the hero must survive initial focus and act after the trigger."),
    t("Смерть происходит до применения ключевого заклинания, а соперник не может безнаказанно снять защиту заранее.", "Death occurs before the key spell can be cast and the opponent cannot freely strip the protection first."),
    t("Раннее случайное срабатывание отдаёт длительное окно перезарядки перед настоящей целью.", "An accidental early trigger gives away a long cooldown window before the real objective."),
    t("Что ты успел сделать после срабатывания, и можно ли было сохранить эффект лучшей позицией?", "What did you accomplish after the trigger, and could better positioning have preserved it?")
  ),
  spirit_vessel: note(
    t("Зарядная утилита против восстановления с дополнительным давлением на цель. Ценность зависит от того, есть ли заряды к нужной драке.", "Charge-based anti-sustain utility with added pressure on a target. Its value depends on having charges for the fight that matters."),
    t("Команда может собирать заряды и назвать героя, чьё лечение или восстановление нужно ограничить.", "The team can collect charges and name the hero whose healing or recovery must be constrained."),
    t("Пустой Vessel перед объектом означает, что значительная часть предполагаемой контрмеры отсутствует.", "An empty Vessel before an objective means much of the intended countermeasure is unavailable."),
    t("Сколько ключевых драк началось с зарядом, и на кого он был потрачен первым?", "How many key fights began with a charge, and who received it first?")
  ),
  solar_crest: note(
    t("Перенос части личного бюджета в темп выбранного союзника. Предмет требует заранее понимать, кого команда усиливает в следующем окне.", "A transfer of personal budget into the tempo of a chosen ally. It requires knowing who the team will accelerate in the next window."),
    t("Один герой стабильно наносит урон или забирает объект, а владелец может безопасно поддерживать его из второй линии.", "One hero reliably deals damage or takes the objective while the holder can support from the second line."),
    t("Без постоянной цели актив распадается на случайные применения и не оправдывает задержку другого сейва.", "Without a consistent target, the active dissolves into random uses and does not justify delaying another save."),
    t("Какой союзник получил большинство применений и что изменилось в его следующем действии?", "Which ally received most casts, and what changed in their next action?")
  ),
  travel_boots: note(
    t("Покупка пропускной способности карты: быстрее превращать свободные линии в золото и успевать к действию в другой точке.", "A purchase of map throughput: convert free lanes into gold while still reaching the next action elsewhere."),
    t("Команда создаёт пространство на нескольких линиях, а герой умеет покидать дальнюю позицию без потери цели.", "The team creates space across lanes and the hero can leave a distant position without conceding the objective."),
    t("Если карта уже сжата, дорогая мобильность не создаёт безопасную линию сама по себе.", "When the map is already compressed, expensive mobility does not create a safe lane by itself."),
    t("Сколько дополнительных волн удалось забрать без опоздания к командному действию?", "How many extra waves were collected without arriving late to the team action?")
  )
};

export function getDotaItemEditorial(item: DotaItemRecord): DotaItemEditorialNote {
  const curated = editorialNotes[item.key];
  if (curated) return curated;
  const active = item.abilities.length > 0;
  const expensive = item.cost >= 4_000;
  return note(
    active
      ? t("Предмет соединяет характеристики с активной или пассивной механикой. Его полная ценность не помещается в процент характеристик.", "The item combines stats with an active or passive mechanic. Its full value cannot fit inside a stat-efficiency percentage.")
      : t("Покупка в основном меняет числовые характеристики героя. Проверяй не только итоговую сумму, но и полезность каждого промежуточного компонента.", "The purchase primarily changes numeric hero stats. Test not only the final total but the usefulness of every intermediate component."),
    expensive
      ? t("Ближайшее окно достаточно далеко, чтобы завершить сборку, и команда не теряет обязательный предмет или запас на выкуп.", "The next window is far enough away to complete it without costing the team a required item or buyback reserve.")
      : t("Эффект решает конкретную проблему ближайших пяти минут и появляется до связанной с ним цели.", "The effect solves a named problem in the next five minutes and arrives before the related objective."),
    active
      ? t("Покупка без заранее выбранного применения превращает уникальную механику в неиспользованный остаток цены.", "Buying without a preselected use turns unique utility into an unused portion of the price.")
      : t("Чистые характеристики могут выглядеть выгодно, но не исправляют неверную позицию или отсутствующее условие драки.", "Raw stats can look efficient while failing to repair positioning or a missing fight condition."),
    t("Какое действие стало сильнее в первые пять минут после завершения предмета?", "Which action became stronger in the first five minutes after completion?")
  );
}
