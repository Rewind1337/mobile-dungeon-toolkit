import { ATTRIBUTE, RARITY, ELEMENT, ROLE, PRIMARY_STAT, STATUS_EFFECTS } from "./enums.jsx"
import { heroSprites, elementSprites } from "./db_sprites.jsx"

let BASE_HEROES = []

function add_hero(name, variant, mainAttribute, baseStats, rarity, isStarred, element, role, statusEffects, skills, talents) {
    let id = BASE_HEROES.length
    let normalizedName = name.toLowerCase().replace(/[^a-z]/g, '_') + (variant !== null ? "_" + variant : "");
    BASE_HEROES.push({
        id: id,
        name: name,
        variant: variant,
        mainAttribute: mainAttribute,
        baseStats: baseStats,
        rarity: rarity,
        isStarred: isStarred,
        element: element,
        role: role,
        statusEffects: statusEffects,
        heroSrc: (heroSprites[normalizedName] !== undefined ? heroSprites[normalizedName] : heroSprites["null"]),
        elementSrc: elementSprites[element],
        skills: skills,
        talents: talents,
    })
}

function skill(name, level, cooldown, description, effect) {
    return { name: name, level: level, cooldown: cooldown, description: description, effect: effect }
}

function talent(name, effect) {
    return { name: name, effect: effect, active: true }
}

export function init_hero_db() {
    // LEGENDARY
    // STRENGTH

    add_hero("Thor", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.LIGHT, ROLE.OFFENSIVE, [
        STATUS_EFFECTS.mjoellnir, STATUS_EFFECTS.invincibility, STATUS_EFFECTS.recovery, STATUS_EFFECTS.critical_damage_up, STATUS_EFFECTS.attack_down, STATUS_EFFECTS.defense_down
    ], [
        skill("Mjoellnir", 1, 0, "description", [{ type: "single_hit", targets: 1, damage: 1.20, scaling: PRIMARY_STAT.ATTACK, applies: [{ status: STATUS_EFFECTS.mjoellnir, duration: -1 }] }]),
        skill("Odin's Blessing", 1, 4, "description", [{ type: "self_buff", applies: [{ status: STATUS_EFFECTS.invincibility, duration: 1 }, { status: STATUS_EFFECTS.recovery, duration: 2 }, { status: STATUS_EFFECTS.critical_damage_up, duration: 2 }] }]),
        skill("Ragnarök", 1, 5, "description", [{ type: "multi_hit", targets: 5, hits: 3, damage: 0.6, scaling: PRIMARY_STAT.ATTACK, applies: [{ status: STATUS_EFFECTS.attack_down, duration: 2 }, { status: STATUS_EFFECTS.defense_down, duration: 2 }] }])
    ],
        {
            11: talent("Attribute Buff", [{ "attack": 1.05, "critical_chance": 1.05 }]),
            12: talent("Attribute Buff", [{ "health": 1.05, "defense": 1.05 }]),
            21: talent("Warrior's Spirit", [{ "buff_on_self_critical_damage": 1.10 }]),
            22: talent("Full Power", [{ "healing_received": 1.20 }]),
            30: talent("Overhealing", [{ "overhealing_shield": 1.20 }]),
            41: talent("Attribute Buff", [{ "attack": 1.10, "critical_chance": 1.05, "critical_damage": 1.05 }]),
            42: talent("Attribute Buff", [{ "health": 1.10, "defense": 1.05, "resistance": 1.05 }]),
            51: talent("Precision", [{ "dead_enemies_crit_chance": 1.04 }]),
            52: talent("Recharger", [{ "killing_heals_maxhp": 1.12 }]),
            60: talent("Countdown", [{ "true_damage_every_3": 1.25 }]),
        })

    add_hero("Arachnotaur", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Prellbog", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Undead Dragon", null, ATTRIBUTE.STRENGTH, { health: 191, attack: 66, defense: 53, agility: 54 }, RARITY.LEGENDARY, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Valkyre", null, ATTRIBUTE.STRENGTH, { health: 197, attack: 63, defense: 54, agility: 54 }, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Black Skull Overlord", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Cybork", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Goblin Shredder", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Heimdall", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Hephaestus", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, true, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Krampus", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Lucifer", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Murdermachine", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.LIGHT, ROLE.DEFENSIVE)
    add_hero("Anubis", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Gravitator", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Buster", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Shakes", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, true, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Drillbert", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Armadrax", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Phoenix", null, ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.SUPPORT)

    // DEXTERITY
    add_hero("Mercy", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, true, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Jack-o'-Lantern", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Headless Horseman", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Wendigo", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Athena", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Bastet", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, true, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Davy Jane", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Hades", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Loki", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Muzen", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, true, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Shroom Empress", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Sleipnir", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Void Assassin", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, true, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Thorne", null, ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.OFFENSIVE)

    // INTELLIGENCE
    add_hero("Shroom Emperor", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Dracula", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Monk", null, ATTRIBUTE.INTELLIGENCE, { health: 197, attack: 61, defense: 59, agility: 50 }, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Siren", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Lilith", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, true, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Murdering Mass", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Medusa", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Aphrodite", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Cthulhu", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, true, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Isolde", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.SHADOW, ROLE.SUPPORT)
    add_hero("Odin", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.SHADOW, ROLE.SUPPORT)
    add_hero("Sphinx", null, ATTRIBUTE.INTELLIGENCE, { health: 199, attack: 68, defense: 55, agility: 56 }, RARITY.LEGENDARY, false, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Professor", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Cornelius Prime", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, true, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Pele", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Fidget", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, true, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Beholder", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Jackbot", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, false, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Emperor Fedget", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, true, ELEMENT.SHADOW, ROLE.CONTROL)

    // EPIC
    // STRENGTH
    add_hero("Dr. Pestilence", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Yulamb", null, ATTRIBUTE.STRENGTH, { health: 179, attack: 63, defense: 48, agility: 51 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Cornelius", null, ATTRIBUTE.STRENGTH, { health: 186, attack: 60, defense: 53, agility: 54 }, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Orkdozer", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Orkopter", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Construct", null, ATTRIBUTE.STRENGTH, { health: 192, attack: 61, defense: 53, agility: 52 }, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.DEFENSIVE)
    add_hero("Monika", null, ATTRIBUTE.STRENGTH, { health: 191, attack: 57, defense: 55, agility: 46 }, RARITY.EPIC, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Werewolf", null, ATTRIBUTE.STRENGTH, { health: 167, attack: 66, defense: 45, agility: 55 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Bandit Captain", null, ATTRIBUTE.STRENGTH, { health: 188, attack: 61, defense: 51, agility: 47 }, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Golem", null, ATTRIBUTE.STRENGTH, { health: 207, attack: 57, defense: 59, agility: 38 }, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Scourge", null, ATTRIBUTE.STRENGTH, { health: 167, attack: 65, defense: 45, agility: 55 }, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Ragnor", null, ATTRIBUTE.STRENGTH, { health: 174, attack: 67, defense: 46, agility: 51 }, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Frankenstein", null, ATTRIBUTE.STRENGTH, { health: 217, attack: 55, defense: 61, agility: 42 }, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.DEFENSIVE)
    add_hero("Black Skull Warrior", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Jotunn", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("King Crab", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Neanderthal", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Orca", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Rudolph", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, true, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("War Bard", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Buzzfreak", null, ATTRIBUTE.STRENGTH, { health: 190, attack: 60, defense: 55, agility: 51 }, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.DEFENSIVE)
    add_hero("Woolinator", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Drorc", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Rift Protector", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Woolinator", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Ramgor", null, ATTRIBUTE.STRENGTH, null, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.DEFENSIVE) // role unsure

    // DEXTERITY
    add_hero("Hermes", null, ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Drone", null, ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Predator", null, ATTRIBUTE.DEXTERITY, { health: 167, attack: 64, defense: 45, agility: 56 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Assassin", null, ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Jack The Ripper", null, ATTRIBUTE.DEXTERITY, { health: 182, attack: 66, defense: 53, agility: 50 }, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Robyn", null, ATTRIBUTE.DEXTERITY, { health: 167, attack: 64, defense: 47, agility: 54 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Badgerer", null, ATTRIBUTE.DEXTERITY, { health: 171, attack: 63, defense: 46, agility: 55 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Cyntrix", null, ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, true, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Desert Ranger", null, ATTRIBUTE.DEXTERITY, { health: 174, attack: 64, defense: 51, agility: 56 }, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Gnarler", null, ATTRIBUTE.DEXTERITY, { health: 207, attack: 57, defense: 57, agility: 40 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Mirage", null, ATTRIBUTE.DEXTERITY, { health: 171, attack: 66, defense: 46, agility: 53 }, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Axolotty", null, ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.OFFENSIVE)

    // INTELLIGENCE
    add_hero("Candy Elemental", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Oil Elemental", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Joanne", null, ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 65, defense: 53, agility: 60 }, RARITY.EPIC, true, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Black Skull Mage", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Margrethe", null, ATTRIBUTE.INTELLIGENCE, { health: 190, attack: 58, defense: 55, agility: 52 }, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Banshee", null, ATTRIBUTE.INTELLIGENCE, { health: 180, attack: 54, defense: 50, agility: 56 }, RARITY.EPIC, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Taurus", null, ATTRIBUTE.INTELLIGENCE, { health: 203, attack: 52, defense: 58, agility: 44 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Lotte", null, ATTRIBUTE.INTELLIGENCE, { health: 174, attack: 62, defense: 52, agility: 56 }, RARITY.EPIC, true, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Gondolf", null, ATTRIBUTE.INTELLIGENCE, { health: 186, attack: 58, defense: 56, agility: 46 }, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Alien", null, ATTRIBUTE.INTELLIGENCE, { health: 170, attack: 62, defense: 45, agility: 57 }, RARITY.EPIC, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Legba", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Unicorn", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, true, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Alice", null, ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 68, defense: 48, agility: 55 }, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Ice Worm", null, ATTRIBUTE.INTELLIGENCE, { health: 185, attack: 62, defense: 50, agility: 48 }, RARITY.EPIC, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Nerissa", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Cleo", null, ATTRIBUTE.INTELLIGENCE, { health: 167, attack: 64, defense: 50, agility: 58 }, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Djinn", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Witch", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Sylvanna", null, ATTRIBUTE.INTELLIGENCE, { health: 194, attack: 56, defense: 55, agility: 46 }, RARITY.EPIC, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Yaotl", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Catalina", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Aqualon", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Atomic Seagull", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Doctress", null, ATTRIBUTE.INTELLIGENCE, { health: 190, attack: 52, defense: 55, agility: 51 }, RARITY.EPIC, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Bonnie Bullet", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)

    // RARE
    // STRENGTH
    add_hero("Bag Head", null, ATTRIBUTE.STRENGTH, { health: 185, attack: 53, defense: 54, agility: 45 }, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Circus Boxer", null, ATTRIBUTE.STRENGTH, { health: 173, attack: 61, defense: 46, agility: 49 }, RARITY.RARE, false, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Skeleton Warrior", null, ATTRIBUTE.STRENGTH, { health: 184, attack: 53, defense: 54, agility: 38 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Zombie Grunt", null, ATTRIBUTE.STRENGTH, { health: 204, attack: 52, defense: 58, agility: 37 }, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Wolf", null, ATTRIBUTE.STRENGTH, { health: 161, attack: 63, defense: 42, agility: 48 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Cursed Pirate", null, ATTRIBUTE.STRENGTH, { health: 170, attack: 57, defense: 49, agility: 44 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Grilled Chicken", null, ATTRIBUTE.STRENGTH, { health: 160, attack: 57, defense: 47, agility: 49 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Crook", null, ATTRIBUTE.STRENGTH, { health: 169, attack: 61, defense: 44, agility: 46 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Grave Digger", null, ATTRIBUTE.STRENGTH, { health: 155, attack: 61, defense: 41, agility: 52 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Mummy", null, ATTRIBUTE.STRENGTH, { health: 178, attack: 51, defense: 51, agility: 45 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Orkitect", null, ATTRIBUTE.STRENGTH, { health: 161, attack: 58, defense: 42, agility: 51 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Shield-Maiden", null, ATTRIBUTE.STRENGTH, null, RARITY.RARE, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Mole Tamer", null, ATTRIBUTE.STRENGTH, null, RARITY.RARE, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Earthworm", null, ATTRIBUTE.STRENGTH, null, RARITY.RARE, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Claw Machine", null, ATTRIBUTE.STRENGTH, null, RARITY.RARE, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Hermit Crab", null, ATTRIBUTE.STRENGTH, null, RARITY.RARE, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Hermit Crab", "green", ATTRIBUTE.STRENGTH, null, RARITY.RARE, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Hermit Crab", "red", ATTRIBUTE.STRENGTH, null, RARITY.RARE, false, ELEMENT.FIRE, ROLE.DEFENSIVE)

    // INTELLIGENCE
    add_hero("Cursed Goat", null, ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 61, defense: 44, agility: 53 }, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Succubus", null, ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 59, defense: 49, agility: 50 }, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.SUPPORT)
    add_hero("Voodoo Doll", null, ATTRIBUTE.INTELLIGENCE, { health: 170, attack: 58, defense: 45, agility: 53 }, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Extraterrestrial", null, ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 55, defense: 49, agility: 43 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Lab Rat", null, ATTRIBUTE.INTELLIGENCE, { health: 174, attack: 49, defense: 51, agility: 48 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Imp", null, ATTRIBUTE.INTELLIGENCE, { health: 155, attack: 58, defense: 41, agility: 55 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Soul", null, ATTRIBUTE.INTELLIGENCE, { health: 176, attack: 58, defense: 49, agility: 48 }, RARITY.RARE, false, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Muncher", null, ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 55, defense: 49, agility: 43 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Infected Mushroom", null, ATTRIBUTE.INTELLIGENCE, { health: 155, attack: 59, defense: 41, agility: 54 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Pumpkin Man", null, ATTRIBUTE.INTELLIGENCE, { health: 166, attack: 53, defense: 49, agility: 49 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Brainiac", null, ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 59, defense: 51, agility: 48 }, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Dracula's Brides", null, ATTRIBUTE.INTELLIGENCE, { health: 167, attack: 50, defense: 47, agility: 53 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Forest Terror", null, ATTRIBUTE.INTELLIGENCE, { health: 183, attack: 53, defense: 50, agility: 43 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Fire Elemental", null, ATTRIBUTE.INTELLIGENCE, { health: 171, attack: 56, defense: 50, agility: 43 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Jolly", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.RARE, false, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Particle Reaver", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.RARE, false, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Cooklin", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.RARE, false, ELEMENT.FIRE, ROLE.OFFENSIVE)

    // DEXTERITY
    add_hero("Killer Bunny", null, ATTRIBUTE.DEXTERITY, { health: 155, attack: 61, defense: 41, agility: 52 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Naga", null, ATTRIBUTE.DEXTERITY, { health: 169, attack: 58, defense: 46, agility: 46 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Beaver", null, ATTRIBUTE.DEXTERITY, { health: 185, attack: 50, defense: 55, agility: 40 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Raptor", null, ATTRIBUTE.DEXTERITY, { health: 157, attack: 62, defense: 41, agility: 51 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Watcher", null, ATTRIBUTE.DEXTERITY, { health: 162, attack: 56, defense: 45, agility: 50 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Freezer Goat", null, ATTRIBUTE.DEXTERITY, { health: 174, attack: 53, defense: 49, agility: 47 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Frog Prince", null, ATTRIBUTE.DEXTERITY, { health: 181, attack: 49, defense: 55, agility: 42 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Mimic Toilet", null, ATTRIBUTE.DEXTERITY, { health: 157, attack: 59, defense: 41, agility: 53 }, RARITY.RARE, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Arachne", null, ATTRIBUTE.DEXTERITY, { health: 167, attack: 58, defense: 45, agility: 48 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Harpy", null, ATTRIBUTE.DEXTERITY, { health: 159, attack: 61, defense: 42, agility: 50 }, RARITY.RARE, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Battle Bot", null, ATTRIBUTE.DEXTERITY, { health: 167, attack: 60, defense: 44, agility: 47 }, RARITY.RARE, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Nutcracker", null, ATTRIBUTE.DEXTERITY, null, RARITY.RARE, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Torture Dummy", null, ATTRIBUTE.DEXTERITY, null, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Man Bat", null, ATTRIBUTE.DEXTERITY, null, RARITY.RARE, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Turbo Hare", null, ATTRIBUTE.DEXTERITY, null, RARITY.RARE, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Centaur", null, ATTRIBUTE.DEXTERITY, null, RARITY.RARE, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Light Fly", null, ATTRIBUTE.DEXTERITY, null, RARITY.RARE, false, ELEMENT.LIGHT, ROLE.SUPPORT)

    // UNCOMMON
    // STRENGTH
    add_hero("Ghoul", null, ATTRIBUTE.STRENGTH, { health: 155, attack: 58, defense: 43, agility: 45 }, RARITY.UNCOMMON, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Butt with Ears", null, ATTRIBUTE.STRENGTH, { health: 156, attack: 52, defense: 44, agility: 41 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Scarab", null, ATTRIBUTE.STRENGTH, { health: 173, attack: 47, defense: 50, agility: 37 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Scarab", "green", ATTRIBUTE.STRENGTH, { health: 173, attack: 47, defense: 50, agility: 37 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Scarab", "red", ATTRIBUTE.STRENGTH, { health: 173, attack: 47, defense: 50, agility: 37 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Skeleton", null, ATTRIBUTE.STRENGTH, { health: 160, attack: 54, defense: 43, agility: 41 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Skeleton", "blue", ATTRIBUTE.STRENGTH, { health: 160, attack: 54, defense: 43, agility: 41 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Skeleton", "red", ATTRIBUTE.STRENGTH, { health: 160, attack: 54, defense: 43, agility: 41 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Chicklet", null, ATTRIBUTE.STRENGTH, { health: 154, attack: 51, defense: 42, agility: 46 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Scorpion", null, ATTRIBUTE.STRENGTH, { health: 145, attack: 55, defense: 37, agility: 49 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Scorpion", "blue", ATTRIBUTE.STRENGTH, { health: 145, attack: 55, defense: 37, agility: 49 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Zombie", null, ATTRIBUTE.STRENGTH, { health: 176, attack: 49, defense: 50, agility: 35 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Gingerbread Boy", null, ATTRIBUTE.STRENGTH, { health: 148, attack: 56, defense: 41, agility: 48 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Crab", null, ATTRIBUTE.STRENGTH, null, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Crab", "green", ATTRIBUTE.STRENGTH, null, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Block Worker", null, ATTRIBUTE.STRENGTH, null, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Mallorc", null, ATTRIBUTE.STRENGTH, null, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Magma Blobby", null, ATTRIBUTE.STRENGTH, null, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.OFFENSIVE)

    // INTELLIGENCE
    add_hero("Lab Ape", null, ATTRIBUTE.INTELLIGENCE, { health: 161, attack: 55, defense: 43, agility: 47 }, RARITY.UNCOMMON, false, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Slime", null, ATTRIBUTE.INTELLIGENCE, { health: 150, attack: 51, defense: 46, agility: 43 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Slime", "red", ATTRIBUTE.INTELLIGENCE, { health: 150, attack: 51, defense: 46, agility: 43 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Slime", "green", ATTRIBUTE.INTELLIGENCE, { health: 150, attack: 51, defense: 46, agility: 43 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Ghost", null, ATTRIBUTE.INTELLIGENCE, { health: 169, attack: 49, defense: 49, agility: 38 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Ghost", "red", ATTRIBUTE.INTELLIGENCE, { health: 169, attack: 49, defense: 49, agility: 38 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Ghost", "green", ATTRIBUTE.INTELLIGENCE, { health: 169, attack: 49, defense: 49, agility: 38 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Sheep", null, ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 49, defense: 49, agility: 39 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Sheep", "brown", ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 49, defense: 49, agility: 39 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Sheep", "black", ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 49, defense: 49, agility: 39 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Snake", null, ATTRIBUTE.INTELLIGENCE, { health: 142, attack: 55, defense: 37, agility: 51 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Snake", "striped", ATTRIBUTE.INTELLIGENCE, { health: 142, attack: 55, defense: 37, agility: 51 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Snake", "green", ATTRIBUTE.INTELLIGENCE, { health: 142, attack: 55, defense: 37, agility: 51 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Cockatrice", null, ATTRIBUTE.INTELLIGENCE, { health: 150, attack: 52, defense: 41, agility: 47 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Cockatrice", "blue", ATTRIBUTE.INTELLIGENCE, { health: 150, attack: 52, defense: 41, agility: 47 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Irradieel", null, ATTRIBUTE.INTELLIGENCE, null, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Dummy", null, ATTRIBUTE.STRENGTH, null, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.CONTROL)

    // DEXTERITY
    add_hero("Seagull", null, ATTRIBUTE.DEXTERITY, { health: 152, attack: 57, defense: 44, agility: 46 }, RARITY.UNCOMMON, false, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Cannon Scavenger", null, ATTRIBUTE.DEXTERITY, { health: 152, attack: 58, defense: 44, agility: 39 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Rotten Kitty", null, ATTRIBUTE.DEXTERITY, { health: 152, attack: 57, defense: 40, agility: 50 }, RARITY.UNCOMMON, false, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Gargoyle", null, ATTRIBUTE.DEXTERITY, { health: 157, attack: 53, defense: 43, agility: 43 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Gargoyle", "green", ATTRIBUTE.DEXTERITY, { health: 157, attack: 53, defense: 43, agility: 43 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Gargoyle", "red", ATTRIBUTE.DEXTERITY, { health: 157, attack: 53, defense: 43, agility: 43 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Land Diver", null, ATTRIBUTE.DEXTERITY, { health: 150, attack: 50, defense: 41, agility: 48 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Rat", null, ATTRIBUTE.DEXTERITY, { health: 152, attack: 54, defense: 41, agility: 45 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Rat", "red", ATTRIBUTE.DEXTERITY, { health: 152, attack: 54, defense: 41, agility: 45 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Rat", "black", ATTRIBUTE.DEXTERITY, { health: 152, attack: 54, defense: 41, agility: 45 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Glompf", null, ATTRIBUTE.DEXTERITY, { health: 142, attack: 57, defense: 37, agility: 48 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Glompf", "red", ATTRIBUTE.DEXTERITY, { health: 142, attack: 57, defense: 37, agility: 48 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Glompf", "blue", ATTRIBUTE.DEXTERITY, { health: 142, attack: 57, defense: 37, agility: 48 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Bat", null, ATTRIBUTE.DEXTERITY, { health: 161, attack: 51, defense: 46, agility: 40 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Vulture", null, ATTRIBUTE.DEXTERITY, { health: 157, attack: 51, defense: 48, agility: 40 }, RARITY.UNCOMMON, false, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Vulture", "blue", ATTRIBUTE.DEXTERITY, { health: 157, attack: 51, defense: 48, agility: 40 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Vulture", "brown", ATTRIBUTE.DEXTERITY, { health: 157, attack: 51, defense: 48, agility: 40 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Seagull", "mean", ATTRIBUTE.DEXTERITY, { health: 152, attack: 57, defense: 44, agility: 46 }, RARITY.UNCOMMON, false, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Snowman", null, ATTRIBUTE.DEXTERITY, { health: 150, attack: 53, defense: 45, agility: 43 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Tentacle", null, ATTRIBUTE.DEXTERITY, { health: 142, attack: 54, defense: 43, agility: 45 }, RARITY.UNCOMMON, false, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Mosquito", null, ATTRIBUTE.DEXTERITY, { health: 146, attack: 55, defense: 41, agility: 46 }, RARITY.UNCOMMON, false, ELEMENT.NATURE, ROLE.CONTROL)

    return BASE_HEROES
}