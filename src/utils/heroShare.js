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

    const compact = {}
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
        if (item[field] !== undefined) compact[shortKey] = item[field]
    }

    if (Array.isArray(item.fixedPerks)) {
        compact.f = item.fixedPerks.map(perk => [perk?.id ?? -1, Number(perk?.value ?? 0)])
    }

    return compact
}

function expandItem(compact, allItems) {
    if (!compact) return null

    const template = allItems.find(item => item.id === compact.i)
    const item = template ? { ...template } : {}
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
        item.fixedPerks = compact.f.map(([id, value], index) => ({
            ...(template?.fixedPerks?.[index] ?? {}),
            id,
            value
        }))
    }

    return item
}

export function createHeroShareToken(hero) {
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

    if (Array.isArray(hero.items) && hero.items.some(Boolean)) {
        payload.e = hero.items.map(compactItem)
    }

    return toBase64Url(JSON.stringify(payload))
}

export function decodeHeroShareInput(input) {
    const trimmed = String(input ?? "").trim()
    if (!trimmed) throw new Error("Paste a hero share link or its encoded data.")

    let token = trimmed
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("heroes/") || trimmed.includes("hero=")) {
        let url
        try {
            url = new URL(trimmed, window.location.origin)
        } catch {
            throw new Error("That does not look like a valid hero share link.")
        }
        token = url.searchParams.get("hero") ?? ""
        if (!token) throw new Error("That link does not contain hero share data.")
    }

    let payload
    try {
        payload = JSON.parse(fromBase64Url(token))
    } catch {
        throw new Error("That does not look like a valid hero share link.")
    }

    if (
        payload?.v !== SHARE_FORMAT_VERSION ||
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

    const allItems = Object.values(baseItems ?? {}).flat()
    const hero = {
        ...baseHero,
        talents,
        level: payload.l,
        stats: {
            health: payload.s[0],
            attack: payload.s[1],
            defence: payload.s[2],
            agility: payload.s[3]
        },
        items: Array.isArray(payload.e)
            ? payload.e.map(item => expandItem(item, allItems))
            : []
    }

    return hero
}
