export function normalizeStableName(name) {
    return String(name ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "unnamed"
}

export function createPersistentId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }

    // Fallback for browsers without crypto.randomUUID().
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function createSavedItemRecord(itemObj) {
    const baseItemId = String(itemObj.baseItemId ?? itemObj.id)
    const saveId = createPersistentId()

    return {
        ...itemObj,
        id: `saved:${baseItemId}:${saveId}`,
        baseItemId,
        saveId,
        fixedPerks: (itemObj.fixedPerks ?? []).map(perk => ({ ...perk })),
        perks: [...(itemObj.perks ?? [])],
        perkValues: [...(itemObj.perkValues ?? [])],
        fixedPerkValues: itemObj.fixedPerkValues ? [...itemObj.fixedPerkValues] : itemObj.fixedPerkValues
    }
}
