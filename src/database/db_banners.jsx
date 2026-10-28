let BASE_BANNERS = []

function add_banner(name, date, heroIDs, hasFeaturedHero = true, standardBanner = false, conditionalHeroIDs) {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    if (BASE_BANNERS.some(banner => banner.id === id)) {
        throw new Error(`Duplicate stable banner ID "${id}". Give the banner a distinct name.`)
    }

    const heroIds = [...heroIDs]
    BASE_BANNERS.push({
        id: id,
        name: name,
        lastLiveDate: date,
        heroIds: heroIds,
        featuredHeroId: (hasFeaturedHero ? heroIds[0] : null),
        standardBanner,
        conditionalHeroIDs
    })
}

export function init_banner_db() {
    add_banner("Everyday Heroes", null, [
        "lilith", "thor", "murdering_mass", "undead_dragon", "prellbog", "jack_o_lantern", "valkyre",
        "siren", "monk", "pele", "medusa",

        "lotte", "unicorn", "joanne", "gondolf", "robyn", "monika", "banshee",
        "bandit_captain", "werewolf", "construct", "ragnor", "yulamb", "golem", "alien",
        "scourge", "taurus", "margrethe", "cornelius", "sylvanna", "aqualon", "dr__pestilence",
        "mirage", "nerissa", "badgerer"
    ], false, true, [ "shakes", "fidget" ])

    add_banner("Banner 1", null, [
        "sphynx", "anubis", "bastet", "monk", "undead_dragon", "lilith", "lucifer",
        "cleo", "djinn", "unicorn", "alien", "scourge", "taurus", "construct"
    ])

    add_banner("Underworld Entities", null, [
        "lilith", "lucifer", "muzen", "isolde", "medusa", "black_skull_overlord", "krampus",
        "scourge", "black_skull_warrior", "candy_elemental", "legba", "yaotl", "badgerer", "black_skull_mage"
    ])

    add_banner("Heroes of the Olymp", null, [
        "aphrodite", "hephaestus", "athena", "hades", "siren", "cthulhu", "wendigo",
        "hermes", "ice_worm", "predator", "rudolph", "catalina", "orca", "drone"
    ])

    add_banner("Midgard's Might", null, [
        "heimdall", "loki", "odin", "valkyre", "thor", "sleipnir", "goblin_shredder",
        "jotunn", "war_bard", "sylvanna", "neanderthal", "candy_elemental", "black_skull_mage", "black_skull_warrior"
    ])

    add_banner("Monsters & Machines", null, [
        "cybork", "cthulhu", "goblin_shredder", "shroom_emperor", "shroom_empress", "davy_jane", "murdermachine",
        "dr__pestilence", "oil_elemental", "orkopter", "orkdozer", "flame_bruiser", "predator", "ice_worm"
    ])

    add_banner("Festive Legends", null, [
        "bastet", "lucifer", "sphynx", "krampus", "medusa", "black_skull_overlord", "isolde",
        "badgerer", "djinn", "candy_elemental", "legba", "rudolph", "black_skull_mage", "black_skull_warrior"
    ], false)

    add_banner("Horrors of the Night", null, [
        "headless_horseman", "mercy", "dracula", "arachnotaur", "wendigo", "medusa", "black_skull_overlord",
        "alice", "frankenstein", "witch", "jack_the_ripper", "nerissa", "assassin", "badgerer"
    ])

    add_banner("Next Evolution", null, [
        "buster", "gravitator", "cornelius_prime", "professor", "anubis", "bastet", "sphynx",
        "mirage", "buzzfreak", "desert_ranger", "doctress", "gnarler", "black_skull_mage", "cleo"
    ])

    add_banner("All or Nothing", null, [
        "jackbot", "emperor_fedget", "cthulhu", "phoenix", "thorne", "athena", "wendigo",
        "rudolph", "bonnie_bullet", "drorc", "rift_protector", "axolotty", "hermes", "ice_worm"
    ])

    add_banner("From the Shadows", null, [
        "rat_king", "high_priest_aureus", "odin", "heimdall", "sleipnir", "loki", "goblin_shredder",
        "wine_slime", "rapunzel", "jotunn", "war_bard", "candy_elemental", "black_skull_mage", "black_skull_warrior"
    ])

    add_banner("Deadly Symbiosis", null, [
        "tech_rex", "theron_dawnbreaker", "shroom_emperor", "shroom_empress", "davy_jane", "murdermachine", "cybork",
        "kinetra", "crumbly", "oil_elemental", "ice_worm", "orkdozer", "flame_bruiser", "predator"
    ])

    add_banner("Blinding Presence", null, [
        "ra", "mary", "mercy", "anubis", "sphynx", "headless_horseman", "arachnotaur",
        "butcher", "vena", "desert_ranger", "cleo", "alice", "witch", "assassin"
    ])

    add_banner("Tides of the Dead", null, [
        "capn__h__ollow", "itzala", "bastet", "cornelius_prime", "dracula", "black_skull_overlord", "buster",
        "jellica", "coatl", "jack_the_ripper", "frankenstein", "doctress", "gnarler", "black_skull_mage"
    ])

    add_banner("Manipulative Mindbreakers", null, [
        "countess_mortana", "vyper", "void_assassin", "drillbert", "beholder", "armadrax", "isolde",
        "cyntrix", "cheery", "hektor", "atomic_seagull", "woolinator", "ramgor", "candy_elemental"
    ])

    add_banner("Ruthless Hunters", null, [
        "elkfreddy", "apollo", "emperor_fedget", "cthulhu", "jackbot", "thorne", "wendigo",
        "rudolph", "kitsune", "draugr", "bonnie_bullet", "drorc", "rift_protector", "axolotty"
    ])

    add_banner("Cleansing Absolution", null, [
        "oozkar", "cruelty", "high_priest_aureus", "odin", "rat_king", "heimdall", "sleipnir",
        "snatchkin", "van_helsing", "rapunzel", "wine_slime", "jotunn", "war_bard", "black_skull_warrior"
    ])

    add_banner("Servants of Chaos", null, [
        "saphira", "catrina", "theron_dawnbreaker", "muzen", "tech_rex", "shroom_emperor", "shroom_empress",
        "dominique", "sulfurok", "kinetra", "crumbly", "orkdozer", "flame_bruiser", "oil_elemental"
    ])

    add_banner("Winged Apocalypse", null, [
        "loretta", "prince_belzar", "mary", "mercy", "ra", "murdermachine", "arachnotaur",
        "princess_trixie", "chronia", "butcher", "vena", "desert_ranger", "cleo", "assassin"
    ])

    add_banner("Timely Order", null, [
        "hizumi_exe", "aeterna", "itzala", "bastet", "capn__h__ollow", "black_skull_overlord", "dracula",
        "jellica", "clockmaster", "cybacker", "caotl", "frankenstein", "doctress", "black_skull_mage"
    ])

    add_banner("Weight of the Deep", null, [
        "nautor", "rodent_rangers", "vyper", "void_assassin", "countess_mortana", "beholder", "isolde",
        "cyntrix", "mariana", "bobbybot", "cheery", "hektor", "atomic_seagull", "candy_elemental"
    ])

    return BASE_BANNERS
}
