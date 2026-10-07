import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import BlurText from '../components/BlurText.jsx'
import NavPill from '../components/NavPill.jsx'
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

/* Nav pills keep the exact widths and x-offsets of the Canva artboard. */
const NAV = [
  { label: 'home', x: 335, w: 85, active: true },
  { label: 'products', x: 431, w: 161 },
  { label: 'our story', x: 604, w: 141 },
  { label: 'get in touch', x: 757, w: 139 },
  { label: 'login', x: 907, w: 124 },
]

/* The polaroid / window cards scattered across the hero.
   Positions are design-pixel coordinates measured off the Canva export.

   `drop` is the order they fall in. z-index already fixes which card paints
   over which, so the order is purely about rhythm: the big left card lands
   first and anchors the composition, then the pair on the right, then the
   three small ones tuck in. `tilt` is the angle each card starts at. */
const CARDS = [
  { key: 'racing', src: '/assets/hero/card-racing.png', x: 90, y: 173, w: 237, h: 284, z: 4, drop: 0, tilt: -7 },
  { key: 'kitchen', src: '/assets/hero/card-kitchen.png', x: 1014, y: 177, w: 193, h: 228, z: 2, drop: 1, tilt: 6 },
  { key: 'energy', src: '/assets/hero/card-energy.png', x: 1049, y: 325, w: 245, h: 294, z: 3, drop: 2, tilt: -5 },
  { key: 'chair', src: '/assets/hero/card-chair.png', x: 282, y: 394, w: 106, h: 134, z: 3, drop: 3, tilt: 9, label: 'Details.jpg' },
  { key: 'coatz', src: '/assets/hero/card-coatz.png', x: 92, y: 485, w: 93, h: 115, z: 2, drop: 4, tilt: -8, label: 'Details.jpg' },
  { key: 'leg', src: '/assets/hero/card-leg.png', x: 167, y: 552, w: 96, h: 121, z: 3, drop: 5, tilt: 7, label: 'Details.jpg' },
]

const u = (n) => `${n / 100}rem`

/* How far above its resting place a card starts, as a share of its own
   height, so it clears the top of the page whatever the scale is. */
const liftOf = ({ y, h }) => -((y + h + 90) / h) * 100

export default function Hero({ started = false }) {
  const root = useRef(null)
  const refs = useRef({})

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const mm = gsap.matchMedia()

    mm.add(
      { desktop: DESKTOP, motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        /* Below the breakpoint responsive.css reflows the artboard into a
           stacked column and strips the absolute positioning the timeline
           assumes, so the entrance is desktop-only (CLAUDE.md §8.12).
           With reduced motion everything simply renders at rest. */
        if (!ctx.conditions.desktop || !ctx.conditions.motionOK) return undefined

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
        gsap.set(cursor, { opacity: 0 })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

        /* The whole section settles as the loader panel lifts away, so the
           two movements read as one gesture rather than a handover. */
        tl.from(el, { yPercent: 2.2, duration: 0.95, ease: 'power2.out' }, 0)

        /* ---- nav + wordmark ----
           fromTo, not from: these are armed at opacity 0 above, and a
           `from` tween would read that as the destination too. */
        tl.fromTo(
          navEntrance,
          { yPercent: -180, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.055 },
          0.55,
        )

        /* ---- the collage falls in ----
           Each card drops from above the page, rotating out of its tilt and
           easing out of a slight over-size, as if it were dealt onto the
           pile. The rotation lands a beat after the fall with a small
           overshoot, which is what gives the card its settle. */
        CARDS.forEach((card, i) => {
          const node = cards[i]
          if (!node) return
          const at = 0.72 + card.drop * 0.13
          tl.fromTo(
            node,
            { yPercent: liftOf(card), rotation: card.tilt, scale: 1.07, opacity: 0 },
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              duration: 0.92,
              ease: 'power4.out',
            },
            at,
          )
          tl.to(
            node,
            { rotation: 0, duration: 0.75, ease: 'back.out(2.2)' },
            at + 0.16,
          )
        })

        /* ---- headline: the band wipe trails "new snack" so the two read
           as one move — the words land (the BlurText reveal settles around
           0.95s), then the marker is drawn through them. Slow and even on
           purpose: it is a pen stroke, not a flash. ---- */
        addBandWipe(tl, band, 1.15)

        /* ---- supporting copy types on, then the selection is dragged ---- */
        const t1 = 1.62
        const d1 = addTypeReveal(tl, { run: run1, caret: caret1, position: t1 })
        const t2 = t1 + d1 + 0.14
        const d2 = addTypeReveal(tl, { run: run2, caret: caret2, position: t2 })

        /* ---- the arrow does the selecting ----
           It flies in from its place in the composition, drags across "your
           backup plan" in step with the blue sweep, and then leaves — once
           the selection is made the pointer has done its job and would just
           be sitting on the artwork. Offsets are measured live and are
           deltas between two viewport rects, so they are correct whatever
           the scale or scroll position. */
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

        const tSelect = t2 + d2 - 0.1
        tl.to(
          cursor,
          {
            x: grab('start'),
            y: grabY,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          tSelect - 0.5,
        )
        addSelectionSweep(tl, selection, tSelect, { duration: 0.5 })
        tl.to(
          cursor,
          { x: grab('end'), duration: 0.5, ease: 'power2.inOut' },
          tSelect,
        )
        /* lifts away from the phrase as it fades, so it reads as the hand
           leaving rather than the arrow blinking out */
        tl.to(
          cursor,
          {
            xPercent: 22,
            yPercent: -34,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
          },
          tSelect + 0.72,
        )

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
          here instead now (see the correction note in Footer.jsx). */}
      <img className="hero__logo" src="/assets/footer/ishayu-logo.png" alt="Ishayu" ref={set('navLogo')} />

      <nav className="hero__nav">
        {NAV.map(({ label, x, w, active }) => (
          <div
            key={label}
            className={`hero__pill${active ? ' hero__pill--active' : ''}`}
            style={{ left: u(x), width: u(w) }}
          >
            <NavPill label={label} />
          </div>
        ))}
      </nav>

      <h1 className="hero__headline">
        <span className="hero__line1">
          <BlurText play={started} delay={130} stepDuration={0.4}>
            meet your
          </BlurText>
        </span>
        <span className="hero__line2">
          <span className="hl hero__band" ref={set('band')}>
            <BlurText play={started} delay={150} stepDuration={0.4} style={{ display: 'inline' }}>
              new snack
            </BlurText>
          </span>
        </span>
      </h1>

      <div className="hero__collage">
        {CARDS.map(({ key, src, x, y, w, h, z, label }) => (
          <div
            key={key}
            className="hero__card"
            style={{ left: u(x), top: u(y), width: u(w), zIndex: z }}
          >
            <img src={src} alt="" style={{ width: '100%', height: u(h) }} />
            {label && <span className="hero__card-label">{label}</span>}
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
