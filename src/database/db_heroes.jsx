import { ATTRIBUTE, RARITY, ELEMENT, ROLE } from "./enums"
import { heroSprites, elementSprites } from "./db_sprites"

let BASE_HEROES = []

function add_hero(name, mainAttribute, baseStats, rarity, element, role) {
    let id = BASE_HEROES.length
    let normalizedName = name.toLowerCase().replace(/[^a-z]/g, '_');
    BASE_HEROES.push({
        id: id, name: name, mainAttribute: mainAttribute, baseStats: baseStats, rarity: rarity, element: element, role: role,
        heroSrc: (heroSprites[normalizedName] !== undefined ? heroSprites[normalizedName] : heroSprites["null"]),
        elementSrc: elementSprites[element]
    })
}

export function init_hero_db() {
    // LEGENDARY
    // STRENGTH
    add_hero("Thor", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Arachnotaur", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Prellbog", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Undead Dragon", ATTRIBUTE.STRENGTH, { health: 191, attack: 66, defense: 53, agility: 54 }, RARITY.LEGENDARY, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Valkyre", ATTRIBUTE.STRENGTH, { health: 197, attack: 63, defense: 54, agility: 54 }, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Black Skull Overlord", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Cybork", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Goblin Shredder", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Heimdall", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Hephaestus", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Krampus", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Lucifer", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Murdermachine", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.DEFENSIVE)
    add_hero("Anubis", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.SHADOW, ROLE.OFFENSIVE)

    add_hero("Gravitator", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Buster", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Shakes", ATTRIBUTE.STRENGTH, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.OFFENSIVE)

    // AGILITY
    add_hero("Mercy", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Jack-o'-Lantern", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Headless Horseman", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Wendigo", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Athena", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Bastet", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Davy Jane", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Hades", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Loki", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Muzen", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Shroom Empress", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Sleipnir", ATTRIBUTE.DEXTERITY, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.DEFENSIVE)

    // INTELLIGENCE
    add_hero("Shroom Emperor", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Dracula", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Monk", ATTRIBUTE.INTELLIGENCE, { health: 197, attack: 61, defense: 59, agility: 50 }, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Siren", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Lilith", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Murdering Mass", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Medusa", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Aphrodite", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Cthulhu", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Isolde", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.SHADOW, ROLE.SUPPORT)
    add_hero("Odin", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.SHADOW, ROLE.SUPPORT)
    add_hero("Sphinx", ATTRIBUTE.INTELLIGENCE, { health: 199, attack: 68, defense: 55, agility: 56 }, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.CONTROL)

    add_hero("Professor", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Cornelius Prime", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Pele", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Fidget", ATTRIBUTE.INTELLIGENCE, null, RARITY.LEGENDARY, ELEMENT.LIGHT, ROLE.SUPPORT)

    // EPIC
    // STRENGTH
    add_hero("Dr. Pestilence", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Yulamb", ATTRIBUTE.STRENGTH, { health: 179, attack: 63, defense: 48, agility: 51 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Cornelius", ATTRIBUTE.STRENGTH, { health: 186, attack: 60, defense: 53, agility: 54 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Orkdozer", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Orkopter", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Construct", ATTRIBUTE.STRENGTH, { health: 192, attack: 61, defense: 53, agility: 52 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.DEFENSIVE)
    add_hero("Monika", ATTRIBUTE.STRENGTH, { health: 191, attack: 57, defense: 55, agility: 46 }, RARITY.EPIC, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Werewolf", ATTRIBUTE.STRENGTH, { health: 167, attack: 66, defense: 45, agility: 55 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Bandit Captain", ATTRIBUTE.STRENGTH, { health: 188, attack: 61, defense: 51, agility: 47 }, RARITY.EPIC, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Golem", ATTRIBUTE.STRENGTH, { health: 207, attack: 57, defense: 59, agility: 38 }, RARITY.EPIC, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Scourge", ATTRIBUTE.STRENGTH, { health: 167, attack: 65, defense: 45, agility: 55 }, RARITY.EPIC, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Ragnor", ATTRIBUTE.STRENGTH, { health: 174, attack: 67, defense: 46, agility: 51 }, RARITY.EPIC, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Frankenstein", ATTRIBUTE.STRENGTH, { health: 217, attack: 55, defense: 61, agility: 42 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.DEFENSIVE)
    add_hero("Black Skull Warrior", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Jotunn", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("King Crab", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Neanderthal", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Orca", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Rudolph", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("War Bard", ATTRIBUTE.STRENGTH, null, RARITY.EPIC, ELEMENT.FIRE, ROLE.SUPPORT)

    add_hero("Buzzfreak", ATTRIBUTE.STRENGTH, { health: 190, attack: 60, defense: 55, agility: 51 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.DEFENSIVE)

    // AGILITY
    add_hero("Hermes", ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Drone", ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Predator", ATTRIBUTE.DEXTERITY, { health: 167, attack: 64, defense: 45, agility: 56 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Assassin", ATTRIBUTE.DEXTERITY, null, RARITY.EPIC, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Jack The Ripper", ATTRIBUTE.DEXTERITY, { health: 182, attack: 66, defense: 53, agility: 50 }, RARITY.EPIC, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Robyn", ATTRIBUTE.DEXTERITY, { health: 167, attack: 64, defense: 47, agility: 54 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Badgerer", ATTRIBUTE.DEXTERITY, { health: 171, attack: 63, defense: 46, agility: 55 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.CONTROL)

    add_hero("Desert Ranger", ATTRIBUTE.DEXTERITY, { health: 174, attack: 64, defense: 51, agility: 56 }, RARITY.EPIC, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Gnarler", ATTRIBUTE.DEXTERITY, { health: 207, attack: 57, defense: 57, agility: 40 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Mirage", ATTRIBUTE.DEXTERITY, { health: 171, attack: 66, defense: 46, agility: 53 }, RARITY.EPIC, ELEMENT.FIRE, ROLE.OFFENSIVE)

    // INTELLIGENCE
    add_hero("Candy Elemental", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Oil Elemental", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Joanne", ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 65, defense: 53, agility: 60 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Black Skull Mage", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Margrethe", ATTRIBUTE.INTELLIGENCE, { health: 190, attack: 58, defense: 55, agility: 52 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Banshee", ATTRIBUTE.INTELLIGENCE, { health: 180, attack: 54, defense: 50, agility: 56 }, RARITY.EPIC, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Taurus", ATTRIBUTE.INTELLIGENCE, { health: 203, attack: 52, defense: 58, agility: 44 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Lotte", ATTRIBUTE.INTELLIGENCE, { health: 174, attack: 62, defense: 52, agility: 56 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Gondolf", ATTRIBUTE.INTELLIGENCE, { health: 186, attack: 58, defense: 56, agility: 46 }, RARITY.EPIC, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Alien", ATTRIBUTE.INTELLIGENCE, { health: 170, attack: 62, defense: 45, agility: 57 }, RARITY.EPIC, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Legba", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Unicorn", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Alice", ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 68, defense: 48, agility: 55 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Ice Worm", ATTRIBUTE.INTELLIGENCE, { health: 185, attack: 62, defense: 50, agility: 48 }, RARITY.EPIC, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Nerissa", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Cleo", ATTRIBUTE.INTELLIGENCE, { health: 167, attack: 64, defense: 50, agility: 58 }, RARITY.EPIC, ELEMENT.LIGHT, ROLE.SUPPORT)
    add_hero("Djinn", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Witch", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Sylvanna", ATTRIBUTE.INTELLIGENCE, { health: 194, attack: 56, defense: 55, agility: 46 }, RARITY.EPIC, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Yaotl", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Catalina", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Aqualon", ATTRIBUTE.INTELLIGENCE, null, RARITY.EPIC, ELEMENT.WATER, ROLE.SUPPORT)

    add_hero("Doctress", ATTRIBUTE.INTELLIGENCE, { health: 190, attack: 52, defense: 55, agility: 51 }, RARITY.EPIC, ELEMENT.WATER, ROLE.SUPPORT)

    // RARE
    // STRENGTH
    add_hero("Bag Head", ATTRIBUTE.STRENGTH, { health: 185, attack: 53, defense: 54, agility: 45 }, RARITY.RARE, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Circus Boxer", ATTRIBUTE.STRENGTH, { health: 173, attack: 61, defense: 46, agility: 49 }, RARITY.RARE, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Skeleton Warrior", ATTRIBUTE.STRENGTH, { health: 184, attack: 53, defense: 54, agility: 38 }, RARITY.RARE, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Zombie Grunt", ATTRIBUTE.STRENGTH, { health: 204, attack: 52, defense: 58, agility: 37 }, RARITY.RARE, ELEMENT.SHADOW, ROLE.DEFENSIVE)
    add_hero("Wolf", ATTRIBUTE.STRENGTH, { health: 161, attack: 63, defense: 42, agility: 48 }, RARITY.RARE, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Cursed Pirate", ATTRIBUTE.STRENGTH, { health: 170, attack: 57, defense: 49, agility: 44 }, RARITY.RARE, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Grilled Chicken", ATTRIBUTE.STRENGTH, { health: 160, attack: 57, defense: 47, agility: 49 }, RARITY.RARE, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Crook", ATTRIBUTE.STRENGTH, { health: 169, attack: 61, defense: 44, agility: 46 }, RARITY.RARE, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Grave Digger", ATTRIBUTE.STRENGTH, { health: 155, attack: 61, defense: 41, agility: 52 }, RARITY.RARE, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Mummy", ATTRIBUTE.STRENGTH, { health: 178, attack: 51, defense: 51, agility: 45 }, RARITY.RARE, ELEMENT.FIRE, ROLE.DEFENSIVE)
    add_hero("Orkitect", ATTRIBUTE.STRENGTH, { health: 161, attack: 58, defense: 42, agility: 51 }, RARITY.RARE, ELEMENT.FIRE, ROLE.CONTROL)

    // INTELLIGENCE
    add_hero("Cursed Goat", ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 61, defense: 44, agility: 53 }, RARITY.RARE, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Succubus", ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 59, defense: 49, agility: 50 }, RARITY.RARE, ELEMENT.SHADOW, ROLE.SUPPORT)
    add_hero("Voodoo Doll", ATTRIBUTE.INTELLIGENCE, { health: 170, attack: 58, defense: 45, agility: 53 }, RARITY.RARE, ELEMENT.SHADOW, ROLE.CONTROL)
    add_hero("Extraterrestrial", ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 55, defense: 49, agility: 43 }, RARITY.RARE, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Lab Rat", ATTRIBUTE.INTELLIGENCE, { health: 174, attack: 49, defense: 51, agility: 48 }, RARITY.RARE, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Imp", ATTRIBUTE.INTELLIGENCE, { health: 155, attack: 58, defense: 41, agility: 55 }, RARITY.RARE, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Soul", ATTRIBUTE.INTELLIGENCE, { health: 176, attack: 58, defense: 49, agility: 48 }, RARITY.RARE, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Muncher", ATTRIBUTE.INTELLIGENCE, { health: 178, attack: 55, defense: 49, agility: 43 }, RARITY.RARE, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Infected Mushroom", ATTRIBUTE.INTELLIGENCE, { health: 155, attack: 59, defense: 41, agility: 54 }, RARITY.RARE, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Pumpkin Man", ATTRIBUTE.INTELLIGENCE, { health: 166, attack: 53, defense: 49, agility: 49 }, RARITY.RARE, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Brainiac", ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 59, defense: 51, agility: 48 }, RARITY.RARE, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Dracula's Brides", ATTRIBUTE.INTELLIGENCE, { health: 167, attack: 50, defense: 47, agility: 53 }, RARITY.RARE, ELEMENT.FIRE, ROLE.SUPPORT)
    add_hero("Forest Terror", ATTRIBUTE.INTELLIGENCE, { health: 183, attack: 53, defense: 50, agility: 43 }, RARITY.RARE, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Fire Elemental", ATTRIBUTE.INTELLIGENCE, { health: 171, attack: 56, defense: 50, agility: 43 }, RARITY.RARE, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Jolly", ATTRIBUTE.INTELLIGENCE, null, RARITY.RARE, ELEMENT.LIGHT, ROLE.SUPPORT)

    // DEXTERITY
    add_hero("Killer Bunny", ATTRIBUTE.DEXTERITY, { health: 155, attack: 61, defense: 41, agility: 52 }, RARITY.RARE, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Naga", ATTRIBUTE.DEXTERITY, { health: 169, attack: 58, defense: 46, agility: 46 }, RARITY.RARE, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Beaver", ATTRIBUTE.DEXTERITY, { health: 185, attack: 50, defense: 55, agility: 40 }, RARITY.RARE, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Raptor", ATTRIBUTE.DEXTERITY, { health: 157, attack: 62, defense: 41, agility: 51 }, RARITY.RARE, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Watcher", ATTRIBUTE.DEXTERITY, { health: 162, attack: 56, defense: 45, agility: 50 }, RARITY.RARE, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Freezer Goat", ATTRIBUTE.DEXTERITY, { health: 174, attack: 53, defense: 49, agility: 47 }, RARITY.RARE, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Frog Prince", ATTRIBUTE.DEXTERITY, { health: 181, attack: 49, defense: 55, agility: 42 }, RARITY.RARE, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Mimic Toilet", ATTRIBUTE.DEXTERITY, { health: 157, attack: 59, defense: 41, agility: 53 }, RARITY.RARE, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Arachne", ATTRIBUTE.DEXTERITY, { health: 167, attack: 58, defense: 45, agility: 48 }, RARITY.RARE, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Harpy", ATTRIBUTE.DEXTERITY, { health: 159, attack: 61, defense: 42, agility: 50 }, RARITY.RARE, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Battle Bot", ATTRIBUTE.DEXTERITY, { health: 167, attack: 60, defense: 44, agility: 47 }, RARITY.RARE, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Nutcracker", ATTRIBUTE.DEXTERITY, null, RARITY.RARE, ELEMENT.NATURE, ROLE.DEFENSIVE)


    // UNCOMMON
    // STRENGTH
    add_hero("Ghoul", ATTRIBUTE.STRENGTH, { health: 155, attack: 58, defense: 43, agility: 45 }, RARITY.UNCOMMON, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Butt with Ears", ATTRIBUTE.STRENGTH, { health: 156, attack: 52, defense: 44, agility: 41 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Scarab", ATTRIBUTE.STRENGTH, { health: 173, attack: 47, defense: 50, agility: 37 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Skeleton", ATTRIBUTE.STRENGTH, { health: 160, attack: 54, defense: 43, agility: 41 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Chicklet", ATTRIBUTE.STRENGTH, { health: 154, attack: 51, defense: 42, agility: 46 }, RARITY.UNCOMMON, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Scorpion", ATTRIBUTE.STRENGTH, { health: 145, attack: 55, defense: 37, agility: 49 }, RARITY.UNCOMMON, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Zombie", ATTRIBUTE.STRENGTH, { health: 176, attack: 49, defense: 50, agility: 35 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Gingerbread Boy", ATTRIBUTE.STRENGTH, { health: 148, attack: 56, defense: 41, agility: 48 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.SUPPORT)
    add_hero("Crab", ATTRIBUTE.STRENGTH, null, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.DEFENSIVE)

    // INTELLIGENCE
    add_hero("Lab Ape", ATTRIBUTE.INTELLIGENCE, { health: 161, attack: 55, defense: 43, agility: 47 }, RARITY.UNCOMMON, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Slime", ATTRIBUTE.INTELLIGENCE, { health: 150, attack: 51, defense: 46, agility: 43 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.SUPPORT)
    add_hero("Ghost", ATTRIBUTE.INTELLIGENCE, { health: 169, attack: 49, defense: 49, agility: 38 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.DEFENSIVE)
    add_hero("Sheep", ATTRIBUTE.INTELLIGENCE, { health: 165, attack: 49, defense: 49, agility: 39 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Snake", ATTRIBUTE.INTELLIGENCE, { health: 142, attack: 55, defense: 37, agility: 51 }, RARITY.UNCOMMON, ELEMENT.FIRE, ROLE.CONTROL)
    add_hero("Cockatrice", ATTRIBUTE.INTELLIGENCE, { health: 150, attack: 52, defense: 41, agility: 47 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.CONTROL)

    // DEXTERITY
    add_hero("Seagull", ATTRIBUTE.DEXTERITY, { health: 152, attack: 57, defense: 44, agility: 46 }, RARITY.UNCOMMON, ELEMENT.LIGHT, ROLE.OFFENSIVE)
    add_hero("Cannon Scavenger", ATTRIBUTE.DEXTERITY, { health: 152, attack: 58, defense: 44, agility: 39 }, RARITY.UNCOMMON, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Rotten Kitty", ATTRIBUTE.DEXTERITY, { health: 152, attack: 57, defense: 40, agility: 50 }, RARITY.UNCOMMON, ELEMENT.LIGHT, ROLE.CONTROL)
    add_hero("Gargoyle", ATTRIBUTE.DEXTERITY, { health: 157, attack: 53, defense: 43, agility: 43 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Land Diver", ATTRIBUTE.DEXTERITY, { health: 150, attack: 50, defense: 41, agility: 48 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.CONTROL)
    add_hero("Rat", ATTRIBUTE.DEXTERITY, { health: 152, attack: 54, defense: 41, agility: 45 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.CONTROL)
    add_hero("Glompf", ATTRIBUTE.DEXTERITY, { health: 142, attack: 57, defense: 37, agility: 48 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.OFFENSIVE)
    add_hero("Bat", ATTRIBUTE.DEXTERITY, { health: 161, attack: 51, defense: 46, agility: 40 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.DEFENSIVE)
    add_hero("Vulture", ATTRIBUTE.DEXTERITY, { health: 157, attack: 51, defense: 48, agility: 40 }, RARITY.UNCOMMON, ELEMENT.FIRE, ROLE.OFFENSIVE)
    add_hero("Mean Seagull", ATTRIBUTE.DEXTERITY, { health: 152, attack: 57, defense: 44, agility: 46 }, RARITY.UNCOMMON, ELEMENT.SHADOW, ROLE.OFFENSIVE)
    add_hero("Snowman", ATTRIBUTE.DEXTERITY, { health: 150, attack: 53, defense: 45, agility: 43 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Tentacle", ATTRIBUTE.DEXTERITY, { health: 142, attack: 54, defense: 43, agility: 45 }, RARITY.UNCOMMON, ELEMENT.WATER, ROLE.OFFENSIVE)
    add_hero("Mosquito", ATTRIBUTE.DEXTERITY, { health: 146, attack: 55, defense: 41, agility: 46 }, RARITY.UNCOMMON, ELEMENT.NATURE, ROLE.CONTROL)

    return BASE_HEROES
}