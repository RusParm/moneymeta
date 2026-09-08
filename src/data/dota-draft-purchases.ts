/**
 * Conditional replay prompts, reviewed against the bundled 7.41e item ability
 * descriptions (snapshot fetched 2026-09-02; editorial review 2026-09-08).
 * These describe an option a purchase may open, not proof of item use, a power
 * peak or the cause of a later fight result. No timing or win-rate model applies.
 */
export interface DotaDraftPurchaseContext {
  key: string;
  title: { ru: string; en: string };
  explanation: { ru: string; en: string };
  sourceUrl: string;
}

const itemConstantsSource = "https://api.opendota.com/api/constants/items";

export interface DotaDraftPurchaseThreatContext {
  key: string;
  heroId: number;
  ability: string;
  explanation: { ru: string; en: string };
  sourceUrl: string;
}

// The current immutable ability snapshot establishes Duel as Unit Target.
// This names a threat to review, not a verified item/ability interaction matrix.
// Keep it separate from the narrowly reviewed Soulbind follow-up trait.
export const dotaDraftPurchaseThreatContexts: DotaDraftPurchaseThreatContext[] = [
  {
    key: "sphere",
    heroId: 104,
    ability: "Duel",
    explanation: {
      ru: "Перед попыткой Duel отдельно проверь готовность защиты Linken's Sphere и не была ли она израсходована раньше.",
      en: "Before a Duel attempt, specifically check whether Linken's Sphere protection was ready or had already been consumed."
    },
    sourceUrl: "https://api.github.com/repos/odota/dotaconstants/git/blobs/3f1229d41b1b07beb0a08e125ecb6e3a9118b8cd"
  }
];

export const dotaDraftPurchaseContexts: DotaDraftPurchaseContext[] = [
  {
    key: "blink",
    title: { ru: "Blink Dagger", en: "Blink Dagger" },
    explanation: {
      ru: "Даёт возможность быстро сократить дистанцию и начать драку. Проверь, были ли видны подходящие цели и успевали ли союзники продолжить после прыжка.",
      en: "Can close the distance quickly to start a fight. Check whether suitable targets were visible and allies could follow the jump."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "black_king_bar",
    title: { ru: "Black King Bar", en: "Black King Bar" },
    explanation: {
      ru: "Может дать время для атаки или заклинаний под вражеским давлением. Проверь момент применения и оставшийся у соперника контроль, проходящий сквозь невосприимчивость к эффектам.",
      en: "Can create time to attack or cast under enemy pressure. Check the activation timing and which enemy disables still pierce debuff immunity."
    },
    sourceUrl: "https://www.dota2.com/newfrontiers"
  },
  {
    key: "force_staff",
    title: { ru: "Force Staff", en: "Force Staff" },
    explanation: {
      ru: "Позволяет сместить героя из опасной позиции или помочь ему приблизиться к цели. Проверь, куда был развёрнут союзник и становилась ли новая позиция безопаснее.",
      en: "Can move a hero out of danger or help them reach a target. Check the ally's facing direction and whether the new position was safer."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "lotus_orb",
    title: { ru: "Lotus Orb", en: "Lotus Orb" },
    explanation: {
      ru: "Позволяет снять часть отрицательных эффектов и отражать многие направленные заклинания. Отражение не отменяет исходное заклинание: проверь, кого и от какой угрозы планировали защитить.",
      en: "Can dispel some negative effects and reflect many targeted spells. Reflection does not cancel the original spell: check the intended ally and threat."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "sphere",
    title: { ru: "Linken's Sphere", en: "Linken's Sphere" },
    explanation: {
      ru: "Может заблокировать одно подходящее направленное заклинание. Проверь, сохранялась ли защита до ключевой угрозы или соперник сначала снимал её другой способностью.",
      en: "Can block one eligible targeted spell. Check whether the protection survived until the key threat or the enemy removed it with another ability first."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "orchid",
    title: { ru: "Orchid Malevolence", en: "Orchid Malevolence" },
    explanation: {
      ru: "Безмолвие может дать время убить цель до её ответных заклинаний. Проверь, успевала ли команда нанести урон и какой ответ оставался у цели или её союзников.",
      en: "Silence can create time to kill a target before it casts in response. Check whether the team could deal damage in time and what answers the target or its allies retained."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "bloodthorn",
    title: { ru: "Bloodthorn", en: "Bloodthorn" },
    explanation: {
      ru: "Усиливает атаки по выбранной цели во время безмолвия. Проверь, могли ли союзники атаковать эту цель и сохранялся ли эффект достаточно долго для совместного урона.",
      en: "Strengthens attacks against the selected target during the silence. Check whether allies could reach that target and the effect lasted long enough for focused damage."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "sheepstick",
    title: { ru: "Scythe of Vyse", en: "Scythe of Vyse" },
    explanation: {
      ru: "Hex может лишить выбранную цель возможности атаковать, применять способности и предметы. Проверь, удалось ли добраться до важной цели и продолжить контроль или нанести урон.",
      en: "Hex can stop a selected target from attacking, casting or using items. Check whether the holder could reach an important target and allies followed with damage or another disable."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "desolator",
    title: { ru: "Desolator", en: "Desolator" },
    explanation: {
      ru: "Снижение брони может усилить физический урон команды по выбранной цели. Проверь, удавалось ли удерживать цель под атаками после наложения эффекта.",
      en: "Armor reduction can increase the team's physical damage against a selected target. Check whether that target could be kept within attack range after the effect was applied."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "assault",
    title: { ru: "Assault Cuirass", en: "Assault Cuirass" },
    explanation: {
      ru: "Аура может усилить совместные атаки и давление на строения, одновременно добавляя союзникам броню. Проверь, находился ли владелец достаточно близко к участникам драки или осады.",
      en: "The aura can strengthen coordinated attacks and building pressure while adding allied armor. Check whether the holder was close enough to the heroes or structures involved."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "pipe",
    title: { ru: "Pipe of Insight", en: "Pipe of Insight" },
    explanation: {
      ru: "Барьер может помочь группе пережить магический урон и продолжить действие. Проверь, покрывал ли он нужных союзников до попадания ключевых заклинаний.",
      en: "The barrier can help a group survive magic damage and continue its move. Check whether it covered the relevant allies before the key spells landed."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "crimson_guard",
    title: { ru: "Crimson Guard", en: "Crimson Guard" },
    explanation: {
      ru: "Командная защита может уменьшить потери от серии вражеских атак. Проверь, получали ли союзники такой урон во время действия защиты и могли ли благодаря ей продолжать бой.",
      en: "Group protection can reduce damage from repeated enemy attacks. Check whether allies faced those attacks while it was active and could continue fighting."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "guardian_greaves",
    title: { ru: "Guardian Greaves", en: "Guardian Greaves" },
    explanation: {
      ru: "Восстановление здоровья и маны может позволить группе продолжить драку или осаду. Проверь, получали ли его союзники до гибели или вынужденного отхода.",
      en: "Restoring health and mana can let a group continue a fight or siege. Check whether allies received it before dying or being forced to retreat."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "manta",
    title: { ru: "Manta Style", en: "Manta Style" },
    explanation: {
      ru: "Даёт иллюзии и позволяет снять часть отрицательных эффектов. Проверь, создавали ли иллюзии полезное давление на линии или помогало ли снятие эффекта остаться в драке.",
      en: "Provides illusions and can dispel some negative effects. Check whether the illusions created useful lane pressure or the dispel helped the hero stay in the fight."
    },
    sourceUrl: itemConstantsSource
  },
  {
    key: "heavens_halberd",
    title: { ru: "Heaven's Halberd", en: "Heaven's Halberd" },
    explanation: {
      ru: "Обезоруживание может прервать атаки опасного противника. Проверь, совпало ли применение с моментом, когда именно его атаки угрожали союзникам.",
      en: "Disarm can interrupt a dangerous enemy's attacks. Check whether it was used when those attacks were actually threatening allies."
    },
    sourceUrl: itemConstantsSource
  }
];
