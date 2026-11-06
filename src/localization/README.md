# Localization

Language dictionaries live in this folder. Each file exports one nested object;
keep the same key structure in every language and translate only the string values.

## Add a language

1. Copy `lang_enUS.jsx` to a new file, for example `lang_deDE.jsx`.
2. Translate the values without changing the object keys or interpolation names.
3. Import the new file in `index.js` and add it to `LANGUAGE_DICTIONARIES`:

```js
import lang_deDE from "./lang_deDE.jsx"

export const LANGUAGE_DICTIONARIES = {
    enUS: lang_enUS,
    deDE: lang_deDE,
}
```

4. Set the initial locale with `<LocalizationProvider initialLanguage="deDE">`,
   or change it at runtime with `useLocalization().setLanguage("deDE")`.

## Use a translation

```jsx
const filterHeading = useTranslation("app.pages.heroes.filter.header")
const resultCount = useTranslation(
    "app.pages.heroes.filters.search",
    undefined,
    { resultCount: 12, totalCount: 48 }
)
```

Keys use dot-separated paths. Missing keys fall back to the English dictionary;
if a key is missing in English too, the key itself is returned to make omissions
visible during development.

Interpolation uses named `{{placeholders}}`. Keep placeholder names identical
between dictionaries. The active language is provided through
`LocalizationProvider`, so changing it causes subscribed components to render
with the new translations.
