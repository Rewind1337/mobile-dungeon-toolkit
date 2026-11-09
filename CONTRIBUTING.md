# Contributing

Thanks for helping improve Mobile Dungeon Toolkit! Contributions are welcome, and you do not need to be a programmer to make a useful one. Knowing the game, being comfortable with basic computer tasks, and speaking another language are already enough to help improve the translations.

## Localization at a glance

The language files live in **src/localization/**:

- **lang_enUS.jsx** is the English reference.
- **lang_deDE.jsx** is the German translation example. It is still being filled in; once complete, it will be a useful full-language template for contributors.
- Other languages follow the same file structure, for example **lang_frFR.jsx** for French.

A language file has two main areas:

~~~jsx
const lang_example = {
    app: {
        // Translated interface wording: labels, messages, instructions, and page text.
    },
    data: {
        overrides: {
            // Optional translations for game content such as items and status effects.
        },
    },
}
~~~

You can contribute just to the visible interface text, just to game content, or to both. It is perfectly fine to submit a small or incomplete translation; anything not translated yet continues to use the English wording or original game data.

## Adding a new language

For example, to start a French translation:

1. Open **src/localization/lang_deDE.jsx** on GitHub. When the German translation is complete, copy its contents as a starting point and create a new file named **src/localization/lang_frFR.jsx**. Until then, use **lang_enUS.jsx** alongside it so you do not miss entries that are not yet present in the German example.
2. Translate the readable text values into French. Keep the structure and all existing keys exactly as they are: do not rename section names, property names, IDs, or placeholders such as **{{chance}}**. The keys are how the application connects each translation to the right place.
3. Make the change directly on GitHub. For an existing language file, open it and choose the pencil icon to edit it. To add a new file, use **Add file → Create new file** and enter the full path **src/localization/lang_frFR.jsx**. When you are ready, choose the option to create a new branch and propose the changes—do not commit directly to **main**. Give the proposal a clear title and a short note about the language or corrections, then create the pull request.

You do not need to edit application code or register the language yourself. The project maintainers will take care of the technical setup needed to make a new language available.

## Example: translating game content

Game-content translations can be added in the **data.overrides** area. Keep the collection names, IDs, and field names as shown; translate only the readable text:

~~~jsx
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
~~~

The database remains the original source for game data, so there is no need to copy entire item, hero, or status definitions into a language file. Add only the text that should appear differently in your language.

## Placeholders in translated text

Some sentences contain values that the application fills in automatically. They look like **{{chance}}**, **{{value}}**, **{{status}}**, or **{{duration}}**.

Keep each placeholder exactly as written, including its spelling and double braces. You can move it to a different position in the sentence when your language needs a different word order, but do not translate it, remove it, or replace it with a fixed number. Only use placeholders that are already present in the English wording or game-content entry.

## Translation review checklist

Before proposing a translation, it helps to check that:

- The wording sounds natural and is easy to understand in your language.
- Game terms, hero names, item names, skills, and effects are consistent wherever they appear.
- The translation describes the same in-game effect as the English text. Do not guess at unclear mechanics; leave a note in the pull request so someone can check them.
- Keys, section names, IDs, field names, and placeholders have not been changed—only the readable text values should be translated.
- You have checked the surrounding English wording when a sentence is unclear. Partial translations are welcome, so it is better to leave an uncertain entry for review than to invent a meaning.

You do not need to run the project, install development tools, or know React to contribute a translation. A pull request made through GitHub's website is enough. Maintainers can help with anything that requires code changes or testing.

## Code contributions

For changes to the application itself, the project uses Vite and React. Set up a local copy with:

~~~bash
npm install
npm run dev
~~~

Before submitting code changes, run:

~~~bash
npm run lint
npm run build
~~~

Keep code pull requests focused, describe the user-visible changes, and mention the checks you ran. For changes involving game data, include the source or reasoning where practical. Game data is manually researched and can be incomplete; do not silently turn assumptions into confirmed mechanics.
