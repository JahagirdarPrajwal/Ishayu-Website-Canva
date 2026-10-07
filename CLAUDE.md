# ISHAYU — homepage

Pixel-faithful web recreation of a Canva homepage design, now being extended
with a scroll-driven animation layer.

**Reference / source of truth:** `1.png` — the Canva export, 1366 × 6520.
Treat it as a visual spec, not inspiration. `2.png` (products) and `3.png`
(our story) are exports of pages that have **not** been built yet.

Stack: React 18 + Vite 5, plain CSS (one stylesheet per section). No Tailwind
(see Conflicts), no TypeScript config, no router.

---

## 1. Current state

The static recreation is **complete and approved**. Verified numerically
against `1.png`:

- rendered page height is exactly **6520 px** at 1366 wide
- every text run matches the reference width to within **0.5 %**
- element positions land within **0–3 px** vertically
- whole-page mean pixel difference **2.6 %** (almost all JPEG noise in photos)

Do not regress this. Re-verify after any change — see §9.

The next phase is animation only. **Do not redesign, restructure or migrate.**

---

## 2. The design canvas — read this before touching any CSS

The artboard is a fixed 1366 px canvas, so the site reproduces it as a canvas
rather than as a fluid grid.

Every length in `src/sections/*.css` is a **design pixel ÷ 100, written in
`rem`**. A 237 px card is `2.37rem`. A 28 px type size is `0.28rem`.

`src/main.jsx` sets the root font-size from the live content width:

```js
fontSize = (clientWidth / 1366) * 100 + 'px'   // so 1rem === 100 artboard px
```

- Capped at **1.25×** above 1366 so it does not balloon on a 4K monitor.
- Below **860 px** it re-bases on a 430 px canvas and `responsive.css` reflows
  the artboard into a stacked column. That breakpoint constant is duplicated in
  both files — keep them in sync.

### Consequences you must respect

- **Never write raw `px`** in section CSS. It will not scale with the design.
- **Never enable a library that assumes `1rem === 16px`.** At our root size a
  Tailwind `p-4` becomes 100 px of padding.
- **ScrollTrigger `start` / `end` must be `%` or `vh`, never `px`** — the root
  font-size changes with viewport width, so px offsets drift between screens.
- Animate **transforms**, not `left` / `top`. The rem values are layout
  properties; tweening them thrashes layout on every frame.

---

## 3. Section map

| Component | Artboard rows | Height | Background |
|---|---|---|---|
| `Hero.jsx` | 0 – 768 | `7.68rem` | `hero/hero-bg.jpg` |
| `EverydayEdit.jsx` | 768 – 1690 | `9.22rem` | white |
| `BetterChoice.jsx` | 1690 – 2360 | `6.7rem` | white |
| `ChaseTheAura.jsx` | 2360 – 4160 | `18rem` | `aura/aura-bg.jpg` |
| `SnackLikeYouMeanIt.jsx` | 4160 – 5020 | `8.6rem` | `--blue-deep` |
| `Instagram.jsx` | 5020 – 5682 | `6.62rem` | `--blue-deep` + `insta/band.jpg` |
| `Footer.jsx` | 5682 – 6520 | `8.38rem` | `footer/footer-bg.jpg` |

Each section is `position: relative; overflow: hidden` (`.section` in
`tokens.css`) with absolutely positioned children at measured coordinates.

---

## 4. Type

The original is set in a licensed Helvetica-family grotesque. **Archivo** is the
closest free match and is self-hosted via `@fontsource` — no external font
requests at runtime. Per-style negative tracking (`--track-body`,
`--track-display` in `tokens.css`) closes the remaining width difference so
every line of copy breaks at the same width as the export.

Display italics are **Playfair Display**. Its lowercase runs ~10 % shorter than
the original at matching width; that is the one accepted type difference.

**Decision (confirmed by Prajwal): keep Archivo.** Swapping the family means
re-tuning every tracking value and re-running the comparison in §9.

---

## 5. Yellow highlight bands

The marker-pen bands behind the italic words are **not** text backgrounds. Each
is an explicitly sized rectangle drawn by `.hl::before`, positioned by four
custom properties set per instance:

```css
.better__italic { --hl-x: 0.24rem; --hl-y: 0.22rem; --hl-w: 4.12rem; --hl-h: 0.76rem; }
```

They were measured off the export so they match regardless of how the italic
face renders. `.hl` carries `isolation: isolate` so the `z-index: -1` pseudo
stays behind the text but above the section background.

**To animate the left-to-right wipe:** tween `--hl-w` from `0` to its resting
value (GSAP can animate custom properties on the parent), or convert `::before`
into a real child element and scale it with `transform-origin: left`. Either
way, **do not change the resting geometry** — those numbers are measured.

---

## 6. Assets

Everything lives in `public/assets/`. Originals from the Canva export are used
where they existed; the rest were cropped out of `1.png` at full resolution.

### Used as supplied
`hero/hero-bg.jpg`, `aura/aura-bg.jpg`, `aura/ie-logo.png`,
`aura/game-{snackslash,astrofuel,fuelrally,snackrush}.jpg`

### Cropped from `1.png` — pixel-accurate but flattened
`hero/card-*.png` (6 collage cards), `edit/shelf-objects.png`,
`edit/note-reminder.png`, `products/strip.jpg`, `snack/card-lemons.jpg`,
`snack/note-year.png`, `snack/folder.png`, `insta/card.png`, `footer/logo.png`

### Reconstructed (type painted out, hidden areas rebuilt)
`insta/band.jpg` and `footer/footer-bg.jpg` — the export has headline, body
copy, logo and contact block burnt into that landscape. The hill behind the
Instagram row was rebuilt from the four visible gaps between the cards.

### New assets in the project root, not yet wired in
| File | For |
|---|---|
| `coatz.png`, `protein bar.png`, `blend.png`, `nutribite.png` | Part 3 — replace `products/strip.jpg`. Clean alpha cutouts, 1536–1800 px wide |
| `running guy.png` | Part 4 — 263 × 504, real alpha. Overlays the guy already baked into `aura-bg.jpg` |
| `Ishayu website (9).png` | Part 2 notes card. **Still has its body text baked in** — only "reminder" was removed. Those four lines need painting out before they can be typed on |
| `Screenshot 2026-10-07 025911.png` | Part 5 notes card. Fully empty, ready to use |
| `ishayu logo.png` | Part 7 — replaces the keyed `footer/logo.png` |
| 6 × `.mp4` | Part 6 carousel reels |

---

## 7. Animation work

Master spec: **`docs/animation-spec.md`** (Prajwal's own words; the OriginKit
API key has been redacted from the copy in this repo).

Implementation is **progressive, one Part at a time**, each tested before
moving on.

### Part → component

| Spec part | Component |
|---|---|
| Loading screen | *(new)* `Loader.jsx`, App level |
| Nav buttons | `Hero.jsx` → `.hero__pill` ×5 |
| Part 1 hero | `Hero.jsx` |
| Part 2 the everyday edit | `EverydayEdit.jsx` |
| Part 3 make your better choice | `BetterChoice.jsx` |
| Part 4 chase the aura | `ChaseTheAura.jsx` |
| Part 5 snack like you mean it | `SnackLikeYouMeanIt.jsx` |
| Part 6 Instagram carousel | `Instagram.jsx` |
| Part 7 footer | `Footer.jsx` |

### Library split

**Motion** (`motion/react`) — BlurText word reveals, OrbitImages, SpringCheck,
TactileButton, shelf-object float/drag springs, folder pops, product levitation
loops, loader exit.

**GSAP + ScrollTrigger** — every scroll-timed sequence: rack rails, section
entry orchestration, band wipes, product rise, IE pixel unfold, orbit entry,
carousel sync.

Rule of thumb: **GSAP owns *when*, Motion owns *how*.** ScrollTrigger is free;
no Club GreenSock licence needed.

### Third-party components

| Component | Verdict |
|---|---|
| `OrbitImages`, `RefineFrame`, `FoldText`, `SpringCheck` | use as supplied |
| `TactileButton` (OriginKit, already at `src/components/originkit/ui/`) | use as supplied; needs a px-scale wrapper, see Conflicts |
| `BlurText` | **fork** — must accept children, not a string |
| `TextType` | **fork** — reserve box, support segments, `loop={false}` |
| `CircularCarousel` | **fork** — render `<video>` instead of `<img>` |

### Dependencies

Installed: `react` 18.3, `react-dom`, `vite` 5.4, `@vitejs/plugin-react`,
nine `@fontsource/*`, `playwright` (dev), **`motion` 14**, `framer-motion` 14,
`tailwindcss` 4.3 + `@tailwindcss/vite`.

Still needed:

```bash
npm i gsap @hugeicons/react @hugeicons/core-free-icons
npm un framer-motion    # motion@14 supersedes it; two copies invite version drift
```

`lenis` for scroll smoothing is optional — hold off until Part 1 is felt.

---

## 8. Conflicts and their resolutions

### Critical

1. **Tailwind must stay switched off.** It is installed but *not* wired in —
   no `tailwindcss()` plugin in `vite.config.js`, no `@import "tailwindcss"`,
   no config file. Leave it inert. Preflight would reset the design, and every
   Tailwind spacing utility is rem-based (see §2). The OriginKit button uses
   **zero** Tailwind classes — it is entirely inline-styled — so nothing needs
   it. Removing the two packages is safe if you prefer.

2. **`BlurText`'s flex root breaks every heading.** Its root is
   `<p style={{display:'flex',flexWrap:'wrap'}}>` taking a plain `text` string.
   Our headings are absolutely positioned, `white-space: nowrap`, tracked, and
   each contains a nested `<span class="hl">` carrying the yellow band. Fork it
   to accept **children**, walk the React tree, wrap only text nodes in per-word
   spans, and keep `display: inline`.

3. **`.section { overflow: hidden }`** clips the orbit ring, the carousel and
   the falling hero cards. Relax per-section, carefully — it is currently what
   stops the full-bleed backgrounds bleeding into neighbours.

### Assets that must be split before they can animate

4. **`edit/shelf-objects.png` is one flat composite** — three rails and six
   objects baked together. Split into 3 rails + 6 transparent PNGs before
   anything can float or be dragged.
5. **`products/strip.jpg` is one flat image.** Replaced by the four cutouts, but
   the grey panel backdrop behind them has to be rebuilt in CSS.
6. **The running guy appears twice.** He is baked into `aura-bg.jpg`;
   `running guy.png` goes on top. **Decision: overlay the cutout exactly on the
   baked-in one** — calibrate position and scale against the export so the seam
   is invisible. The orbit ring then passes between the two layers.
7. **`insta/band.jpg` has the five placeholder cards baked in.** The carousel
   cannot sit over them; that strip needs repainting.
8. **`Ishayu website (9).png` still has its body text baked in.** Paint those
   four lines out (flat cream background, straightforward) before typing on it.

### Smaller

9. **`tactile-button.tsx` sizes everything in px** (`padding: "40px 64px"`,
   `rounded`, `base.depth`). Under the scaled canvas the buttons would not grow
   with the page. Feed it computed px derived from the live scale factor.
10. **It is TypeScript in a JS project.** Vite/esbuild strips types fine so it
    runs, but editors complain without a `tsconfig.json`. One small file.
11. **`React.StrictMode` double-invokes effects in dev**, breaking `TextType`'s
    timing state and double-registering ScrollTriggers. Guard, or drop it.
12. **Mobile**: `responsive.css` strips absolute positioning below 860 px, which
    breaks every pinned animation. Wrap scroll-pinned work in
    `gsap.matchMedia()` desktop-only blocks.
13. **`RefineFrame` wraps media in its own frame** with its own radius and
    background. `snack/card-lemons.jpg` has the `slay.png` title bar baked into
    the image — pass the photo alone and keep the title bar as a sibling.

### Resolved

14. Slot 2 of the product row moves from the green **Moringa Energy Bar** (in
    the Canva reference) to the **Cocoa Protein Bar** (`protein bar.png`).
    Slots 1, 3, 4 match. **Confirmed deliberate by Prajwal** — the Moringa
    pack shot could not be sourced, so the cocoa flavour stands in. Build
    Part 3 against the four supplied cutouts, not the Canva strip.

---

## 9. Verifying fidelity

Two scripts guard the recreation. Run them after any change that touches
layout, type or positioning.

```bash
node scripts/shot.mjs          # full-page screenshot at 1366 → .verify/build.png
python3 scripts/compare.py     # section-by-section diff against 1.png
```

`compare.py` prints per-section mean absolute pixel difference on a 0–255
scale, plus the page height. Healthy baseline for the approved recreation:

```
whole page mean abs diff: 6.44        <- page height must be exactly 6520

  hero     8.05    edit     4.02    better   4.49    aura   8.19
  snack    3.36    insta    6.34    footer   8.67
```

The photographic sections sit higher purely because of JPEG noise. A jump of
more than ~2 in any section means something moved — open the side-by-side
strip in `.verify/cmp/` to see what.

Animated elements settle to their resting state, so run the comparison with
animations complete (the script waits for `document.fonts.ready` plus a settle
delay; extend it if a Part's entrance runs long).

---

## 10. Decisions already made

- **Font** — keep Archivo + Playfair Display. Not revisiting.
- **Running guy** — overlay the transparent cutout on the baked-in one.
- **Instagram reels** — play the six local `.mp4`s, muted and looping,
  scroll-synced. Click opens that reel on instagram.com in a new tab. No
  embeds: Instagram blocks autoplay and scrubbing in iframes.
- **Nav button** — OriginKit `tactile-button` has been installed via the CLI
  and lives at `src/components/originkit/ui/tactile-button.tsx`.
- **Mobile** — the reflow in `responsive.css` is a reflow, not a redesign, and
  is open to revision. Deleting that file and its import reverts to a straight
  proportional shrink.

## 11. Housekeeping

The OriginKit API key was pasted in plaintext in the original spec file. It has
been redacted from `docs/animation-spec.md`, but **rotate it** — and note that
`.gitignore` covers `.originkit/` only.
