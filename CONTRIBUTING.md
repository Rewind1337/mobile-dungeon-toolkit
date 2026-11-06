# Contributing

Thanks for helping improve Mobile Dungeon Toolkit. Contributions are welcome, especially corrections to game data, UI improvements, and additional translations.

## Development setup

The project uses Vite and React.

```bash
npm install
npm run dev
```

Before submitting changes, run:

```bash
npm run lint
npm run build
```

Keep pull requests focused, describe the user-visible changes, and mention any checks you ran. For changes involving game data, include the source or reasoning where practical. Game data is manually researched and can be incomplete; do not silently turn assumptions into confirmed mechanics.

## Localization at a glance

Locale files live in `src/localization/`:

- `lang_enUS.jsx` is the source dictionary and fallback for interface wording.
- `lang_deDE.jsx` is an example partial German translation. It intentionally contains only translated entries.
- `index.js` imports locales, sets `DEFAULT_LANGUAGE`, and registers them in `LANGUAGE_DICTIONARIES`.

Each locale has two main areas:

```jsx
const lang_example = {
    app: {
        // Interface text: navigation, labels, messages, instructions, and page copy.
    },
    data: {
        overrides: {
            // Optional translations for database-backed game content.
        },
    },
}
```

Keep interface wording under `app`. Keep translated hero, item, skill, perk, status, banner, resource, gem, and enum content under `data.overrides`. Do not duplicate the original database in a locale file: missing translations are expected and fall back automatically.

## How locale selection works

The application is currently initialized with the default English locale in `src/main.jsx`:

```jsx
<LocalizationProvider>
    <App />
</LocalizationProvider>
```

There is not yet a language selector in the application UI. To test the partial German locale locally, temporarily pass its registered locale ID:

```jsx
<LocalizationProvider initialLanguage="deDE">
    <App />
</LocalizationProvider>
```

Revert that change when you are finished testing English.

For an in-app language control in a component, use the localization context:

```jsx
import { useLocalization } from "../hooks/useLocalization.jsx"

function LanguageControl() {
    const { language, setLanguage } = useLocalization()

    return (
        <select value={language} onChange={event => setLanguage(event.target.value)}>
            <option value="enUS">English</option>
            <option value="deDE">Deutsch</option>
        </select>
    )
}
```

Only locale IDs registered in `LANGUAGE_DICTIONARIES` are accepted by `setLanguage`.

## Translating interface wording

Use `useTranslate` when a component needs several strings. Call the hook once, then use the returned `t` function:

```jsx
import { useTranslate } from "../hooks/useTranslate.jsx"

function ResultSummary({ count }) {
    const t = useTranslate()

    return (
        <p>
            {t("app.pages.catalogues.searchCount", {
                resultCount: count,
                totalCount: count,
            })}
        </p>
    )
}
```

For a single value, `useTranslation` is also available:

```jsx
import { useTranslation } from "../hooks/useTranslation.jsx"

function PageHeading() {
    const title = useTranslation("app.navigation.heroes")
    return <h1>{title}</h1>
}
```

Its arguments are `useTranslation(key, language, values)`. Leave the second argument undefined to use the active locale from `LocalizationProvider`; supply the third argument for interpolation. Prefer `useTranslate` when several strings are needed in one component so the locale-bound translator is created once.

### Interface key conventions

Use dot-separated paths, grouped by purpose:

- `app.navigation` for primary navigation.
- `app.common` for generally reusable actions and common UI wording.
- `app.shared` for labels and text reused throughout multiple pages.
- `app.pages.<page>` for wording that belongs to one page.
- `app.pages.<page>.title` for a full page title reused in multiple places.
- `app.pages.simulators` for simulator route labels and the simulator overview description.

Keep full sentences together where their grammar depends on the surrounding words. The splash footer is a single `app.pages.footer` template, not several translated fragments.

Use a `Tooltip` suffix for strings used exclusively by native HTML `title` attributes. For example, `app.shared.expandPreviewTooltip`. Do not use that suffix for visible labels or database-backed content names.

The English dictionary is grouped with comments such as `// shared search`, `// shared elements`, and `// Hero preview`. Put new keys beside related entries and add a short comment when a section grows large enough to benefit from one. Keep each key unique within its containing object.

### Interpolation

Use named placeholders with double braces:

```jsx
searchCount: "Search ({{resultCount}} of {{totalCount}})",
helpForTooltip: "Help for {{title}}",
```

Pass values by name:

```jsx
t("app.pages.catalogues.searchCount", {
    resultCount: filtered.length,
    totalCount: entries.length,
})
```

A translated sentence can reorder placeholders to suit its language. Unknown placeholders remain visible, which makes missing values easier to spot. Interpolated values are rendered as text; templates are never interpreted as HTML.

## Translating database-backed game content

Use `useContentTranslation` for content stored in the game database. It resolves a field using this order:

1. The active locale's override.
2. The English locale's override, if one exists.
3. The original value from the database.

Example:

```jsx
import { useContentTranslation } from "../hooks/useContentTranslation.jsx"

function ItemName({ item }) {
    const tc = useContentTranslation()
    return <span>{tc("item", item.id, "name", item.name)}</span>
}
```

The call signature is:

```jsx
tc(collection, stableId, fieldPath, originalValue, interpolationValues)
```

The final interpolation-values argument is optional. Field paths can point into nested values, for example `"effects.unique"`.

### Supported content collections and IDs

Use the actual stable identifiers from the game data:

| Collection | Stable ID |
|---|---|
| `hero` | `hero.id`, e.g. `thor` |
| `item` | `item.id`, including slot prefix, e.g. `weapon:pumpkin_scythe` |
| `set` | `set.id`, e.g. `breaker` |
| `skill` | `heroId:skillIndex`, e.g. `thor:0` |
| `talent` | `heroId:talentPosition`, e.g. `thor:21` |
| `perk` | Perk enum key, e.g. `HEALTH_PERCENT` |
| `status` | Status key, e.g. `burn` |
| `banner` | `banner.id`, e.g. `everyday_heroes` |
| `resource`, `gem` | `resource.id`, e.g. `ruby_common` |
| `masterworkMutation` | `PERK_KEY:mutationId`, e.g. `AGILITY_PERCENT:1` |
| `attribute`, `element`, `role`, `rarity`, `equipmentSlot`, `resourceLocation`, `primaryStat`, `dropSource` | Corresponding enum key |

Only add the fields that are actually translated. Common fields include `name`, `description`, nested `effects.unique`, and banner-specific text such as `conditionalHeroCondition`.

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
            burn: {
                name: "Verbrennung",
                description: "Ein übersetzter Statuseffekt.",
            },
        },
    },
}
```

Do not copy English database values into locale files. The database remains the English source of truth. Add an English override only when an existing database string genuinely needs a UI-facing correction without changing the game data itself.

### Content placeholders and legacy database text

Use meaningful placeholders such as `{{chance}}`, `{{value}}`, `{{status}}`, and `{{duration}}`. For unique weapon effects, use `{{chance}}` for a probability percentage and `{{value}}` for another percentage or scalar effect value.

Some original database descriptions still contain the legacy `$e` marker. The content interpolator normalizes those existing source-data markers to `{{value}}` for compatibility. Do not use `$e` in new unique weapon definitions or new locale overrides; use named placeholders instead.

## Adding a new language

1. Create a file such as `src/localization/lang_frFR.jsx`, using the same `app` and `data.overrides` roots as the other locale files.
2. Add only the translated interface keys and game-content fields. Omitted keys deliberately fall back to English or to the original database value.
3. Export the dictionary as the default export.
4. Import it in `src/localization/index.js` and add it to `LANGUAGE_DICTIONARIES` with a locale ID such as `frFR`.
5. Test it by setting `initialLanguage="frFR"` on `LocalizationProvider`, then run the lint and production build checks.

Use `lang_deDE.jsx` as an example of a partial locale. A translation does not need to be complete before it can be registered, but untranslated wording will continue to appear in English.

## Translation review checklist

- Confirm every new key is used and every new `t()` / `tc()` reference resolves.
- Keep placeholder names intact, while allowing their order to change between languages.
- Preserve the namespace and `Tooltip` naming conventions.
- Use stable database IDs, not display names, for content overrides.
- Check that the translated sentence reads naturally as a whole; avoid translating fragments in isolation.
- Test the locale in the application and run `npm run lint` and `npm run build`.
