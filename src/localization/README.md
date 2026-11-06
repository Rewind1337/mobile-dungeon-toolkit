# Localization

Language dictionaries live in this folder. Each file exports one nested object.
Keep the same key structure in every language and translate only the string
values.

## Dictionary organization

- `app.navigation`: primary navigation labels shared across pages.
- `app.common`: small, general controls used by shared components.
- `app.shared`: reusable labels, actions, filter values, accessibility text,
  and messages used in multiple places.
- `app.pages`: page-specific headings, descriptions, instructions, and
  messages. Keep values here only when they are genuinely specific to that
  page or feature.

**Reuse identical wording.** Before adding a new entry, check whether the same
text already exists in `app.navigation`, `app.common`, or `app.shared`.
If two parts of the interface display the same wording, both should reference
the same dictionary key. Do not duplicate the English string under separate
page-specific keys just to mirror the component tree. Different wording or
different meaning should remain separate.

Game/database content such as hero names, item names, perk descriptions, and
user-created team names is not interface copy and should not be moved into the
UI dictionary.

## Use a translation

For one value, use `useTranslation`:

```jsx
const heading = useTranslation("app.navigation.heroes")
const resultCount = useTranslation(
    "app.pages.catalogues.searchCount",
    undefined,
    { resultCount: 12, totalCount: 48 }
)
```

For several values in a component, use `useTranslate` once and call the
returned translator:

```jsx
const t = useTranslate()

return (
    <>
        <h1>{t("app.pages.teams.savedTeams")}</h1>
        <button aria-label={t("app.shared.close")}>×</button>
    </>
)
```

Keys use dot-separated paths. Missing keys fall back to the English dictionary;
if a key is missing in English too, the key itself is returned to make omissions
visible during development.

## Interpolation

Use named `{{placeholders}}` when a translation needs dynamic information.
Pass the matching values as the second argument to `t`, or as the third
argument to `useTranslation`:

```jsx
// Dictionary:
itemCount: "{{count}} items",
teamName: "Team name for {{name}}",

// Component:
const t = useTranslate()
t("app.pages.example.itemCount", { count: 12 })
t("app.pages.teams.teamName", { name: "Dungeon Team" })
```

This keeps the complete sentence in the dictionary instead of concatenating
translated fragments in components. A different language can move placeholders
to a different position or change the surrounding grammar. Keep placeholder
names identical in every language file. Values can be numbers, names, dates,
or other text that belongs inside the translated sentence.

## Add a language

1. Copy `lang_enUS.jsx` to a new file, for example `lang_deDE.jsx`.
2. Translate the values without changing object keys or interpolation names.
3. Import the new file in `index.js` and add it to `LANGUAGE_DICTIONARIES`:

```js
import lang_deDE from "./lang_deDE.jsx"

export const LANGUAGE_DICTIONARIES = {
    enUS: lang_enUS,
    deDE: lang_deDE,
}
```

4. Set the initial locale with `<LocalizationProvider initialLanguage="deDE">`,
   or change it at runtime from a component using
   `const { setLanguage } = useLocalization()` followed by
   `setLanguage("deDE")`.

The active language is provided through `LocalizationProvider`; changing it
causes subscribed components to render with the new translations. Unsupported
locale codes are ignored, and missing translated values fall back to English.
