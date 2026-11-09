# Mobile Dungeon Toolkit

A mobile-friendly companion website for exploring, managing, and planning your *Mobile Dungeon* experience.

**[Open the Mobile Dungeon Toolkit](https://rewind1337.github.io/mobile-dungeon-toolkit/)**

## Project status

- **Current version:** 0.4.1
- **Project started:** 9 July 2025

This is an independent fan project. It is not affiliated with, endorsed by, or sponsored by Playa Games.

## Current features

- **Hero management** — save and manage heroes, inspect their stats, skills, and talents, and configure their equipment.
- **Item management** — browse, inspect, and save equipment; work with perk rolls, item stats, and set bonuses.
- **Team builder** — assemble teams from saved heroes, configure individual team setups, and import or export saved data.
- **Wiki and catalogues** — search the Hero Catalogue, tier list and banners, Item and Set Catalogue, Perk Catalogue, Skills and Talents Catalogue, Status Effect Catalogue, and Resource and Gem Catalogues.
- **Magic Toilet simulator** — simulate flushes, banner odds, pity counters, boosters, and resource spending.

The Magic Toilet is currently the only enabled simulator. Adventure, Tower, Titan, Guild Hunt, and Custom Combat simulations are planned but are not yet available as playable simulations.

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

## Roadmap

Completed milestones are marked with ~~strikethrough~~. The roadmap describes the broader development plan; individual features may be delivered ahead of their original milestone.

### 0.0.x — Foundations
- ~~Build the basic interface, with a focus on usability and mobile responsiveness.~~

### 0.1.x — Item management
- ~~Add the item database, including set items and unique items.~~
- ~~Save and manage item stats and set bonuses.~~
- ~~Support perks and rolls, including rarity, equipment slot, and item type.~~
- ~~Calculate stats from base stats for a desired level.~~

### 0.2.x — Hero management
- ~~Add functional management for legendary and epic heroes.~~
- ~~Equip heroes with gear, inspect their skills, and save their stats.~~
- ~~Calculate stats from base stats for a desired level.~~

### 0.3.x — Teams
- ~~Create and save teams.~~
- ~~Support reusable heroes with different equipment layouts and presets across multiple teams.~~
- ~~Add team import and export.~~

### 0.4.x — Wiki-style data hub
- ~~Provide a browsable, searchable reference for manually collected game data.~~
  - ~~Hero Catalogue, including the Tier List and Banner Catalogue.~~
  - ~~Item and Set Catalogue.~~
  - ~~Perk Catalogue.~~
  - ~~Skills and Talents Catalogue.~~
  - ~~Status Effect Catalogue.~~
  - ~~Resource and Gem Catalogues.~~
- ~~Add the localization framework and initial English/German translation support.~~

### 0.5.x — Simulation preparation
- Build the shared combat foundation used by the individual simulators.
- Implement core combat rules such as turn order, action priorities, damage calculations, targeting, and status-effect handling.
- Consolidate the hero and enemy stats, skill data, and reusable battle logic needed by each simulation mode.

### 0.6.x — Adventure and dungeon simulation
- Build on the shared combat foundation with chapter and dungeon encounters, enemy formations, spawn rules, and encounter-specific modifiers.

### 0.7.x — Tower simulation
- Add tower layouts, encounters, and tower-specific modifiers.

### 0.8.x — Titan simulation
- Add titan stats, skills, mechanics, and encounter rules.

### 0.9.x — Guild Hunt simulation
- Add guild boss stats, skills, mechanics, and encounter rules.

### 0.10.x — Custom PvP simulation
- Add configurable PvP battles using the shared combat foundation.

### 0.11.x — Daily activities
- ~~Implement the Magic Toilet banner-pull simulator, including banner odds, pity counters, boosters, and resource spending.~~
- Explore simulations for other daily mini-games and activities.

### 1.0.0 — Full toolkit
- Complete the planned features above, with room for additional tools and improvements.

## Project notes

The project is a work in progress. Some catalogue entries, descriptions, and game mechanics may be incomplete or inaccurate as understanding of the game evolves.

Game data is entered manually, using the game itself as the primary reference. Development has also been accelerated with the assistance of ChatGPT; the game data is not generated from the application's code or translation files.
