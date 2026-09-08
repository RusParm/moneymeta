import type { DotaDraftTrait } from "./dota-draft-profiles";

type Copy = { ru: string; en: string };
export interface DotaDraftRule {
  id: string;
  traits: DotaDraftTrait[];
  enemyTraits?: DotaDraftTrait[];
  requiresDamageFollowup?: boolean;
  title: Copy;
  explanation: Copy;
  condition: Copy;
  action: Copy;
}

// Editorial conditions, ordered by specificity. This order is not a power score.
// Every multi-trait rule requires distinct heroes. Observed abilities supply evidence.
export const dotaDraftRules: DotaDraftRule[] = [
  {
    id: "armor-focus", traits: ["armorReduction", "physicalDamage"],
    title: { ru: "Общая цель для физического урона", en: "A shared target for physical damage" },
    explanation: { ru: "Снижение брони одного героя может усиливать физический урон союзника по той же цели.", en: "One hero's armor reduction can amplify an ally's physical damage to the same target." },
    condition: { ru: "Нужно добраться до общей цели и продолжить наносить физический урон. Само наличие связки не гарантирует этого.", en: "Both heroes need access to the same target and time to follow through with physical damage." },
    action: { ru: "Проверь, наносила ли команда физический урон цели со сниженной бронёй или урон расходился по разным героям.", en: "Check whether allies dealt physical damage to the armor-reduced target or split damage across different heroes." }
  },
  {
    id: "bound-targets", traits: ["soulbind", "targetedSpell"],
    title: { ru: "Связанные цели под направленными заклинаниями", en: "Bound targets and unit-targeted spells" },
    explanation: { ru: "Soulbind создаёт условия для повторения подходящих направленных заклинаний на связанном противнике.", en: "Soulbind creates an opportunity to repeat eligible unit-targeted spells on a bound enemy." },
    condition: { ru: "Нужны две связанные цели и подходящее готовое заклинание. Исключения зависят от способности.", en: "Two enemies must be bound, and an eligible spell must be available. Ability-specific exceptions apply." },
    action: { ru: "Пересмотри взаимное положение героев до начала боя и момент применения направленных заклинаний.", en: "Review the heroes' spacing before the fight and the timing of unit-targeted spells." }
  },
  {
    id: "global-pressure", traits: ["globalReach"], enemyTraits: ["areaControl"],
    title: { ru: "Разделить внимание соперника на карте", en: "Split the opponent's attention across the map" },
    explanation: { ru: "Дальнее перемещение даёт возможность менять участок давления, пока противник готовит совместное действие.", en: "Long-range movement offers a way to change where pressure is applied while the opponent prepares a grouped move." },
    condition: { ru: "Нужны доступная цель перемещения, информация о противнике и возможность уйти. Сила в бою впятером здесь не измеряется.", en: "A valid destination, enemy information and an exit are needed. This does not measure five-on-five fighting strength." },
    action: { ru: "Сопоставь давление на другой части карты с тем, что противник получил в это время.", en: "Compare pressure elsewhere on the map with what the opponent gained at the same time." }
  },
  {
    id: "immunity-control", traits: ["immunityControl"],
    title: { ru: "Контроль сквозь невосприимчивость к эффектам", en: "Control that pierces debuff immunity" },
    explanation: { ru: "В составе есть конкретная способность контроля, проходящая сквозь невосприимчивость к эффектам. Это исключение относится к ней, а не ко всему набору героя.", en: "The draft has a specific control ability that pierces debuff immunity. This exception applies to that ability, not the hero's entire kit." },
    condition: { ru: "Способность должна быть доступна, а цель должна попасть под её действие.", en: "The ability must be available, and the target must be caught by it." },
    action: { ru: "При разборе боя под BKB проверь готовность названной способности, дистанцию до цели и возможность её применить.", en: "When reviewing a fight under BKB, check the named ability's availability, range to the target and whether it could be used." }
  },
  {
    id: "rescue-response", traits: ["save"], enemyTraits: ["catch", "magicBurst"],
    title: { ru: "Ответ на первую атаку противника", en: "A response to the opponent's first attack" },
    explanation: { ru: "Способность помощи союзнику может изменить исход первого захвата цели.", en: "An allied protection or rescue ability can change the outcome of the first catch." },
    condition: { ru: "Герой помощи должен оставаться в досягаемости и иметь возможность применить способность. Разные виды защиты работают против разных угроз.", en: "The protecting hero needs to remain in range and able to cast. Different protections answer different threats." },
    action: { ru: "Проверь позицию героя помощи и подходила ли его защита против конкретной атаки.", en: "Check the protecting hero's position and whether their protection answered that particular attack." }
  },
  {
    id: "catch-burst", traits: ["catch", "magicBurst"], requiresDamageFollowup: true,
    title: { ru: "Захват цели с быстрым продолжением", en: "A catch with immediate follow-up" },
    explanation: { ru: "Контроль одного героя может подготовить цель для урона заклинаниями союзника.", en: "One hero's control can set up a target for an ally's spell damage." },
    condition: { ru: "Нужны дистанция для продолжения, готовые способности и подходящая цель с учётом её защиты.", en: "Follow-up range, available abilities and a suitable target accounting for its defenses are required." },
    action: { ru: "Проверь задержку между первым контролем и продолжением команды, а также доступность защитных ответов.", en: "Review the delay between the first control and team follow-up, plus the available defensive responses." }
  },
  {
    id: "area-followup", traits: ["areaControl", "magicBurst"], requiresDamageFollowup: true,
    title: { ru: "Урон по целям в области контроля", en: "Damage into an area of control" },
    explanation: { ru: "Оглушение, замедление или ограничение пути могут помочь союзнику попасть заклинаниями по целям в этой области.", en: "A stun, slow or restricted route can help an ally land spells on targets in that area." },
    condition: { ru: "Нужно учесть конкретный вид контроля, позицию союзника и возможность противника уйти или применить защиту.", en: "Account for the specific control, the ally's position and the opponent's options to escape or use protection." },
    action: { ru: "Проверь, совпали ли контроль и урон по времени и целям, особенно в узких проходах и у объектов.", en: "Check whether control and damage aligned in time and targets, especially around narrow approaches and objectives." }
  },
  {
    id: "building-pressure", traits: ["buildingPressure"],
    title: { ru: "Превратить свободное время в давление на строения", en: "Turn available time into building pressure" },
    explanation: { ru: "В составе есть способность, помогающая воздействовать на строения. Это даёт вариант продолжения после освобождения участка карты.", en: "The draft has an ability that helps pressure buildings, creating a follow-up option after an area becomes available." },
    condition: { ru: "Нужны доступ к строению и возможность использовать способность. Потенциал давления не означает безопасную осаду базы.", en: "Access to a building and an opportunity to use the ability are needed. Pressure potential does not imply a safe high-ground siege." },
    action: { ru: "Проверь, удалось ли использовать время без противника для объекта и что пришлось бы отдать за продолжение.", en: "Check whether time without enemy interference was used for an objective and what continuing would have cost." }
  }
];

export const dotaDraftAxes: Array<{ id: string; title: Copy; traits: DotaDraftTrait[]; explanation: Copy }> = [
  { id: "catch", title: { ru: "Захват цели", en: "Catching a target" }, traits: ["catch"], explanation: { ru: "Герои с проверенными инструментами контроля. Дальность и условия начала боя различаются.", en: "Heroes with reviewed control tools. Their reach and initiation conditions differ." } },
  { id: "area", title: { ru: "Контроль области", en: "Area control" }, traits: ["areaControl"], explanation: { ru: "Возможности воздействовать на нескольких героев. Число героев не является оценкой силы драки.", en: "Options to control multiple heroes. Hero count is not a teamfight strength score." } },
  { id: "protect", title: { ru: "Помощь союзнику", en: "Protecting an ally" }, traits: ["save"], explanation: { ru: "Защита требует проверки конкретной способности, её ограничений и угрозы.", en: "Protection must be checked against the specific ability, its restrictions and the threat." } },
  { id: "dispel", title: { ru: "Развеивание эффектов", en: "Dispelling effects" }, traits: ["dispel"], explanation: { ru: "Одни способности снимают отрицательные эффекты с союзников, другие снимают усиления с врагов. Их применение различается.", en: "Some abilities remove allied debuffs; others remove enemy buffs. Their uses differ." } },
  { id: "physical", title: { ru: "Физическое давление", en: "Physical pressure" }, traits: ["physicalDamage", "armorReduction"], explanation: { ru: "Учитываются проверенные способности физического урона и снижения брони. Обычная атака любого героя сюда автоматически не добавляется.", en: "Reviewed physical-damage and armor-reduction abilities are included. Every hero's basic attack is not automatically counted." } },
  { id: "map", title: { ru: "Карта и строения", en: "Map and buildings" }, traits: ["globalReach", "remoteDamage", "buildingPressure"], explanation: { ru: "Перемещение, удалённое применение заклинаний и воздействие на строения создают разные способы давления.", en: "Movement, remote spell use and building abilities create different ways to apply pressure." } },
  { id: "waves", title: { ru: "Работа с волнами", en: "Managing creep waves" }, traits: ["waveClear"], explanation: { ru: "Наличие способности для работы с волной не подтверждает безопасность доступного фарма.", en: "Having a wave-management ability does not establish that the available farm is safe." } }
];
