const SHARE_FORMAT_VERSION = 1

function toBase64Url(value) {
    const bytes = new TextEncoder().encode(value)
    let binary = ""
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value) {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - base64.length % 4) % 4)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0))
    return new TextDecoder().decode(bytes)
}

function compactItem(item) {
    if (!item) return null

    // Item identity, name, unique-effect description, rarityEffect, base attributes,
    // and set metadata come from the receiving toolkit's item database.
    // Only serialize the configured values that can differ between builds.
    const compact = {}
    const baseId = item.baseItemId ?? item.id
    if (baseId !== undefined) compact.i = baseId
    if (item.slot !== undefined) compact.s = item.slot

    const fields = {
        r: "rarity",
        p: "perks",
        v: "perkValues",
        l: "level",
        w: "masterworkLevel",
        d: "isDamaged",
        b: "setBonusValues",
        x: "mutations"
    }

    for (const [shortKey, field] of Object.entries(fields)) {
        const value = item[field]
        if (value === undefined) continue
        if (shortKey === "w" && Number(value) === 0) continue
        if (shortKey === "d" && value === false) continue

        if (shortKey === "b" && (!Array.isArray(value) || value.length === 0 || value.every(entry => Number(entry) === 0))) {
            continue
        }

        if (shortKey === "x" && value && typeof value === "object" && !Array.isArray(value)) {
            const activeMutations = Object.fromEntries(
                Object.entries(value).filter(([, mutationValue]) => mutationValue !== null && mutationValue !== undefined)
            )
            if (Object.keys(activeMutations).length > 0) compact.x = activeMutations
            continue
        }

        compact[shortKey] = value
    }

    if (Array.isArray(item.fixedPerks) && item.fixedPerks.length > 0) {
        // The fixed perk IDs are part of the base item template; only their configured values are needed.
        compact.f = item.fixedPerks.map(perk => Number(perk?.value ?? 0))
    }

    return compact
}

function expandItem(compact, allItems) {
    if (!compact) return null

    const template = allItems.find(item => item.id === compact.i || item.baseItemId === compact.i)
    const item = template ? { ...template } : {}
    // Keep reading older v1 links that serialized the full item metadata.
    const fields = {
        i: "id",
        s: "slot",
        n: "name",
        r: "rarity",
        a: "attributeRequirement",
        m: "mainAttribute",
        u: "unique",
        t: "set",
        p: "perks",
        v: "perkValues",
        l: "level",
        w: "masterworkLevel",
        d: "isDamaged",
        b: "setBonusValues",
        x: "mutations"
    }

    for (const [shortKey, field] of Object.entries(fields)) {
        if (compact[shortKey] !== undefined) item[field] = compact[shortKey]
    }

    if (Array.isArray(compact.f)) {
        item.fixedPerks = compact.f.map((encodedPerk, index) => {
            // Older links store [perkId, value]; compact links store only the value.
            const legacyPair = Array.isArray(encodedPerk)
            const id = legacyPair ? encodedPerk[0] : (template?.fixedPerks?.[index]?.id ?? -1)
            const value = legacyPair ? encodedPerk[1] : encodedPerk
            return {
                ...(template?.fixedPerks?.[index] ?? {}),
                id,
                value
            }
        })
    }

    return item
}

function getAllItems(baseItems) {
    return Object.values(baseItems ?? {}).flat().filter(Boolean)
}

export function createHeroShareToken(hero, { includeItems = true } = {}) {
    const talentKeys = Object.keys(hero.talents ?? {})
        .filter(key => key !== "" && Number.isInteger(Number(key)))
        .sort((a, b) => Number(a) - Number(b))
    const talentMask = talentKeys.reduce(
        (mask, key, index) => hero.talents[key]?.active ? mask | (1 << index) : mask,
        0
    )

    const payload = {
        v: SHARE_FORMAT_VERSION,
        i: hero.id,
        l: Math.max(1, Math.trunc(Number(hero.level) || 1)),
        s: [
            Number(hero.stats?.health) || 0,
            Number(hero.stats?.attack) || 0,
            Number(hero.stats?.defence) || 0,
            Number(hero.stats?.agility) || 0
        ],
        t: talentMask
    }

    if (includeItems && Array.isArray(hero.items) && hero.items.some(Boolean)) {
        payload.e = hero.items.filter(Boolean).map(compactItem)
    }

    return toBase64Url(JSON.stringify(payload))
}

export function createItemShareToken(item) {
    if (!item || item.slot === undefined || item.slot === null) {
        throw new Error("Select a valid item before exporting it.")
    }
    return toBase64Url(JSON.stringify({
        v: SHARE_FORMAT_VERSION,
        k: "item",
        i: compactItem(item)
    }))
}

export function createItemsShareToken(items) {
    const equippedItems = (items ?? []).filter(Boolean)
    if (equippedItems.length === 0) throw new Error("This hero has no equipped items to export.")
    return toBase64Url(JSON.stringify({
        v: SHARE_FORMAT_VERSION,
        k: "items",
        a: equippedItems.map(compactItem)
    }))
}

function decodeInput(input, queryKey) {
    const trimmed = String(input ?? "").trim()
    if (!trimmed) throw new Error("Paste a share link or its encoded data.")

    let token = trimmed
    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("/") ||
        trimmed.startsWith("./") ||
        trimmed.startsWith("heroes/") ||
        trimmed.startsWith("items/") ||
        trimmed.includes(`${queryKey}=`)
    ) {
        let url
        try {
            url = new URL(trimmed, window.location.origin)
        } catch {
            throw new Error("That does not look like a valid share link.")
        }
        token = url.searchParams.get(queryKey) ?? ""
        if (!token) throw new Error(`That link does not contain ${queryKey} share data.`)
    }

    try {
        return JSON.parse(fromBase64Url(token))
    } catch {
        throw new Error("That does not look like a valid share link.")
    }
}

export function decodeHeroShareInput(input) {
    const payload = decodeInput(input, "hero")
    if (
        payload?.v !== SHARE_FORMAT_VERSION ||
        (payload.k !== undefined && payload.k !== "hero") ||
        typeof payload.i !== "string" ||
        !Number.isInteger(payload.l) ||
        !Array.isArray(payload.s) ||
        payload.s.length !== 4 ||
        !Number.isInteger(payload.t) ||
        payload.t < 0 ||
        payload.t > 1023 ||
        (payload.e !== undefined && !Array.isArray(payload.e))
    ) {
        throw new Error("This hero link is invalid or uses an unsupported format version.")
    }
    return payload
}

export function decodeItemShareInput(input) {
    const payload = decodeInput(input, "item")
    if (
        payload?.v !== SHARE_FORMAT_VERSION ||
        payload.k !== "item" ||
        !payload.i ||
        typeof payload.i !== "object" ||
        !Number.isInteger(payload.i.s)
    ) {
        throw new Error("This item link is invalid or uses an unsupported format version.")
    }
    return payload
}

export function decodeItemsShareInput(input) {
    const payload = decodeInput(input, "items")
    if (
        payload?.v !== SHARE_FORMAT_VERSION ||
        payload.k !== "items" ||
        !Array.isArray(payload.a) ||
        payload.a.some(item => !item || !Number.isInteger(item.s))
    ) {
        throw new Error("This equipped-items link is invalid or uses an unsupported format version.")
    }
    return payload
}

export function restoreSharedItem(payload, baseItems) {
    return expandItem(payload.i, getAllItems(baseItems))
}

export function restoreSharedItems(payload, baseItems) {
    const allItems = getAllItems(baseItems)
    const restored = []
    for (const compact of payload.a ?? []) {
        const item = expandItem(compact, allItems)
        if (item && Number.isInteger(Number(item.slot)) && Number(item.slot) >= 0) {
            restored[Number(item.slot)] = item
        }
    }
    return restored
}

export function restoreSharedHero(payload, baseHeroes, baseItems) {
    const baseHero = baseHeroes.find(hero => hero.id === payload.i)
    if (!baseHero) {
        throw new Error("This hero is not present in the current toolkit database.")
    }

    const talents = baseHero.talents ? { ...baseHero.talents } : baseHero.talents
    if (talents) {
        const talentKeys = Object.keys(talents)
            .filter(key => key !== "" && Number.isInteger(Number(key)))
            .sort((a, b) => Number(a) - Number(b))
        for (let index = 0; index < talentKeys.length; index++) {
            const key = talentKeys[index]
            talents[key] = {
                ...talents[key],
                active: Boolean(payload.t & (1 << index))
            }
        }
    }

    const allItems = getAllItems(baseItems)
    const restoredItems = []
    for (const [index, compact] of (payload.e ?? []).entries()) {
        const item = expandItem(compact, allItems)
        if (!item) continue
        const slot = Number.isInteger(Number(item.slot)) ? Number(item.slot) : index
        if (slot >= 0) restoredItems[slot] = item
    }

    return {
        ...baseHero,
        talents,
        level: payload.l,
        stats: {
            health: payload.s[0],
            attack: payload.s[1],
            defence: payload.s[2],
            agility: payload.s[3]
        },
        items: restoredItems
    }
}
