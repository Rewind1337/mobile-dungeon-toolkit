export { RARITY_DEFINITIONS } from "./enums.jsx"
import { resourceSprites } from "./db_sprites.jsx"

// Add manually verified resources here. IDs are stable keys and do not need to
// follow display order. Use null for rarity when the resource has no rarity.
export const RESOURCE_DATA = {
    // Example:
    // premium_currency: {
    //     id: "premium_currency",
    //     name: "Resource name",
    //     description: "Description of what this resource is used for.",
    //     spriteKey: "premium_currency", // Add this key to resourceSprites in db_sprites.jsx.
    //     rarity: RARITY_DEFINITIONS.RARE.id,
    // },
}

export function init_resource_db() {
    return Object.values(RESOURCE_DATA).map(resource => ({
        ...resource,
        spriteSrc: resourceSprites[resource.spriteKey] ?? null,
        rarity: resource.rarity ?? null,
    }))
}
