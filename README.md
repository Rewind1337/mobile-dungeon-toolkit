# Mobile Dungeon Toolkit

A web-based toolkit for exploring, managing, and planning your *Mobile Dungeon* experience.

## Project status

- **Current version:** 0.2.1
- **Project started:** 9 July 2025

This project is independent and is not affiliated with Playa Games.
IF you are affiliated with Playa Games, please reach out to me.

## Artwork, third-party assets, and licensing

Mobile Dungeon and its characters, artwork, sprites, icons, item/equipment graphics, and other in-game visual assets are owned by Playa Games and/or their respective rights holders. These assets are not original work by this project's author and are **not covered by the repository's MIT License**.

The toolkit is an independent fan project and is not affiliated with or endorsed by Playa Games. Permission to use and redistribute the game's assets is being sought; this notice does not itself grant permission. See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for the asset locations, attribution, and licensing scope.

The MIT License is intended to cover only original project code to the extent the author has the right to license it. It does not grant rights to Playa Games' intellectual property, third-party libraries, or other third-party material.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and detailed instructions for contributing code, game data, and translations.

## Roadmap

### 0.0.x — Foundations
- Build the basic interface, with a focus on usability and mobile responsiveness.

### 0.1.x — Item management
- Add the item database, including set items and unique items.
- Save and manage item stats and set bonuses.
- Support perks and rolls, including rarity, equipment slot, and item type.
- ~~Calculate stats from base stats for a desired level.~~

### 0.2.x — Hero management
- Add functional management for legendary and epic heroes.
- Equip heroes with gear, inspect their skills, and save their stats.
- ~~Calculate stats from base stats for a desired level.~~

### 0.3.x — Teams
- Create and save teams.
- Support reusable heroes with different equipment layouts and presets across multiple teams.

### 0.4.x — Wiki-Style Data Hub
- Provide a browsable, searchable reference for the manually collected game data:
  - Hero Catalogue, including the Tier List and Banner Catalogue.
  - Item & Set Catalogue.
  - Perk Catalogue.
  - Skills & Talents Catalogue.
  - Status Effect Catalogue.
  - Resource & Gem Catalogue.

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
- Explore simulations for the Magic Toilet and other daily mini-games.

### 1.0.0 — Full toolkit
- Complete the planned features above, with room for additional tools and improvements.

## Data and development notes

The toolkit is a work in progress. Some sections, entries, and descriptions are still incomplete, and calculated or simulated results may change as the underlying mechanics become better understood.

The project began without the assistance of AI tools. More recently, development has been significantly accelerated with the help of ChatGPT. All game data in the toolkit has been entered manually, using the game itself as the primary source of truth. Despite that care, some entries or values may still contain errors or omissions.
