/**
 * Reviewed capabilities, not power ratings or an exhaustive ability catalogue.
 * Classifying a described mechanic as a draft trait is an editorial inference.
 * Missing traits mean "not recorded here", never "the hero cannot do this".
 * Conditional upgrades, stolen spells and facet-dependent alternatives are omitted.
 */
export type DotaDraftTrait =
  | "catch"
  | "areaControl"
  | "save"
  | "buildingPressure"
  | "globalReach"
  | "remoteDamage"
  | "armorReduction"
  | "physicalDamage"
  | "magicBurst"
  | "waveClear"
  | "dispel"
  | "immunityControl"
  | "soulbind"
  | "targetedSpell";

export interface DotaDraftEvidence {
  trait: DotaDraftTrait;
  ability: string;
  text: { ru: string; en: string };
  /** Do not recommend allied damage during this control effect. */
  blocksAllyDamage?: boolean;
}

export interface DotaDraftHeroProfile {
  heroId: number;
  sourceUrl: string;
  evidence: DotaDraftEvidence[];
}

// This immutable Git blob was read through the OpenDota repository on the check
// date. Keep the blob URL: the hash is a blob hash, not a commit/ref for /blob/.
const abilitySourceUrl = "https://api.github.com/repos/odota/dotaconstants/git/blobs/3f1229d41b1b07beb0a08e125ecb6e3a9118b8cd";

export const dotaDraftProfileSnapshot = {
  patchFamily: "7.41",
  patchLabel: "7.41e",
  patchId: 60,
  checkedAt: "2026-09-08",
  // Valve dates the release July 30 without a precise hour. Start at the next
  // full UTC day so matches from that ambiguous release day are not overclaimed.
  supportedSince: "2026-07-31T00:00:00.000Z",
  methodVersion: "draft-context-v1",
  sourceUrls: [abilitySourceUrl, "https://www.dota2.com/patches/7.41e", "https://www.dota2.com/newsentry/678505520073540065"]
} as const;

const evidence = (trait: DotaDraftTrait, ability: string, ru: string, en: string): DotaDraftEvidence => ({
  trait, ability, text: { ru, en }
});

const profile = (heroId: number, ...rows: DotaDraftEvidence[]): DotaDraftHeroProfile => ({
  heroId, sourceUrl: abilitySourceUrl, evidence: rows
});

/**
 * physicalDamage requires an ability that deals or supports physical damage;
 * ordinary attacks alone do not qualify. save is protection of an ally.
 * immunityControl applies only to the named control ability, not the whole kit.
 * targetedSpell is deliberately limited to reviewed Soulbind follow-up examples.
 * dispel evidence always identifies whether it removes allied debuffs or enemy buffs.
 */
export const dotaDraftHeroProfiles: DotaDraftHeroProfile[] = [
  profile(1,
    evidence("physicalDamage", "Mana Break", "Атаки сжигают ману и наносят дополнительный физический урон от сожжённой маны.", "Attacks burn mana and deal bonus physical damage based on the mana burned."),
    evidence("magicBurst", "Mana Void", "Наносит магический урон от недостающей маны основной цели ей самой и врагам рядом.", "Deals magical damage to the primary target and nearby enemies based on that target's missing mana.")
  ),
  profile(5,
    evidence("catch", "Frostbite", "Не даёт выбранному врагу двигаться и атаковать; применение заклинаний этим не запрещается.", "Prevents the selected enemy from moving and attacking; it does not itself prevent casting spells."),
    evidence("areaControl", "Freezing Field", "Взрывы замедляют врагов и наносят урон вокруг Crystal Maiden, пока она поддерживает способность.", "Explosions slow and damage enemies around Crystal Maiden while she channels.")
  ),
  profile(6,
    evidence("physicalDamage", "Marksmanship", "Особые атаки игнорируют базовую броню; способность отключается рядом с вражеским героем.", "Special attacks ignore base armor; the ability is disabled near an enemy hero."),
    evidence("waveClear", "Multishot", "Выпускает несколько залпов стрел с физическим уроном по задетым врагам.", "Releases multiple arrow volleys that deal physical damage to enemies hit.")
  ),
  profile(8,
    evidence("physicalDamage", "Blade Dance", "Атаки Juggernaut могут наносить критический урон.", "Juggernaut's attacks can deal critical damage."),
    evidence("waveClear", "Blade Fury", "Вращение наносит магический урон врагам рядом с Juggernaut.", "The spin deals magical damage to enemies near Juggernaut.")
  ),
  profile(10,
    evidence("catch", "Adaptive Strike", "Оглушает и отталкивает цель; длительность контроля зависит от силы Morphling.", "Stuns and knocks back the target; the disable duration depends on Morphling's strength."),
    evidence("waveClear", "Waveform", "Волна наносит магический урон врагам по пути движения Morphling.", "The wave deals magical damage to enemies along Morphling's path.")
  ),
  profile(12,
    evidence("physicalDamage", "Juxtapose", "Атаки могут создавать иллюзии, которые добавляют атакующие юниты в бой.", "Attacks can create illusions that add more attacking units to a fight."),
    evidence("magicBurst", "Spirit Lance", "Наносит магический урон выбранному врагу, замедляет его и создаёт атакующую иллюзию.", "Deals magical damage to the selected enemy, slows it and creates an attacking illusion.")
  ),
  profile(14,
    evidence("catch", "Meat Hook", "Притягивает первого задетого юнита к Pudge; попадание зависит от траектории крюка.", "Pulls the first unit hit toward Pudge; landing it depends on the hook's path."),
    evidence("immunityControl", "Dismember", "Удержание действует сквозь невосприимчивость к эффектам, пока Pudge поддерживает способность.", "The disable pierces debuff immunity while Pudge channels.")
  ),
  profile(15,
    evidence("physicalDamage", "Static Link", "Переносит урон атак выбранного врага к Razor, пока сохраняется связь.", "Transfers attack damage from the selected enemy to Razor while the link holds."),
    evidence("armorReduction", "Eye of the Storm", "Удары бури снижают броню выбранной ею цели.", "The storm's strikes reduce the armor of the target it selects.")
  ),
  profile(17,
    evidence("catch", "Electric Vortex", "Притягивает выбранного врага к Storm Spirit.", "Pulls the selected enemy toward Storm Spirit."),
    evidence("waveClear", "Static Remnant", "Оставляет заряженный образ, который взрывается рядом с врагом и наносит магический урон.", "Creates a charged image that detonates near an enemy and deals magical damage.")
  ),
  profile(19,
    evidence("areaControl", "Avalanche", "Камни многократно оглушают врагов в выбранной области.", "Rocks repeatedly stun enemies in the selected area."),
    evidence("physicalDamage", "Tree Grab", "Дерево увеличивает урон и дальность атак Tiny и добавляет урон по области.", "A grabbed tree increases Tiny's attack damage and range and adds splash damage.")
  ),
  profile(23,
    evidence("catch", "Torrent", "После задержки подбрасывает и оглушает врагов в области.", "After a delay, lifts and stuns enemies in an area."),
    evidence("physicalDamage", "Tidebringer", "Усиленная атака наносит физический урон по широкой области.", "An empowered attack deals physical damage across a wide area."),
    evidence("areaControl", "Ghostship", "Корабль оглушает врагов в месте крушения.", "The ship stuns enemies near its crash site.")
  ),
  profile(32,
    evidence("areaControl", "Smoke Screen", "Дым запрещает врагам применять способности и заставляет их промахиваться атаками.", "Smoke silences enemies and causes their attacks to miss."),
    evidence("physicalDamage", "Backstab", "Атаки со спины наносят дополнительный физический урон от ловкости Riki.", "Attacks from behind deal bonus physical damage based on Riki's agility.")
  ),
  profile(35,
    evidence("areaControl", "Shrapnel", "Обстрел замедляет врагов и наносит урон в выбранной области.", "The barrage slows and damages enemies in the selected area."),
    evidence("physicalDamage", "Headshot", "Часть атак наносит дополнительный физический урон и отталкивает цель.", "Some attacks deal bonus physical damage and knock the target back.")
  ),
  profile(36,
    evidence("waveClear", "Death Pulse", "Волна наносит магический урон ближайшим врагам и лечит союзников.", "A wave deals magical damage to nearby enemies and heals allies."),
    evidence("magicBurst", "Reaper's Scythe", "Наносит магический урон от недостающего здоровья выбранного героя.", "Deals magical damage based on the selected hero's missing health."),
    evidence("catch", "Reaper's Scythe", "Оглушает выбранного героя перед нанесением основного урона.", "Stuns the selected hero before dealing its main damage.")
  ),
  profile(37,
    evidence("areaControl", "Upheaval", "Поддерживаемая область постепенно усиливает замедление и наносит урон.", "The channeled area progressively increases its slow and deals damage."),
    evidence("immunityControl", "Chaotic Offering", "Оглушение при появлении голема действует сквозь невосприимчивость к эффектам.", "The stun when the golem appears pierces debuff immunity.")
  ),
  profile(39,
    evidence("waveClear", "Scream Of Pain", "Крик наносит магический урон ближайшим врагам.", "The scream deals magical damage to nearby enemies."),
    evidence("areaControl", "Sonic Wave", "Волна чистого урона отталкивает задетых врагов.", "A wave of pure damage pushes affected enemies back.")
  ),
  profile(42,
    evidence("catch", "Wraithfire Blast", "Оглушает выбранного врага, затем замедляет его.", "Stuns the selected enemy, then slows it."),
    evidence("physicalDamage", "Mortal Strike", "Периодически усиливает одну атаку Wraith King.", "Periodically empowers one of Wraith King's attacks.")
  ),
  profile(44,
    evidence("physicalDamage", "Coup de Grace", "Накопленный Deadly Focus позволяет следующей подходящей атаке нанести критический урон.", "Accumulated Deadly Focus lets the next eligible attack deal critical damage."),
    evidence("physicalDamage", "Stifling Dagger", "Кинжал наносит физический урон от атаки Phantom Assassin и применяет эффекты атаки.", "The dagger deals physical damage based on Phantom Assassin's attack and applies attack effects.")
  ),
  profile(47,
    evidence("waveClear", "Nethertoxin", "Область продолжает наносить магический урон находящимся в ней врагам.", "The area continues dealing magical damage to enemies inside it.")
  ),
  profile(48,
    evidence("physicalDamage", "Moon Glaives", "Атаки перескакивают между врагами, теряя часть урона при каждом отскоке.", "Attacks bounce between enemies, losing some damage with each bounce."),
    evidence("magicBurst", "Eclipse", "Лучами поражает случайных ближайших врагов; распределение урона зависит от доступных целей.", "Beams strike random nearby enemies; damage distribution depends on available targets.")
  ),
  profile(51,
    evidence("areaControl", "Power Cogs", "Создаёт вокруг Clockwerk кольцо шестерней, ограничивающее перемещение юнитов.", "Creates a ring of cogs around Clockwerk that restricts unit movement."),
    evidence("catch", "Hookshot", "Крюк перемещает Clockwerk к задетому юниту и оглушает врагов на пути и рядом с целью.", "The hook brings Clockwerk to the unit hit and stuns enemies along the way and near the target."),
    evidence("immunityControl", "Hookshot", "Оглушение Hookshot действует сквозь невосприимчивость к эффектам.", "Hookshot's stun pierces debuff immunity.")
  ),
  profile(67,
    evidence("globalReach", "Haunt / Reality", "Haunt создаёт иллюзии у вражеских героев, а Reality позволяет Spectre переместиться к одной из них.", "Haunt creates illusions at enemy heroes, and Reality lets Spectre teleport to one of them."),
    evidence("physicalDamage", "Haunt", "Созданные иллюзии атакуют вражеских героев с уменьшенным уроном.", "The created illusions attack enemy heroes with reduced damage.")
  ),
  profile(70,
    evidence("physicalDamage", "Fury Swipes", "Последовательные атаки одной цели накапливают дополнительный физический урон.", "Consecutive attacks on the same target build up bonus physical damage."),
    evidence("physicalDamage", "Overpower", "Даёт повышенную скорость атаки для ограниченной серии ударов.", "Grants increased attack speed for a limited sequence of attacks.")
  ),
  profile(71,
    evidence("globalReach", "Charge of Darkness", "Может преследовать выбранного врага через карту, проходя сквозь препятствия.", "Can pursue the selected enemy across the map, passing through obstacles."),
    evidence("catch", "Charge of Darkness", "Попадание по основной цели и врагам на пути вызывает Greater Bash.", "Hitting the primary target and enemies along the path triggers Greater Bash."),
    evidence("immunityControl", "Nether Strike", "Оглушение и отталкивание Nether Strike действуют сквозь невосприимчивость к эффектам.", "Nether Strike's bash and knockback pierce debuff immunity.")
  ),
  profile(72,
    evidence("physicalDamage", "Flak Cannon", "Ограниченная серия атак поражает несколько врагов вокруг Gyrocopter.", "A limited sequence of attacks hits multiple enemies around Gyrocopter."),
    evidence("catch", "Homing Missile", "Ракета оглушает цель при попадании; враги могут уничтожить её до этого.", "The missile stuns its target on impact; enemies can destroy it before it arrives.")
  ),
  profile(73,
    evidence("armorReduction", "Acid Spray", "Снижает броню врагов в кислотной области.", "Reduces the armor of enemies in the acid area."),
    evidence("catch", "Unstable Concoction", "Брошенная колба оглушает врагов в области; перед броском её нужно подготовить.", "A thrown concoction stuns enemies in an area; it must be brewed before throwing."),
    evidence("physicalDamage", "Acid Spray", "Кислотная область наносит периодический физический урон.", "The acid area deals physical damage over time.")
  ),
  profile(74,
    { ...evidence("areaControl", "Tornado", "Поднимает врагов в воздух; продолжение уроном нужно согласовать с их приземлением.", "Lifts enemies into the air; damage follow-up must be timed with their landing."), blocksAllyDamage: true },
    evidence("armorReduction", "Forge Spirit", "Атаки призванного духа снижают броню вражеских героев.", "The summoned spirit's attacks reduce enemy heroes' armor."),
    evidence("remoteDamage", "Sun Strike", "Позволяет нанести урон в выбранной точке карты; попадание требует учёта задержки.", "Can deal damage at a selected point on the map; landing it requires accounting for the delay.")
  ),
  profile(94,
    evidence("physicalDamage", "Split Shot", "Атаки поражают дополнительные цели с уменьшенным уроном.", "Attacks hit additional targets with reduced damage."),
    evidence("areaControl", "Stone Gaze", "Враги, которые достаточно долго смотрят на Medusa, превращаются в камень.", "Enemies that look at Medusa long enough turn to stone."),
    evidence("immunityControl", "Stone Gaze", "Окаменение действует сквозь невосприимчивость к эффектам.", "Petrification pierces debuff immunity.")
  ),
  profile(98,
    evidence("waveClear", "Whirling Death", "Наносит чистый урон ближайшим врагам и уничтожает деревья.", "Deals pure damage to nearby enemies and destroys trees."),
    evidence("areaControl", "Chakram", "Оставленная пила наносит урон и замедляет врагов в области.", "The deployed saw damages and slows enemies in its area.")
  ),
  profile(99,
    evidence("armorReduction", "Viscous Nasal Goo", "Последовательные применения накапливают снижение брони выбранной цели.", "Repeated casts stack armor reduction on the selected target."),
    evidence("physicalDamage", "Quill Spray", "Выпуски игл наносят физический урон, который растёт при повторных попаданиях.", "Quill sprays deal physical damage that increases with repeated hits.")
  ),
  profile(100,
    evidence("areaControl", "Ice Shards", "Ледяные осколки создают временную преграду для перемещения.", "Ice shards create a temporary movement barrier."),
    evidence("catch", "Snowball", "Запущенный снежный ком оглушает врагов на своём пути.", "The launched snowball stuns enemies along its path."),
    evidence("immunityControl", "Walrus PUNCH!", "Подбрасывание Walrus PUNCH! действует сквозь невосприимчивость к эффектам.", "The Walrus PUNCH! launch pierces debuff immunity.")
  ),
  profile(106,
    evidence("catch", "Searing Chains", "Цепи удерживают ближайших врагов на месте и наносят периодический урон.", "Chains root nearby enemies and deal damage over time."),
    evidence("physicalDamage", "Sleight of Fist", "Ember Spirit атакует врагов в выбранной области и возвращается в исходную точку.", "Ember Spirit attacks enemies in the selected area and returns to his starting point.")
  ),
  profile(107,
    evidence("catch", "Rolling Boulder", "Столкновение с героем останавливает перекат и оглушает его; Stone Remnant усиливает перекат.", "Colliding with a hero stops the roll and stuns it; a Stone Remnant enhances the roll."),
    evidence("waveClear", "Magnetize", "Наносит периодический магический урон задетым врагам; Stone Remnants могут продлевать действие.", "Deals magical damage over time to affected enemies; Stone Remnants can extend its duration.")
  ),
  profile(108,
    evidence("areaControl", "Pit of Malice", "Область удерживает входящих врагов корнями и может повторить удержание через интервал.", "The area roots enemies that enter and can root them again after an interval."),
    evidence("globalReach", "Fiend's Gate", "Создаёт два портала для перемещения героев между ними после поддержания перехода.", "Creates two portals that heroes can channel to travel between.")
  ),
  profile(109,
    evidence("physicalDamage", "Metamorphosis", "Даёт Terrorblade дальнюю атаку и преобразует его ближайшие иллюзии.", "Gives Terrorblade a ranged attack and transforms his nearby illusions."),
    evidence("physicalDamage", "Conjure Image", "Создаёт дополнительную атакующую иллюзию Terrorblade.", "Creates an additional attacking illusion of Terrorblade.")
  ),
  profile(114,
    evidence("catch", "Boundless Strike", "Удар посохом оглушает врагов вдоль линии.", "The staff strike stuns enemies along a line."),
    evidence("physicalDamage", "Boundless Strike", "Наносит физический урон на основе критической атаки Monkey King.", "Deals physical damage based on Monkey King's critical attack."),
    evidence("physicalDamage", "Wukong's Command", "Солдаты атакуют вражеских героев в области и исчезают, если Monkey King её покидает.", "Soldiers attack enemy heroes in the area and disperse if Monkey King leaves it.")
  ),
  profile(123,
    evidence("catch", "Bushwhack", "Оглушает врагов только при наличии подходящего дерева в области.", "Stuns enemies only when a suitable tree is present in the area."),
    evidence("physicalDamage", "Acorn Shot", "Жёлудь перескакивает между целями и наносит физический урон на основе атаки Hoodwink.", "The acorn bounces between targets and deals physical damage based on Hoodwink's attack.")
  ),
  profile(136,
    evidence("catch", "Rebound", "Прыжок от союзника оглушает врагов в точке приземления.", "A leap from an ally stuns enemies at the landing point."),
    evidence("save", "Bodyguard", "Создаёт для Marci и выбранного союзника общий барьер от урона.", "Creates a shared damage barrier for Marci and the selected ally."),
    evidence("physicalDamage", "Bodyguard", "Увеличивает урон атак Marci и передаёт часть усиления выбранному союзнику.", "Increases Marci's attack damage and shares part of the bonus with the selected ally.")
  ),
  profile(137,
    evidence("catch", "Onslaught", "Разгон с последующим рывком оглушает задетых врагов.", "A charged rush stuns enemies it hits."),
    evidence("immunityControl", "Pulverize", "Удержание основной цели действует сквозь невосприимчивость к эффектам, пока Primal Beast поддерживает способность.", "The primary target's disable pierces debuff immunity while Primal Beast channels.")
  ),
  profile(2,
    evidence("catch", "Berserker's Call", "Заставляет ближайших врагов атаковать Axe.", "Forces nearby enemies to attack Axe."),
    evidence("areaControl", "Berserker's Call", "Провокация может захватить нескольких врагов рядом с Axe.", "The taunt can affect multiple enemies close to Axe."),
    evidence("immunityControl", "Berserker's Call", "Провокация действует сквозь невосприимчивость к эффектам.", "The taunt pierces debuff immunity.")
  ),
  profile(3,
    evidence("catch", "Fiend's Grip", "Удерживает одну цель, пока Bane поддерживает способность.", "Disables one target while Bane channels the ability."),
    evidence("immunityControl", "Fiend's Grip", "Удержание действует сквозь невосприимчивость к эффектам; поддержание можно прервать.", "The disable pierces debuff immunity; the channel can be interrupted.")
  ),
  profile(7,
    evidence("catch", "Fissure", "Оглушает врагов вдоль линии и создаёт непроходимую преграду.", "Stuns enemies along a line and creates an impassable barrier."),
    evidence("areaControl", "Fissure", "Каменная преграда меняет доступные пути движения для обеих команд.", "The stone barrier changes movement routes for both teams."),
    evidence("magicBurst", "Echo Slam", "Попадания вызывают дополнительные волны урона по ближайшим врагам.", "Hits create additional damage echoes against nearby enemies.")
  ),
  profile(9,
    evidence("catch", "Sacred Arrow", "Стрела оглушает первого задетого врага; для результата нужно попасть.", "The arrow stuns the first enemy hit; landing the projectile is required."),
    evidence("waveClear", "Starstorm", "Метеоры наносят магический урон нескольким ближайшим врагам.", "Meteors deal magical damage to multiple nearby enemies.")
  ),
  profile(11,
    evidence("armorReduction", "Presence of the Dark Lord", "Снижает броню врагов рядом с Shadow Fiend.", "Reduces the armor of enemies near Shadow Fiend."),
    evidence("physicalDamage", "Necromastery", "Собранные души увеличивают урон атак; при смерти часть душ теряется.", "Collected souls increase attack damage; death removes some souls."),
    evidence("waveClear", "Shadowraze", "Наносит магический урон врагам в выбранной области перед героем.", "Deals magical damage to enemies in an area in front of the hero."),
    evidence("areaControl", "Requiem of Souls", "Волны душ накладывают страх на задетых врагов.", "Soul waves apply fear to enemies they hit.")
  ),
  profile(13,
    evidence("catch", "Dream Coil", "Привязывает врагов к области; разрыв связи оглушает цель.", "Leashes enemies to an area; breaking the coil stuns the target."),
    evidence("areaControl", "Dream Coil", "Может ограничить перемещение нескольких героев одновременно.", "Can restrict the movement of multiple heroes at once."),
    evidence("waveClear", "Illusory Orb", "Шар наносит магический урон врагам на своём пути.", "The orb deals magical damage to enemies along its path.")
  ),
  profile(18,
    evidence("catch", "Storm Hammer", "Оглушает цель и врагов в небольшой области вокруг неё.", "Stuns the target and enemies in a small area around it."),
    evidence("physicalDamage", "God's Strength", "Временно увеличивает урон атак Sven.", "Temporarily increases Sven's attack damage."),
    evidence("waveClear", "Great Cleave", "Атаки также наносят урон врагам за основной целью.", "Attacks also damage enemies behind the primary target.")
  ),
  profile(20,
    evidence("catch", "Magic Missile", "Направленная ракета оглушает задетую цель.", "A targeted missile stuns the enemy it hits."),
    evidence("save", "Nether Swap", "Может поменять союзного героя местами с Vengeful Spirit и дать ему барьер.", "Can swap an allied hero with Vengeful Spirit and give that ally a barrier."),
    evidence("armorReduction", "Wave of Terror", "Снижает броню и урон атак задетых врагов.", "Reduces the armor and attack damage of affected enemies.")
  ),
  profile(25,
    evidence("magicBurst", "Laguna Blade", "Наносит большой разовый магический урон одной цели.", "Deals a large burst of magical damage to one target."),
    evidence("targetedSpell", "Laguna Blade", "Направленный урон можно продолжить по связанным Soulbind целям.", "Its unit-targeted damage can follow up on enemies linked by Soulbind."),
    evidence("waveClear", "Dragon Slave", "Волна огня наносит магический урон врагам на своём пути.", "A wave of fire deals magical damage to enemies along its path.")
  ),
  profile(26,
    evidence("catch", "Hex", "Превращает выбранного врага в зверька и лишает его возможности применять способности.", "Transforms a selected enemy into a beast and disables its abilities."),
    evidence("magicBurst", "Finger of Death", "Наносит большой разовый магический урон выбранному врагу.", "Deals a large burst of magical damage to the selected enemy."),
    evidence("targetedSpell", "Finger of Death / Hex", "Направленные Finger of Death и Hex дают продолжение по связанным Soulbind целям.", "Unit-targeted Finger of Death and Hex provide follow-up against enemies linked by Soulbind.")
  ),
  profile(27,
    evidence("buildingPressure", "Mass Serpent Ward", "Призывает змеиные тотемы, которые атакуют врагов и постройки.", "Summons serpent wards that attack enemies and structures."),
    evidence("physicalDamage", "Mass Serpent Ward", "Атаки змеиных тотемов наносят физический урон.", "Serpent ward attacks deal physical damage.")
  ),
  profile(28,
    evidence("catch", "Slithereen Crush", "Оглушает врагов рядом со Slardar; для применения нужно сблизиться.", "Stuns enemies close to Slardar; he must get into range."),
    evidence("armorReduction", "Corrosive Haze", "Снижает броню выбранного врага и раскрывает его невидимость.", "Reduces the selected enemy's armor and reveals its invisibility."),
    evidence("physicalDamage", "Bash of the Deep", "После серии атак следующая атака оглушает и наносит дополнительный физический урон.", "After a sequence of attacks, the next attack stuns and deals bonus physical damage."),
    evidence("immunityControl", "Bash of the Deep", "Оглушение Bash of the Deep действует сквозь невосприимчивость к эффектам.", "The Bash of the Deep stun pierces debuff immunity.")
  ),
  profile(29,
    evidence("areaControl", "Ravage", "Оглушает врагов в большой области вокруг Tidehunter.", "Stuns enemies in a large area around Tidehunter."),
    evidence("armorReduction", "Gush", "Выбранная цель получает урон, замедление и снижение брони.", "The selected target takes damage and has its movement speed and armor reduced.")
  ),
  profile(33,
    evidence("areaControl", "Black Hole", "Удерживает врагов в области, пока Enigma поддерживает способность.", "Disables enemies in an area while Enigma channels the ability."),
    evidence("immunityControl", "Black Hole", "Удержание действует сквозь невосприимчивость к эффектам; поддержание можно прервать.", "The disable pierces debuff immunity; the channel can be interrupted.")
  ),
  profile(38,
    evidence("catch", "Primal Roar", "Оглушает выбранного врага и расталкивает юнитов на пути к нему.", "Stuns the selected enemy and pushes units aside along the path."),
    evidence("immunityControl", "Primal Roar", "Оглушение основной цели действует сквозь невосприимчивость к эффектам.", "The primary target's stun pierces debuff immunity.")
  ),
  profile(41,
    evidence("areaControl", "Chronosphere", "Останавливает юнитов в области, включая союзников; Faceless Void и его юниты свободны.", "Stops units in the area, including allies; Faceless Void and his units remain free."),
    evidence("immunityControl", "Chronosphere", "Остановка внутри сферы действует сквозь невосприимчивость к эффектам.", "The disable inside the sphere pierces debuff immunity.")
  ),
  profile(43,
    evidence("buildingPressure", "Exorcism", "Духи атакуют врагов и постройки рядом с Death Prophet.", "Spirits attack enemy units and structures near Death Prophet."),
    evidence("physicalDamage", "Exorcism", "Духи наносят физический урон в течение действия способности.", "The spirits deal physical damage for the duration of the ability."),
    evidence("waveClear", "Crypt Swarm", "Рой наносит магический урон врагам перед Death Prophet.", "A swarm deals magical damage to enemies in front of Death Prophet.")
  ),
  profile(46,
    evidence("armorReduction", "Meld", "Атака из Meld снижает броню задетого врага.", "An attack from Meld reduces the affected enemy's armor."),
    evidence("physicalDamage", "Meld", "Атака из Meld наносит дополнительный физический урон.", "An attack from Meld deals bonus physical damage."),
    evidence("waveClear", "Psi Blades", "Атаки также поражают врагов позади основной цели.", "Attacks also hit enemies behind the primary target.")
  ),
  profile(50,
    evidence("save", "Shallow Grave", "Временно защищает союзника от смерти; взаимодействия со способностями добивания требуют отдельной проверки.", "Temporarily protects an ally from death; interactions with execution abilities need a separate check."),
    evidence("physicalDamage", "Shadow Wave", "Лечит союзников и наносит физический урон врагам рядом с ними.", "Heals allies and deals physical damage to enemies near them.")
  ),
  profile(52,
    evidence("buildingPressure", "Diabolic Edict", "Взрывы поражают врагов и постройки; при меньшем числе целей урон меньше распределяется.", "Explosions hit enemies and structures; fewer targets means less damage is spread between them."),
    evidence("catch", "Split Earth", "Оглушает врагов в выбранной области после задержки.", "Stuns enemies in the selected area after a delay.")
  ),
  profile(53,
    evidence("globalReach", "Teleportation", "Может телепортироваться в выбранную точку карты.", "Can teleport to a selected point on the map."),
    evidence("buildingPressure", "Nature's Call", "Управляемые Treants позволяют отправлять отдельные группы юнитов давить линии и постройки.", "Controllable Treants allow separate groups of units to pressure lanes and structures."),
    evidence("waveClear", "Wrath of Nature", "Магический урон перескакивает между видимыми врагами по карте.", "Magical damage bounces between visible enemies across the map.")
  ),
  profile(54,
    evidence("physicalDamage", "Feast", "Атаки наносят дополнительный физический урон от максимального здоровья цели и лечат Lifestealer.", "Attacks deal bonus physical damage based on the target's maximum health and heal Lifestealer.")
  ),
  profile(57,
    evidence("save", "Guardian Angel", "Даёт ближайшим союзникам временную невосприимчивость к физическому урону.", "Gives nearby allies temporary immunity to physical damage."),
    evidence("save", "Repel", "Даёт союзнику невосприимчивость к эффектам, сопротивление магии и восстановление здоровья.", "Grants an ally debuff immunity, magic resistance and health regeneration.")
  ),
  profile(64,
    evidence("areaControl", "Ice Path", "Ледяная дорожка оглушает врагов, которые её касаются.", "The ice path stuns enemies that touch it."),
    evidence("waveClear", "Macropyre", "Линия огня продолжает наносить урон врагам, которые остаются в ней.", "A line of fire continues damaging enemies that remain inside it.")
  ),
  profile(65,
    evidence("catch", "Flaming Lasso", "Связывает выбранного врага и позволяет тащить его за Batrider.", "Tethers the selected enemy and allows Batrider to drag it."),
    evidence("immunityControl", "Flaming Lasso", "Удержание действует сквозь невосприимчивость к эффектам.", "The disable pierces debuff immunity.")
  ),
  profile(79,
    evidence("save", "Disruption", "Временно убирает выбранного союзника с поля боя; после окончания он возвращается.", "Temporarily removes a selected ally from the battlefield; the ally returns when it ends."),
    evidence("dispel", "Demonic Purge", "Снимает положительные эффекты с выбранного врага и замедляет его.", "Removes positive buffs from the selected enemy and slows it.")
  ),
  profile(80,
    evidence("buildingPressure", "Demolish", "Spirit Bear наносит дополнительный урон постройкам.", "Spirit Bear deals additional damage to structures.")
  ),
  profile(86,
    evidence("catch", "Telekinesis", "Поднимает выбранного врага и позволяет изменить место его приземления.", "Lifts a selected enemy and allows its landing location to be changed."),
    evidence("waveClear", "Fade Bolt", "Магический урон перескакивает между врагами и снижает их урон атак и заклинаний.", "Magical damage bounces between enemies and reduces their attack and spell damage.")
  ),
  profile(104,
    evidence("catch", "Duel", "Заставляет Legion Commander и выбранного врага атаковать друг друга.", "Forces Legion Commander and the selected enemy to attack each other."),
    evidence("immunityControl", "Duel", "Принуждение к Duel действует сквозь невосприимчивость к эффектам.", "Duel's forced combat pierces debuff immunity."),
    evidence("save", "Press The Attack", "Снимает с союзника снимаемые сильным развеиванием эффекты и даёт восстановление здоровья.", "Removes effects that can be strongly dispelled from an ally and grants health regeneration."),
    evidence("dispel", "Press The Attack", "Применяет сильное развеивание к союзнику; оно не снимает все виды контроля.", "Applies a strong dispel to an ally; it does not remove every kind of disable.")
  ),
  profile(111,
    evidence("save", "False Promise", "Откладывает получаемые союзником урон и лечение до окончания эффекта.", "Delays an ally's incoming damage and healing until the effect ends."),
    evidence("dispel", "False Promise", "При применении накладывает на союзника сильное развеивание.", "Applies a strong dispel to the ally on cast."),
    evidence("dispel", "Fortune's End", "Базовое развеивание снимает положительные эффекты с врагов или отрицательные с выбранного союзника.", "A basic dispel removes enemy buffs or debuffs from the selected ally.")
  ),
  profile(112,
    evidence("save", "Cold Embrace", "Обездвиживает союзника, лечит его и защищает от физического урона; магический урон остаётся угрозой.", "Immobilizes an ally, heals it and blocks physical damage; magical damage remains a threat."),
    { ...evidence("areaControl", "Winter's Curse", "Заставляет врагов рядом с основной целью атаковать её; урон вашей команды по проклятым ограничен.", "Forces enemies near the primary target to attack it; your team's damage against cursed units is restricted."), blocksAllyDamage: true }
  ),
  profile(121,
    evidence("soulbind", "Soulbind", "Связывает выбранного врага с ближайшим к нему союзником и повторяет подходящие направленные способности по второй цели.", "Links the selected enemy to its nearest ally and repeats eligible unit-targeted abilities on the other target."),
    evidence("areaControl", "Ink Swell", "По окончании эффекта оглушает врагов вокруг носителя; результат зависит от его сближения с противником.", "Stuns enemies around its carrier when the effect ends; the result depends on getting close to enemies."),
    evidence("waveClear", "Stroke of Fate", "Чернильная линия наносит магический урон нескольким врагам на пути.", "A path of ink deals magical damage to multiple enemies along it.")
  ),
  profile(128,
    evidence("areaControl", "Mortimer Kisses", "Оставляет горящие области, которые замедляют врагов и наносят урон.", "Leaves burning areas that slow enemies and deal damage."),
    evidence("catch", "Firesnap Cookie", "Прыжок носителя оглушает врагов в месте приземления.", "The carrier's hop stuns enemies in the landing area."),
    evidence("armorReduction", "Lil' Shredder", "Попадания очереди снижают броню цели.", "Hits from the burst reduce the target's armor."),
    evidence("physicalDamage", "Lil' Shredder", "Очередь атак наносит физический урон.", "The burst of attacks deals physical damage.")
  )
];
