# Sprite match report: Google Sheets artwork export

This report records visually confirmed matches between files in the supplied export and existing item sprite paths under `src/sprites/`.

The export files have generated names, and many images appear more than once. Source files with `.jpg` extensions are PNG images with alpha transparency. Do not replace a current sprite with a source file unless the source is at least as useful in resolution/quality; a matching 133×133 export is an identity match, not an HD upgrade.

## High-confidence identity matches

| Export file | Existing sprite path | Match | Source size | Notes |
|---|---|---|---:|---|
| `cellImage_130486642_0.jpg` | `src/sprites/helmets/sets/pumpkin.png` | Pumpkin helmet | 133×133 | Exact visual identity |
| `cellImage_1677669421_20.jpg` | `src/sprites/helmets/sets/cyber.png` | Digital display helmet | 133×133 | Exact visual identity |
| `cellImage_567663537_5.jpg` | `src/sprites/helmets/sets/downhole.png` | Yellow hard hat | 133×133 | Exact visual identity |
| `cellImage_567663537_0.jpg` | `src/sprites/helmets/sets/thorn.png` | Green spiked helmet | 133×133 | Exact visual identity |
| `cellImage_567663537_11.jpg` | `src/sprites/helmets/sets/breaker.png` | Silver helmet with purple eyes | 133×133 | Exact visual identity |
| `cellImage_567663537_20.jpg` | `src/sprites/helmets/sets/goliath.png` | Gold horned helmet | 184×184 | Exact visual identity |
| `cellImage_567663537_16.jpg` | `src/sprites/helmets/sets/titan.png` | Barrel-shaped helmet | 184×184 | Exact visual identity |
| `cellImage_567663537_8.jpg` | `src/sprites/helmets/sets/ringmaster.png` | Clown helmet | 184×184 | Exact visual identity |
| `cellImage_1677669421_95.jpg` | `src/sprites/helmets/sets/warden.png` | Icy silver helmet | 184×184 | Exact visual identity |
| `cellImage_1677669421_106.jpg` | `src/sprites/helmets/sets/lab.png` | Respirator helmet | 184×184 | Exact visual identity |
| `cellImage_196840205_0.jpg` | `src/sprites/helmets/sets/elementor.png` | Blue/purple mask | 184×184 | Exact visual identity |
| `cellImage_1677669421_24.jpg` | `src/sprites/helmets/sets/dragonbone.png` | Jawbone helmet | 184×184 | Exact visual identity |

## Important limitation

These are reliable name/path matches, but the listed source files are not the large HD assets. The export also contains a smaller set of 1,200–1,400 px images; those need to be matched separately to the appropriate existing item or treated as new art. The matching report intentionally does not claim that a low-resolution duplicate is an upgrade or overwrite any current sprite.

## Next matching pass

Continue matching the remaining source files against weapons, armor, rings, and necklaces. Prefer the large transparent images when their visual identity is confirmed, and preserve the current source files until the match is unambiguous.
