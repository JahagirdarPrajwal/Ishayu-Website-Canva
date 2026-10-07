/* ==================================================================
   Shared primitives for the animation layer.

   The recreation is approved and verified pixel-for-pixel (CLAUDE.md §1,
   §9), so every helper here is built around one rule:

       the settled state must be byte-identical to the static build.

   That means a tween never ends on a hard-coded number. It reads the value
   the stylesheet authored, animates towards it, and then *removes its own
   inline override* so the element falls back to the authored CSS. After the
   entrance the DOM carries no leftover inline geometry at all.
================================================================== */

export const DESKTOP = '(min-width: 860px)' // must match main.jsx / responsive.css

/* ------------------------------------------------------------------
   Yellow marker band — left-to-right wipe.

   The resting rectangle was measured off the export and is set per instance
   as --hl-x/-y/-w/-h (CLAUDE.md §5). Those numbers must not change, so the
   authored --hl-w is read back and used as the tween target, and the inline
   value is dropped on completion. Only the band's own absolutely positioned
   pseudo-element repaints — nothing else in the section relayouts.
------------------------------------------------------------------ */
/* Design px the marker travels per second. Every band on the page runs at
   this rate so a short one and a long one read as the same stroke — set
   from the hero's band, which is the one that was signed off: 473 px over
   1.6s. Giving each band its own duration instead makes the narrow ones
   crawl. */
const BAND_SPEED = 295

/* The authored width is in rem (1rem === 100 design px). The mobile
   fallback uses calc(), which never animates — the entrance is desktop
   only — so anything unparseable just takes the default. */
function bandDuration(resting) {
  const m = /^([\d.]+)rem$/.exec(resting)
  return m ? Math.max(0.35, (parseFloat(m[1]) * 100) / BAND_SPEED) : 1.2
}

export function addBandWipe(tl, el, position, { duration } = {}) {
  if (!el) return
  /* Read the authored width (e.g. " 4.73rem", kept in rem so it stays
     scale-safe) with any armed value out of the way first. If the 0 is read
     back as the target the tween runs 0 -> 0 and the band appears to snap
     open when the inline value is dropped on completion — invisible, and it
     looks exactly like a timing problem. Clearing first makes this correct
     however the element was left: a re-run under StrictMode, a matchMedia
     revert that has not fired yet, or a second call on the same band. */
  el.style.removeProperty('--hl-w')
  const resting = getComputedStyle(el).getPropertyValue('--hl-w').trim() || '100%'
  el.style.setProperty('--hl-w', '0rem')
  tl.fromTo(
    el,
    { '--hl-w': '0rem' },
    {
      '--hl-w': resting,
      duration: duration ?? bandDuration(resting),
      /* a near-even stroke — power2 ramps hard in the middle and reads as a
         flash on a band this wide */
      ease: 'power1.inOut',
      onComplete: () => el.style.removeProperty('--hl-w'),
    },
    position,
  )
}

/* ------------------------------------------------------------------
   Stepped type-on reveal of a line of real text.

   This is the behavioural fork of React Bits' TextType that CLAUDE.md §7
   calls for ("reserve box, support segments, loop={false}"). The original
   mounts one character at a time into the DOM, which would re-measure and
   re-centre our nowrap, letter-spaced lines on every keystroke. Here the
   text is never touched: the full run stays in the DOM and is revealed by a
   clip whose right edge steps one character width at a time.

   Consequences:
   - zero layout shift, because nothing is added or removed
   - nested markup survives untouched, so the blue selection span and the
     red spell-check squiggle are still real DOM
   - the resting state is the original DOM with no inline clip at all

   The caret is a sibling of the run (not a child) so the clip does not eat
   it, and is positioned from the run's measured width. That measurement is
   transient — it is re-read on every frame and cleared at the end — so it
   never becomes resting geometry.
------------------------------------------------------------------ */
const CLIP_HIDDEN = 'inset(-30% 100% -30% -2%)'

export function armTypeReveal(run, caret) {
  if (run) run.style.clipPath = CLIP_HIDDEN
  if (caret) caret.style.opacity = '0'
}

export function clearTypeReveal(run, caret) {
  if (run) {
    run.style.clipPath = ''
    run.style.filter = ''
  }
  if (caret) {
    caret.style.opacity = ''
    caret.style.transform = ''
  }
}

/* `blur` is additive and opt-in (rem, default 0 — every existing call site
   is unaffected). The footer is the one place that pairs the clip reveal
   with a blur-to-sharp focus pull, so rather than fork a second typing
   system the one helper every other section already uses just grew an
   optional knob. */
export function addTypeReveal(
  tl,
  { run, caret, position, speed = 0.023, minDuration = 0.45, blur = 0 },
) {
  if (!run) return 0

  const chars = (run.textContent || '').trim().length || 1
  const duration = Math.max(minDuration, chars * speed)
  const state = { p: 0 }

  const paint = () => {
    // quantise to whole characters so it reads as typing, not as a wipe
    const q = Math.min(1, Math.ceil(state.p * chars) / chars)
    run.style.clipPath = `inset(-30% ${(1 - q) * 100}% -30% -2%)`
    if (blur > 0) run.style.filter = `blur(${(1 - q) * blur}rem)`
    if (caret) {
      const w = run.offsetWidth
      caret.style.transform = `translateX(${q * w - w / 2}px)`
      caret.style.opacity = state.p > 0 && state.p < 1 ? '1' : '0'
    }
  }

  tl.to(
    state,
    {
      p: 1,
      duration,
      ease: 'none',
      onUpdate: paint,
      onComplete: () => clearTypeReveal(run, caret),
    },
    position,
  )

  return duration
}

/* ------------------------------------------------------------------
   Text-selection sweep.

   The resting treatment (a flat blue wash plus a caret bar at each end) is
   part of the approved composition, so it is left in the stylesheet and
   only *revealed* here: the wash is a single-colour gradient whose
   background-size grows from 0 to its authored 100%, and the two end
   handles fade in behind it. Both are driven by custom properties that
   default to the resting value, so with no inline override the element
   renders exactly as the static build does.
------------------------------------------------------------------ */
export function armSelection(el) {
  if (!el) return
  el.style.setProperty('--sel-sweep', '0%')
  el.style.setProperty('--sel-handle', '0')
}

export function clearSelection(el) {
  if (!el) return
  el.style.removeProperty('--sel-sweep')
  el.style.removeProperty('--sel-handle')
}

export function addSelectionSweep(tl, el, position, { duration = 0.5 } = {}) {
  if (!el) return
  tl.fromTo(
    el,
    { '--sel-sweep': '0%' },
    { '--sel-sweep': '100%', duration, ease: 'power2.inOut' },
    position,
  )
  tl.fromTo(
    el,
    { '--sel-handle': 0 },
    {
      '--sel-handle': 1,
      duration: 0.22,
      ease: 'power1.out',
      onComplete: () => clearSelection(el),
    },
    position + duration * 0.72,
  )
}
