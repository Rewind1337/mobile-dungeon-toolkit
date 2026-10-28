import { resourceSprites } from "./db_sprites.jsx"

let BASE_RESOURCES = []

function add_resource(name, description, rarity = null) {
    const normalizedName = name.toLowerCase().replace(/[^a-z]/g, "_")
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
    // Add manually verified resource entries here. IDs are generated from each name.

    return BASE_RESOURCES
}
