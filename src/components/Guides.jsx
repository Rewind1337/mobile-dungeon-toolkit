import AeternaSprite from "../sprites/heroes/aeterna.webp"
import AliceSprite from "../sprites/heroes/alice.webp"
import AnubisSprite from "../sprites/heroes/anubis.webp"
import AthenaSprite from "../sprites/heroes/athena.webp"
import ApolloSprite from "../sprites/heroes/apollo.webp"
import LightSwordSprite from "../sprites/weapons/unique/light_sword.webp"
import BreakerHelmetSprite from "../sprites/helmets/sets/breaker.webp"
import BreakerArmorSprite from "../sprites/armors/sets/breaker.webp"
import BreakerRingSprite from "../sprites/rings/sets/breaker.webp"
import BreakerNecklaceSprite from "../sprites/necklaces/sets/breaker.webp"
import SoulSprite from "../sprites/resources/soul.webp"
import LegendaryBoosterSprite from "../sprites/resources/legendary_banner_booster.webp"
import EpicBoosterSprite from "../sprites/resources/epic_banner_booster.webp"

function GuideStep({ number, title, children }) {
    return (
        <section className="guide-step">
            <span className="guide-step-number">{number}</span>
            <div className="guide-step-body">
                <h3 className="guide-step-title">{title}</h3>
                <div className="guide-step-copy">{children}</div>
            </div>
        </section>
    )
}

function GuideAsset({ src, label, alt = "" }) {
    return (
        <div className="guide-asset">
            <img src={src} alt={alt || label} loading="lazy" decoding="async" draggable={false} />
            <span>{label}</span>
        </div>
    )
}

function GuideLead({ eyebrow, title, children }) {
    return (
        <header className="guide-lead">
            <span className="guide-eyebrow">{eyebrow}</span>
            <h2 className="guide-lead-title">{title}</h2>
            <p className="guide-copy">{children}</p>
        </header>
    )
}

export function HeroManagementGuide() {
    return (
        <div className="page-guide">
            <GuideLead eyebrow="Hero management" title="Find the right hero, then build them up">
                The Heroes page is your working roster. Browse the full collection, keep personal builds in Saved Heroes, and use the preview to tune a hero before adding them to a team.
            </GuideLead>

            <div className="guide-example guide-hero-example">
                <div className="guide-example-heading">
                    <span className="guide-example-kicker">Example hero</span>
                    <strong>Aeterna</strong>
                </div>
                <div className="guide-hero-showcase">
                    <img className="guide-hero-sprite" src={AeternaSprite} alt="Aeterna hero sprite" />
                    <div className="guide-hero-details">
                        <span className="guide-example-label">Hero preview</span>
                        <div className="guide-mini-chips">
                            <span>Dexterity</span>
                            <span>Support</span>
                            <span>Starred-ready</span>
                        </div>
                        <p className="guide-copy">Selecting a hero opens their preview with their attributes, equipment slots, main stats, calculated stats, skills, talents, and other stat details.</p>
                    </div>
                </div>
                <div className="guide-equipment-strip">
                    <GuideAsset src={LightSwordSprite} label="Weapon" />
                    <GuideAsset src={BreakerHelmetSprite} label="Helmet" />
                    <GuideAsset src={BreakerArmorSprite} label="Armor" />
                    <GuideAsset src={BreakerRingSprite} label="Ring" />
                </div>
            </div>

            <div className="guide-steps">
                <GuideStep number="01" title="Search and combine filters">
                    Search by hero name or details, then combine Rarity, Main Attribute, Element, Role, and Starred. Use Sort Order to switch between Alphabetic, Rarity, and Level.
                </GuideStep>
                <GuideStep number="02" title="Inspect the preview">
                    Select a hero to open the preview. Expand it for more room, review the stat breakdown, and click an equipment slot to choose an item for that hero.
                </GuideStep>
                <GuideStep number="03" title="Save your build">
                    Use Save Hero in the preview to keep the configured version in Saved Heroes. Saved heroes can be selected when building teams. Use Import Hero to bring in a shared hero link.
                </GuideStep>
            </div>
            <p className="guide-tip"><strong>Tip</strong> A saved hero is a separate build from the base catalogue entry, so you can keep multiple configured versions without changing the original.</p>
        </div>
    )
}

export function ItemManagementGuide() {
    return (
        <div className="page-guide">
            <GuideLead eyebrow="Item management" title="Compare equipment and create your builds">
                Use the item list to find equipment, then open its preview to inspect and adjust its rarity, perks, set information, and other available properties.
            </GuideLead>

            <div className="guide-example">
                <div className="guide-example-heading">
                    <span className="guide-example-kicker">Example equipment</span>
                    <strong>Weapon and matching gear</strong>
                </div>
                <div className="guide-equipment-showcase">
                    <GuideAsset src={LightSwordSprite} label="Light Sword" />
                    <GuideAsset src={BreakerHelmetSprite} label="Breaker Helmet" />
                    <GuideAsset src={BreakerArmorSprite} label="Breaker Armor" />
                    <GuideAsset src={BreakerRingSprite} label="Breaker Ring" />
                    <GuideAsset src={BreakerNecklaceSprite} label="Breaker Necklace" />
                </div>
                <p className="guide-copy">Item cards show the essentials at a glance. The preview gives you room to examine the full configuration.</p>
            </div>

            <div className="guide-steps">
                <GuideStep number="01" title="Narrow down the list">
                    Search item names and effect text. Combine Slot, Attribute Requirement, and Item type filters; use Sort Order to organize the results. Saved Items also includes the Rarity filter.
                </GuideStep>
                <GuideStep number="02" title="Inspect an item">
                    Select an item to open its preview. Depending on the item, you can review weapon effects, fixed and rolled perks, set bonuses, masterwork levels, and mutations.
                </GuideStep>
                <GuideStep number="03" title="Save, export, or import">
                    Save a configured item to Saved Items for use in teams and hero previews. Export creates a share link, while Import Item accepts a shared item or equipped-items link.
                </GuideStep>
            </div>
            <p className="guide-tip"><strong>Tip</strong> Use the Item type filter to switch between 2-piece sets, 4-piece sets, and Unique items without stacking mutually exclusive filters.</p>
        </div>
    )
}

export function TeamManagementGuide() {
    const members = [
        [AeternaSprite, "Aeterna"],
        [AliceSprite, "Alice"],
        [AnubisSprite, "Anubis"],
        [AthenaSprite, "Athena"],
        [ApolloSprite, "Apollo"],
    ]

    return (
        <div className="page-guide">
            <GuideLead eyebrow="Team management" title="Bring five saved heroes together">
                Teams let you assemble a lineup from your Saved Heroes and see how their attributes, equipment, and effects work together.
            </GuideLead>

            <div className="guide-example">
                <div className="guide-example-heading">
                    <span className="guide-example-kicker">Example lineup</span>
                    <strong>Five team slots</strong>
                </div>
                <div className="guide-team-roster">
                    {members.map(([src, name], index) => (
                        <div className="guide-team-member" key={name}>
                            <span className="guide-team-slot">Slot {index + 1}</span>
                            <img src={src} alt={name} loading="lazy" decoding="async" draggable={false} />
                            <span>{name}</span>
                        </div>
                    ))}
                </div>
                <div className="guide-equipment-strip guide-team-equipment">
                    <GuideAsset src={LightSwordSprite} label="Weapon" />
                    <GuideAsset src={BreakerHelmetSprite} label="Helmet" />
                    <GuideAsset src={BreakerArmorSprite} label="Armor" />
                    <GuideAsset src={BreakerRingSprite} label="Ring" />
                    <GuideAsset src={BreakerNecklaceSprite} label="Necklace" />
                </div>
            </div>

            <div className="guide-steps">
                <GuideStep number="01" title="Create and name teams">
                    Start with the default team or use New Team to add another. Give each team a name that makes its purpose easy to recognize.
                </GuideStep>
                <GuideStep number="02" title="Fill the five hero slots">
                    Select an empty slot and choose one of your saved heroes. Each slot can hold one saved hero; open the hero preview to adjust that build before assigning it.
                </GuideStep>
                <GuideStep number="03" title="Review the team summary">
                    Expand a team to inspect its combined attributes, detected buffs and debuffs, hero stats, and equipped items. Collapse it when you want to focus on another team.
                </GuideStep>
                <GuideStep number="04" title="Keep your roster organized">
                    Duplicate a team to use it as a starting point, or clear and delete teams you no longer need. Team edits are saved automatically.
                </GuideStep>
            </div>
            <p className="guide-tip"><strong>Tip</strong> Set up and save the individual hero builds first. Teams use Saved Heroes, not unsaved changes from the base hero catalogue.</p>
        </div>
    )
}

export function SimulatorsGuide() {
    return (
        <div className="page-guide">
            <GuideLead eyebrow="Simulators" title="Test banner pulls without spending resources">
                Magic Toilet is currently the available simulator. It recreates the banner rarity rolls and lets you experiment with pity and banner boosters.
            </GuideLead>

            <div className="guide-example guide-resource-example">
                <div className="guide-example-heading">
                    <span className="guide-example-kicker">Resources and boosters</span>
                    <strong>Track your simulated usage</strong>
                </div>
                <div className="guide-resource-row">
                    <GuideAsset src={SoulSprite} label="Souls" />
                    <GuideAsset src={LegendaryBoosterSprite} label="Legendary booster" />
                    <GuideAsset src={EpicBoosterSprite} label="Epic booster" />
                </div>
            </div>

            <div className="guide-steps">
                <GuideStep number="01" title="Choose a banner and pity">
                    Select the banner you want to simulate. Current Epic Pity and Current Legendary Pity can be adjusted directly and then decrement as pulls are simulated.
                </GuideStep>
                <GuideStep number="02" title="Configure optional boosters">
                    Enable a Legendary or Epic Banner Booster and choose its target hero. With Don't reset Boosters off, a booster is consumed by the next pull of its rarity. Turn it on to keep the selected target active across pulls.
                </GuideStep>
                <GuideStep number="03" title="Choose how to flush">
                    Flush once, use the selected batch size, or continue until a Legendary appears. With persistent boosters enabled, Flush until Boosted continues until one of your selected boosted heroes is pulled.
                </GuideStep>
                <GuideStep number="04" title="Review the results">
                    The stats row tracks pulls, souls, booster usage, rarity counts, expected Legendaries, and luck. Separate result rows show the Legendary and Epic heroes pulled.
                </GuideStep>
            </div>
            <p className="guide-tip"><strong>Tip</strong> Changing the selected banner resets the current results and pity counters so each simulation starts with a clean banner state.</p>
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
