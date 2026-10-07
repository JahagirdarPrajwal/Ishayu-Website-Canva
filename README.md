# ISHAYU — homepage

A static recreation of the Canva homepage (`1.png`, a 1366 × 6520 artboard),
rebuilt as a React + Vite site. **Stage 1: fidelity only — no animations,
no interactions, no design changes.**

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## How the layout works

The Canva artboard is a fixed 1366 px canvas, so the site reproduces it as a
canvas rather than as a fluid grid.

- Every length in the stylesheets is a **design pixel ÷ 100**, expressed in
  `rem`. A 237 px card is `2.37rem`; a 28 px type size is `0.28rem`.
- `src/main.jsx` sets the root font-size from the viewport width
  (`width / 1366 × 100`), so `1rem` is exactly 100 artboard pixels at 1366 px
  wide and the whole composition scales proportionally at any other width.
  Above 1366 px the scale is capped at 1.25× so it doesn't balloon on a 4K
  monitor.
- Section heights and element positions are the measured artboard
  coordinates, so the rendered page is 6520 px tall — the same as the export.

Each section is one component plus one stylesheet, so a section can be
changed or animated without touching the others:

| File | Artboard rows |
| --- | --- |
| `src/sections/Hero.jsx` | 0 – 768 |
| `src/sections/EverydayEdit.jsx` | 768 – 1690 |
| `src/sections/BetterChoice.jsx` | 1690 – 2360 |
| `src/sections/ChaseTheAura.jsx` | 2360 – 4160 |
| `src/sections/SnackLikeYouMeanIt.jsx` | 4160 – 5020 |
| `src/sections/Instagram.jsx` | 5020 – 5682 |
| `src/sections/Footer.jsx` | 5682 – 6520 |

### Yellow highlight bands

The marker-pen bands behind the italic words are drawn as explicitly sized
rectangles (`--hl-x/-y/-w/-h` on a `.hl` element) rather than as text
backgrounds, so each band matches the export to the pixel no matter how the
italic face measures. See `.hl` in `src/styles/tokens.css`.

## Type

The original is set in a Helvetica-family grotesque that isn't freely
licensed. **Archivo** is the closest available match and is self-hosted via
`@fontsource` (no external font requests). A small negative letter-spacing
per type style (`--track-body`, `--track-display`) closes the remaining width
difference, so every line of copy breaks at the same width as the export.

The italic display face is **Playfair Display**. It matches the original's
`w`, `k` and `a` closely; its lowercase runs about 10% shorter at the same
width, which is the one visible type difference. If you can find out the real
Canva font, swapping `--sans` / `--serif` in `src/styles/tokens.css` is a
one-line change — the tracking values are the only thing that would need
re-tuning.

## Assets

Everything in `public/assets/` came out of your folder. The files below were
**cropped from `1.png`** because they weren't in the export as separate
layers. They're pixel-accurate to the reference but are flattened — replace
them with clean Canva exports when you can and nothing else needs to change:

| File | What it should be |
| --- | --- |
| `hero/card-racing.png`, `card-kitchen.png`, `card-energy.png` | the three "slay.png" window cards |
| `hero/card-chair.png`, `card-coatz.png`, `card-leg.png` | the three "Details.jpg" polaroids |
| `edit/shelf-objects.png` | the three shelves + six objects, as one flat image |
| `edit/note-reminder.png` | the "reminder" Notes card |
| `products/strip.jpg` | the four pack shots, as one 1366 × 513 strip |
| `snack/card-lemons.jpg`, `note-year.png` | the picnic photo and the "This year, it was…" card |
| `snack/folder.png` | the Finder folder icon |
| `insta/card.png`, `insta/band.jpg` | one Instagram placeholder card, and the hill behind the row |
| `footer/logo.png` | the Ishayu wordmark (keyed off the grass, so the edges are soft) |
| `footer/footer-bg.jpg` | the footer landscape |

Two of these were **reconstructed**, not just cropped: `insta/band.jpg` and
`footer/footer-bg.jpg`. The export has the headline, body copy, logo and
contact block burnt into that landscape, so the type was painted out and the
hill behind the Instagram row — which the cards hide almost completely — was
rebuilt from the four visible gaps between them. It reads correctly at full
size; if you still have the original landscape image, dropping it in will be
cleaner.

Used as-is from your export: `hero/hero-bg.jpg`, `aura/aura-bg.jpg`,
`aura/ie-logo.png` and the four `aura/game-*.jpg` tiles.

## Responsive

`src/styles/responsive.css` only applies below 860 px. Above that the artboard
is reproduced exactly and nothing in that file is active.

Below 860 px there's no reference to copy, so the sections are released from
the artboard and stacked into one readable column using the same assets,
colours, type styles and copy — a reflow, not a redesign. Delete that file and
its import in `main.jsx` to fall back to a straight proportional shrink.

## Not done yet (Stage 2)

No animations, transitions, hover states, parallax or scroll effects — by
design. The nav links, Instagram cards and game tiles are inert placeholders.
Only the homepage is built; `2.png` (products) and `3.png` (our story) are
still just exports in your folder.
