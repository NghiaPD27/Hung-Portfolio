# English / Vietnamese localization

English is the default. The EN / VI button uses i18next and react-i18next, saves
the selected language locally, and updates text without remounting project pages.
Names, brands, contact details, and existing English copy are preserved in English.

## Artwork scope

Only these four EKO signs have English variants, as requested. All other original
artwork, posters, and logos remain unchanged, including text baked into those images.
The original Vietnamese assets are never overwritten.

| Original asset | English asset | English text |
| --- | --- | --- |
| `/assets/eko/sign-1-opt.jpg` | `/assets/locales/en/eko/sign-1.png` | LITTERING IS NOT COOL |
| `/assets/eko/sign-2-opt.jpg` | `/assets/locales/en/eko/sign-2.png` | PUT TRASH IN ITS PLACE |
| `/assets/eko/sign-3-opt.jpg` | `/assets/locales/en/eko/sign-3.png` | PROTECT THE ENVIRONMENT / DO IT NOW |
| `/assets/eko/sign-4-opt.jpg` | `/assets/locales/en/eko/sign-4.png` | THE BIN IS RIGHT HERE |

The mobile first-sign source maps to the same English sign-4 artwork. Switching
back to VI restores its original Figma export.

## Image generation prompt set

Mode: built-in image generation, editing each original sign independently.
Reference role: source artwork, not style inspiration.
Shared instructions: translate only the Vietnamese caption into the exact English
text listed above; preserve the square composition, bright green backdrop, blue
and green sign borders, white/black icon artwork, sign pole, lighting, shadows,
and overall typography placement. Do not add elements or change the scene.
Each result is saved as a separate PNG, with its original asset retained.

No further English image variants are generated or used.

## Verification

`node scripts/test-localization.mjs` checks translation coverage, placeholder
matching, existing English copy, asset existence, and English/Vietnamese routing.
Swiper's accessibility labels are refreshed without resetting its active slide.
