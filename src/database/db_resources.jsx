import { resourceSprites } from "./db_sprites.jsx"
import { RESOURCE_LOCATIONS, RARITY_DEFINITIONS } from "./enums"

export { RESOURCE_LOCATIONS }

let BASE_RESOURCES = []

function add_resource(name, description, rarity = null) {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "")
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    if (BASE_RESOURCES.some(resource => resource.id === id)) {
        throw new Error(`Duplicate stable resource ID "${id}". Give the resource a distinct name.`)
    }

    BASE_RESOURCES.push({
        id: id,
        name: name,
        description: description,
        spriteSrc: resourceSprites[normalizedName] !== undefined ? resourceSprites[normalizedName] : resourceSprites["null"],
        rarity: rarity ?? null,
    })
}

export function init_resource_db() {
    add_resource("Crystal", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Gold", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Hero Experience Scroll", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Essence", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Dungeon Artifact", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Dungeon Artifact Ancient", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Arena Coin", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Guildhunt Coin", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Chaostower Coin", "Description here.", RARITY_DEFINITIONS.EPIC)

    add_resource("Soul", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shimmering Soul", "Description here.", RARITY_DEFINITIONS.EPIC)
    add_resource("Crystalized Soul", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Rare Crystalized Soul", "Description here.", RARITY_DEFINITIONS.EPIC)
    add_resource("Uncommon Banner Booster", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Rare Banner Booster", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Epic Banner Booster", "Description here.", RARITY_DEFINITIONS.EPIC)
    add_resource("Legendary Banner Booster", "Description here.", RARITY_DEFINITIONS.LEGENDARY)

    add_resource("Uncommon Wildcard", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Rare Wildcard", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Epic Wildcard", "Description here.", RARITY_DEFINITIONS.EPIC)
    add_resource("Legendary Wildcard", "Description here.", RARITY_DEFINITIONS.LEGENDARY)

    add_resource("Crimson Hourglass", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Golden Hourglass", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Adventure Thirst", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Dungeon Key", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Root Beer", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Monster Musk", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Arena Ticket", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Guildhunt Ticket", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Chaostower Ticket", "Description here.", RARITY_DEFINITIONS.EPIC)

    add_resource("Uncommon Ascension Orb", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Rare Ascension Orb", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Epic Ascension Orb", "Description here.", RARITY_DEFINITIONS.EPIC)
    add_resource("Legendary Ascension Orb", "Description here.", RARITY_DEFINITIONS.LEGENDARY)
    add_resource("Reincarnation Stone", "Description here.", RARITY_DEFINITIONS.RARE)

    add_resource("Cinder", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Common Equipment Dust", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Uncommon Equipment Dust", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Rare Equipment Dust", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Epic Equipment Dust", "Description here.", RARITY_DEFINITIONS.EPIC)
    add_resource("Legendary Equipment Dust", "Description here.", RARITY_DEFINITIONS.LEGENDARY)
    add_resource("Protection Scroll", "Description here.", RARITY_DEFINITIONS.EPIC)

    add_resource("Uncommon Skill Tome", "Description here.", RARITY_DEFINITIONS.UNCOMMON)
    add_resource("Rare Skill Tome", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Epic Skill Tome", "Description here.", RARITY_DEFINITIONS.EPIC)
    add_resource("Legendary Skill Tome", "Description here.", RARITY_DEFINITIONS.LEGENDARY)

    add_resource("Ruby", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Sapphire", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Emerald", "Description here.", RARITY_DEFINITIONS.COMMON)
    add_resource("Diamond", "Description here.", RARITY_DEFINITIONS.COMMON)

    add_resource("Fire Shard Tier1", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Fire Shard Tier2", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Fire Shard Tier3", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Fire Shard Tier4", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Fire Shard Tier5", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Fire Shard Tier6", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Fire Shard Tier7", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Fire Shard Tier8", "Description here.", RARITY_DEFINITIONS.RARE)

    add_resource("Water Shard Tier1", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Water Shard Tier2", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Water Shard Tier3", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Water Shard Tier4", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Water Shard Tier5", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Water Shard Tier6", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Water Shard Tier7", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Water Shard Tier8", "Description here.", RARITY_DEFINITIONS.RARE)

    add_resource("Nature Shard Tier1", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Nature Shard Tier2", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Nature Shard Tier3", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Nature Shard Tier4", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Nature Shard Tier5", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Nature Shard Tier6", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Nature Shard Tier7", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Nature Shard Tier8", "Description here.", RARITY_DEFINITIONS.RARE)

    add_resource("Shadow Shard Tier1", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shadow Shard Tier2", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shadow Shard Tier3", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shadow Shard Tier4", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shadow Shard Tier5", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shadow Shard Tier6", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shadow Shard Tier7", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Shadow Shard Tier8", "Description here.", RARITY_DEFINITIONS.RARE)

    add_resource("Light Shard Tier1", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Light Shard Tier2", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Light Shard Tier3", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Light Shard Tier4", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Light Shard Tier5", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Light Shard Tier6", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Light Shard Tier7", "Description here.", RARITY_DEFINITIONS.RARE)
    add_resource("Light Shard Tier8", "Description here.", RARITY_DEFINITIONS.RARE)

    return BASE_RESOURCES
}
