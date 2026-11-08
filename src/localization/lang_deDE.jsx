/**
 * German example locale.
 *
 * Only add fields that differ from the English database values. All omitted
 * names/descriptions continue to use the original database entry.
 */
const lang_deDE = {
    app: {
        navigation: {
            heroes: "Helden",
            items: "Gegenstände",
            teams: "Teams",
        },
        shared: {
            obtainedFrom: "Erhalten aus",
            usedFor: "Verwendet für",
            attributeNotSpecified: "Attribut nicht angegeben",
            notSpecified: "Nicht angegeben",
            none: "Keine",
            fixedPerks: "Feste Vorteile",
            setBonuses: "Setboni",
            notImplemented: "Noch nicht implementiert",
            special: "Spezial",
            buff: "Stärkung",
            debuff: "Schwächung",
            value: "Wert",
            perStack: "Pro Stapel",
            maxStacks: "Maximale Stapel",
            duration: "Dauer",
            turn: "Runde",
            turns: "Runden",
            tick: "Tick",
            stat: "Attribut",
            dropSource: "Beutequelle",
            unspecified: "Nicht angegeben",
            guildHuntShort: "GJ",
            shareTypes: {
                hero: "Held",
                item: "Gegenstand",
                items: "ausgerüstete Gegenstände",
            },
            shareErrors: {
                selectValidItemBeforeExport: "Wähle einen gültigen Gegenstand aus, bevor du ihn exportierst.",
                noEquippedItemsToExport: "Dieser Held hat keine ausgerüsteten Gegenstände zum Exportieren.",
                pasteShareLinkOrEncodedData: "Füge einen Freigabelink oder die codierten Daten ein.",
                invalidShareLink: "Das sieht nicht nach einem gültigen Freigabelink aus.",
                missingShareData: "Dieser Link enthält keine Freigabedaten für {{type}}.",
                invalidHeroShareLink: "Dieser Heldenlink ist ungültig oder verwendet eine nicht unterstützte Formatversion.",
                invalidItemShareLink: "Dieser Gegenstandslink ist ungültig oder verwendet eine nicht unterstützte Formatversion.",
                invalidItemsShareLink: "Dieser Link für ausgerüstete Gegenstände ist ungültig oder verwendet eine nicht unterstützte Formatversion.",
                heroNotInCurrentDatabase: "Dieser Held ist nicht in der aktuellen Toolkit-Datenbank vorhanden.",
                invalidTeamShareLink: "Dieser Teamlink ist ungültig oder verwendet eine nicht unterstützte Formatversion.",
            },
            offensive: "Offensiv",
            defensive: "Defensiv",
            control: "Kontrolle",
            support: "Unterstützung",
            // Shared catalogue labels
            items: "Gegenstände",
            sets: "Sets",
            heroes: "Helden",
            banners: "Banner",
            skills: "Fähigkeiten",
            talentEntries: "Talenteinträge",
            perks: "Vorteile",
            statusEffects: "Statuseffekte",
            resources: "Ressourcen",
            gemTypes: "Edelsteintypen",
            // Shared stats and elements
            attribute: "Attribut",
            attributes: "Attribute",
            element: "Element",
            role: "Rolle",
            rarity: "Seltenheit",
            set: "Set",
            twoPieceSets: "2-Teile-Sets",
            fourPieceSets: "4-Teile-Sets",
        },
        pages: {
            // Reused page titles
            adventureChapters: { title: "Abenteuerkapitel" },
            towers: { title: "Türme" },
            titans: { title: "Titanen" },
            guildHunt: { title: "Gildenjagd" },
            footer: "Das Spiel {{game}} und alle hier verwendeten Bilder gehören {{publisher}}. Diese Seite ist in keiner Weise mit {{publisher}} verbunden. Schriftarten von {{fontProvider}}",
            // Simulator overview
            simulators: {
                description: "Wähle oben einen Simulator aus, um Begegnungen anzusehen oder einen eigenen Kampf zusammenzustellen.",
            },
            magicToilet: {
                soulsUsed: "Verwendete Seelen",
                shimmeringSoulsUsed: "Verwendete schimmernde Seelen",
                notEnoughPullsYet: "Noch nicht genug Ziehungen",
                extremelyLucky: "Unglaubliches Glück",
                lucky: "Glücklich",
                aroundAverage: "Etwa im Durchschnitt",
                unlucky: "Pech",
                veryUnlucky: "Sehr viel Pech",
            },
        },
    },
    data: {
        overrides: {
            // Hero translations
            hero: {
                thor: { name: "Thor" },
                undead_dragon: { name: "Untoter Drache" },
            },
            // Item translations
            item: {
                "weapon:pumpkin_scythe": {
                    name: "Kürbissense",
                    effects: {
                        unique: "Mit einer Chance von {{chance}} erhältst du bei einem besiegten Gegner einen zusätzlichen Zug.",
                    },
                },
                "weapon:hydras_bite": {
                    name: "Hydras Biss",
                    effects: {
                        unique: "Kritische Treffer haben eine Chance von {{chance}}, {{status}} beim Ziel für {{duration}} Runden auszulösen.",
                    },
                },
            },
            set: {
                breaker: { name: "Brecher" },
            },
            skill: {
                "thor:0": { name: "Mjölnir", description: "Trifft einen einzelnen Gegner mit einem Lichtangriff." },
            },
            talent: {
                "thor:21": { name: "Kriegergeist", description: "Erhöht den kritischen Schaden des Helden." },
            },
            perk: {
                HEALTH_PERCENT: { name: "Lebenspunkte in Prozent", description: "Erhöht die maximalen Lebenspunkte prozentual." },
                ATTACK_PERCENT: { name: "Angriff in Prozent" },
                CRIT_CHANCE: { name: "Kritische Trefferchance" },
            },
            status: {
                burn: { name: "Verbrennung", description: "Fügt Schaden zu, wenn das betroffene Ziel angegriffen wird." },
                poison: { name: "Gift", description: "Verursacht zu Beginn eines Zuges Schaden über Zeit." },
                mute: { name: "Stumm", description: "Beschränkt Fertigkeiten auf den Basisangriff." },
            },
            banner: {
                everyday_heroes: { name: "Alltagshelden", conditionalHeroCondition: "Freigeschaltet nach Abschluss von Kapitel 15 – Dungeon 2" },
            },
            resource: {
                crystal: { name: "Kristall", description: "Beispiel einer übersetzten Ressourcenbeschreibung." },
            },
            gem: {
                ruby_common: { name: "Gewöhnlicher Rubin", description: "Ein gewöhnlicher roter Edelstein." },
            },
            masterworkMutation: {
                "AGILITY_PERCENT:1": { name: "+20 %, wenn keine Verbündeten besiegt sind" },
            },
            attribute: {
                STRENGTH: { name: "Stärke" },
                DEXTERITY: { name: "Geschicklichkeit" },
                INTELLIGENCE: { name: "Intelligenz" },
                NONE: { name: "Alle Attribute" },
            },
            element: { FIRE: { name: "Feuer" }, LIGHT: { name: "Licht" } },
            role: { OFFENSIVE: { name: "Offensiv" }, DEFENSIVE: { name: "Defensiv" } },
            rarity: { LEGENDARY: { name: "Legendär" }, EPIC: { name: "Episch" } },
            equipmentSlot: { WEAPON: { name: "Waffe" }, HELMET: { name: "Helm" }, ARMOR: { name: "Rüstung" }, NECKLACE: { name: "Halskette" }, RING: { name: "Ring" } },
            resourceLocation: {
                CHAPEL: { name: "Kapelle" },
                TAVERN: { name: "Taverne" },
                ARENA: { name: "Arena" },
                GUILD_HUNT: { name: "Gildenjagd" },
                MAGIC_TOILET: { name: "Magische Toilette (Spülung)" },
                REGULAR_SHOP: { name: "Regulärer Shop (Händler)" },
                DUNGEON_SHOP: { name: "Dungeon-Shop (Händler)" },
            },
            primaryStat: {
                ATTACK: { name: "Angriff" },
                DEFENCE: { name: "Verteidigung" },
                AGILITY: { name: "Beweglichkeit" },
            },
            dropSource: {
                EVERYWHERE: { name: "Überall" },
                GUILD_HUNT: { name: "Gildenjagd" },
            },
        },
    },
}

export default lang_deDE
