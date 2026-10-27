import { useMemo, useState } from "react"
import { STATUS_EFFECT_DEFINITIONS } from "../database/enums.jsx"
import { statusSprites } from "../database/db_sprites.jsx"
import Button from "./Button.jsx"

const STATUS_DESCRIPTIONS = {
    attack_up: "Increases Attack.",
    defense_up: "Increases Defence.",
    critical_chance_up: "Increases Critical Chance.",
    critical_damage_up: "Increases Critical Damage.",
    accuracy_up: "Increases Accuracy.",
    resistance_up: "Increases Resistance.",
    agility_up: "Increases Agility.",
    critical_resistance: "Reduces the chance of receiving a critical hit.",
    invincibility: "Prevents damage.",
    immunity: "Prevents debuffs from being applied.",
    recovery: "Restores HP over time.",
    preservation: "Prevents HP from dropping below 1 while active.",
    shroud: "Cannot be selected as the primary target, but can still be affected by area attacks.",
    guard: "Takes a share of damage intended for the protected ally.",
    shield: "Absorbs incoming damage. Can stack and is marked as non-removable.",
    absorbing: "Restores HP based on damage dealt.",
    blessed: "Increases healing received.",
    attack_down: "Reduces Attack.",
    defense_down: "Reduces Defence.",
    critical_chance_down: "Reduces Critical Chance.",
    accuracy_down: "Reduces Accuracy.",
    resistance_down: "Reduces Resistance.",
    agility_down: "Reduces Agility.",
    blind: "Causes attacks to have a chance to miss.",
    marked: "Causes the target to take increased damage.",
    sick: "Prevents healing.",
    cursed: "Prevents buffs from being applied.",
    stunned: "Prevents actions.",
    sleep: "Reduces AP regeneration.",
    freeze: "Prevents cooldown reduction.",
    petrified: "Makes the next hit received a guaranteed critical hit; consumed when triggered.",
    burn: "Deals damage when the affected target is attacked.",
    poison: "Deals damage over time at the start of a turn.",
    bleeding: "Deals damage over time at the start of a turn, based on the caster's Attack.",
    mute: "Restricts skills to the basic attack.",
    bound: "Disables passive abilities.",
    taunt: "Restricts targeting to the taunter and limits the affected unit to basic attacks.",
    confused: "Causes the primary target to be ignored.",
    cursed_flame: "Converts a portion of healing into damage.",
    hellfire: "Special status that grants Hellfire Mode.",
    hellfire_mode: "Increases Attack and Agility.",
    frozen_heart: "Stores a revive HP bonus that can stack up to 5 times.",
    heating_up: "Increases skill damage with stacks; above 3 stacks, the effect can apply Burn.",
    mjoellnir: "Deals delayed damage: an initial hit followed by return damage.",
    anubis_seal: "Triggers damage against the enemy team when its holder dies.",
    soulmate: "Converts a portion of damage dealt into healing.",
    sphinx_curse: "Applies a special target marker.",
    styx: "Reduces maximum HP; stacks up to 3 times and is removed when Hades dies.",
    burrow: "Stores a stack that enhances a skill.",
    defense_drone: "Increases Defence per stack, up to 10 stacks.",
    divine_shield: "Provides a special damage-resistance effect.",
    ferryman: "Stacks to enhance the Cerberus skill.",
    feral: "Each stack increases damage and Agility, up to 6 stacks.",
    wildfire: "Each stack increases damage and Critical Damage, up to 20 stacks.",
    fury: "Each stack increases Critical Chance; counterattacking consumes a stack.",
    hivemind: "Each stack increases Agility, up to 6 stacks.",
    hot_saw: "Primary attacks have a chance to inflict Burn.",
    loa: "Each stack increases Resistance, up to 5 stacks.",
    the_moon: "Attacks can inflict Blind; also grants a shield to the ally with the lowest HP.",
    the_star: "Attacks can inflict Mute.",
    the_sun: "Attacks can apply Marked.",
    wind_up: "Each stack increases damage and Critical Damage, up to 6 stacks.",
    war_forge: "Increases Attack and Defence and can stack with Attack Up and Defence Up.",
    drumbeat: "Each stack increases Agility, up to 4 stacks.",
    foresight: "Each stack grants damage resistance, up to 4 stacks.",
    ap_resistance: "Prevents AP reduction.",
    arachnid: "A stacking status that enhances a skill, up to 5 stacks.",
    bloodrage: "A special status that enhances a skill.",
    bunny: "Increases Agility and allows the bonus to affect skills.",
    pain_fueled: "A stacking status that enhances a skill, up to 5 stacks.",
    blood_transfusion: "Each stack increases maximum HP, up to 4 stacks.",
    soul_harvest: "Each stack increases Critical Chance and Agility, up to 6 stacks.",
    buzz_meter: "Each stack increases Attack, up to 4 stacks.",
    biomass: "Each stack increases maximum HP, up to 5 stacks.",
    ignited_ego: "Enhances a skill using maximum HP.",
    life_after_death: "Can survive a lethal hit at low HP, gains a shield, then dies when the shield breaks or after its active turn.",
    sludge: "When Burn is present, deals conditional damage and removes itself.",
    detonator: "Builds stacks that cause secondary skills to deal exploding-stack true damage.",
    courage: "Grants an extra turn when an enemy is killed.",
    smoke: "Each stack increases Life Steal, up to 3 stacks.",
    mana_shield: "Reduces damage taken.",
    echo: "Deals delayed damage when the status duration ends.",
    ionize: "Makes the next turn's hit a guaranteed critical hit.",
    fracture: "Each stack increases Ultimate skill Critical Chance, up to 4 stacks.",
    irradiate: "Reflects true damage and ignores shields.",
    rift_step: "Increases Critical Chance.",
    blacklist: "Applies a conditional debuff triggered by a primary attack or Ultimate.",
    rooted: "Prevents gaining extra AP or extra turns.",
    ash: "A stacking status that scales a death skill, up to 9 stacks.",
    phoenix_feather: "Each stack increases maximum HP, up to 9 stacks.",
    luck: "Each stack increases Critical Chance, up to 3 stacks.",
    soul_core: "Provides damage resistance.",
    tempered: "Reduces damage from area-of-effect attacks.",
    soaked: "Primary attacks inflict Poison.",
    spectral_shield: "Reduces damage taken; the reduction depends on how many turns remain.",
    wither: "Each stack reduces Attack, Defence, and Agility. Removed when High Cleric Aureus dies.",
    backup_drone: "When HP falls below 50%, each stack heals 10% (up to 3 stacks).",
    reflect: "Reflects 50% of damage.",
    momentum: "Each stack increases Defence, up to 5 stacks.",
    dawn: "Increases maximum HP by 10%.",
    zenith: "Increases Agility by 10%.",
    dusk: "Increases Attack by 10%.",
    tender: "Each stack reduces Defence; can stack up to 3 times.",
    sealed: "When a buff is received, triggers damage based on Mary’s Defence and then removes itself.",
    lifeblood: "Each stack reduces Agility; can stack up to 3 times.",
    ghost_crew: "Each stack reduces area-of-effect damage taken, up to 4 stacks.",
    terror: "At the start of each turn, reduces buff durations by 1, except Invincibility and Preservation.",
    feast: "Increases damage taken by Countess Mortana’s enemies.",
    pin: "Each stack reduces Defence; can stack up to 4 times.",
    puppet: "Reduces Resistance.",
    buzzkill: "Enhances primary and secondary skills with an Agility bonus and AP damage.",
    plagued: "Each stack reduces Accuracy. At 3 stacks, heals the caster’s team for 5% max HP at turn end and clears the stacks.",
    encore: "Increases damage dealt.",
    contaminated: "When damage is received, deals AP damage equal to 5% of current AP and consumes one stack; up to 3 stacks.",
    cruelty: "Each stack increases damage taken, up to 3 stacks.",
    portal: "Each stack increases Attack, up to 5 stacks.",
    critical_condition: "Increases damage taken from damage-over-time effects.",
    hellforge: "Each stack increases Defence, up to 5 stacks.",
    spotlight: "Each stack reduces Agility.",
    emission: "At 5 stacks summons a Lunar Seeker; at 10 stacks triggers the united Ultimate, Eclipse.",
    flare: "At 5 stacks summons a Sun Seeker; at 10 stacks triggers the united Ultimate, Eclipse.",
    hollowing: "When a buff is received, triggers damage based on the holder’s Defence.",
    miasma: "At 5 stacks, deals damage equal to 20% of own max HP at round end."
}

const humanize = value => String(value ?? "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

// These are conservative classifications based on the recorded status mechanics.
// Leave entries out when the data does not make the affected side clear.
const SPECIAL_STATUS_POLARITY = {
    hellfire: "Buff",
    hellfire_mode: "Buff",
    frozen_heart: "Buff",
    heating_up: "Buff",
    mjoellnir: "Debuff",
    anubis_seal: "Debuff",
    soulmate: "Buff",
    sphinx_curse: "Debuff",
    styx: "Debuff",
    burrow: "Buff",
    defense_drone: "Buff",
    divine_shield: "Buff",
    ferryman: "Buff",
    feral: "Buff",
    wildfire: "Buff",
    fury: "Buff",
    hivemind: "Buff",
    hot_saw: "Buff",
    loa: "Buff",
    the_moon: "Buff",
    the_star: "Buff",
    the_sun: "Buff",
    wind_up: "Buff",
    war_forge: "Buff",
    drumbeat: "Buff",
    foresight: "Buff",
    ap_resistance: "Buff",
    arachnid: "Buff",
    bloodrage: "Buff",
    bunny: "Buff",
    pain_fueled: "Buff",
    blood_transfusion: "Buff",
    soul_harvest: "Buff",
    buzz_meter: "Buff",
    biomass: "Buff",
    ignited_ego: "Buff",
    life_after_death: "Buff",
    sludge: "Debuff",
    echo: "Debuff",
    ionize: "Buff",
    detonator: "Debuff",
    courage: "Buff",
    smoke: "Buff",
    mana_shield: "Buff",
    fracture: "Buff",
    irradiate: "Buff",
    rift_step: "Buff",
    blacklist: "Debuff",
    rooted: "Debuff",
    ash: "Debuff",
    phoenix_feather: "Buff",
    luck: "Buff",
    soul_core: "Buff",
    tempered: "Buff",
    soaked: "Buff",
    spectral_shield: "Buff",
    wither: "Debuff",
    backup_drone: "Buff",
    reflect: "Buff",
    momentum: "Buff",
    dawn: "Buff",
    zenith: "Buff",
    dusk: "Buff",
    tender: "Debuff",
    sealed: "Debuff",
    lifeblood: "Debuff",
    ghost_crew: "Buff",
    terror: "Debuff",
    feast: "Debuff",
    pin: "Debuff",
    puppet: "Debuff",
    buzzkill: "Buff",
    plagued: "Debuff",
    encore: "Buff",
    contaminated: "Debuff",
    cruelty: "Debuff",
    portal: "Buff",
    critical_condition: "Debuff",
    hellforge: "Buff",
    spotlight: "Debuff",
    emission: "Buff",
    flare: "Buff",
    hollowing: "Debuff",
    miasma: "Debuff",
}

function getCategory(status) {
    if (status.id <= 16) return "Buff"
    if (status.id <= 38) return "Debuff"
    const polarity = SPECIAL_STATUS_POLARITY[status.name]
    return polarity ? `Special ${polarity}` : "Special"
}

function getDetails(status) {
    const details = []
    if (status.value !== undefined) details.push(`Value: ${status.value}`)
    if (status.per_stack !== undefined) details.push(`Per stack: ${status.per_stack}`)
    if (status.max_stacks !== undefined) details.push(`Max stacks: ${status.max_stacks}`)
    if (status.duration !== undefined) details.push(`Duration: ${status.duration} turn(s)`)
    if (status.interval !== undefined) details.push(`Tick: ${humanize(status.interval)}`)
    if (status.stat !== undefined) details.push(`Stat: ${humanize(status.stat)}`)

    return details
}

function StatusCard({ status }) {
    const category = getCategory(status)
    const sprite = statusSprites[status.name] ?? statusSprites[status.name.replace("critical_resistance", "critical_resist")]
    const description = STATUS_DESCRIPTIONS[status.name]
        ?? `Special status effect (${humanize(status.effectType ?? "effect")}). Check its stored effect data for the exact behaviour.`

    return (
        <article className="status-catalogue-card card" data-category={category.toLowerCase()}>
            <div className="status-catalogue-identity">
                {sprite
                    ? <img className="status-catalogue-icon" src={sprite} alt="" loading="lazy" draggable={false} />
                    : <span className="status-catalogue-icon-fallback" aria-hidden="true">◆</span>
                }
                <div className="status-catalogue-heading">
                    <h3 className="status-catalogue-name header">{humanize(status.name)}</h3>
                    <span className={"status-catalogue-category text"}>{category}</span>
                </div>
            </div>
            <p className="status-catalogue-description text">{description}</p>
            <div className="status-polarity-row" aria-label="Status effect properties">
                <span className="status-polarity" title={status.mitigatable === false ? "Not mitigatable" : "Mitigatable"}><span aria-hidden="true">{status.mitigatable === false ? "✕" : "✓"}</span><span className="text">Mitigatable</span></span>
                <span className="status-polarity" title={status.removable === false ? "Not removable" : "Removable"}><span aria-hidden="true">{status.removable === false ? "✕" : "✓"}</span><span className="text">Removable</span></span>
            </div>
            {getDetails(status).length > 0 && (
                <ul className="status-catalogue-details">
                    {getDetails(status).map(detail => <li className="text" key={detail}>{detail}</li>)}
                </ul>
            )}
        </article>
    )
}

function SubPageStatusCatalogue() {
    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")

    const statuses = useMemo(() => Object.values(STATUS_EFFECT_DEFINITIONS)
        .slice()
        .sort((a, b) => a.id - b.id), [])

    const filteredStatuses = useMemo(() => {
        const query = search.trim().toLowerCase()
        return statuses.filter(status => {
            const category = getCategory(status)
            const description = STATUS_DESCRIPTIONS[status.name] ?? humanize(status.effectType ?? "effect")
            const searchable = `${status.name} ${description} ${status.effectType ?? ""} ${JSON.stringify(status)}`.toLowerCase()
            return (!query || searchable.includes(query))
                && (categoryFilter === "all"
                    || (categoryFilter === "special"
                        ? category.startsWith("Special")
                        : category.toLowerCase().endsWith(categoryFilter)))
        })
    }, [statuses, search, categoryFilter])

    return (
        <section className="status-catalogue">
            <header className="catalogue-header">
                <div className="catalogue-heading-copy">
                    <h2 className="catalogue-title header-big">Status Effect Catalogue</h2>
                    <p className="catalogue-description text">
                        A searchable reference for the status effects currently defined in the project, including their recorded mechanics.
                    </p>
                </div>
                <p className="catalogue-result-count text">{filteredStatuses.length} of {statuses.length} status effects</p>
            </header>

            <div className="status-catalogue-filters">
                <label className="catalogue-search">
                    <span className="catalogue-control-label text">Search status effects</span>
                    <input
                        className="selectable catalogue-input"
                        aria-label="Search status effects"
                        placeholder="Name, effect, stat, mechanic…"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                    />
                </label>
                <label className="catalogue-filter">
                    <span className="catalogue-control-label text">Category</span>
                    <select aria-label="Filter by status category" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
                        <option value="all">All categories</option>
                        <option value="buff">Buffs</option>
                        <option value="debuff">Debuffs</option>
                        <option value="special">Special effects (including inferred buffs/debuffs)</option>
                    </select>
                </label>
                <div className="catalogue-filter-actions">
                    <Button className="status-catalogue-clear" text="Clear filters" color={5} onClick={() => { setSearch(""); setCategoryFilter("all") }} />
                </div>
            </div>

            {filteredStatuses.length === 0
                ? <p className="catalogue-empty card">No status effects match these filters.</p>
                : <div className="status-catalogue-grid">
                    {filteredStatuses.map(status => <StatusCard key={status.id} status={status} />)}
                </div>
            }
        </section>
    )
}

export default SubPageStatusCatalogue
