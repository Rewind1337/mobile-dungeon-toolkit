# Third-Party Notices

This document records third-party artwork, fonts, and software used by Mobile Dungeon Toolkit. It is an attribution and license summary, not a grant of rights or a substitute for the original license texts.

The dependency versions and license identifiers below are taken from the current `package-lock.json`. Dependency versions and declared license metadata can change when dependencies are updated; review this document whenever the lockfile or application imports change.

## Mobile Dungeon artwork, branding, and game data

**Mobile Dungeon**, including its characters, character artwork, sprites, item and equipment graphics, icons, visual effects, and other in-game assets, is the property of **Playa Games** and/or the applicable rights holders. The project does not claim ownership of those materials.

The toolkit is an independent fan project and is not affiliated with, endorsed by, or sponsored by Playa Games. Permission to use and redistribute game assets is being sought. Until permission is confirmed, this notice is provided for attribution and rights clarification only; it is **not** a license or authorization to use or redistribute those assets.

### Asset locations

The repository's image and sprite assets are stored under `src/sprites/`, including:

- `armors/` (including set artwork)
- `attributes/`
- `buttons/`
- `elements/`
- `helmets/` (including set artwork)
- `heroes/`
- `necklaces/` (including set artwork)
- `perks/`
- `resources/`
- `rings/` (including set artwork)
- `roles/`
- `simulation/`
- `special/`
- `splash/`
- `stats/`
- `status/`
- `weapons/` (including unique-item artwork)

The directory also contains root-level files such as game and publisher logos, the favicon, and interface artwork. This directory listing identifies where assets are stored; it is not a claim that every file has the same creator, rights holder, or license. Where an individual asset has a different rights holder, that holder's rights remain in force.

### Game data

The `src/database/` directory contains manually collected game data, including names, descriptions, stats, mechanics, and other game-related information. Some entries may reproduce or be derived from in-game text or mechanics. The project does not claim that the repository's MIT License grants rights to third-party game content or intellectual property.

## Fonts

The application requests the following font families from Google Fonts in `index.html`. The font files are served externally and are not stored in this repository.

| Font | Designer / attribution | License |
| --- | --- | --- |
| [Bangers](https://fonts.google.com/specimen/Bangers) | Vernon Adams | [SIL Open Font License 1.1](https://openfontlicense.org/) |
| [Poetsen One](https://fonts.google.com/specimen/Poetsen+One) | Pablo Impallari and Rodrigo Fuenzalida; Reserved Font Name: Poetsen | [SIL Open Font License 1.1](https://openfontlicense.org/) |
| [Roboto](https://fonts.google.com/specimen/Roboto) | The Roboto Project Authors; upstream metadata credits Christian Robertson, ParaType, and Font Bureau as designers | [SIL Open Font License 1.1](https://openfontlicense.org/) |

The Google Fonts name and wordmark are used in the application as provider attribution. Google and Google Fonts names and marks remain the property of Google.

## Direct npm dependencies

The following direct dependencies are declared by the project. Versions are the exact versions resolved in the current lockfile, not the version ranges in `package.json`.

### Application dependencies

| Package | Locked version | License |
| --- | ---: | --- |
| `@tanstack/react-virtual` | 3.14.25 | MIT |
| `react` | 19.3.1 | MIT |
| `react-dom` | 19.3.1 | MIT |
| `react-responsive` | 10.0.1 | MIT |
| `react-use-draggable-scroll-safe` | 0.5.4 | MIT |
| `sass-embedded` | 1.107.1 | MIT |

### Development dependencies

| Package | Locked version | License |
| --- | ---: | --- |
| `@eslint/js` | 9.39.5 | MIT |
| `@types/react` | 19.3.0 | MIT |
| `@types/react-dom` | 19.3.0 | MIT |
| `@vitejs/plugin-react` | 4.7.0 | MIT |
| `baseline-browser-mapping` | 2.11.34 | Apache-2.0 |
| `eslint` | 9.39.5 | MIT |
| `eslint-plugin-react-hooks` | 5.2.0 | MIT |
| `eslint-plugin-react-refresh` | 0.4.26 | MIT |
| `globals` | 16.5.0 | MIT |
| `rollup-plugin-visualizer` | 7.1.1 | MIT |
| `vite` | 6.4.5 | MIT |

### Transitive npm dependencies

The lockfile currently contains **291 dependency package entries** (excluding the root project entry), including development tools, nested package versions, and optional platform-specific packages. Every dependency entry currently declares a license value in its package metadata. The counts below describe lockfile package entries, not unique projects or copyright holders.

| Lockfile license value | Package entries |
| --- | ---: |
| MIT | 247 |
| Apache-2.0 | 15 |
| ISC | 14 |
| BSD-2-Clause | 6 |
| BSD-3-Clause | 4 |
| BSD | 1 |
| Apache-2.0 AND BSD-3-Clause | 1 |
| Python-2.0 | 1 |
| CC-BY-4.0 | 1 |
| 0BSD | 1 |

The package names, exact versions, dependency relationships, and declared license metadata for these transitive packages are recorded in `package-lock.json`. Consult each package's own distribution for its copyright notices and complete license text. When redistributing installed dependencies or a build that includes them, retain all applicable upstream license and notice files. The summary above does not replace those texts.

## Original project code

Original application code and styling authored for this toolkit are primarily located in:

- `src/App.jsx` and `src/main.jsx` — application entry point and routing.
- `src/components/` — React UI components.
- `src/css/` — stylesheets.
- `src/hooks/` — application hooks.
- `src/js/` — JavaScript utilities and helpers.
- `src/localization/` — interface translations and game-content overrides.
- Root-level project and build configuration files such as `index.html`, `vite.config.js`, and `eslint.config.js`.

These are broad directory-level descriptions, not a guarantee that every line or item in those locations is exclusively original. The `src/database/` and `src/sprites/` directories may contain third-party game content, artwork, names, or other material with separate rights.

The repository's `LICENSE` applies only to the project author's original work to the extent the author is entitled to license it. It does not override third-party copyright, trademarks, license terms, or permissions.
