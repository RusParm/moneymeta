import type { DotaItemRecord } from "../lib/dota-items";

// Official delta applied to the archived catalog. Never relabel its match cohort.
export const dotaItemPatch = {
  patch: "7.41f",
  startedAt: "2026-09-15T00:00:00.000Z",
  checkedAt: "2026-09-18",
  sourceUrl: "https://www.dota2.com/patches/7.41f"
} as const;

export const dotaItemCostOverrides: Record<string, number> = {
  greater_crit: 5200, dragon_lance: 2000, heart: 5300,
  heavens_halberd: 3300, hurricane_pike: 4550, hydras_breath: 5900, octarine_core: 5100
};
const attributes: Record<string, Record<string, string>> = {
  infused_raindrop: { mana_regen: "0.6" },
  essence_distiller: { mana_regen: "1.5" },
  manta: { images_do_damage_percent_ranged: "-75", tooltip_damage_outgoing_ranged: "25" },
  mask_of_madness: { lifesteal_percent: "22" },
  mjollnir: { static_duration: "12.0" },
  satanic: { lifesteal_percent: "25" },
  shivas_guard: { blast_damage: "225" },
  silver_edge: { windwalk_movement_speed: "20" }
};
const descriptions: Record<string, Record<string, string>> = {
  bfury: { "Chop Tree": "Destroys a target tree. Cooldown: 3 seconds." },
  manta: { "Mirror Image": "Creates 2 illusions for 18 seconds. Melee illusions deal 33% damage; ranged illusions deal 25%. Both take 300% damage. Basic dispel." },
  mask_of_madness: { Lifesteal: "Heals for 22% of attack damage against heroes, or 13.2% against creeps." },
  mjollnir: { "Static Charge": "Shields a target for 12 seconds. When triggered (20% chance), deals 225 magical damage to a nearby attacker and 4 additional enemies." },
  satanic: { Lifesteal: "Heals for 25% of attack damage against heroes, or 15% against creeps." },
  shivas_guard: { "Arctic Blast": "A freezing wave deals 225 magical damage and slows movement by 40% for 4 seconds. Radius: 825." },
  silver_edge: { "Shadow Walk": "Invisibility lasts 17 seconds or until an attack or spell. Grants 20% movement speed and movement through units. The opening attack deals 300 bonus physical damage, breaks passives for 5 seconds and caps movement speed at 200. Cooldown: 23 seconds." }
};

export function applyDotaItemPatch(item: DotaItemRecord): DotaItemRecord {
  return {
    ...item,
    cost: dotaItemCostOverrides[item.key] ?? item.cost,
    attributes: item.attributes.map((row) => ({ ...row, value: attributes[item.key]?.[row.key] ?? row.value })),
    abilities: item.abilities.map((row) => ({ ...row, description: descriptions[item.key]?.[row.title] ?? row.description }))
  };
}
