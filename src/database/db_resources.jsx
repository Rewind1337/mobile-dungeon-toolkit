import { resourceSprites } from "./db_sprites.jsx"
import { RARITY_DEFINITIONS, RESOURCE_LOCATIONS } from "./enums.jsx"
import { humanize } from "../js/util.jsx"

let BASE_RESOURCES = []

function add_resource(name, description, sourceLocations = [], useLocations = [], additionalInformation = []) {
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
        sourceLocations: [...sourceLocations],
        useLocations: [...useLocations],
        additionalInformation: additionalInformation.map(entry => ({ ...entry })),
    })
}

function add_gem(name, rarity, sourceLocations = []) {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "")
    const id = `${normalizedName}_${rarity.name.toLowerCase()}`
    if (BASE_RESOURCES.some(resource => resource.id === id)) {
        throw new Error(`Duplicate stable gem ID "${id}".`)
    }

    BASE_RESOURCES.push({
        id,
        name: `${humanize(rarity.name)} ${name}`,
        gemType: name,
        description: "Description here.",
        spriteSrc: resourceSprites[normalizedName] !== undefined ? resourceSprites[normalizedName] : resourceSprites["null"],
        sourceLocations: [...sourceLocations],
        useLocations: [],
        additionalInformation: [],
        isGem: true,
        rarity,
    })
}

export function init_resource_db() {
    // This initializer is used by the Info overview and the Resource/Gem catalogues.
    // Rebuild the list on every call so module-level state doesn't accumulate duplicates.
    BASE_RESOURCES = []

    add_resource("Crystal", "Description here.")
    add_resource("Gold", "Description here.")
    add_resource("Hero Experience Scroll", "Description here.")
    add_resource("Essence", "Description here.")
    add_resource("Dungeon Artifact", "Description here.")
    add_resource("Dungeon Artifact Ancient", "Description here.")
    add_resource("Arena Coin", "Description here.")
    add_resource("Guildhunt Coin", "Description here.")
    add_resource("Chaostower Coin", "Description here.")

    add_resource("Soul", "Description here.", [], [RESOURCE_LOCATIONS.MAGIC_TOILET], [])
    add_resource("Shimmering Soul", "Description here.", [], [RESOURCE_LOCATIONS.MAGIC_TOILET], [])
    add_resource("Crystalized Soul", "Description here.")
    add_resource("Rare Crystalized Soul", "Description here.")
    add_resource("Uncommon Banner Booster", "Description here.", [], [RESOURCE_LOCATIONS.MAGIC_TOILET], [{ rarity: "uncommon" }])
    add_resource("Rare Banner Booster", "Description here.", [], [RESOURCE_LOCATIONS.MAGIC_TOILET], [{ rarity: "rare" }])
    add_resource("Epic Banner Booster", "Description here.", [], [RESOURCE_LOCATIONS.MAGIC_TOILET], [{ rarity: "epic" }])
    add_resource("Legendary Banner Booster", "Description here.", [], [RESOURCE_LOCATIONS.MAGIC_TOILET], [{ rarity: "legendary" }])

    add_resource("Uncommon Wildcard", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "uncommon" }])
    add_resource("Rare Wildcard", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "rare" }])
    add_resource("Epic Wildcard", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "epic" }])
    add_resource("Legendary Wildcard", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "legendary" }])

    add_resource("Crimson Hourglass", "Description here.")
    add_resource("Golden Hourglass", "Description here.")
    add_resource("Adventure Thirst", "Description here.")
    add_resource("Dungeon Key", "Description here.")
    add_resource("Root Beer", "Description here.")
    add_resource("Monster Musk", "Description here.")
    add_resource("Arena Ticket", "Description here.")
    add_resource("Guildhunt Ticket", "Description here.")
    add_resource("Chaostower Ticket", "Description here.")

    add_resource("Uncommon Ascension Orb", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ rarity: "uncommon" }])
    add_resource("Rare Ascension Orb", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ rarity: "rare" }])
    add_resource("Epic Ascension Orb", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ rarity: "epic" }])
    add_resource("Legendary Ascension Orb", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ rarity: "legendary" }])
    add_resource("Reincarnation Stone", "Description here.")

    add_resource("Cinder", "Description here.")
    add_resource("Common Equipment Dust", "Description here.", [], [RESOURCE_LOCATIONS.SMITH_ENHANCE], [{ rarity: "common" }])
    add_resource("Uncommon Equipment Dust", "Description here.", [], [RESOURCE_LOCATIONS.SMITH_ENHANCE], [{ rarity: "uncommon" }])
    add_resource("Rare Equipment Dust", "Description here.", [], [RESOURCE_LOCATIONS.SMITH_ENHANCE], [{ rarity: "rare" }])
    add_resource("Epic Equipment Dust", "Description here.", [], [RESOURCE_LOCATIONS.SMITH_ENHANCE], [{ rarity: "epic" }])
    add_resource("Legendary Equipment Dust", "Description here.", [], [RESOURCE_LOCATIONS.SMITH_ENHANCE], [{ rarity: "legendary" }])
    add_resource("Protection Scroll", "Description here.")

    add_resource("Uncommon Skill Tome", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "uncommon" }, { text: "Not Implemented" }])
    add_resource("Rare Skill Tome", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "rare" }, { text: "Not Implemented" }])
    add_resource("Epic Skill Tome", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "epic" }, { text: "Not Implemented" }])
    add_resource("Legendary Skill Tome", "Description here.", [], [RESOURCE_LOCATIONS.TAVERN], [{ rarity: "legendary" }, { text: "Not Implemented" }])

    // Each rarity has its own sourceLocations array for its dungeon drop odds.
    // Store future drop entries as plain strings so they can be displayed directly.
    const gemRarities = [
        RARITY_DEFINITIONS.COMMON,
        RARITY_DEFINITIONS.UNCOMMON,
        RARITY_DEFINITIONS.RARE,
        RARITY_DEFINITIONS.EPIC,
        RARITY_DEFINITIONS.LEGENDARY,
    ]
    for (const name of ["Ruby", "Sapphire", "Emerald", "Diamond"]) {
        gemRarities.forEach(rarity => add_gem(name, rarity, []))
    }

    add_resource("Fire Shard Tier1", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }])
    add_resource("Fire Shard Tier2", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }])
    add_resource("Fire Shard Tier3", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }])
    add_resource("Fire Shard Tier4", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }])
    add_resource("Fire Shard Tier5", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }])
    add_resource("Fire Shard Tier6", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }])
    add_resource("Fire Shard Tier7", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }, { text: "Not Implemented" }])
    add_resource("Fire Shard Tier8", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "fire" }, { text: "Not Implemented" }])

    add_resource("Water Shard Tier1", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }])
    add_resource("Water Shard Tier2", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }])
    add_resource("Water Shard Tier3", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }])
    add_resource("Water Shard Tier4", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }])
    add_resource("Water Shard Tier5", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }])
    add_resource("Water Shard Tier6", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }])
    add_resource("Water Shard Tier7", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }, { text: "Not Implemented" }])
    add_resource("Water Shard Tier8", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "water" }, { text: "Not Implemented" }])

    add_resource("Nature Shard Tier1", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }])
    add_resource("Nature Shard Tier2", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }])
    add_resource("Nature Shard Tier3", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }])
    add_resource("Nature Shard Tier4", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }])
    add_resource("Nature Shard Tier5", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }])
    add_resource("Nature Shard Tier6", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }])
    add_resource("Nature Shard Tier7", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }, { text: "Not Implemented" }])
    add_resource("Nature Shard Tier8", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "nature" }, { text: "Not Implemented" }])

    add_resource("Shadow Shard Tier1", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }])
    add_resource("Shadow Shard Tier2", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }])
    add_resource("Shadow Shard Tier3", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }])
    add_resource("Shadow Shard Tier4", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }])
    add_resource("Shadow Shard Tier5", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }])
    add_resource("Shadow Shard Tier6", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }])
    add_resource("Shadow Shard Tier7", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }, { text: "Not Implemented" }])
    add_resource("Shadow Shard Tier8", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "shadow" }, { text: "Not Implemented" }])

    add_resource("Light Shard Tier1", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }])
    add_resource("Light Shard Tier2", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }])
    add_resource("Light Shard Tier3", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }])
    add_resource("Light Shard Tier4", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }])
    add_resource("Light Shard Tier5", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }])
    add_resource("Light Shard Tier6", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }])
    add_resource("Light Shard Tier7", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }, { text: "Not Implemented" }])
    add_resource("Light Shard Tier8", "Description here.", [], [RESOURCE_LOCATIONS.CHAPEL], [{ element: "light" }, { text: "Not Implemented" }])

    return BASE_RESOURCES
}
