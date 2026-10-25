# HD Item Sprite Migration

This branch starts the migration of the higher-resolution item artwork exported from the project's Google Sheet.

## Source inventory

- 217 image files in the supplied export.
- The files are PNG data despite their `.jpg` extensions.
- Most source images are 133–185 px square; a smaller subset is approximately 1.2–1.4k px, with one 2048×2048 image.
- The export uses generated `cellImage_*.jpg` names, so filenames alone do not identify the corresponding game item.

## Migration rules

1. Match each source image visually against the current sprite and item name before changing a runtime reference.
2. Prefer the HD source when it is a confirmed match; preserve transparent backgrounds and image proportions.
3. Give imported files descriptive names that follow the existing `src/sprites` directory conventions.
4. If the image has no current counterpart, add it only when its item identity can be established from the source data.
5. Leave ambiguous matches untouched and record them for review rather than assigning artwork by guess.

This first commit records the migration plan. No sprite references are changed by this documentation-only commit; the next migration commit should contain the first confirmed replacements/additions.
