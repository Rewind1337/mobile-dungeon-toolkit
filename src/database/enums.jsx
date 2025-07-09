export const EQUIPMENT_SLOT_NAME_MAP = {
    0: "WEAPON",
    1: "HELMET",
    2: "ARMOR",
    3: "NECKLACE",
    4: "RING",
    5: "OTHER",
}

export const EQUIPMENT_SLOT = {
    WEAPON: 0,
    HELMET: 1,
    ARMOR: 2,
    NECKLACE: 3,
    RING: 4,
    OTHER: 5,
}

export const ATTRIBUTE_NAME_MAP = {
    0: "NONE",
    1: "STRENGTH",
    2: "DEXTERITY",
    3: "INTELLIGENCE",
}

export const ATTRIBUTE = {
    NONE: 0,
    STRENGTH: 1,
    DEXTERITY: 2,
    INTELLIGENCE: 3,
}

export const PRIMARY_STAT_NAME_MAP = {
    0: "ATTACK",
    1: "DEFENCE",
    2: "AGILITY",
}

export const PRIMARY_STAT = {
    ATTACK: 0,
    DEFENCE: 1,
    AGILITY: 2,
}

export const ROLE_NAME_MAP = {
    0: "OFFENSIVE",
    1: "DEFENSIVE",
    2: "CONTROL",
    3: "SUPPORT",
}

export const ROLE = {
    OFFENSIVE: 0,
    DEFENSIVE: 1,
    CONTROL: 2,
    SUPPORT: 3,
}

export const PERKS = {
    HEALTH_PERCENT: { id: 0, name: "Health Percent" },
    ATTACK_PERCENT: { id: 1, name: "Attack Percent" },
    DEFENCE_PERCENT: { id: 2, name: "Defence Percent" },
    AGILITY_PERCENT: { id: 3, name: "Agility Percent" },
    HEALTH_FLAT: { id: 4, name: "Health Flat" },
    ATTACK_FLAT: { id: 5, name: "Attack Flat" },
    DEFENCE_FLAT: { id: 6, name: "Defence Flat" },
    AGILITY_FLAT: { id: 7, name: "Agility Flat" },
    CRIT_CHANCE: { id: 8, name: "Critical Chance" },
    CRIT_RESISTANCE: { id: 9, name: "Critical Resistance" },
    CRIT_DAMAGE: { id: 10, name: "Critical Damage" },
    CRIT_DAMAGE_REDUCTION: { id: 11, name: "Critical Damage Reduction" },
    ACCURACY: { id: 12, name: "Accuracy" },
    RESISTANCE: { id: 13, name: "Resistance" },
    BOSS_DAMAGE: { id: 14, name: "Boss Damage" },
    BOSS_DAMAGE_REDUCTION: { id: 15, name: "Boss Damage Reduction" },
    AOE_DAMAGE_REDUCTION: { id: 16, name: "AoE Damage Reduction" },
    AP_DAMAGE_REDUCTION: { id: 17, name: "AP Damage Reduction" },
    LIFE_STEAL: { id: 18, name: "Life Steal" },
    HEALING_EFFICIENCY: { id: 19, name: "Healing Efficiency" },
    HEALING_RECEIVED: { id: 20, name: "Healing Received" },
    FIRE_DAMAGE: { id: 21, name: "Fire Damage" },
    NATURE_DAMAGE: { id: 22, name: "Nature Damage" },
    WATER_DAMAGE: { id: 23, name: "Water Damage" },
    LIGHT_DAMAGE: { id: 24, name: "Light Damage" },
    SHADOW_DAMAGE: { id: 25, name: "Shadow Damage" },
    FIRE_DAMAGE_REDUCTION: { id: 26, name: "Fire Damage Reduction" },
    NATURE_DAMAGE_REDUCTION: { id: 27, name: "Nature Damage Reduction" },
    WATER_DAMAGE_REDUCTION: { id: 28, name: "Water Damage Reduction" },
    LIGHT_DAMAGE_REDUCTION: { id: 29, name: "Light Damage Reduction" },
    SHADOW_DAMAGE_REDUCTION: { id: 30, name: "Shadow Damage Reduction" },
    MAIN_STAT_PERCENT: { id: 31, name: "Main Attribute Percent" },
    MAIN_STAT_FLAT: { id: 32, name: "Main Attribute Flat" },
}

export const POSSIBLE_PERKS = {
    WEAPONS: [
        "MAIN_STAT_FLAT", "MAIN_STAT_PERCENT", "HEALTH_PERCENT", "ACCURACY", "CRIT_DAMAGE",
        "CRIT_CHANCE", "BOSS_DAMAGE", "LIFE_STEAL", "HEALING_EFFICIENCY", "HEALING_RECEIVED"
    ],
    HELMETS: [
        "MAIN_STAT_FLAT", "MAIN_STAT_PERCENT", "HEALTH_FLAT", "HEALTH_PERCENT", "ACCURACY",
        "CRIT_DAMAGE", "BOSS_DAMAGE_REDUCTION", "CRIT_RESISTANCE", "SHADOW_DAMAGE_REDUCTION", "LIGHT_DAMAGE_REDUCTION"
    ],
    ARMORS: [
        "MAIN_STAT_PERCENT", "HEALTH_FLAT", "HEALTH_PERCENT", "RESISTANCE", "HEALING_RECEIVED",
        "CRIT_DAMAGE_REDUCTION", "AOE_DAMAGE_REDUCTION", "FIRE_DAMAGE_REDUCTION", "NATURE_DAMAGE_REDUCTION", "WATER_DAMAGE_REDUCTION"
    ],
    RINGS: [
        "MAIN_STAT_PERCENT", "AP_DAMAGE_REDUCTION", "CRIT_DAMAGE_REDUCTION", "CRIT_RESISTANCE", "LIFE_STEAL",
        "HEALING_EFFICIENCY", "HEALING_RECEIVED", "FIRE_DAMAGE", "NATURE_DAMAGE", "WATER_DAMAGE"
    ],
    NECKLACES: [
        "ACCURACY", "RESISTANCE", "CRIT_DAMAGE", "CRIT_CHANCE", "BOSS_DAMAGE",
        "AP_DAMAGE_REDUCTION", "HEALING_EFFICIENCY", "SHADOW_DAMAGE", "LIGHT_DAMAGE", "CRIT_RESISTANCE",
        "BOSS_DAMAGE_REDUCTION",
    ],
}

export const RARITY_NAME_MAP = {
    0: "COMMON",
    1: "UNCOMMON",
    2: "RARE",
    3: "EPIC",
    4: "LEGENDARY",
    5: "MYTHICAL",
}

export const RARITY = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4,
    MYTHICAL: 5,
}

export const ELEMENT_NAME_MAP = {
    0: "FIRE",
    1: "WATER",
    2: "NATURE",
    3: "LIGHT",
    4: "SHADOW",
    5: "VOID"
}

export const ELEMENT = {
    FIRE: 0,
    WATER: 1,
    NATURE: 2,
    LIGHT: 3,
    SHADOW: 4,
    VOID: 5,
}

export const UNIQUE_SKILLS = {
    NOTHING: 0,

    // STRENGTH
    PUMPKIN_SCYTHE: { id: 100, description: "" },
    DRILL_SLAMMER: { id: 101, description: "" },
    LIGHT_AXE: { id: 102, description: "" },
    FROST_BINDER: { id: 103, description: "" },
    HYDRAS_BITE: { id: 104, description: "" },
    VAMPIRES_STAKE: { id: 105, description: "" },
    SKY_PIERCER: { id: 106, description: "" },
    VOID_PIERCER_LANCE: { id: 107, description: "" },
    VOID_SPLITTER: { id: 108, description: "" },
    LIGHT_SWORD: { id: 109, description: "" },
    SUN_SPLITTER: { id: 110, description: "" },
    RUST_BINDER: { id: 111, description: "" },
    MAGMA_EDGE: { id: 112, description: "" },
    ROTTEN_MAUL: { id: 113, description: "" },
    HOOK_HAMMER: { id: 114, description: "" },
    TITANS_MAUL: { id: 115, description: "" },
    EARTH_BREAKER: { id: 116, description: "" },
    PROBLEM_SOLVER: { id: 117, description: "" },
    HARMONY: { id: 118, description: "" },
    CHOPOCALYPSE: { id: 119, description: "" },
    SINGULARITY: { id: 120, description: "" },

    // INTELLIGENCE
    EMBRYONIC_CATALYST: { id: 200, description: "" },
    PEST_BRINGER: { id: 201, description: "" },
    MIASMA_STAFF: { id: 201, description: "" },
    FIRE_STARTER: { id: 202, description: "" },
    ICILE: { id: 203, description: "" },
    LIFE_CATALYST: { id: 204, description: "" },
    ARCANE_CODEX: { id: 205, description: "" },
    LAST_OATH: { id: 206, description: "" },
    BASILISKS_EYE: { id: 207, description: "" },
    RAINBOW_STAFF: { id: 208, description: "" },
    SEED_OF_ROT: { id: 209, description: "" },
    TOME_OF_ETERNAL_FROST: { id: 210, description: "" },
    GODS_VOW: { id: 211, description: "" },
    SOUL_CATALYST: { id: 212, description: "" },
    ARCANE_PULSE: { id: 213, description: "" },
    RESEARCH_LOG: { id: 214, description: "" },
    EQUILIBRIUM: { id: 215, description: "" },
    INSANITY_CATALYST: { id: 216, description: "" },
    DUALITY: { id: 217, description: "" },

    // AGILITY
    BLASTER: { id: 300, description: "" },
    BONE_BOW: { id: 301, description: "" },
    BOOMSTICK: { id: 302, description: "" },
    WOLF_CLAWS: { id: 303, description: "" },
    CORKSCREW_KNUCKLE: { id: 304, description: "" },
    SOUL_STABBER: { id: 305, description: "" },
    WHISPER_BLADE: { id: 306, description: "" },
    STARFIRE_BALLISTA: { id: 307, description: "" },
    BLACK_FEATHER_BOW: { id: 308, description: "" },
    SHADOW_SPIKES: { id: 309, description: "" },
    VORTEX_DANCER: { id: 310, description: "" },
    RELICFANG_DAGGER: { id: 311, description: "" },
    NEEDLE_POINT: { id: 312, description: "" },
    BRUTE_FORCE: { id: 313, description: "" },
    CLAWTASTROPHE: { id: 314, description: "" },
    STARFALL: { id: 315, description: "" },
    TWILIGHT: { id: 316, description: "" },
}