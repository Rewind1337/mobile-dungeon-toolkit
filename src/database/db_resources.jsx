import { RARITY_DEFINITIONS } from "./enums.jsx"
import { resourceSprites } from "./db_sprites.jsx"

let BASE_RESOURCES = []

function add_resource(name, description, rarity = null) {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    const id = normalizedName
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
    // Add manually verified resources here. IDs are generated from each name.
    // Use RARITY_DEFINITIONS.<RARITY>.id when the resource has a rarity.
    add_resource("Premium Currency", "Used to purchase premium items.", RARITY_DEFINITIONS.RARE.id)

    return BASE_RESOURCES
}
