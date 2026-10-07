import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurText from '../components/BlurText.jsx'
import { DESKTOP, addBandWipe } from '../anim/helpers.js'
import './BetterChoice.css'

gsap.registerPlugin(ScrollTrigger)

export default function BetterChoice() {
  const heading = useRef(null)
  const band = useRef(null)
  const [headingIn, setHeadingIn] = useState(false)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      { desktop: DESKTOP, motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        /* As elsewhere: below the breakpoint the artboard reflows into a
           column and with reduced motion everything renders at rest. The
           heading still has to be released either way, or BlurText sits at
           opacity 0 waiting for a cue that never comes. */
        if (!ctx.conditions.desktop || !ctx.conditions.motionOK) {
          setHeadingIn(true)
          return undefined
        }

        /* Same treatment as "the everyday edit", which is the point — these
           are both headings and the section wants one consistent reveal:
           the words land, then the marker is drawn through the italic. The
           wipe takes its duration from the band's own width so it strokes
           at the same rate as every other band on the page. */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: heading.current, start: 'top 85%' },
          onStart: () => setHeadingIn(true),
        })
        tl.to({}, { duration: 1.15 }) // let the four words settle first
        addBandWipe(tl, band.current, 1.15)

        return () => band.current?.style.removeProperty('--hl-w')
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="section better">
      {/* The band is the parent of its BlurText, not a child — see the note
          in EverydayEdit.jsx: BlurText remounts its subtree when it settles,
          which would drop the inline --hl-w the wipe is driving. */}
      <h2 className="better__heading" ref={heading}>
        <span className="better__plain">
          <BlurText play={headingIn} delay={130} stepDuration={0.4}>
            Make your
          </BlurText>
        </span>
        <span className="hl better__italic" ref={band}>
          <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={2}>
            better choice
          </BlurText>
        </span>
      </h2>

      {/* four pack shots as one strip, exactly as composed in Canva */}
      <img className="better__strip" src="/assets/products/strip.jpg" alt="Ishayu product range" />
    </section>
  )
}
