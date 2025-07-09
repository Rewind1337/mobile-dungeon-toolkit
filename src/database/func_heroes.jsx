export function getStatsAtLevel(level, stats) {
    // Validate inputs
    if (level < 1 || !Number.isInteger(level)) {
        throw new Error("Level must be a positive integer");
    }
    if (!stats || typeof stats !== "object" ||
        !("health" in stats) || !("attack" in stats) ||
        !("defense" in stats) || !("agility" in stats)) {
        throw new Error("Stats must be an object with health, attack, defense, and agility properties");
    }

    // Per-level multipliers
    const multipliers = {
        health: 1.051,  // ~5.1% per level
        attack: 1.037,  // ~3.7% per level
        defense: 1.039, // ~3.9% per level
        agility: 1.041  // ~4.1% per level
    };

    // Upgrade multipliers
    const upgradeMultipliers = {
        health: 1.35,   // ~35% boost
        attack: 1.23,   // ~23% boost
        defense: 1.23,  // ~23% boost
        agility: 1.23   // ~23% boost
    };

    // Calculate number of upgrades (every 10 levels: 10, 20, 30, ...)
    let numUpgrades = Math.ceil(level / 10);

    // Calculate number of regular level-ups (level - 1, as Level 1 is base)
    const regularLevels = level - 1;

    // Initialize result object
    const newStats = {};

    // Calculate stats for each attribute
    for (const stat of ["health", "attack", "defense", "agility"]) {
        // Apply regular level-ups (compound growth)
        const baseGrowth = stats[stat] * Math.pow(multipliers[stat], regularLevels);
        // Apply upgrades
        const finalStat = baseGrowth * Math.pow(upgradeMultipliers[stat], numUpgrades);
        // Round to nearest integer
        newStats[stat] = Math.round(finalStat);
    }

    return newStats;
}