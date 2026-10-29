import { ATTRIBUTE_DEFINITIONS, DROP_SOURCE_DEFINITIONS, EQUIPMENT_SLOT_DEFINITIONS, PERK_DEFINITIONS, RARITY_DEFINITIONS, getEnumNameById } from "../database/enums.jsx"
import { isSearchAssetField } from "./search.jsx"
import { statusSprites } from "../database/db_sprites.jsx"

export const SLOT_NAMES = Object.fromEntries(
    Object.values(EQUIPMENT_SLOT_DEFINITIONS).map(({ id, name }) => [id, name])
)
export const RARITY_NAMES = Object.fromEntries(
    Object.values(RARITY_DEFINITIONS).map(({ id, name }) => [id, name])
)
export const PERK_NAMES = Object.fromEntries(
    Object.entries(PERK_DEFINITIONS).map(([key, perk]) => [key, perk.name ?? key])
)
export const SLOT_ICON_KEYS = { WEAPON: "weapons", HELMET: "helmets", ARMOR: "armors", NECKLACE: "necklaces", RING: "rings" }
export const ATTRIBUTE_ICON_KEYS = { strength: 1, dexterity: 2, intelligence: 3 }

export const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

export function getLocations(item) {
    const raw = item?.dropLocation
    if (Array.isArray(raw)) return raw.map(value => String(value)).filter(Boolean)
    if (raw === null || raw === undefined || raw === "") return ["Unspecified location"]
    return [String(raw)]
}

export function getSetLocations(set, pieces) {
    const rawLocation = set?.dropLocation
    if (rawLocation !== undefined && rawLocation !== null && rawLocation !== "") {
        return getLocations(set)
    }
    const inheritedLocations = [...new Set(pieces.flatMap(getLocations))]
        .filter(location => location !== "Unspecified location")
    return inheritedLocations.length > 0 ? inheritedLocations : ["Unspecified location"]
}

export function getSourceName(source) {
    if (source === null || source === undefined || source === "") return "Unspecified source"
    const name = getEnumNameById(DROP_SOURCE_DEFINITIONS, Number(source)) ?? String(source)
    return name.toLowerCase() === "everywhere" ? "Any Dungeon" : humanize(name)
}

export function getDropSourceLabel(source, locations) {
    const locationNames = (locations ?? []).filter(location => location && location !== "Unspecified location")
    const locationLabel = locationNames.length > 0 ? locationNames.join(", ") : "Unspecified"
    const sourceName = getSourceName(source)
    if (sourceName.toLowerCase().includes("guild hunt")) return `Drop Source: ${locationLabel} (GH)`
    if (locationNames.length > 0) return `Drop Source: ${locationLabel}`
    return "Drop Source: Unspecified"
}

export function getAttributeRequirementLabel(value) {
    if (value === null || value === undefined || value === "") return "Not specified"
    const name = getEnumNameById(ATTRIBUTE_DEFINITIONS, Number(value))
    return !name || name === "NONE" ? "None" : humanize(name)
}

export function getPerkKey(perk) {
    if (typeof perk === "string") return perk.toUpperCase().replace(/\s/g, "_")
    if (perk && typeof perk === "object") {
        return Object.keys(PERK_DEFINITIONS).find(key => PERK_DEFINITIONS[key].id === perk.id) ?? ""
    }
    return ""
}

export function getPerkLabel(perk) {
    const key = getPerkKey(perk)
    return PERK_NAMES[key] ?? (typeof perk === "string" ? humanize(perk) : "")
}

export function getSearchableValues(value, seen = new Set()) {
    if (value === null || value === undefined) return []
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return [String(value)]
    if (typeof value !== "object" || seen.has(value)) return []
    seen.add(value)
    return Object.entries(value).flatMap(([key, child]) => isSearchAssetField(key) ? [] : getSearchableValues(child, seen))
}

const STATUS_ALIASES = [
    { key: "poison", terms: ["poison"] },
    { key: "cursed", terms: ["cursed"] },
    { key: "blind", terms: ["blind"] },
    { key: "bleeding", terms: ["bleeding", "bleed"] },
    { key: "burn", terms: ["burn"] },
    { key: "freeze", terms: ["freeze", "frozen"] },
    { key: "defense_down", terms: ["def down", "defence down", "defense down"] },
    { key: "agility_down", terms: ["agi down", "agility down"] },
    { key: "attack_down", terms: ["atk down", "attack down"] },
    { key: "marked", terms: ["marked"] },
    { key: "petrified", terms: ["petrified"] },
    { key: "sick", terms: ["sick"] },
    { key: "mute", terms: ["mute"] },
    { key: "bound", terms: ["bound"] },
    { key: "echo", terms: ["echo"] },
    { key: "stunned", terms: ["stun", "stunned"] },
]

export function getEffectStatuses(item) {
    const description = String(item?.unique?.description ?? "").toLowerCase()
    if (!description) return []
    return STATUS_ALIASES
        .filter(status => status.terms.some(term => description.includes(term)) && statusSprites[status.key])
        .map(status => ({ key: status.key, name: humanize(status.key), sprite: statusSprites[status.key] }))
}

export function isUniqueItem(item) {
    return Boolean(item?.isUnique) || (item?.unique !== undefined && item?.unique !== null && item.unique !== 0)
}
