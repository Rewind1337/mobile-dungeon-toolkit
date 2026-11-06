/**
 * English (United States) source language.
 *
 * Keep keys grouped by app area and use dot-separated paths when calling
 * useTranslation(), e.g. "app.pages.heroes.filters.search".
 */
const lang_enUS = {
    app: {
        navigation: {
            heroes: "Heroes",
            items: "Items",
            teams: "Teams",
            home: "Home",
            games: "Fun & Games",
            simulators: "Simulators",
            wiki: "Wiki",
        },
        shared: {
            // shared search
            search: "Search",
            searchHeroPlaceholder: "Name, skill, talent, effect...",
            searchItemPlaceholder: "Name, perk, effect...",

            // shared stats
            allAttributes: "All attributes",
            mainAttribute: "Main attribute",
            attribute: "Attribute",
            attributes: "{{attribute}}s",
            strength: "Strength",
            health: "Health",
            attack: "Attack",
            defence: "Defence",
            agility: "Agility",
            max: "MAX",
            primary: "Primary",
            secondary: "Secondary",
            ultimate: "Ultimate",
            skillNumber: "Skill {{number}}",
            dexterity: "Dexterity",
            intelligence: "Intelligence",

            // shared elements
            element: "Element",
            void: "Void",
            fire: "Fire",
            water: "Water",
            nature: "Nature",
            light: "Light",
            shadow: "Shadow",

            // shared roles
            role: "Role",
            offensive: "Offensive",
            defensive: "Defensive",
            control: "Control",
            support: "Support",

            // shared rarities
            rarity: "Rarity",
            filterByRarity: "Filter by rarity",
            common: "Common",
            uncommon: "Uncommon",
            rare: "Rare",
            epic: "Epic",
            legendary: "Legendary",
            mythic: "Mythic",
            heroic: "Heroic",
            divine: "Divine",
            ancient: "Ancient",
            unique: "Unique",
            notUnique: "Not Unique",
            allRarities: "All rarities",

            // shared equipment and sets
            slotLabel: "Slot",
            allSlots: "All slots",
            other: "Other",
            weapon: "Weapon",
            helmet: "Helmet",
            armor: "Armor",
            ring: "Ring",
            necklace: "Necklace",
            set: "Set",
            noSet: "No Set",
            twoPieceSet: "2-piece set",
            fourPieceSet: "4-piece set",
            twoPieceSets: "2-piece sets",
            fourPieceSets: "4-piece sets",
            perks: "Perks",
            skillsAndTalents: "Skills & Talents",

            // shared status effects
            statusEffects: "Status Effects",
            buffs: "Buffs",
            debuffs: "Debuffs",
            otherUnclassified: "Other / unclassified",
            buff: "Buff",
            debuff: "Debuff",
            special: "Special",
            notMitigatableTooltip: "Not mitigatable",
            mitigatable: "Mitigatable",
            mitigatableTooltip: "Mitigatable",
            notRemovableTooltip: "Not removable",
            removable: "Removable",
            removableTooltip: "Removable",
            no: "No",
            yes: "Yes",
            noStatusEffectsDetected: "No status effects detected.",

            // shared effect values
            noDescriptionRecorded: "No description recorded.",
            value: "Value",
            perStack: "Per stack",
            maxStacks: "Max stacks",
            duration: "Duration",
            tick: "Tick",
            stat: "Stat",
            uniqueEffect: "Unique Effect",
            notChangeable: "not changeable",
            effective: "Effective",
            flat: "Flat",
            percent: "%",
            effectData: "Effect data",
            cooldownTurns: "Cooldown: {{count}} Turns",
            conditional: "Conditional",
            chance: "{{percent}}% chance",
            fixedPerks: "Fixed perks",
            setBonuses: "Set bonuses",

            // shared sources and labels
            allSources: "All sources",
            notImplemented: "Not implemented",
            setName: "Set: {{name}}",
            obtainedFrom: "Obtained from",
            usedFor: "Used for",
            attributeNotSpecified: "Attribute not specified",
            notSpecified: "Not specified",
            none: "None",
            dropSource: "Drop Source",
            unspecified: "Unspecified",
            guildHuntShort: "GH",
            lastLive: "Last live: {{date}}",

            // shared hero and item states
            legendaryHeroes: "Legendary Heroes",
            epicHeroes: "Epic Heroes",
            otherHeroes: "Other Heroes",
            missingReferencedHeroes: "{{count}} referenced {{noun}} not defined in the hero database.",
            missingHeroSingular: "hero is",
            missingHeroPlural: "heroes are",
            noHeroesAssigned: "No heroes assigned yet.",
            noHeroesMatchFilters: "No heroes match the selected filters",
            noItemsMatchFilters: "No items match the selected filters",
            emptySlot: "Empty Slot",
            savedTeam: "Saved Team",
            noneRecorded: "None recorded",
            unnamedSkill: "Unnamed skill",
            unnamedTalent: "Unnamed talent",

            // shared management
            heroManagement: "Hero Management",
            itemManagement: "Item Management",
            teamManagement: "Team Management",
            allItems: "All Items",
            yourSavedItems: "Your Saved Items",
            savedHeroes: "Saved Heroes",
            savedItems: "Saved Items",
            allHeroes: "All Heroes",
            selectPerk: "Select Perk",
            allPerksSelected: "All available perks are already selected on this item.",
            saveHero: "Save Hero",
            exportHero: "Export Hero",
            deleteSavedHero: "Delete Saved Hero",
            saveItem: "Save Item",
            exportItem: "Export Item",
            deleteSavedItem: "Delete Saved Item",
            equipItem: "Equip Item",
            deselectHero: "Deselect Hero",
            deselectItem: "Deselect Item",

            // shared imports and exports
            importHero: "Import Hero",
            importItem: "Import Item",
            importingHero: "Importing Hero...",
            importingItem: "Importing Item...",
            pasteHeroShare: "Paste a hero share link below. You can also paste the encoded data by itself.",
            pasteHeroSharePrompt: "Paste a hero share link or its encoded data.",
            pasteItemShare: "Paste an item share link, an equipped-items link, or the encoded data itself.",
            pasteItemSharePrompt: "Paste an item share link or its encoded data.",
            couldNotImportHero: "Could not import this hero link.",
            couldNotImportItem: "Could not import this item.",
            couldNotExportItem: "Could not export this item.",
            itemExportDescription: "Share this link to import this configured item into Saved Items.",
            linkCopied: "Link Copied!",
            copyItemLink: "Copy Item Link",
            copyHeroLink: "Copy Hero Link",
            copyItemsLink: "Copy Items Link",
            heroLinkCopied: "Hero Link Copied!",
            itemsLinkCopied: "Items Link Copied!",
            copyingBlocked: "Copying was blocked by your browser. Select and copy the link manually.",

            // shared controls
            help: "Help",
            showFilters: "Show filters",
            hideFilters: "Hide filters",
            clearFilters: "Clear filters",
            sortOrder: "Sort Order",
            alphabetic: "Alphabetic",
            level: "Level",
            all: "All",
            close: "Close",
            cancel: "Cancel",
            confirm: "Confirm",
            selectHero: "Select a Hero",
            comingSoon: "Coming soon",
            loading: "Loading...",
            slot: "Slot {{number}}",
            backToTop: "Back to top",
            expand: "Expand",
            showList: "Show List",

            // shared tooltips
            helpForTooltip: "Help for {{title}}",
            showOrHideAdvancedFiltersTooltip: "Show or hide advanced filters",
            showStarredHeroesTooltip: "Show starred heroes only",
            strengthTooltip: "Strength",
            dexterityTooltip: "Dexterity",
            intelligenceTooltip: "Intelligence",
            fireTooltip: "Fire",
            waterTooltip: "Water",
            natureTooltip: "Nature",
            lightTooltip: "Light",
            shadowTooltip: "Shadow",
            offensiveTooltip: "Offensive",
            defensiveTooltip: "Defensive",
            controlTooltip: "Control",
            supportTooltip: "Support",
            commonTooltip: "Common",
            uncommonTooltip: "Uncommon",
            rareTooltip: "Rare",
            epicTooltip: "Epic",
            legendaryTooltip: "Legendary",
            mythicTooltip: "Mythic",
            heroicTooltip: "Heroic",
            divineTooltip: "Divine",
            ancientTooltip: "Ancient",
            weaponTooltip: "Weapon",
            helmetTooltip: "Helmet",
            armorTooltip: "Armor",
            ringTooltip: "Ring",
            necklaceTooltip: "Necklace",
            strengthRequirementTooltip: "Strength requirement",
            dexterityRequirementTooltip: "Dexterity requirement",
            intelligenceRequirementTooltip: "Intelligence requirement",
            uniqueItemsTooltip: "Unique items",
            itemsWithTwoPieceSetsTooltip: "Items with 2-piece sets",
            itemsWithFourPieceSetsTooltip: "Items with 4-piece sets",
            damagedItemLockedTooltip: "Damaged item — perk changes are locked",
            showHeroListTooltip: "Show hero list",
            showItemListTooltip: "Show item list",
            expandPreviewTooltip: "Expand preview to full width",
            deselectHeroClosePreviewTooltip: "Deselect this hero and close the preview",
            deselectItemClosePreviewTooltip: "Deselect this item and close the preview",
            scrollListToTopTooltip: "Scroll this list back to the top",
            clearAllFiltersTooltip: "Clear all filters",
        },
        pages: {
            // Reset timers
            resetTimers: {
                daily: "Daily Reset",
                weekly: "Weekly Reset",
                zeroSeconds: "0 seconds",
                units: {
                    day: { one: "day", other: "days" },
                    hour: { one: "hour", other: "hours" },
                    minute: { one: "minute", other: "minutes" },
                    second: { one: "second", other: "seconds" },
                },
            },
            
            // Hero management and preview
            heroes: {

                // Hero preview
                preview: {
                    exportItemsOnly: "Export Items only",
                    exportItemsOnHero: "Export items on hero",
                    shareDescription: "Share this link to import the hero, level, stats, and talents.",
                    itemsShareDescription: "This hero link also includes the equipped items. The separate link below only imports the Items.",
                    itemsOnlyDescription: "This item link only includes the equipped items, not the hero. The first link above can import the hero as well.",
                    skills: "Skills",
                    talents: "Talents",
                    equippedItems: "Equipped Items",
                    mainStats: "Main Stats",
                    calculatedStats: "Calculated Stats",
                    calculatedStatsNoteTooltip: "These calculations are experimental and may be incorrect or incomplete.",
                    otherStats: "Other Stats",
                    otherSlot: "Other Slot",
                    otherSlotUnavailableTooltip: "The Other equipment slot is not implemented yet",
                    finalStatTooltip: "Final {{name}} after equipped gear",
                    exportEquippedItemsError: "Could not export equipped items.",
                },

                // Hero catalogue filters
                filters: {
                    searchPlaceholder: "Name, skill, talent, effect, ID…",
                    allElements: "All elements",
                    allRoles: "All roles",
                    starred: "Starred",
                },
            },

            // Item management and preview
            items: {

                // Item preview
                preview: {
                    selectItem: "Select an Item",
                    rarityDecrease: "Rarity - 1",
                    rarityIncrease: "Rarity + 1",
                    masterworkLevel: "Masterwork - Level {{level}} / {{maxLevel}}",
                    masterworkDecrease: "Masterwork - 1",
                    masterworkIncrease: "Masterwork + 1",
                    damagedItem: "Damaged item (locks perk changes)",
                    masterworkMutations: "Masterwork Mutations",
                    firstMutation: "First Mutation",
                    secondMutation: "Second Mutation",
                    unlockedAtMasterwork: "Unlocked at Masterwork {{level}}",
                    conditionalMutationNote: "Conditional mutations contribute to MAX; permanent mutations affect the calculated value.",
                    weaponEffect: "Weapon Effect",
                    missingRarityValueTooltip: "No value is defined for this rarity yet; showing the highest available value.",
                    fixedItemPerks: "Fixed Item Perks",
                    setBonus: "Set Bonus",
                    active: "Active",
                    inactive: "Inactive",
                    noPerks: "No perks available",
                },

                // Item catalogue filters
                filters: {
                    searchPlaceholder: "Name, effect text, perk, set, source, ID…",
                    source: "Source",
                    location: "Location",
                    allLocations: "All locations",
                    setAttribute: "Set attribute",
                    setPieces: "Set pieces",
                    allSets: "All sets",
                    twoPieceSets: "2 Piece Sets",
                    fourPieceSets: "4 Piece Sets",
                    itemType: "Item type",
                    allItems: "All items",
                },
            },

            // Team management
            teams: {

                // Team navigation and editing
                savedTeams: "Saved Teams",
                recommendedTeams: "Recommended Teams",
                importTeam: "Import Team",
                collapse: "Collapse",
                expandTeamDetailsTooltip: "Expand team details",
                collapseTeamDetailsTooltip: "Collapse team details",
                clearTeam: "Clear Team",
                duplicate: "Duplicate",
                exportTeam: "Export Team",
                deleteTeam: "Delete Team",
                noTeams: "No teams yet. Create one to get started.",
                noOtherSlotTooltip: "Other slot (not implemented yet)",
                heroSlotTooltip: "{{hero}} · {{slot}}",
                statusEffectsTooltip: "Status effects: {{label}}",
                baseStatTooltip: "{{hero}} · {{stat}}",
                equippedItemsTooltip: "{{name}}'s equipped items",
                statusIcons: "{{name}} buffs and debuffs: {{statuses}}",

                // Team sharing and import/export
                createNewTeam: "Create New Team",
                includeEquippedItems: "Include equipped items on heroes",
                shareTeamDescription: "Share this link to import the team and its saved heroes.",
                teamLinkCopied: "Team Link Copied!",
                copyTeamLink: "Copy Team Link",
                pasteShareLink: "Paste a team share link or its encoded data.",
                chooseHero: "Choose a Hero",
                chooseSavedHeroPrompt: "Choose a saved hero for this slot.",
                noSavedHeroes: "You have no saved heroes yet. Save a hero first, then return here.",
                couldNotExport: "Could not export this team.",
                couldNotExportHeroes: "Could not export this team's heroes.",
                couldNotImport: "Could not import this team.",
            },

            // Wiki overview
            wiki: {

                // Text
                description: "Explore the heroes, banners, equipment, gems, resources, perks, skills, talents, and status effects tracked by the toolkit. Use the catalogue navigation above to browse each collection.",
                dataOverview: "Data Overview",
                dataDistribution: "Distribution of the currently loaded data.",
                heroOverview: "Hero Overview",
                heroDistribution: "Distribution of the currently loaded hero data.",
                itemOverview: "Item Overview",
                itemDistribution: "Distribution of the currently loaded item database.",

                dataCountNote: "Counts reflect the data currently loaded in the project. Skills and talent entries are counted per hero, so repeated names are included.",
                showEntriesTooltip: "Show {{label}} entries in the catalogue",
                loadingCatalogue: "Loading catalogue...",

                // Navigation buttons
                heroesAndBanners: "Heroes & Banners",
                itemsAndSets: "Items & Sets",
                statusCatalogue: "Status Catalogue",
                statuses: "Statuses",
                resourcesAndGems: "Resources & Gems",

                // Overview "By X" labels
                byElement: "By element",
                byRarity: "By rarity",
                byRole: "By role",
                byMainAttribute: "By main attribute",
                bySlot: "By slot",
                byDropSource: "By drop source",
                dungeonDrops: "Dungeon drops",
                guildHuntDrops: "Guild Hunt drops",
            },

            // Simulator encounter selection and stage details
            simulatorEntries: {

                // Selection labels
                selectChapter: "Select Chapter",
                selectAChapter: "Select a Chapter",
                selectTower: "Select Tower",
                selectATower: "Select a Tower",
                selectTitan: "Select Titan",
                selectATitan: "Select a Titan",
                selectGuildBoss: "Select Guild Boss",
                selectAGuildBoss: "Select a Guild Boss",
                
                // Stage titles
                towerTitle: "Tower {{number}} - {{name}}",
                titanTitle: "{{element}} Titan - {{name}}",
                guildBossTitle: "Guild Boss - {{name}}",
                chapterTitle: "Chapter {{number}} - {{name}}{{threshold}}",
                thresholdSuffix: " - Threshold {{number}}",
                shadowWorldThresholdTooltip: "Shadow World {{number}} · Threshold {{number}}",
                shadowWorldShort: "SW {{number}}",
                stages: "Stages",
                stage: "Stage",

                // Empty stage titles
                noStageEntries: "No stage entries have been defined yet.",
                noTowerStages: "No tower stage entries have been defined yet.",
                noTitanStages: "No titan stage entries have been defined yet.",
                noGuildBossStages: "No guild boss stage entries have been defined yet.",
            },

            // Custom combat
            customCombat: {
                title: "Custom Combat",
                description: "Choose the two saved teams that should face each other. The same team can be selected for both sides.",
                teamOne: "Combat Team 1",
                teamTwo: "Combat Team 2",
                createTeamPrompt: "Create a saved team on the Teams page to use it in Custom Combat.",
            },

            // Catalogue pages
            catalogues: {

                // Hero catalogue
                heroTitle: "Hero Catalogue",
                heroDescription: "Search heroes, skills, talents, effects, attributes, rarity, element, role, and other stored hero data.",
                noHeroesMatch: "No heroes match these filters.",

                // Banner catalogue
                banners: "Banners",
                bannerTitle: "Banner Catalogue",
                bannerSearchPlaceholder: "Search banners, heroes, and details...",
                noBannersMatch: "No banners match that search.",
                listedHeroes: "{{count}} listed heroes",
                standardBanner: "Standard banner",
                featuredHero: "Featured: {{name}}",
                estimatedBannerDateTooltip: "Estimated from the previous and next banner dates",
                recordedLastLiveDateTooltip: "Recorded last-live date",
                alwaysAvailable: "Always available",
                conditionalHeroes: "Conditional Heroes",
                bannerDataMissing: "Banner data is incomplete.",

                // Hero Tier List
                tierList: "Tier List",
                heroTierListTitle: "Hero Tier List",
                noTierPlacements: "No tier placements have been defined yet.",
                bannerDescription: "Browse the banner definitions and their included heroes. Filter by hero name, rarity, element, role, main attribute, and starred status.",
                tierListDescription: "Tier List view. Tier placements are not currently defined in the project data.",

                // Item catalogue
                itemTitle: "Item Catalogue",
                itemDescription: "Search item names, unique-effect descriptions, fixed perks, rarity, drop source, location, and other stored item data.",
                variant: "Variant: {{name}}",
                noItemsMatch: "No items match these filters.",

                // Set catalogue
                setTitle: "Set Catalogue",
                setDescription: "Browse item sets, their required attributes, drop locations, set pieces, and set bonuses.",
                noSetsMatch: "No sets match these filters.",
                piecesCount: "Pieces ({{count}})",
                noSetPieces: "No item pieces are currently linked to this set in the item database.",

                // Perk catalogue
                perkTitle: "Perk Catalogue",
                perkDescription: "Each perk is listed once, alongside the equipment slots it can roll on.",
                perkSearchPlaceholder: "Search perks or equipment slots…",
                noPerksMatch: "No perks match this search.",

                // Status catalogue
                statusTitle: "Status Effect Catalogue",
                statusDescription: "A searchable reference for the status effects currently defined in the project, including their recorded mechanics.",
                statusProgress: "Some status-effect values and mechanics are not yet interpreted or verified correctly. Treat these details as provisional; the underlying values have not been changed.",
                statusSearchPlaceholder: "Name, effect, stat, mechanic…",
                category: "Category",
                allCategories: "All categories",
                specialEffects: "Special Effects",
                noStatusesMatch: "No status effects match these filters.",

                // Resource catalogue
                resourceTitle: "Resource Catalogue",
                resources: "Resources",
                resourceDescription: "Browse defined resources. Search matches resource names and descriptions.",
                resourcesPlaceholder: "Search resources...",
                noResourcesMatch: "No resources match that search.",

                // Gem catalogue
                gemTitle: "Gem Catalogue",
                gems: "Gems",
                gemDescription: "Browse every defined rarity of each gem, grouped by gem type.",
                gemsPlaceholder: "Search gems...",
                dungeon: "Dungeon",
                allDungeons: "All dungeons",
                rarities: "{{count}} rarities",
                noGemsMatch: "No gems match that search.",

                // Skill catalogues
                skillsTitle: "Skills Catalogue",
                skillsDescription: "Every skill currently present in the hero database, with its source hero.",
                skillTab: "Skill Catalogue",
                noSkillsMatch: "No skills match this search.",
                
                // Talent catalogues
                talentsTitle: "Talents Catalogue",
                talentsDescription: "Every unique talent currently present in the hero database, with its source hero and position. Shared talents list all source heroes.",
                talentTab: "Talent Catalogue",
                noTalentsMatch: "No talents match this search.",

                // Shared Catalogue Labels
                searchCount: "Search ({{resultCount}} of {{totalCount}})",
                skillsTalentsPlaceholder: "Name, hero, effect…",
                skillsTalentsProgress: "This section is still in progress; some skill and talent data may be incomplete.",
                usedFor: "Used for",
                allUses: "All uses",
                obtainedFrom: "Obtained from",
                catalogueProgress: "This section is still in progress; entries and descriptions may be incomplete.",

            },

            // Magic Toilet simulator
            magicToilet: {

                // Simulator heading and banner configuration
                title: "Magic Toilet",
                description: "Simulate banner flushes, track Epic and Legendary pity, and compare your Legendary results with the expected average.",
                viewSelectedBanner: "View selected Banner",
                banner: "Banner",
                currentEpicPity: "Current Epic Pity",
                currentLegendaryPity: "Current Legendary Pity",
                flushAmount: "Flush amount",
                epicPity: "Epic pity: {{count}}",
                legendaryPity: "Legendary pity: {{count}}",
                legendaryBooster: "Legendary Banner Booster",
                epicBooster: "Epic Banner Booster",
                flushOne: "Flush 1",
                flushAmountButton: "Flush {{count}}",
                flushUntilLegendary: "Flush until Legendary",
                flushUntilLegendaryTooltip: "Automatically flush until a Legendary rarity is rolled.",
                flushUntilBoosted: "Flush until Boosted",
                flushUntilBoostedTooltip: "Flush until one of your selected boosted heroes is pulled",
                dontResetBoosters: "Don't reset Boosters",
                selectBoostedHero: "Select your boosted hero to enable flushing.",

                // Pull statistics and results
                epicBoostersUsed: "Epic Boosters used: {{count}}",
                legendaryBoostersUsed: "Legendary Boosters used: {{count}}",
                rarityCount: "{{rarity}} ({{chance}}): {{count}}",
                expectedLegendaries: "Expected Legendaries: {{count}}",
                luck: "Luck: {{value}}",
                pulledHeroes: "Pulled Heroes ({{count}})",
                onlyDefinedHeroes: "Only defined Epic and Legendary heroes are shown.",
                resetResults: "Reset Results",
                legendaryHeroes: "Legendary Heroes ({{count}})",
                epicHeroes: "Epic Heroes ({{count}})",
                noLegendaryPulled: "No Legendary heroes pulled yet.",
                noEpicPulled: "No Epic heroes pulled yet.",
            },

            // Guide Page Content
            guides: {

                // Heroes Guide
                heroEyebrow: "Hero management guide",
                heroTitle: "Find the right hero, then build them up",
                heroLeadCopy: "The Heroes page is your working roster. Browse the full collection, keep personal builds in Saved Heroes, and use the preview to tune a hero before adding them to a team.",
                exampleHeroes: "Example heroes",
                heroPreview: "Selecting a hero opens their preview with their attributes, equipment slots, main stats, calculated stats, skills, talents, and other stat details.",
                searchCombineFilters: "Search and combine filters",
                heroStep1: "Search by hero name or details, then combine Rarity, Main Attribute, Element, Role, and Starred. Use Sort Order to switch between Alphabetic, Rarity, and Level.",
                inspectPreview: "Inspect the preview",
                heroStep2: "Select a hero to open the preview. Expand it for more room, review the stat breakdown, and click an equipment slot to choose an item for that hero.",
                saveHero: "Save your hero",
                heroStep3: "Use Save Hero in the preview to keep the configured version for later. Saved heroes can be selected when building teams. Use Import Hero to bring in a shared hero via link or code.",
                modifyBuilds: "Modify your builds",
                heroStep4: "Continue modifying and tweaking your heroes in the 'Saved Heroes' Tab. Export your builds and share them with your mates, while comparing them against eachother.",
                savedBuildTip: "Each saved hero is a separate build, so you can keep multiple configured versions of the same hero, if you need to.",

                // Items Guide
                itemEyebrow: "Item management guide",
                itemTitle: "Compare equipment and create your builds",
                itemLeadCopy: "Use the item list to find equipment, then open its preview to inspect and adjust its rarity, perks, set information, and other available properties.",
                exampleEquipment: "Example equipment",
                narrowList: "Narrow down the list",
                itemStep1: "Search item names and effect text. Combine Slot, Attribute Requirement, and Item type filters; use Sort Order to organize the results. Saved Items also includes the Rarity filter.",
                inspectItem: "Inspect an item",
                itemStep2: "Select an item to open its preview. Depending on the item, you can review weapon effects, fixed and rolled perks, set bonuses, masterwork levels, and mutations.",
                saveItem: "Save your item",
                itemStep3: "Save a configured item to Saved Items for use in teams and hero previews. Saved items can be selected when equipping heroes. Use Import Item to bring in a shared item via link or code.",
                itemStep4: "Continue modifying and tweaking your items in the 'Saved Items' Tab. Export your builds and share them with your mates, while comparing them against eachother.",
                itemTipExtra: " You can even equip the same item on multiple heroes at once!",

                // Team Guide
                teamsEyebrow: "Team management",
                teamsTitle: "Bring five saved heroes together",
                teamLeadCopy: "Teams let you assemble a lineup from your Saved Heroes and see how their attributes, equipment, and effects work together.",
                exampleLineup: "Example lineup",
                createNameTeams: "Create and name teams",
                teamStep1: "Start with the default team or use New Team to add another. Give each team a name that makes its purpose easy to recognize.",
                fillHeroSlots: "Fill the five hero slots",
                teamStep2: "Select an empty slot and choose one of your saved heroes. Each slot can hold one saved hero; open the hero preview to adjust that build before assigning it.",
                reviewTeamSummary: "Review the team summary",
                teamStep3: "Expand a team to inspect its combined attributes, detected buffs and debuffs, hero stats, and equipped items. Collapse it when you want to focus on another team.",
                organizeRoster: "Keep your roster organized",
                teamStep4: "Duplicate a team to use it as a starting point, or clear and delete teams you no longer need. Team edits are saved automatically.",
                exportFullTeams: "Export full teams",
                teamStep5: "Export the full team with or without the equipped items, fully supported!",
                teamTip: "Set up and save the individual item and hero builds first, to save you some trouble later! When importing a full team, each hero and each item will be saved separately alongside the team.",

                // Simulator Guide
                simulatorTitle: "Test banner pulls without spending resources",
                simulatorLeadCopy: "Magic Toilet is currently the only available simulator. It recreates the banner rarity rolls and lets you experiment with pity and banner boosters.",
                trackUsage: "Track your simulated usage!",
                chooseBannerPity: "Choose a banner and starting pity",
                simulatorStep1: "Select the banner you want to simulate. Current Epic Pity and Current Legendary Pity can be adjusted directly and then decrement as pulls are simulated.",
                configureBoosters: "Configure optional boosters",
                simulatorStep2: "Enable a Legendary or Epic Banner Booster and choose its target hero. With 'Don't reset Boosters' off, a booster is consumed by the next pull of its rarity. Turn it on to keep the selected target active across pulls.",
                chooseFlush: "Choose how to flush",
                simulatorStep3: "Flush once, use the selected batch size, or continue until a Legendary appears. With persistent boosters enabled, 'Flush until Boosted' continues until one of your selected boosted heroes is pulled.",
                reviewResults: "Review the results",
                simulatorStep4: "The stats row tracks pulls, souls, booster usage, rarity counts, expected Legendaries, and luck. Separate result rows show the Legendary and Epic heroes pulled.",
                simulatorTip: "Changing the selected banner resets the current results and pity counters so each simulation starts with a clean banner state.",
                simulatorWarning: "At the moment, the calculations do not respect the 'Featured Hero' getting removed from a Banner after pulling it twice.",

                // Games guide
                gamesTitle: "A place for future extras",
                gamesLeadCopy: "This section is reserved for small game-related tools and experiments. It is not active yet, so there are no playable activities to launch here.",
                gamesComingLater: "The navigation entry is in place, and the page can be expanded when the first activity is ready.",

                // Shared Guide labels
                tip: "Tip",
                warning: "Warning",
                comingLater: "Coming later",
            },

            // Simulator Page titles
            adventureChapters: { title: "Adventure Chapters" },
            towers: { title: "Towers" },
            titans: { title: "Titans" },
            guildHunt: { title: "Guild Hunt" },

            // Simulator navigation and overview
            simulators: {
                description: "Choose a simulator from the navigation above to browse encounters or set up a custom combat matchup.",
                adventure: "Adventure",
                customCompact: "Custom",
            },

            // Splash page
            splash: {
                management: "Management",
                simulations: "Simulations",
                underConstruction: "UNDER CONSTRUCTION",
                siteIs: "This site is",
                moreFeatures: "More features are on the way",
                sourceCode: "Source Code",
                seagullAlt: "A seagull",
            },

            // Not-found page
            notFound: {
                title: "Sorry",
                heading: "Looks like you've flown off course.",
                description: "We couldn't find the page you were looking for.",
            },

            // Games page
            games: {
                comingSoon: "More activities coming soon",
                description: "This section is reserved for future fun and game-related tools.",
            },

            // Shared footer sentence
            footer: "The game {{game}} and all images used here are owned by {{publisher}}. This site is not affiliated with {{publisher}} in any way. Fonts from {{fontProvider}}",
        },
    },
    data: {
        // The database is the English source of truth; nothing has to be added here, if the database is correct.
        overrides: {
            hero: {}, item: {}, set: {}, skill: {}, talent: {}, perk: {},
            status: {}, banner: {}, resource: {}, gem: {}, masterworkMutation: {},
            attribute: {}, element: {}, role: {}, rarity: {}, equipmentSlot: {},
            resourceLocation: {}, primaryStat: {}, dropSource: {},
        },
    },
}

export default lang_enUS
