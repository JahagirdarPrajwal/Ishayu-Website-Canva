import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import BlurText from '../components/BlurText.jsx'
import Header from '../components/Header.jsx'
import HeroProduct from '../components/HeroProduct.jsx'
import {
  DESKTOP,
  addBandWipe,
  addSelectionSweep,
  addTypeReveal,
  armSelection,
  armTypeReveal,
  clearSelection,
  clearTypeReveal,
} from '../anim/helpers.js'
import './Hero.css'

/* The four products floating around the seated figure (desktop client
   feedback: replaces the six lifestyle/polaroid collage cards this used
   to show — CLAUDE.md's old hero/card-*.png — entirely; this is a
   different kind of object, a clean product cutout, not a framed photo,
   so there is no label any more either). Positions are design-pixel
   coordinates approximated off "Screenshot 1"/"Screenshot 2", the same
   coordinate space the old cards used (1366 x 768).

   `drop` is the fall order, `tilt` is each product's own RESTING angle —
   unlike the old cards (which fell rotated and settled dead level at 0),
   these settle into the tilted rest pose the screenshots show, so the
   entrance rotates *into* `tilt` rather than *out of* it (see
   ROTATION_OVERSHOOT below). `amp`/`duration`/`delay` feed the perpetual
   levitation once the entrance has landed (HeroProduct.jsx). */
const PRODUCTS = [
  { key: 'nutribite-beet', src: '/assets/hero/product-nutribite-beet.png', x: 98, y: 55, w: 240, h: 320, z: 3, drop: 0, tilt: -12, amp: 14, duration: 4.6, delay: 0 },
  { key: 'coatz-tangy', src: '/assets/hero/product-coatz-tangy.png', x: 1066, y: 50, w: 215, h: 323, z: 3, drop: 1, tilt: 9, amp: 13, duration: 5.1, delay: 0.5 },
  { key: 'peanut-butter', src: '/assets/hero/product-peanut-butter.png', x: 70, y: 392, w: 305, h: 229, z: 2, drop: 2, tilt: -14, amp: 11, duration: 4.9, delay: 1.0 },
  { key: 'sweet-blend', src: '/assets/hero/product-sweet-blend.png', x: 1013, y: 388, w: 155, h: 232, z: 2, drop: 3, tilt: 10, amp: 15, duration: 5.4, delay: 0.3 },
]

/* The degrees of extra spin each product enters with, on top of its own
   resting `tilt` — it rotates down *into* rest instead of past it, the
   mirror of the old cards' settle-to-0. Sign follows the resting tilt so
   it always over-rotates in the same direction. */
const ROTATION_OVERSHOOT = 13

/* The small Beetroot Protein bar composited into the seated figure's
   hand, replacing the generic bar already baked into hero-bg.jpg —
   calibrated against that baked bar the same way running guy.png is
   calibrated against aura-bg.jpg (CLAUDE.md §6/§8.6). Deliberately not in
   PRODUCTS: its entrance, scale and levitation amplitude are all much
   smaller — it is a hand detail, not a fifth floating product. */
const BEETROOT = { x: 663, y: 489, w: 62, h: 47, tilt: -6, amp: 3, duration: 3.6 }

const u = (n) => `${n / 100}rem`

/* How far above its resting place a card starts, as a share of its own
   height, so it clears the top of the page whatever the scale is. */
const liftOf = ({ y, h }) => -((y + h + 90) / h) * 100

/* Entrance rhythm (desktop client feedback): the seated-guy background is
   already the first thing on screen the instant the loader lifts — that is
   what `tl.from(el, {yPercent:2.2,...})` below settles into place — so
   "guy first" falls out of position 0 for free. What used to compete with
   it was the headline: BlurText's `play` prop fired at the exact same
   instant as everything else. TEXT_DELAY holds the headline back by one
   short beat so the guy reads as the first thing, then the words, then the
   collage. Nothing about *how* any of these animate changes — only when
   each stage is told to begin. */
const TEXT_DELAY = 0.2 // guy -> headline stagger, seconds

export default function Hero({ started = false }) {
  const root = useRef(null)
  const refs = useRef({})
  const [textIn, setTextIn] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const mm = gsap.matchMedia()

    mm.add(
      { desktop: DESKTOP, motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        /* With reduced motion everything simply renders at rest. */
        if (!ctx.conditions.motionOK) return undefined

        const { band, selection, run1, run2, caret1, caret2, cursor, navLogo } = refs.current
        const cards = gsap.utils.toArray('.hero__card', el)
        const pills = gsap.utils.toArray('.hero__pill', el)
        /* The wordmark drops in with the pills rather than getting a
           ScrollTrigger of its own — it is just one more item in the same
           stagger group, first in the array so it leads the row (it sits
           left of all of them). */
        const navEntrance = [navLogo, ...pills].filter(Boolean)

        /* ---- arm: hold everything at its entry state before first paint,
           so nothing flashes at its resting value under the loader ---- */
        /* the band arms itself inside addBandWipe, so its resting width is
           read before it is zeroed */
        armSelection(selection)
        armTypeReveal(run1, caret1)
        armTypeReveal(run2, caret2)
        gsap.set(cards, { opacity: 0 })
        gsap.set(navEntrance, { opacity: 0 })
        if (refs.current.beetroot) gsap.set(refs.current.beetroot, { opacity: 0 })
        if (ctx.conditions.desktop) gsap.set(cursor, { opacity: 0 })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

        /* ---- stage 1: the guy ----
           The whole section (background, guy included) settles as the
           loader panel lifts away, so the two movements read as one
           gesture rather than a handover. This is the first thing on
           screen — nothing else is cued until TEXT_DELAY below. */
        tl.from(el, { yPercent: 2.2, duration: 0.95, ease: 'power2.out' }, 0)

        /* ---- nav + wordmark ----
           Kept on its existing cue (unrelated to the guy/text/images
           rhythm — it is a small, peripheral row, not part of that
           hierarchy). fromTo, not from: these are armed at opacity 0
           above, and a `from` tween would read that as the destination
           too. */
        tl.fromTo(
          navEntrance,
          { yPercent: -180, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.055 },
          0.55,
        )

        /* ---- stage 2: the text ----
           BlurText's `play` prop used to be wired straight to `started`, so
           the headline fired at the exact same instant as the guy/section
           settle — the two were competing. `textIn` holds it back by one
           short, deliberate beat instead. Same BlurText, same band wipe,
           same type-reveal — only the cue moves. */
        tl.call(() => setTextIn(true), undefined, TEXT_DELAY)

        if (ctx.conditions.desktop) {
          /* ---- stage 3: the four products ----
             Same fall-from-above choreography the old collage cards used
             (drop from off-page, rotate, ease out of a slight over-size),
             just aimed at a different resting rotation: these settle INTO
             their own tilt rather than out of it to 0, since the
             screenshots show them resting at an angle, not flat. The
             GSAP-owned outer stage (.hero__card) still keeps the old
             class name on purpose — that is what responsive.css's mobile
             nav/collage rules already key off, so mobile layout stays
             exactly as it was without touching that stylesheet. */
          PRODUCTS.forEach((p, i) => {
            const node = cards[i]
            if (!node) return
            const at = 1.1 + p.drop * 0.13
            const overshoot = p.tilt + (p.tilt < 0 ? -ROTATION_OVERSHOOT : ROTATION_OVERSHOOT)
            tl.fromTo(
              node,
              { yPercent: liftOf(p), rotation: overshoot, scale: 1.07, opacity: 0 },
              { yPercent: 0, scale: 1, opacity: 1, duration: 0.92, ease: 'power4.out' },
              at,
            )
            tl.to(node, { rotation: p.tilt, duration: 0.75, ease: 'back.out(2.2)' }, at + 0.16)
          })
        } else {
          /* mobile: the same four products, a plain fade+rise + settle-
             into-tilt instead of the desktop's fall-from-off-page drop,
             which depended on space above the fold this layout doesn't
             have */
          PRODUCTS.forEach((p, i) => {
            const node = cards[i]
            if (!node) return
            const at = 0.72 + p.drop * 0.09
            tl.fromTo(
              node,
              { yPercent: 18, rotation: 0, scale: 0.94, opacity: 0 },
              { yPercent: 0, rotation: p.tilt, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
              at,
            )
          })
        }

        /* ---- stage 4: the Beetroot bar falls into his hand ----
           Last object to arrive, and only once the four products have
           fully settled (brief: "the Beetroot bar should NOT appear
           before the four products"). A straight vertical fall — reusing
           the same liftOf() the products use for their own off-page
           start, so it travels down from well above the viewport — with
           no rotation animated on the GSAP-owned node at all (the resting
           tilt lives on a separate, static wrapper — see the JSX), which
           is what keeps this a 90°-down fall instead of a tumble.
           power2.out decelerates into the hand on its own; the short
           follow-up scale tween is the "tiny settle", not a bounce. */
        if (refs.current.beetroot) {
          const productsDone = ctx.conditions.desktop
            ? 1.1 + 3 * 0.13 + 0.16 + 0.75 // last product's rotation-settle finishes
            : 0.72 + 3 * 0.09 + 0.6 // mobile: last product's single tween finishes
          const fallAt = productsDone + 0.15

          tl.fromTo(
            refs.current.beetroot,
            { yPercent: liftOf(BEETROOT), opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.95, ease: 'power2.out' },
            fallAt,
          )
          tl.fromTo(
            refs.current.beetroot,
            { scale: 1 },
            { scale: 1.035, duration: 0.14, ease: 'power1.out', yoyo: true, repeat: 1 },
            fallAt + 0.85,
          )
        }

        /* ---- headline: the band wipe trails "new snack" so the two read
           as one move — the words land, then the marker is drawn through
           them. Slow and even on purpose: it is a pen stroke, not a flash.
           Position accounts for TEXT_DELAY plus how long the (now faster,
           see helpers.js) BlurText reveal actually takes to land, with the
           same buffer the original 0.95s-landing/1.15s-band gap had. ---- */
        addBandWipe(tl, band, 1.05)

        /* ---- supporting copy types on, then the selection is dragged ---- */
        const t1 = 1.5
        const d1 = addTypeReveal(tl, { run: run1, caret: caret1, position: t1 })
        const t2 = t1 + d1 + 0.14
        const d2 = addTypeReveal(tl, { run: run2, caret: caret2, position: t2 })
        const tSelect = t2 + d2 - 0.1

        if (ctx.conditions.desktop) {
          /* ---- the arrow does the selecting ----
             It flies in from its place in the composition, drags across
             "your backup plan" in step with the blue sweep, and then
             leaves — once the selection is made the pointer has done its
             job. Offsets are measured live deltas between two viewport
             rects. This whole gesture assumes a mouse-pointer-sized cursor
             graphic dragging across a line of desktop-width text; at phone
             width the same glyph reads as a stray mark, so mobile plays
             only the sweep itself, below. */
          const grab = (edge) => () => {
            if (!cursor || !selection) return 0
            const c = cursor.getBoundingClientRect()
            const s = selection.getBoundingClientRect()
            return edge === 'start' ? s.left - c.left - c.width * 0.4 : s.right - c.left
          }
          const grabY = () => {
            if (!cursor || !selection) return 0
            const c = cursor.getBoundingClientRect()
            const s = selection.getBoundingClientRect()
            return s.top + s.height / 2 - c.top
          }

          tl.to(
            cursor,
            { x: grab('start'), y: grabY, opacity: 1, duration: 0.5, ease: 'power2.inOut' },
            tSelect - 0.5,
          )
          addSelectionSweep(tl, selection, tSelect, { duration: 0.5 })
          tl.to(cursor, { x: grab('end'), duration: 0.5, ease: 'power2.inOut' }, tSelect)
          /* lifts away from the phrase as it fades, so it reads as the hand
             leaving rather than the arrow blinking out */
          tl.to(
            cursor,
            { xPercent: 22, yPercent: -34, opacity: 0, duration: 0.5, ease: 'power2.in' },
            tSelect + 0.72,
          )
        } else {
          addSelectionSweep(tl, selection, tSelect, { duration: 0.5 })
        }

        if (started) tl.play()

        return () => {
          /* matchMedia reverts everything GSAP touched; the clip and the
             custom properties are set by hand, so they are cleared by hand.
             This also makes StrictMode's double effect harmless. */
          clearTypeReveal(run1, caret1)
          clearTypeReveal(run2, caret2)
          clearSelection(selection)
          band?.style.removeProperty('--hl-w')
        }
      },
    )

    return () => mm.revert()
  }, [started])

  const set = (name) => (node) => {
    refs.current[name] = node
  }

  return (
    <section className="section hero" ref={root}>
      <img className="section__bg" src="/assets/hero/hero-bg.jpg" alt="" />

      {/* The real wordmark asset (CLAUDE.md §6), not baked into the export —
          the Canva artboard had no logo in this corner, so this is new
          branding added to the live site rather than a reproduction of
          anything in 1.png. Same file the footer used to render; it sits
          here instead now (see the correction note in Footer.jsx).
          Logo + nav pills are the shared Header component (src/components/
          Header.jsx), extracted so the Product Page can reuse the exact
          same nav; Hero still owns the ref its own entrance timeline needs. */}
      <Header active="home" logoRef={set('navLogo')} />

      <h1 className="hero__headline">
        <span className="hero__line1">
          <BlurText play={textIn} delay={85} stepDuration={0.27}>
            meet your
          </BlurText>
        </span>
        <span className="hero__line2">
          <span className="hl hero__band" ref={set('band')}>
            <BlurText play={textIn} delay={100} stepDuration={0.27} style={{ display: 'inline' }}>
              new snack
            </BlurText>
          </span>
        </span>
      </h1>

      {/* The small Beetroot Protein bar composited into his hand — see the
          BEETROOT note above for the calibration. Sits above the
          background but below the four floating products' z-index range,
          since it is a hand detail, not one of them. */}
      <div className="hero__beetroot" style={{ left: u(BEETROOT.x), top: u(BEETROOT.y), width: u(BEETROOT.w) }} ref={set('beetroot')}>
        {/* the resting tilt lives on this middle wrapper, not on the ref
            GSAP animates opacity/scale on above — GSAP's CSSPlugin owns
            the whole `transform` once it touches `scale`, so a plain CSS
            rotate set on that same node would get silently clobbered */}
        <div style={{ transform: `rotate(${BEETROOT.tilt}deg)` }}>
          <HeroProduct
            src="/assets/hero/beetroot-protein.png"
            alt="Ishayu Beetroot Protein bar"
            amp={BEETROOT.amp}
            duration={BEETROOT.duration}
            className="hero__beetroot-stage"
          />
        </div>
      </div>

      <div className="hero__collage">
        {PRODUCTS.map(({ key, src, x, y, w, z, tilt, amp, duration, delay }) => (
          <div
            key={key}
            className="hero__card"
            style={{ left: u(x), top: u(y), width: u(w), zIndex: z, '--tilt': `${tilt}deg` }}
          >
            <HeroProduct src={src} alt="" amp={amp} duration={duration} delay={delay} />
          </div>
        ))}
      </div>

      <svg className="hero__cursor" viewBox="0 0 28 40" aria-hidden="true" ref={set('cursor')}>
        <path
          d="M2 1.5 L2 33 L9.6 26.2 L14.4 37.8 L19.6 35.6 L14.9 24.3 L24.5 23.4 Z"
          fill="#fff"
          stroke="#111"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      <p className="hero__sub">
        <span className="hero__sub-line1">
          <span className="hero__sub-run" ref={set('run1')}>
            Consider this{' '}
            <span className="hero__selection" ref={set('selection')}>
              your backup plan
            </span>
          </span>
          <span className="hero__sub-caret" aria-hidden="true" ref={set('caret1')} />
        </span>
        <span className="hero__sub-line2">
          <span className="hero__sub-run" ref={set('run2')}>
            because “<span className="hero__squiggle">I’ll eat later</span>” is not a strategy.
          </span>
          <span className="hero__sub-caret" aria-hidden="true" ref={set('caret2')} />
        </span>
      </p>
    </section>
  )
}
