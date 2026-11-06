# Localization

Each locale file contains two distinct roots:

- `app`: interface copy (navigation, buttons, labels, instructions, accessibility text, and page-specific messages).
- `data.overrides`: optional translations for database-backed game content.

Keep UI wording under `app`; do not put hero/item names or game descriptions there. Keep game content under `data.overrides`; do not duplicate the database's English values.

## UI translations

Use `useTranslation` for one value:

```jsx
const heading = useTranslation("app.navigation.heroes")
const resultCount = useTranslation(
    "app.pages.catalogues.searchCount",
    undefined,
    { resultCount: 12, totalCount: 48 }
)
```

For several values, use `useTranslate` once and call the returned function:

```jsx
const t = useTranslate()
t("app.shared.close")
t("app.pages.teams.teamName", { name: "Dungeon Team" })
```

## UI key conventions

Use `app.pages.<page>.title` for a page heading that is reused, including on splash tiles and subpage tabs. Keep compact route labels under `app.pages.simulators` and the general simulator overview copy at `app.simulators.description`. Keep one-off prose as a complete sentence or template rather than fragmenting it into unrelated keys; the splash footer is `app.pages.footer` and uses `{{game}}`, `{{publisher}}`, and `{{fontProvider}}` placeholders for its linked logos.

Use a `_tooltip` suffix for dictionary entries that are only used by native HTML `title` attributes. Keep visible labels and database content names under their normal keys.

## Database content overrides

The database remains the English source of truth. Each locale contains the same optional collection names, but only translated fields need to be present. Collections are singular and keyed by stable database IDs:

- `hero`: `hero.id` (for example `thor`)
- `item`: `item.id`, including its slot prefix (for example `weapon:pumpkin_scythe`)
- `set`: `set.id` (for example `breaker`)
- `skill`: `heroId:skillIndex` (for example `thor:0`)
- `talent`: `heroId:talentPosition` (for example `thor:21`)
- `perk`: enum key (for example `HEALTH_PERCENT`)
- `status`: status key (for example `burn`)
- `banner`: `banner.id` (for example `everyday_heroes`)
- `resource`: `resource.id` (for example `crystal`)
- `gem`: `resource.id` (for example `ruby_common`)
- `masterworkMutation`: `PERK_KEY:mutationId` (for example `AGILITY_PERCENT:1`)
- `attribute`, `element`, `role`, `rarity`, `equipmentSlot`, `resourceLocation`, `primaryStat`, and `dropSource`: their corresponding enum keys.

Each entry may override only the fields it needs: `name`, `description`, `effects.unique`, `conditionalHeroCondition`, and other nested display fields. Missing fields are not errors: lookup falls back to an English override if one exists, then to the original database value.

Example:

```jsx
data: {
    overrides: {
        item: {
            "weapon:pumpkin_scythe": {
                name: "Kürbissense",
                effects: {
                    unique: "Mit einer Chance von {{chance}} erhältst du einen zusätzlichen Zug.",
                },
            },
        },
        status: {
            burn: { name: "Verbrennung", description: "..." },
        },
    },
}
```

Use `useContentTranslation` in components:

```jsx
const tc = useContentTranslation()
const itemName = tc("item", item.id, "name", item.name)
const description = tc("item", item.id, "description", item.description)
```

The English locale deliberately has empty override collections. Do not copy the database into locale files; add an English override only when the original database wording genuinely needs a UI-facing correction without changing game data.

## Interpolation in content

Content templates support named placeholders such as `{{chance}}`, `{{value}}`, `{{status}}`, and `{{duration}}`. Use `{{chance}}` for a chance percentage and `{{value}}` for other percentages or scalar effect values. Existing database descriptions that still contain `$e` are normalized to `{{value}}` before interpolation; this is retained for source-data compatibility only. New `UNIQUE_WEAPON_DEFINITIONS` entries and locale overrides should use named placeholders rather than `$e`. For unique item effects, the preview supplies the selected rarity's percentage, the detected and localized status name(s), and the duration parsed from the database effect text.

Interpolated values are inserted as ordinary text, never parsed as HTML. Unknown placeholders are left visible so missing values are easy to spot. A translation can reorder placeholders naturally for its language.

## Add a language

1. Copy `lang_enUS.jsx` to a new locale file, such as `lang_frFR.jsx`.
2. Keep the `app` and `data.overrides` roots, and add only translated values.
3. Import the locale in `index.js` and register it in `LANGUAGE_DICTIONARIES`.
4. Select it through `LocalizationProvider initialLanguage` or `useLocalization().setLanguage()`.

See `lang_deDE.jsx` for partial UI and game-content examples.