import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurText from '../components/BlurText.jsx'
import OrbitImages from '../components/OrbitImages.jsx'
import PixelUnfold from '../components/PixelUnfold.jsx'
import {
  DESKTOP,
  addBandWipe,
  addTypeReveal,
  armTypeReveal,
  clearTypeReveal,
} from '../anim/helpers.js'
import './ChaseTheAura.css'

gsap.registerPlugin(ScrollTrigger)

/* The four games now ride the orbit instead of sitting in a static row —
   Prajwal's call, so this section no longer matches the export's tile row. */
const GAMES = [
  { name: 'SnackSlash', src: '/assets/aura/game-snackslash.jpg' },
  { name: 'AstroFuel', src: '/assets/aura/game-astrofuel.jpg' },
  { name: 'FuelRally', src: '/assets/aura/game-fuelrally.jpg' },
  { name: 'SnackRush', src: '/assets/aura/game-snackrush.jpg' },
]

const FIND = ['find your game,', 'you might find your', 'energy along the way.']
const CLOSING = [
  'it’s not about following a perfect routine.',
  'it’s about finding what works for you,',
  'one choice, one moment, one day at a time.',
]

export default function ChaseTheAura() {
  const root = useRef(null)
  const refs = useRef({})
  const [headingIn, setHeadingIn] = useState(false)
  const [closingIn, setClosingIn] = useState(false)
  const [ieIn, setIeIn] = useState(false)

  const set = (name) => (node) => {
    refs.current[name] = node
  }

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined

    const mm = gsap.matchMedia()

    mm.add(
      { desktop: DESKTOP, motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        if (!ctx.conditions.desktop || !ctx.conditions.motionOK) {
          setHeadingIn(true)
          setClosingIn(true)
          setIeIn(true)
          return undefined
        }

        const r = refs.current
        const findRuns = gsap.utils.toArray('.aura__find-run', el)
        const closeRuns = gsap.utils.toArray('.aura__closing-run', el)
        findRuns.forEach((run) => armTypeReveal(run))
        closeRuns.forEach((run) => armTypeReveal(run))

        /* 1. the IE mark unfolds out of blocks as the section arrives */
        ScrollTrigger.create({
          trigger: el.querySelector('.aura__ie'),
          start: 'top 82%',
          once: true,
          onEnter: () => setIeIn(true),
        })

        /* 2. "chase the aura", then the marker through the italic. The band
           sits a little above the word in the export and stays there — only
           the reveal is animated. */
        const head = gsap.timeline({
          scrollTrigger: { trigger: r.chase, start: 'top 84%' },
          onStart: () => setHeadingIn(true),
        })
        head.to({}, { duration: 1.1 })
        addBandWipe(head, r.band, 1.1)

        /* 3. "find your game" types on, line by line */
        const find = gsap.timeline({
          scrollTrigger: { trigger: r.find, start: 'top 86%' },
        })
        let at = 0
        findRuns.forEach((run) => {
          at += addTypeReveal(find, { run, position: at }) + 0.12
        })

        /* 4. the tiles drop onto the ring one after another. The entrance is
           on each tile's inner box, not on the orbit container — scaling the
           container would take the figure with it, and the outer box is
           where Motion writes the offset-path transform. */
        gsap.from(el.querySelectorAll('.orbit-item__inner'), {
          scale: 0.3,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: r.orbit, start: 'top 72%' },
        })

        gsap.from(el.querySelectorAll('.orbit-path'), {
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: r.orbit, start: 'top 72%' },
        })

        /* 5. the closing heading, its marker, then the body copy */
        /* Trigger on the copy itself, not on .aura__closing: that wrapper is
           pinned to the top of the section (top: 0, its children carry the
           14.24rem offset), so its box sits ~1400px above the text and the
           whole sequence fired and finished long before the copy was in
           frame. */
        const close = gsap.timeline({
          scrollTrigger: { trigger: r.closingLine1, start: 'top 85%' },
          onStart: () => setClosingIn(true),
        })
        close.to({}, { duration: 1.05 })
        addBandWipe(close, r.closingBand, 1.05)
        let cat = 1.9
        closeRuns.forEach((run) => {
          cat += addTypeReveal(close, { run, position: cat }) + 0.12
        })

        return () => {
          findRuns.forEach((run) => clearTypeReveal(run))
          closeRuns.forEach((run) => clearTypeReveal(run))
          r.band?.style.removeProperty('--hl-w')
          r.closingBand?.style.removeProperty('--hl-w')
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="section aura" ref={root}>
      <img className="section__bg" src="/assets/aura/aura-bg.jpg" alt="" />

      {/* The figure rides inside the orbit so the ring can pass behind him on
          the far side and in front of him on the near side. His box is the
          one measured off the export, expressed in the orbit's own 1000px
          space (the container is 10rem, so that space is 1:1 with design px:
          section x510 y452 becomes x323 y159 inside it). */}
      <div className="aura__orbit" ref={set('orbit')}>
        <OrbitImages
          images={GAMES.map((g) => g.src)}
          alts={GAMES.map((g) => g.name)}
          baseWidth={1000}
          radiusX={430}
          radiusY={150}
          rotation={-8}
          duration={34}
          itemW={150}
          itemH={107}
          showPath
          pathColor="rgba(255, 255, 255, 0.5)"
          pathWidth={3}
          pathDash="10 14"
          subject={{ src: '/assets/aura/guy.png', x: 323, y: 159, w: 354 }}
        />
      </div>

      <PixelUnfold
        className="aura__ie"
        src="/assets/aura/ie-logo.png"
        alt="Internet Explorer"
        play={ieIn}
      />

      <div className="aura__headline">
        <span className="aura__chase" ref={set('chase')}>
          <BlurText play={headingIn} delay={130} stepDuration={0.4}>
            chase the
          </BlurText>
        </span>
        <span className="hl aura__aura" ref={set('band')}>
          <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={2}>
            aura
          </BlurText>
        </span>
        <span className="aura__energy">
          <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={3}>
            (and the energy...)
          </BlurText>
        </span>
      </div>

      <p className="aura__find" ref={set('find')}>
        {FIND.map((line) => (
          <span className="aura__find-line" key={line}>
            <span className="aura__find-run">{line}</span>
          </span>
        ))}
      </p>

      <div className="aura__closing">
        <span className="aura__closing-line1" ref={set('closingLine1')}>
          <BlurText play={closingIn} delay={130} stepDuration={0.4}>
            find your
          </BlurText>
        </span>
        <span className="hl aura__closing-line2" ref={set('closingBand')}>
          <BlurText play={closingIn} delay={130} stepDuration={0.4} indexOffset={2}>
            better choice
          </BlurText>
        </span>
        <p className="aura__closing-body">
          {CLOSING.map((line) => (
            <span className="aura__closing-line" key={line}>
              <span className="aura__closing-run">{line}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
