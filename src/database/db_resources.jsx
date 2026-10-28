import { RARITY_DEFINITIONS } from "./enums.jsx"
import { resourceSprites } from "./db_sprites.jsx"

let BASE_RESOURCES = []

function add_resource(name, description, spriteKey, rarity = null) {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    if (BASE_RESOURCES.some(resource => resource.id === id)) {
        throw new Error(`Duplicate stable resource ID "${id}". Give the resource a distinct name.`)
    }

    BASE_RESOURCES.push({
        id: id,
        name: name,
        description: description,
        spriteKey: spriteKey,
        spriteSrc: resourceSprites[spriteKey] ?? null,
        rarity: rarity ?? null,
    })
}

export function init_resource_db() {
    // Add manually verified resources here. IDs are generated from each name.
    // Add the matching sprite import/key to resourceSprites in db_sprites.jsx.
    // Use RARITY_DEFINITIONS.<RARITY>.id when the resource has a rarity.
    add_resource("Premium Currency", "Used to purchase premium items.", "premium_currency", RARITY_DEFINITIONS.RARE.id)

    return BASE_RESOURCES
}
