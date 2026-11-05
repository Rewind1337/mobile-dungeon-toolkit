import AeternaSprite from "../sprites/heroes/aeterna.webp"
import AliceSprite from "../sprites/heroes/alice.webp"
import AnubisSprite from "../sprites/heroes/anubis.webp"
import AthenaSprite from "../sprites/heroes/athena.webp"
import ApolloSprite from "../sprites/heroes/apollo.webp"
import MercySprite from "../sprites/heroes/mercy.webp"
import VoidAssassinSprite from "../sprites/heroes/void_assassin.webp"
import CandyElementalSprite from "../sprites/heroes/candy_elemental.webp"
import LightSwordSprite from "../sprites/weapons/unique/light_sword.webp"
import BreakerHelmetSprite from "../sprites/helmets/sets/breaker.webp"
import BreakerArmorSprite from "../sprites/armors/sets/breaker.webp"
import BreakerRingSprite from "../sprites/rings/sets/breaker.webp"
import BreakerNecklaceSprite from "../sprites/necklaces/sets/breaker.webp"
import SoulSprite from "../sprites/resources/soul.webp"
import ShimmeringSoulSprite from "../sprites/resources/shimmering_soul.webp"
import LegendaryBoosterSprite from "../sprites/resources/legendary_banner_booster.webp"
import EpicBoosterSprite from "../sprites/resources/epic_banner_booster.webp"

function GuideStep({ number, title, children }) {
    return (
        <section className="guide-step card">
            <span className="guide-step-number card card-static header">{number}</span>
            <div className="guide-step-body">
                <h3 className="guide-step-title header">{title}</h3>
                <div className="guide-step-copy text">{children}</div>
            </div>
        </section>
    )
}

function GuideAsset({ src, label, alt = "" }) {
    return (
        <div className="guide-asset card">
            <img src={src} alt={alt || label} loading="lazy" decoding="async" draggable={false} />
            <span className="text">{label}</span>
        </div>
    )
}

function GuideLead({ eyebrow, title, children }) {
    return (
        <header className="guide-lead">
            <span className="guide-eyebrow text">{eyebrow}</span>
            <h2 className="guide-lead-title text">{title}</h2>
            <p className="guide-copy-header text">{children}</p>
        </header>
    )
}

export function HeroManagementGuide() {
    return (
        <div className="page-guide">
            <GuideLead eyebrow="Hero management guide" title="Find the right hero, then build them up">
                The Heroes page is your working roster. Browse the full collection, keep personal builds in Saved Heroes, and use the preview to tune a hero before adding them to a team.
            </GuideLead>

            <span className="guide-example-kicker text">Example heroes</span>
            <div className="guide-equipment-strip">
                <GuideAsset src={AeternaSprite} label="Aeterna" />
                <GuideAsset src={AliceSprite} label="Alice" />
                <GuideAsset src={AnubisSprite} label="Anubis" />
                <GuideAsset src={AthenaSprite} label="Athena" />
                <GuideAsset src={ApolloSprite} label="Apollo" />
            </div>

            <p className="guide-copy text">Selecting a hero opens their preview with their attributes, equipment slots, main stats, calculated stats, skills, talents, and other stat details.</p>

            <div className="guide-steps">
                <GuideStep number="1" title="Search and combine filters">
                    Search by hero name or details, then combine Rarity, Main Attribute, Element, Role, and Starred. Use Sort Order to switch between Alphabetic, Rarity, and Level.
                </GuideStep>
                <GuideStep number="2" title="Inspect the preview">
                    Select a hero to open the preview. Expand it for more room, review the stat breakdown, and click an equipment slot to choose an item for that hero.
                </GuideStep>
                <GuideStep number="3" title="Save your hero">
                    Use Save Hero in the preview to keep the configured version for later. Saved heroes can be selected when building teams. Use Import Hero to bring in a shared hero via link or code.
                </GuideStep>
                <GuideStep number="4" title="Modify your builds">
                    Continue modifying and tweaking your heroes in the 'Saved Heroes' Tab. Export your builds and share them with your mates, while comparing them against eachother.
                </GuideStep>
            </div>
            <p className="guide-tip card text"><strong>Tip</strong> Each saved hero is a separate build, so you can keep multiple configured versions of the same hero, if you need to.</p>
        </div>
    )
}

export function ItemManagementGuide() {
    return (
        <div className="page-guide">
            <GuideLead eyebrow="Item management guide" title="Compare equipment and create your builds">
                Use the item list to find equipment, then open its preview to inspect and adjust its rarity, perks, set information, and other available properties.
            </GuideLead>

            <span className="guide-example-kicker text">Example equipment</span>

            <div className="guide-equipment-showcase">
                <GuideAsset src={LightSwordSprite} label="Light Sword" />
                <GuideAsset src={BreakerHelmetSprite} label="Breaker Helmet" />
                <GuideAsset src={BreakerArmorSprite} label="Breaker Armor" />
                <GuideAsset src={BreakerRingSprite} label="Breaker Ring" />
                <GuideAsset src={BreakerNecklaceSprite} label="Breaker Necklace" />
            </div>

            <div className="guide-steps">
                <GuideStep number="1" title="Narrow down the list">
                    Search item names and effect text. Combine Slot, Attribute Requirement, and Item type filters; use Sort Order to organize the results. Saved Items also includes the Rarity filter.
                </GuideStep>
                <GuideStep number="2" title="Inspect an item">
                    Select an item to open its preview. Depending on the item, you can review weapon effects, fixed and rolled perks, set bonuses, masterwork levels, and mutations.
                </GuideStep>
                <GuideStep number="3" title="Save your item">
                    Save a configured item to Saved Items for use in teams and hero previews. Saved items can be selected when equipping heroes. Use Import Item to bring in a shared item via link or code.
                </GuideStep>
                <GuideStep number="4" title="Modify your builds">
                    Continue modifying and tweaking your items in the 'Saved Items' Tab. Export your builds and share them with your mates, while comparing them against eachother.
                </GuideStep>
            </div>
            <p className="guide-tip card text"><strong>Tip</strong> Each saved hero is a separate build, so you can keep multiple configured versions of the same hero, if you need to. You can even equip the same item on multiple heroes at once!</p>
        </div>
    )
}

export function TeamManagementGuide() {
    const members = [
        [AeternaSprite, "Aeterna"],
        [VoidAssassinSprite, "Void Assassin"],
        [MercySprite, "Mercy"],
        [AthenaSprite, "Athena"],
        [CandyElementalSprite, "Candy Elemental"],
    ]

    return (
        <div className="page-guide">
            <GuideLead eyebrow="Team management" title="Bring five saved heroes together">
                Teams let you assemble a lineup from your Saved Heroes and see how their attributes, equipment, and effects work together.
            </GuideLead>


            <span className="guide-example-kicker text">Example lineup</span>

            <div className="guide-team-roster card card-dark card-static">
                {members.map(([src, name], index) => (
                    <div className="guide-team-member card" key={name}>
                        <span className="guide-team-slot text">Slot {index + 1}</span>
                        <img src={src} alt={name} loading="lazy" decoding="async" draggable={false} />
                        <span className="text">{name}</span>
                    </div>
                ))}
            </div>

            <div className="guide-steps">
                <GuideStep number="1" title="Create and name teams">
                    Start with the default team or use New Team to add another. Give each team a name that makes its purpose easy to recognize.
                </GuideStep>
                <GuideStep number="2" title="Fill the five hero slots">
                    Select an empty slot and choose one of your saved heroes. Each slot can hold one saved hero; open the hero preview to adjust that build before assigning it.
                </GuideStep>
                <GuideStep number="3" title="Review the team summary">
                    Expand a team to inspect its combined attributes, detected buffs and debuffs, hero stats, and equipped items. Collapse it when you want to focus on another team.
                </GuideStep>
                <GuideStep number="4" title="Keep your roster organized">
                    Duplicate a team to use it as a starting point, or clear and delete teams you no longer need. Team edits are saved automatically.
                </GuideStep>
                <GuideStep number="5" title="Export full teams">
                    Export the full team with or without the equipped items, fully supported! 
                </GuideStep>
            </div>
            <p className="guide-tip"><strong>Tip</strong> Set up and save the individual item and hero builds first, to save you some trouble later! When importing a full team, each hero and each item will be saved seperately alongside the team.</p>
        </div>
    )
}

export function SimulatorsGuide() {
    return (
        <div className="page-guide">
            <GuideLead eyebrow="Simulators" title="Test banner pulls without spending resources">
                Magic Toilet is currently the only available simulator. It recreates the banner rarity rolls and lets you experiment with pity and banner boosters.
            </GuideLead>

            <span className="guide-example-kicker text">Track your simulated usage!</span>

            <div className="guide-equipment-showcase">
                <GuideAsset src={SoulSprite} label="Souls" />
                <GuideAsset src={ShimmeringSoulSprite} label="Shimmering Souls" />
                <GuideAsset src={EpicBoosterSprite} label="Epic Boosters" />
                <GuideAsset src={LegendaryBoosterSprite} label="Legendary Boosters" />
            </div>

            <div className="guide-steps">
                <GuideStep number="1" title="Choose a banner and starting pity">
                    Select the banner you want to simulate. Current Epic Pity and Current Legendary Pity can be adjusted directly and then decrement as pulls are simulated.
                </GuideStep>
                <GuideStep number="2" title="Configure optional boosters">
                    Enable a Legendary or Epic Banner Booster and choose its target hero. With 'Don't reset Boosters' off, a booster is consumed by the next pull of its rarity. Turn it on to keep the selected target active across pulls.
                </GuideStep>
                <GuideStep number="3" title="Choose how to flush">
                    Flush once, use the selected batch size, or continue until a Legendary appears. With persistent boosters enabled, 'Flush until Boosted' continues until one of your selected boosted heroes is pulled.
                </GuideStep>
                <GuideStep number="4" title="Review the results">
                    The stats row tracks pulls, souls, booster usage, rarity counts, expected Legendaries, and luck. Separate result rows show the Legendary and Epic heroes pulled.
                </GuideStep>
            </div>
            <p className="guide-tip"><strong>Tip</strong> Changing the selected banner resets the current results and pity counters so each simulation starts with a clean banner state.</p>
            <p className="guide-tip"><strong>Warning</strong> At the moment, the calculations do not respect the 'Featured Hero' getting removed from a Banner after pulling it twice.</p>
        </div>
    )
}

export function GamesGuide() {
    return (
        <div className="page-guide">
            <GuideLead eyebrow="Fun & Games" title="A place for future extras">
                This section is reserved for small game-related tools and experiments. It is not active yet, so there are no playable activities to launch here.
            </GuideLead>
            <p className="guide-tip"><strong>Coming later</strong> The navigation entry is in place, and the page can be expanded when the first activity is ready.</p>
        </div>
    )
}
