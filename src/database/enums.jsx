export const DROP_SOURCE = {
    EVERYWHERE: 0,
    GUILD_HUNT: 1,
}

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
    RING: 3,
    NECKLACE: 4,
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
    NOTHING: { id: -1, name: "Nothing" },
    HEALTH_PERCENT: { id: 0, name: "Health Percent" },
    ATTACK_PERCENT: { id: 1, name: "Attack Percent" },
    DEFENCE_PERCENT: { id: 2, name: "Defence Percent" },
    AGILITY_PERCENT: { id: 3, name: "Agility Percent" },
    HEALTH_FLAT: { id: 4, name: "Health Flat" },
    ATTACK_FLAT: { id: 5, name: "Attack Flat" },
    DEFENCE_FLAT: { id: 6, name: "Defence Flat" },
    AGILITY_FLAT: { id: 7, name: "Agility Flat" },
    CRIT_CHANCE: { id: 8, name: "Crit Chance" },
    CRIT_RESISTANCE: { id: 9, name: "Crit Resistance" },
    CRIT_DAMAGE: { id: 10, name: "Crit Damage" },
    CRIT_DAMAGE_REDUCTION: { id: 11, name: "Crit Damage Reduction" },
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
    5: "MYTHIC",
    6: "HEROIC",
    7: "DIVINE",
    8: "ANCIENT",
}

export const RARITY = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3,
    LEGENDARY: 4,
    MYTHIC: 5,
    HEROIC: 6,
    DIVINE: 7,
    ANCIENT: 8,
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
    PUMPKIN_SCYTHE: { id: 100, description: "$e chance to get an extra turn when killing an enemy.", rarityEffect: [1.20, 1.25, 1.30, 1.35] },
    DRILL_SLAMMER: { id: 101, description: "Ultimate Skill has a $e chance to deal 6% extra true damage.", rarityEffect: [1.32, 1.40, 1.48, 1.56] },
    LIGHT_AXE: { id: 102, description: "Increases splash damage (ignores primary target) by $e", rarityEffect: [1.05, 1.06, 1.08, 1.10] },
    FROST_BINDER: { id: 103, description: "+$e damage on targets with Freeze.", rarityEffect: [1.05, 1.06, 1.08, 1.10] },
    HYDRAS_BITE: { id: 104, description: "Critical hits have a $e chance to inflinct Poison on the target for 2 turns.", rarityEffect: [1.20, 1.25, 1.30, 1.35] },
    VAMPIRES_STAKE: { id: 105, description: "Critical hits have a $e chance to inflinct Cursed on the target for 2 turns", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    SKY_PIERCER: { id: 106, description: "Primary Skill has a $e chance to ignore shields.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    VOID_PIERCER_LANCE: { id: 107, description: "Primary Skill has a $e chance to inflict DEF Down on target for 2 turns.", rarityEffect: [1.24, 1.30, 1.36, 1.42] },
    VOID_SPLITTER: { id: 108, description: "Ultimate Skill has a $e chance to deal 5% of missing max HP as extra true damage.", rarityEffect: [1.32, 1.40, 1.48, 1.56] },
    LIGHT_SWORD: { id: 109, description: "Increases Critical Chance by $e in turn 1 and every 3 turns.", rarityEffect: [1.16, 1.20, 1.24, 1.28] },
    SUN_SPLITTER: { id: 110, description: "Primary Skill has a $e chance to inflinct Blind on the target for 2 turns.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    RUST_BINDER: { id: 111, description: "Critical Hits have a $e chance to inflinct Bleeding on the target for 2 turns.", rarityEffect: [1.36, 1.45, 1.54, 1.63] },
    MAGMA_EDGE: { id: 112, description: "+$e damage on targets with Burn.", rarityEffect: [1.05, 1.06, 1.08, 1.10] },
    ROTTEN_MAUL: { id: 113, description: "Ultimate Skill has a $e chance to grant self 20% extra AP.", rarityEffect: [1.32, 1.40, 1.48, 1.56] },
    HOOK_HAMMER: { id: 114, description: "Increases Defense by $e in turn 1 and every 2 turns.", rarityEffect: [1.05, 1.06, 1.08, 1.10] },
    TITANS_MAUL: { id: 115, description: "Primary Skill deals $e Defense as true damage to 2 adjancent targets.", rarityEffect: [1.08, 1.10, 1.12, 1.14] },
    EARTH_BREAKER: { id: 116, description: "Primary Skill has a $e chance to inflinct AGI Down on target for 2 turns.", rarityEffect: [1.24, 1.30, 1.36, 1.42] },
    PROBLEM_SOLVER: { id: 117, description: "+$e Critical Damage on targets with Bleeding.", rarityEffect: [1.12, 1.15, 1.18, 1.21] },
    HARMONY: { id: 118, description: "All inflicted debuffs that cause damage over time have a $e chance to last 1 extra turn.", rarityEffect: [1.40, 1.50, 1.60, 1.70] },
    CHOPOCALYPSE: { id: 119, description: "Primary Skill has a $e chance to inflinct ATK Down on target for 1 turn.", rarityEffect: [1.24, 1.30, 1.36, 1.42] },
    SINGULARITY: { id: 120, description: "Ultimate Skill has a $e chance to inflict Echo on target for 2 turns.", rarityEffect: [1.40, 1.50, 1.60, 1.70] },
    GRAVEL_BUSTER: { id: 121, description: "If own HP are above 75%, Shield Strength increased by $e.", rarityEffect: [1.15, 1.20, 1.25, 1.30] },
    BIASED_WHEEL: { id: 122, description: "Primary Skill has a $e chance to inflict Burn on target for 1 turn.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },

    // INTELLIGENCE
    EMBRYONIC_CATALYST: { id: 200, description: "Cast Buffs (except Invincibility & Preservation) have a $e chance to last 1 extra turn.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    PEST_BRINGER: { id: 201, description: "Primary Skill has a $e chance to inflinct Poison on target for 2 turns.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    MIASMA_STAFF: { id: 202, description: "Deals $e extra true damage in turn 1 and every 3 turns.", rarityEffect: [1.08, 1.10, 1.12, 1.14] },
    FIRE_STARTER: { id: 203, description: "Primary Skill deals $e Attack as true damage to 1 adjancent target.", rarityEffect: [1.11, 1.15, 1.19, 1.23] },
    ICILE: { id: 204, description: "+$e Critical Chance on targets with Freeze", rarityEffect: [1.16, 1.20, 1.24, 1.28] },
    LIFE_CATALYST: { id: 205, description: "Critical hits heal all allies by $e of damage dealt.", rarityEffect: [1.05, 1.06, 1.08, 1.10] },
    ARCANE_CODEX: { id: 206, description: "Ultimate Skill has a $e chance to grant self AGI Up for 2 turns.", rarityEffect: [1.36, 1.45, 1.54, 1.63] },
    LAST_OATH: { id: 207, description: "Primary Skill deals $e Agility as true damage to 2 adjacent targets.", rarityEffect: [1.08, 1.10, 1.12, 1.14] },
    BASILISKS_EYE: { id: 208, description: "Primary Skill has a $e chance to inflict Petrified on target for 2 turns.", rarityEffect: [1.20, 1.25, 1.30, 1.35] },
    RAINBOW_STAFF: { id: 209, description: "Critical hits heal ally with lowest health (or self) by $e of damage dealth on the target.", rarityEffect: [1.12, 1.15, 1.18, 1.21] },
    SEED_OF_ROT: { id: 210, description: "Critical hits have a $e chance to inflict Sick on the target for 2 turns.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    TOME_OF_ETERNAL_FROST: { id: 211, description: "Primary Skill has a $e chance to inflinct Freeze on target for 1 turn.", rarityEffect: [1.16, 1.20, 1.24, 1.28] },
    GODS_VOW: { id: 212, description: "$e chance to get an extra turn when killing an enemy.", rarityEffect: [1.20, 1.25, 1.30, 1.35] },
    SOUL_CATALYST: { id: 213, description: "Cast Debuffs (except Stunned) have a $e chance to last 1 extra turn.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    ARCANE_PULSE: { id: 214, description: "Killing enemies has a $e chance to heal self by 15% of own HP", rarityEffect: [1.11, 1.15, 1.19, 1.23] },
    RESEARCH_LOG: { id: 215, description: "Primary Skill has a $e chance to inflinct Mute on target for 1 turn.", rarityEffect: [1.15, 1.20, 1.25, 1.30] },
    EQUILIBRIUM: { id: 216, description: "+$e Critical Chance on targets with Marked.", rarityEffect: [1.25, 1.30, 1.36, 1.42] },
    INSANITY_CATALYST: { id: 217, description: "Increases Critical Damage by $e in turn 1 and every 2 turns.", rarityEffect: [1.15, 1.20, 1.25, 1.30] },
    DUALITY: { id: 218, description: "Ultimate Skill heals the ally with the lowest HP by $e of total damage dealt.", rarityEffect: [1.08, 1.10, 1.12, 1.14] },
    DOOM_ROD: { id: 219, description: "Ultimate Skill has a $e chance to inflict Bound on target for 1 turn.", rarityEffect: [1.12, 1.15, 1.18, 1.21] },
    SINGULARITY_TOME: { id: 220, description: "Increases Splash Damage by $e.", rarityEffect: [1.05, 1.06, 1.08, 1.10] },

    // AGILITY
    BLASTER: { id: 300, description: "Critical hits heal self by $e of damage dealt.", rarityEffect: [1.07, 1.10, 1.13, 1.16] },
    BONE_BOW: { id: 301, description: "Heals self by $e of max HP when killing an enemy.", rarityEffect: [1.08, 1.10, 1.12, 1.14] },
    BOOMSTICK: { id: 302, description: "Increases splash damage (ignores primary target) by $e", rarityEffect: [1.05, 1.06, 1.08, 1.10] },
    WOLF_CLAWS: { id: 303, description: "$e chance to counter with Primary Skill once against attacker", rarityEffect: [1.24, 1.30, 1.36, 1.42] },
    CORKSCREW_KNUCKLE: { id: 304, description: "Primary Skill has a $e chance to inflinct Bleeding on target for 2 turns.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    SOUL_STABBER: { id: 305, description: "Primary Skill has a 60% chance to steal $e of target's current AP.", rarityEffect: [1.12, 1.15, 1.18, 1.21] },
    WHISPER_BLADE: { id: 306, description: "+$e Critical Damage on targets with DEF Down", rarityEffect: [1.12, 1.15, 1.18, 1.21] },
    STARFIRE_BALLISTA: { id: 307, description: "Primary Skill deals $e Agility as true damage to 2 adjacent targets.", rarityEffect: [1.08, 1.10, 1.12, 1.14] },
    BLACK_FEATHER_BOW: { id: 308, description: "Primary Skill has a $e chance to inflict Marked on target for 2 turns.", rarityEffect: [1.24, 1.30, 1.36, 1.42] },
    SHADOW_FANGS: { id: 309, description: "+$e damage on targets with Blind.", rarityEffect: [1.05, 1.06, 1.08, 1.10] },
    VORTEX_DANCER: { id: 310, description: "Critical hits have a $e chance to inflict AGI Down on the target for 1 turn.", rarityEffect: [1.40, 1.50, 1.60, 1.70] },
    RELICFANG_DAGGER: { id: 311, description: "Critical hits have a $e chance to reduce AP of the target by 20%.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    NEEDLE_POINT: { id: 312, description: "Critical hits have a $e chance to inflinct Marked on the target for 1 turn.", rarityEffect: [1.32, 1.40, 1.48, 1.56] },
    BRUTE_FORCE: { id: 313, description: "Primary Skill has a $e chance to inflict DEF Down on target for 2 turns.", rarityEffect: [1.24, 1.30, 1.36, 1.42] },
    CLAWTASTROPHE: { id: 314, description: "Ultimate Skill has a $e chance to grant self Crit Chance Up for 2 turns", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    STARFALL: { id: 315, description: "At the start of every 3rd turn, heals all allies for $e of own max HP.", rarityEffect: [1.04, 1.06, 1.08, 1.10] },
    TWILIGHT: { id: 316, description: "Critical hits have a $e chance to dispel 1 Buff from the target.", rarityEffect: [1.40, 1.50, 1.60, 1.70] },
    DICE_OF_DOOM: { id: 317, description: "Buffs (except Invincibility & Preservation) have a $e chance to extend their Duration by 1 round.", rarityEffect: [1.30, 1.36, 1.43, 1.50] },
    TUSK_FANG: { id: 318, description: "Ultimate Skill has a $e chance to grant the Caster ATK Up for 2 turns.", rarityEffect: [1.40, 1.50, 1.60, 1.70] },
}

// redundant
export const STATUS_EFFECT_NAME_MAP = {
    0: "attack_up",
    1: "defense_up",
    2: "critical_chance_up",
    3: "critical_damage_up",
    4: "accuracy_up",
    5: "resistance_up",
    6: "agility_up",
    7: "critical_resistance",
    8: "invincibility",
    9: "immunity",
    10: "recovery",
    11: "preservation",
    12: "shroud",
    13: "guard",
    14: "shield",
    15: "absorbing",
    16: "blessed",

    17: "attack_down",
    18: "defense_down",
    19: "critical_chance_down",
    20: "accuracy_down",
    21: "resistance_down",
    22: "agility_down",
    23: "blind",
    24: "marked",
    25: "sick",
    26: "cursed",
    27: "stunned",
    28: "sleep",
    29: "freeze",
    30: "petrified",
    31: "burn",
    32: "poison",
    33: "bleeding",
    34: "mute",
    35: "bound",
    36: "taunt",
    37: "confused",
    38: "cursed_flame",

    39: "hellfire",
    40: "hellfire_mode",
    41: "frozen_heart",
    42: "heating_up",
    43: "mjoellnir",
    44: "anubis_seal",
    45: "soulmate",
    46: "sphinx_curse",
    47: "styx",
    48: "burrow",
    49: "defense_drone",
    50: "divine_shield",
    51: "ferryman",
    52: "feral",
    53: "wildfire",
    54: "fury",
    55: "hivemind",
    56: "hot_saw",
    57: "loa",
    58: "the_moon",
    59: "the_star",
    60: "the_sun",
    61: "wind_up",
    62: "war_forge",
    63: "drumbeat",
    64: "foresight",
    65: "ap_resistance",
    66: "arachnid",
    67: "bloodrage",
    68: "bunny",
    69: "pain_fueled",
    70: "blood_transfusion",
    71: "soul_harvest",
    72: "buzz_meter",
    73: "biomass",
    74: "ignited_ego",
    75: "life_after_death",
    76: "sludge",
    77: "detonator",
    78: "courage",
    79: "smoke",
    80: "mana_shield",
    81: "echo",
    82: "ionize",
    83: "fracture",
    84: "irradiate",
    85: "rift_step",
    86: "blacklist",
    87: "rooted",
    88: "ash",
    89: "phoenix_feather",
    90: "luck",
    91: "soul_core",
    92: "tempered",
    93: "soaked",
    94: "spectral_shield",
    95: "wither",
    96: "backup_drone",
    97: "reflect",
    98: "momentum",
    99: "dawn",
    100: "zenith",
    101: "dusk",
    102: "tender",
    103: "sealed",
    104: "lifeblood",
    105: "ghost_crew",
    106: "terror",
    107: "feast",
    108: "pin",
    109: "puppet",
    110: "buzzkill",
    111: "plagued",
    112: "encore",
    113: "contaminated",
    114: "cruelty",
    115: "portal",
    116: "critical_condition",
    117: "hellforge",
    118: "spotlight",
    119: "emission",
    120: "flare",
    121: "hollowing",
    122: "miasma",
};

export const STATUS_EFFECTS = {
    //============================================================
    // POSITIVE STATUS EFFECTS
    //============================================================

    attack_up: {
        id: 0,
        name: "attack_up",
        effectType: "stat_multiplier",
        stat: "attack",
        value: 1.25
    },

    defense_up: {
        id: 1,
        name: "defense_up",
        effectType: "stat_multiplier",
        stat: "defense",
        value: 1.45
    },

    critical_chance_up: {
        id: 2,
        name: "critical_chance_up",
        effectType: "stat_multiplier",
        stat: "critical_chance",
        value: 1.20
    },

    critical_damage_up: {
        id: 3,
        name: "critical_damage_up",
        effectType: "stat_multiplier",
        stat: "critical_damage",
        value: 1.50
    },

    accuracy_up: {
        id: 4,
        name: "accuracy_up",
        effectType: "stat_multiplier",
        stat: "accuracy",
        value: 1.30
    },

    resistance_up: {
        id: 5,
        name: "resistance_up",
        effectType: "stat_multiplier",
        stat: "resistance",
        value: 1.35
    },

    agility_up: {
        id: 6,
        name: "agility_up",
        effectType: "stat_multiplier",
        stat: "agility",
        value: 1.30
    },

    critical_resistance: {
        id: 7,
        name: "critical_resistance",
        effectType: "stat_multiplier",
        stat: "critical_hit_chance_received",
        value: 0.75
    },

    invincibility: {
        id: 8,
        name: "invincibility",
        effectType: "damage_immunity"
    },

    immunity: {
        id: 9,
        name: "immunity",
        effectType: "debuff_immunity"
    },

    recovery: {
        id: 10,
        name: "recovery",
        effectType: "heal_over_time",
        value: 0.15,
        interval: "turn"
    },

    preservation: {
        id: 11,
        name: "preservation",
        effectType: "minimum_hp",
        value: 1
    },

    shroud: {
        id: 12,
        name: "shroud",
        effectType: "target_restriction",
        primary_targetable: false,
        affected_by_aoe: true
    },

    guard: {
        id: 13,
        name: "guard",
        effectType: "damage_share",
        value: 0.25
    },

    shield: {
        id: 14,
        name: "shield",
        effectType: "damage_absorption",
        stacks: true,
        removable: false
    },

    absorbing: {
        id: 15,
        name: "absorbing",
        effectType: "lifesteal",
        value: 0.15
    },

    blessed: {
        id: 16,
        name: "blessed",
        effectType: "healing_received_multiplier",
        value: 1.20
    },


    //============================================================
    // NEGATIVE STATUS EFFECTS
    //============================================================

    attack_down: {
        id: 17,
        name: "attack_down",
        effectType: "stat_multiplier",
        stat: "attack",
        value: 0.75
    },

    defense_down: {
        id: 18,
        name: "defense_down",
        effectType: "stat_multiplier",
        stat: "defense",
        value: 0.55
    },

    critical_chance_down: {
        id: 19,
        name: "critical_chance_down",
        effectType: "stat_multiplier",
        stat: "critical_chance",
        value: 0.80
    },

    accuracy_down: {
        id: 20,
        name: "accuracy_down",
        effectType: "stat_multiplier",
        stat: "accuracy",
        value: 0.60
    },

    resistance_down: {
        id: 21,
        name: "resistance_down",
        effectType: "stat_multiplier",
        stat: "resistance",
        value: 0.85
    },

    agility_down: {
        id: 22,
        name: "agility_down",
        effectType: "stat_multiplier",
        stat: "agility",
        value: 0.70
    },

    blind: {
        id: 23,
        name: "blind",
        effectType: "miss_chance",
        value: 0.30
    },

    marked: {
        id: 24,
        name: "marked",
        effectType: "damage_taken_multiplier",
        value: 1.25
    },

    sick: {
        id: 25,
        name: "sick",
        effectType: "healing_disabled"
    },

    cursed: {
        id: 26,
        name: "cursed",
        effectType: "buff_disabled"
    },

    stunned: {
        id: 27,
        name: "stunned",
        effectType: "action_disabled",
        duration: 1
    },

    sleep: {
        id: 28,
        name: "sleep",
        effectType: "ap_regeneration_multiplier",
        value: 0.50
    },

    freeze: {
        id: 29,
        name: "freeze",
        effectType: "cooldown_reduction_disabled"
    },

    petrified: {
        id: 30,
        name: "petrified",
        effectType: "guaranteed_critical",
        trigger: "next_hit_received",
        consume_on_trigger: true
    },

    burn: {
        id: 31,
        name: "burn",
        effectType: "damage_on_attack_received",
        stat: "target_max_hp",
        value: 0.03
    },

    poison: {
        id: 32,
        name: "poison",
        effectType: "damage_over_time",
        stat: "target_max_hp",
        value: 0.10,
        interval: "turn_start"
    },

    bleeding: {
        id: 33,
        name: "bleeding",
        effectType: "damage_over_time",
        stat: "caster_attack",
        value: 0.10,
        interval: "turn_start"
    },

    mute: {
        id: 34,
        name: "mute",
        effectType: "skill_restriction",
        allowed_skill: "basic_attack"
    },

    bound: {
        id: 35,
        name: "bound",
        effectType: "passive_disabled"
    },

    taunt: {
        id: 36,
        name: "taunt",
        effectType: "target_restriction",
        allowed_target: "caster",
        allowed_skill: "basic_attack"
    },

    confused: {
        id: 37,
        name: "confused",
        effectType: "primary_target_ignored"
    },

    cursed_flame: {
        id: 38,
        name: "cursed_flame",
        effectType: "healing_to_damage",
        value: 0.50
    },


    //============================================================
    // SPECIAL HERO STATUS EFFECTS
    //============================================================

    hellfire: {
        id: 39,
        name: "hellfire",
        effectType: "special",
        grants: "hellfire_mode",
        duration: 2,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    hellfire_mode: {
        id: 40,
        name: "hellfire_mode",
        effectType: "stat_multiplier",
        stats: {
            attack: 1.20,
            agility: 1.40
        },
        mitigatable: false,
        removable: false
    },

    frozen_heart: {
        id: 41,
        name: "frozen_heart",
        effectType: "revive_hp_bonus",
        value: 0.15,
        max_stacks: 5,
        mitigatable: false,
        removable: false
    },

    heating_up: {
        id: 42,
        name: "heating_up",
        effectType: "skill_scaling",
        base_damage: 0.60,
        per_stack: 0.20,
        burn_above_stacks: 3,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    mjoellnir: {
        id: 43,
        name: "mjoellnir",
        effectType: "delayed_damage",
        initial_damage: 1.20,
        return_damage: 0.80,
        stat: "attack",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    anubis_seal: {
        id: 44,
        name: "anubis_seal",
        effectType: "death_trigger_damage",
        value: 0.50,
        stat: "anubis_attack",
        target: "enemy_team",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    soulmate: {
        id: 45,
        name: "soulmate",
        effectType: "damage_to_heal",
        value: 0.05,
        stat: "damage_dealt",
        mitigatable: false,
        removable: false
    },

    sphinx_curse: {
        id: 46,
        name: "sphinx_curse",
        effectType: "target_marker",
        max_stacks: 1,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    styx: {
        id: 47,
        name: "styx",
        effectType: "max_hp_reduction",
        value: 0.08,
        max_stacks: 3,
        removed_when: "hades_dies",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    burrow: {
        id: 48,
        name: "burrow",
        effectType: "skill_enhancement",
        max_stacks: 1,
        mitigatable: false,
        removable: false
    },

    defense_drone: {
        id: 49,
        name: "defense_drone",
        effectType: "stat_multiplier",
        stat: "defense",
        per_stack: 0.03,
        max_stacks: 10,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    divine_shield: {
        id: 50,
        name: "divine_shield",
        effectType: "damage_resistance",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    ferryman: {
        id: 51,
        name: "ferryman",
        effectType: "skill_enhancement",
        target_skill: "cerberus",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    feral: {
        id: 52,
        name: "feral",
        effectType: "stat_multiplier",
        stats_per_stack: {
            damage: 0.05,
            agility: 0.05
        },
        max_stacks: 6,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    wildfire: {
        id: 53,
        name: "wildfire",
        effectType: "stat_multiplier",
        stats_per_stack: {
            damage: 0.05,
            critical_damage: 0.05
        },
        max_stacks: 20,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    fury: {
        id: 54,
        name: "fury",
        effectType: "stat_multiplier",
        stat: "critical_chance",
        per_stack: 0.05,
        max_stacks: 5,
        stacks: true,
        counterattack: true,
        consume_on_counterattack: true,
        mitigatable: false,
        removable: false
    },

    hivemind: {
        id: 55,
        name: "hivemind",
        effectType: "stat_multiplier",
        stat: "agility",
        per_stack: 0.05,
        max_stacks: 6,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    hot_saw: {
        id: 56,
        name: "hot_saw",
        effectType: "inflict_chance",
        target_effect: "burn",
        chance: 0.80,
        trigger: "primary_attack",
        mitigatable: false
    },

    loa: {
        id: 57,
        name: "loa",
        effectType: "stat_multiplier",
        stat: "resistance",
        per_stack: 0.10,
        max_stacks: 5,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    the_moon: {
        id: 58,
        name: "the_moon",
        effectType: "multi_effect",
        attack_effect: "blind",
        attack_duration: 1,
        shield_value: 0.60,
        shield_stat: "max_hp",
        shield_target: "lowest_hp_ally",
        mitigatable: false,
        removable: false
    },

    the_star: {
        id: 59,
        name: "the_star",
        effectType: "multi_effect",
        attack_effect: "mute",
        attack_duration: 1,
        discarded_effect: "ap_boost",
        discarded_value: 1.00,
        discarded_target: "random_ally",
        mitigatable: false,
        removable: false
    },

    the_sun: {
        id: 60,
        name: "the_sun",
        effectType: "multi_effect",
        attack_effect: "marked",
        attack_duration: 1,
        discarded_effect: "heal",
        discarded_value: 0.50,
        discarded_target: "weakest_ally",
        mitigatable: false,
        removable: false
    },

    wind_up: {
        id: 61,
        name: "wind_up",
        effectType: "stat_multiplier",
        stats_per_stack: {
            damage: 0.05,
            critical_damage: 0.05
        },
        max_stacks: 6,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    war_forge: {
        id: 62,
        name: "war_forge",
        effectType: "stat_multiplier",
        stats: {
            attack: 1.10,
            defense: 1.30
        },
        stacks_with: [
            "attack_up",
            "defense_up"
        ],
        mitigatable: false
    },

    drumbeat: {
        id: 63,
        name: "drumbeat",
        effectType: "stat_multiplier",
        stat: "agility",
        per_stack: 0.04,
        max_stacks: 4,
        stacks: true,
        mitigatable: false
    },

    foresight: {
        id: 64,
        name: "foresight",
        effectType: "damage_resistance",
        per_stack: 0.15,
        max_stacks: 4,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    ap_resistance: {
        id: 65,
        name: "ap_resistance",
        effectType: "ap_reduction_immunity"
    },

    arachnid: {
        id: 66,
        name: "arachnid",
        effectType: "skill_enhancement",
        max_stacks: 5,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    bloodrage: {
        id: 67,
        name: "bloodrage",
        effectType: "skill_enhancement",
        mitigatable: false,
        removable: false
    },

    bunny: {
        id: 68,
        name: "bunny",
        effectType: "stat_multiplier",
        stat: "agility",
        value: 1.08,
        affects_skills: true
    },

    pain_fueled: {
        id: 69,
        name: "pain_fueled",
        effectType: "skill_enhancement",
        max_stacks: 5,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    blood_transfusion: {
        id: 70,
        name: "blood_transfusion",
        effectType: "max_hp_multiplier",
        per_stack: 0.05,
        max_stacks: 4,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    soul_harvest: {
        id: 71,
        name: "soul_harvest",
        effectType: "stat_multiplier",
        stats_per_stack: {
            critical_chance: 0.05,
            agility: 0.03
        },
        max_stacks: 6,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    buzz_meter: {
        id: 72,
        name: "buzz_meter",
        effectType: "stat_multiplier",
        stat: "attack",
        per_stack: 0.04,
        max_stacks: 4,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    biomass: {
        id: 73,
        name: "biomass",
        effectType: "max_hp_multiplier",
        per_stack: 0.04,
        max_stacks: 5,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    ignited_ego: {
        id: 74,
        name: "ignited_ego",
        effectType: "skill_enhancement",
        stat: "max_hp",
        value: 1.25,
        mitigatable: false,
        removable: false
    },

    life_after_death: {
        id: 75,
        name: "life_after_death",
        effectType: "death_trigger",
        survive_hp: 0.05,
        shield: 0.30,
        shield_stat: "max_hp",
        dies_when_shield_breaks: true,
        dies_after_active_turn: true,
        mitigatable: false,
        removable: false
    },

    sludge: {
        id: 76,
        name: "sludge",
        effectType: "conditional_damage",
        condition: "burn_present",
        damage: 0.60,
        stat: "attack",
        dispels_self: true
    },

    detonator: {
        id: 77,
        name: "detonator",
        effectType: "skill_enhancement",
        target: "secondary_skills",
        exploding_stack_true_damage: true,
        max_stacks: 4,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    courage: {
        id: 78,
        name: "courage",
        effectType: "extra_turn_on_kill",
        mitigatable: false,
        removable: false
    },

    smoke: {
        id: 79,
        name: "smoke",
        effectType: "stat_multiplier",
        stat: "lifesteal",
        per_stack: 0.10,
        max_stacks: 3,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    mana_shield: {
        id: 80,
        name: "mana_shield",
        effectType: "damage_taken_multiplier",
        value: 0.70,
        mitigatable: false,
        removable: false
    },

    echo: {
        id: 81,
        name: "echo",
        effectType: "delayed_damage",
        value: 0.80,
        stat: "attack",
        trigger: "duration_end"
    },

    ionize: {
        id: 82,
        name: "ionize",
        effectType: "guaranteed_critical",
        duration: 1
    },

    fracture: {
        id: 83,
        name: "fracture",
        effectType: "skill_enhancement",
        target_skill: "ultimate",
        critical_chance_per_stack: 0.04,
        max_stacks: 4,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    irradiate: {
        id: 84,
        name: "irradiate",
        effectType: "damage_reflection",
        value: 0.20,
        damage_type: "true",
        ignores_shield: true
    },

    rift_step: {
        id: 85,
        name: "rift_step",
        effectType: "stat_multiplier",
        stat: "critical_chance",
        value: 1.20,
        mitigatable: false,
        removable: false
    },

    blacklist: {
        id: 86,
        name: "blacklist",
        effectType: "conditional_debuff",
        trigger: [
            "primary_attack",
            "ultimate"
        ],
        mitigatable: false,
        removable: false
    },

    rooted: {
        id: 87,
        name: "rooted",
        effectType: "ap_and_turn_restriction",
        extra_ap: false,
        extra_turn: false
    },

    ash: {
        id: 88,
        name: "ash",
        effectType: "death_skill_scaling",
        max_stacks: 9,
        stacks: true,
        removable: false
    },

    phoenix_feather: {
        id: 89,
        name: "phoenix_feather",
        effectType: "max_hp_multiplier",
        per_stack: 0.05,
        max_stacks: 9,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    luck: {
        id: 90,
        name: "luck",
        effectType: "stat_multiplier",
        stat: "critical_chance",
        per_stack: 0.10,
        max_stacks: 3,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    soul_core: {
        id: 91,
        name: "soul_core",
        effectType: "damage_resistance",
        value: 0.50,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    tempered: {
        id: 92,
        name: "tempered",
        effectType: "aoe_damage_reduction",
        value: 0.30
    },

    soaked: {
        id: 93,
        name: "soaked",
        effectType: "inflict_chance",
        target_effect: "poison",
        chance: 1.00,
        trigger: "primary_attack"
    },

    spectral_shield: {
        id: 94,
        name: "spectral_shield",
        effectType: "damage_taken_multiplier",
        reduction_per_remaining_turn: 0.20,
        mitigatable: false,
        removable: false
    },

    wither: {
        id: 95,
        name: "wither",
        effectType: "stat_multiplier",
        stats_per_stack: {
            attack: 0.97,
            defense: 0.97,
            agility: 0.97
        },
        stacks: true,
        removed_when: "high_cleric_aureus_dies"
    },

    backup_drone: {
        id: 96,
        name: "backup_drone",
        effectType: "conditional_heal",
        trigger: "hp_below_50_percent",
        heal_per_stack: 0.10,
        max_stacks: 3,
        stacks: true
    },

    reflect: {
        id: 97,
        name: "reflect",
        effectType: "damage_reflection",
        value: 0.50
    },

    momentum: {
        id: 98,
        name: "momentum",
        effectType: "stat_multiplier",
        stat: "defense",
        per_stack: 0.05,
        max_stacks: 5,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    dawn: {
        id: 99,
        name: "dawn",
        effectType: "max_hp_multiplier",
        per_stack: 0.10,
        max_stacks: 1,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    zenith: {
        id: 100,
        name: "zenith",
        effectType: "stat_multiplier",
        stat: "agility",
        per_stack: 0.10,
        max_stacks: 1,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    dusk: {
        id: 101,
        name: "dusk",
        effectType: "stat_multiplier",
        stat: "attack",
        per_stack: 0.10,
        max_stacks: 1,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    tender: {
        id: 102,
        name: "tender",
        effectType: "stat_multiplier",
        stat: "defense",
        per_stack: 0.96,
        max_stacks: 3,
        stacks: true,
        mitigatable: false
    },

    sealed: {
        id: 103,
        name: "sealed",
        effectType: "buff_trigger_damage",
        value: 0.40,
        stat: "mary_defense",
        trigger: "buff_received",
        remove_after_trigger: true,
        mitigatable: false
    },

    lifeblood: {
        id: 104,
        name: "lifeblood",
        effectType: "stat_multiplier",
        stat: "agility",
        per_stack: 0.96,
        max_stacks: 3,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    ghost_crew: {
        id: 105,
        name: "ghost_crew",
        effectType: "aoe_damage_reduction",
        reduction_per_stack: 0.08,
        max_stacks: 4,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    terror: {
        id: 106,
        name: "terror",
        effectType: "buff_duration_reduction",
        value: 1,
        interval: "turn_start",
        excludes: [
            "invincibility",
            "preservation"
        ],
        mitigatable: false,
        removable: false
    },

    feast: {
        id: 107,
        name: "feast",
        effectType: "damage_taken_increase",
        target: "countess_mortana_enemies",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    pin: {
        id: 108,
        name: "pin",
        effectType: "stat_multiplier",
        stat: "defense",
        per_stack: 0.96,
        max_stacks: 4,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    puppet: {
        id: 109,
        name: "puppet",
        effectType: "stat_multiplier",
        stat: "resistance",
        value: 0.80,
        mitigatable: false,
        removable: false
    },

    buzzkill: {
        id: 110,
        name: "buzzkill",
        effectType: "skill_enhancement",
        agility: 0.10,
        ap_damage: true,
        skills: [
            "primary",
            "secondary"
        ],
        removable: false
    },

    plagued: {
        id: 111,
        name: "plagued",
        effectType: "stat_multiplier",
        stat: "accuracy",
        per_stack: 0.95,
        max_stacks: 3,
        stacks: true,
        trigger_at_max_stacks: {
            at_end_of_turn: true,
            heal_caster_team: 0.05,
            heal_stat: "max_hp",
            remove_all_stacks: true
        },
        mitigatable: false,
        removable: false
    },

    encore: {
        id: 112,
        name: "encore",
        effectType: "damage_multiplier",
        value: 1.25,
        mitigatable: false,
        removable: false
    },

    contaminated: {
        id: 113,
        name: "contaminated",
        effectType: "damage_trigger",
        trigger: "damage_received",
        stacks_removed_per_trigger: 1,
        damage: 0.05,
        damage_type: "ap",
        stat: "current_ap",
        max_stacks: 3,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    cruelty: {
        id: 114,
        name: "cruelty",
        effectType: "damage_taken_multiplier",
        per_stack: 1.05,
        max_stacks: 3,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    portal: {
        id: 115,
        name: "portal",
        effectType: "stat_multiplier",
        stat: "attack",
        per_stack: 0.05,
        max_stacks: 5,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    critical_condition: {
        id: 116,
        name: "critical_condition",
        effectType: "dot_damage_taken_multiplier",
        value: 1.25,
        mitigatable: false,
        removable: false
    },

    hellforge: {
        id: 117,
        name: "hellforge",
        effectType: "stat_multiplier",
        stat: "defense",
        per_stack: 0.05,
        max_stacks: 5,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    spotlight: {
        id: 118,
        name: "spotlight",
        effectType: "stat_multiplier",
        stat: "agility",
        per_stack: 0.95,
        stacks: true,
        mitigatable: false,
        removable: false
    },

    emission: {
        id: 119,
        name: "emission",
        effectType: "stack_trigger",
        summon_at: 5,
        summon: "lunar_seeker",
        united_ultimate_at: 10,
        united_ultimate: "eclipse",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    flare: {
        id: 120,
        name: "flare",
        effectType: "stack_trigger",
        summon_at: 5,
        summon: "sun_seeker",
        united_ultimate_at: 10,
        united_ultimate: "eclipse",
        stacks: true,
        mitigatable: false,
        removable: false
    },

    hollowing: {
        id: 121,
        name: "hollowing",
        effectType: "buff_trigger_damage",
        value: 0.15,
        stat: "own_defense",
        trigger: "buff_received"
    },

    miasma: {
        id: 122,
        name: "miasma",
        effectType: "stack_trigger_damage",
        trigger_stacks: 5,
        damage: 0.20,
        stat: "own_max_hp",
        trigger: "round_end",
        stacks: true,
        mitigatable: false,
        removable: false
    }

};