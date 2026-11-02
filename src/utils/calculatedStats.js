import { MASTERWORK_MUTATION_DEFINITIONS, PERK_DEFINITIONS } from "../database/enums.jsx"

export const MAIN_STAT_PERKS = {
    health: { flat: "HEALTH_FLAT", percent: "HEALTH_PERCENT" },
    attack: { flat: "ATTACK_FLAT", percent: "ATTACK_PERCENT" },
    defence: { flat: "DEFENCE_FLAT", percent: "DEFENCE_PERCENT" },
    agility: { flat: "AGILITY_FLAT", percent: "AGILITY_PERCENT" },
}

const OTHER_STAT_DEFAULTS = {
    CRIT_CHANCE: 10, CRIT_RESISTANCE: 0, CRIT_DAMAGE: 150, CRIT_DAMAGE_REDUCTION: 0,
    ACCURACY: 10, RESISTANCE: 20, BOSS_DAMAGE: 0, BOSS_DAMAGE_REDUCTION: 0,
    AOE_DAMAGE_REDUCTION: 0, AP_DAMAGE_REDUCTION: 0, LIFE_STEAL: 0, HEALING_EFFICIENCY: 0,
    HEALING_RECEIVED: 0, FIRE_DAMAGE: 0, NATURE_DAMAGE: 0, WATER_DAMAGE: 0, LIGHT_DAMAGE: 0,
    SHADOW_DAMAGE: 0, FIRE_DAMAGE_REDUCTION: 0, NATURE_DAMAGE_REDUCTION: 0,
    WATER_DAMAGE_REDUCTION: 0, LIGHT_DAMAGE_REDUCTION: 0, SHADOW_DAMAGE_REDUCTION: 0,
}
const MUTATION_PERK_ALIASES = { HEAL_RECOVERY: "HEALING_RECEIVED" }
const ITEM_MAIN_STATS = { 0: "attack", 1: "defence", 2: "agility" }

function addValue(target, key, value) {
    target[key] = (target[key] ?? 0) + (Number(value) || 0)
}

function getItemPerkEntries(item) {
    const entries = []
    for (const perk of item?.fixedPerks ?? []) {
        const key = Object.keys(PERK_DEFINITIONS).find(name => PERK_DEFINITIONS[name].id === perk.id)
        if (key && key !== "NOTHING") entries.push({ key, value: Number(perk.value ?? 0), isFixed: true })
    }
    for (let index = 0; index < (item?.perks ?? []).length; index++) {
        const key = String(item.perks[index] ?? "NOTHING").toUpperCase().replace(/\s/g, "_")
        if (PERK_DEFINITIONS[key] && key !== "NOTHING") entries.push({ key, value: Number(item.perkValues?.[index] ?? 0), isFixed: false })
    }
    return entries
}

/** Calculates one item's perk contributions, including masterwork and mutations. */
export function calculateItemStats(item) {
    const perks = {}
    const maxPerks = {}
    if (!item) return { perks, maxPerks }
    const masterworkLevel = Math.max(0, Number(item.masterworkLevel) || 0)
    const masterworkMultiplier = 1 + masterworkLevel / 10
    const selectedMutations = []
    for (const milestone of [5, 10]) {
        if (masterworkLevel < milestone) continue
        const selection = item.mutations?.[milestone]
        if (!selection || typeof selection !== "object" || !selection.perkKey || selection.id == null) continue
        const mutation = MASTERWORK_MUTATION_DEFINITIONS[selection.perkKey]?.find(entry => entry.id === Number(selection.id))
        if (mutation) selectedMutations.push({ perkKey: selection.perkKey, mutation })
    }

    const itemMainStat = ITEM_MAIN_STATS[Number(item.mainAttribute)]
    for (const perk of getItemPerkEntries(item)) {
        let targetKey = perk.key
        if (targetKey === "MAIN_STAT_FLAT" || targetKey === "MAIN_STAT_PERCENT") {
            if (!itemMainStat) continue
            targetKey = targetKey === "MAIN_STAT_FLAT"
                ? MAIN_STAT_PERKS[itemMainStat].flat
                : MAIN_STAT_PERKS[itemMainStat].percent
        }
        const mutationKey = Object.keys(MUTATION_PERK_ALIASES).find(key => MUTATION_PERK_ALIASES[key] === targetKey) ?? targetKey
        const matchingMutations = perk.isFixed
            ? []
            : selectedMutations.filter(selection => selection.perkKey === targetKey || selection.perkKey === mutationKey)
        let normalMutationMultiplier = 1
        let maxMutationMultiplier = 1
        for (const { mutation } of matchingMutations) {
            const multiplier = 1 + (Number(mutation.bonusPercent) || 0) / 100
            maxMutationMultiplier *= multiplier
            if (mutation.condition === "permanent") normalMutationMultiplier *= multiplier
        }
        const masterworkScale = perk.isFixed ? masterworkMultiplier : 1
        addValue(perks, targetKey, perk.value * masterworkScale * normalMutationMultiplier)
        addValue(maxPerks, targetKey, perk.value * masterworkScale * maxMutationMultiplier)
    }
    return { perks, maxPerks }
}

/** Calculates final hero stats from base stats, equipped items and completed set bonuses. */
export function calculateHeroStats(hero, sets = []) {
    const perks = {}
    const maxPerks = {}
    const equippedItems = (hero?.items ?? []).filter(Boolean)
    const itemStats = equippedItems.map(item => ({ item, ...calculateItemStats(item) }))
    const setCounts = new Map()
    for (const { item, perks: itemPerks, maxPerks: itemMaxPerks } of itemStats) {
        if (item.set !== undefined && item.set !== null && item.set !== -1) setCounts.set(item.set, (setCounts.get(item.set) ?? 0) + 1)
        for (const [key, value] of Object.entries(itemPerks)) addValue(perks, key, value)
        for (const [key, value] of Object.entries(itemMaxPerks)) addValue(maxPerks, key, value)
    }
    const appliedSets = new Set()
    for (const { item } of itemStats) {
        if (item.set == null || item.set === -1 || appliedSets.has(item.set)) continue
        const set = (sets ?? []).find(entry => entry.id === item.set)
        if (!set || (setCounts.get(item.set) ?? 0) < Number(set.pieces ?? 0)) continue
        appliedSets.add(item.set)
        for (let index = 0; index < (set.setBonus ?? []).length; index++) {
            const perk = set.setBonus[index]
            const key = Object.keys(PERK_DEFINITIONS).find(name => PERK_DEFINITIONS[name].id === perk.id)
            if (!key) continue
            const value = item.setBonusValues?.[index] ?? 0
            addValue(perks, key, value)
            addValue(maxPerks, key, value)
        }
    }
    const main = {}, mainMax = {}
    for (const [name, mapping] of Object.entries(MAIN_STAT_PERKS)) {
        const base = Number(hero?.stats?.[name]) || 0
        const flat = perks[mapping.flat] ?? 0
        const percent = perks[mapping.percent] ?? 0
        const maxFlat = maxPerks[mapping.flat] ?? 0
        const maxPercent = maxPerks[mapping.percent] ?? 0
        main[name] = (base + flat) * (1 + percent / 100)
        mainMax[name] = (base + maxFlat) * (1 + maxPercent / 100)
    }
    const other = { ...OTHER_STAT_DEFAULTS }, otherMax = {}
    for (const [key, base] of Object.entries(OTHER_STAT_DEFAULTS)) {
        other[key] = base + (perks[key] ?? 0)
        otherMax[key] = base + (maxPerks[key] ?? 0)
    }
    return { main, mainMax, other, otherMax, itemStats }
}

/** Calculates every occupied team slot, preserving slot order and item-level results. */
export function calculateTeamStats(team, savedHeroes = [], sets = []) {
    return (team?.heroes ?? []).map(member => {
        if (member == null) return null
        const hero = typeof member === "object" ? member : (savedHeroes ?? []).find(savedHero => savedHero.saveId === member)
        return hero ? { hero, stats: calculateHeroStats(hero, sets) } : null
    })
}

export function formatCalculatedStatValue(value) {
    const rounded = Math.round((Number(value) || 0) * 100) / 100
    return String(rounded)
}
