# Mobile Dungeon Toolkit

A mobile-friendly companion website for exploring, managing, and planning your *Mobile Dungeon* experience.

**[Open the Mobile Dungeon Toolkit](https://rewind1337.github.io/mobile-dungeon-toolkit/)**

This is an independent fan project. It is not affiliated with, endorsed by, or sponsored by Playa Games.

## Current features

- **Hero management** — save and manage heroes, inspect their stats, skills, and talents, and configure their equipment.
- **Item management** — browse, inspect, and save equipment; work with perk rolls, item stats, and set bonuses.
- **Team builder** — assemble teams from saved heroes, configure individual team setups, and import or export saved data.
- **Wiki and catalogues** — search the Hero Catalogue, tier list and banners, Item and Set Catalogue, Perk Catalogue, Skills and Talents Catalogue, Status Effect Catalogue, and Resource and Gem Catalogues.
- **Magic Toilet simulator** — simulate flushes, banner odds, pity counters, boosters, and resource spending.

The Magic Toilet is currently the only enabled simulator. Adventure, Tower, Titan, Guild Hunt, and Custom Combat simulations are planned but are not yet available.

## Languages

The application includes a localization framework with English as its reference locale and a partially translated German locale. Untranslated interface text falls back to English. Game-content overrides can translate names, descriptions, effects, and other displayed data without duplicating the underlying game database.

Translation contributions are welcome, including incomplete ones. See [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions.

## Saving and sharing data

Saved heroes, items, teams, and application state are stored in your browser's local storage. There is no user account or cloud-sync service, so browser or site-data removal can delete local saves. Use the application's import/export features to transfer saved data between browsers or devices.

## Running locally

The project uses React and Vite. To run a development copy:

~~~bash
npm install
npm run dev
~~~

Before submitting code changes, run:

~~~bash
npm run lint
npm run build
~~~

## Artwork, third-party assets, and licensing

Mobile Dungeon's characters, in-game artwork, sprites, equipment graphics, and related intellectual property belong to Playa Games and/or their respective rights holders. These materials are not original work by this project's author and are **not covered by the repository's MIT License**.

Permission to use and redistribute the game's assets is being sought. This notice does not itself grant permission. The [Third-Party Notices](./THIRD_PARTY_NOTICES.md) document describes the known third-party artwork, fonts, icons, dependencies, and licensing boundaries.

The repository's MIT License applies only to original project code to the extent the author is entitled to license it. It does not grant rights to Playa Games' intellectual property, third-party libraries, fonts, icons, or other third-party material.

## Project notes

The project is a work in progress. Some catalogue entries, descriptions, and game mechanics may be incomplete or inaccurate as understanding of the game evolves.

Game data is entered manually, using the game itself as the primary reference. Development has also been accelerated with the assistance of ChatGPT; the game data is not generated from the application's code or translation files.

The project began on 9 July 2025.
