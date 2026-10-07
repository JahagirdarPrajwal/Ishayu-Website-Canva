import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurText from '../components/BlurText.jsx'
import FloatingProduct from '../components/FloatingProduct.jsx'
import { DESKTOP, addBandWipe } from '../anim/helpers.js'
import './BetterChoice.css'

gsap.registerPlugin(ScrollTrigger)

/* The row is the 1366 x 513 block the flat strip occupied. Positions are a
   share of that block, not rem, so one set of numbers serves the artboard
   and the mobile reflow alike.

   Slot 2 is the Cocoa Protein Bar, not the Moringa Energy Bar in the Canva
   reference — confirmed deliberate, see CLAUDE.md §8.14. */
const ROW_W = 1366
const ROW_H = 513
const pc = (v, total) => `${((v / total) * 100).toFixed(4)}%`

/* x/y/w are the pack's own box in the row, taken from where each pack sits
   in the export. The measured boxes there run wider than the pack itself —
   every shot casts a soft shadow to its lower right — so each one is matched
   on height, which is the pack's true extent, and placed from the box's left
   edge. Slot 4's pack is simply bigger than the others, as it is in the
   export. */
const PRODUCTS = [
  { key: 'coatz', x: 94, y: 100, w: 147, amp: 4.0, duration: 4.2, delay: 0, alt: 'Ishayu Coatz tangy spiced almonds' },
  { key: 'proteinbar', x: 357, y: 196, w: 310, amp: 9.0, duration: 5.1, delay: 0.6, alt: 'Ishayu cocoa protein bar' },
  { key: 'blend', x: 782, y: 97, w: 144, amp: 4.0, duration: 4.6, delay: 1.1, alt: 'Ishayu Sprinkle sweet blend' },
  { key: 'nutribite', x: 1112, y: 70, w: 170, amp: 3.4, duration: 5.5, delay: 0.3, alt: 'Ishayu Nutri Bar crispy coffee bite' },
]

export default function BetterChoice() {
  const heading = useRef(null)
  const band = useRef(null)
  const row = useRef(null)
  const [headingIn, setHeadingIn] = useState(false)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      { desktop: DESKTOP, motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        if (!ctx.conditions.motionOK) {
          setHeadingIn(true)
          return undefined
        }

        /* Same treatment as "the everyday edit", which is the point — these
           are both headings and the section wants one consistent reveal:
           the words land, then the marker is drawn through the italic. The
           wipe takes its duration from the band's own width so it strokes
           at the same rate as every other band on the page. This part does
           not depend on the artboard's geometry, so it runs at every width. */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: heading.current, start: 'top 85%' },
          onStart: () => setHeadingIn(true),
        })
        tl.to({}, { duration: 1.15 }) // let the four words settle first
        addBandWipe(tl, band.current, 1.15)

        /* The packs come up from below the row quickly and then settle —
           expo.out spends most of its travel in the first third, so each one
           arrives fast and eases to a stop, handing straight over to Motion's
           levitation. `from` with a ScrollTrigger renders the start state
           immediately, so nothing flashes at rest beforehand. Mobile travels
           a shorter distance — in the stacked column each pack is its own
           full-width row, so 95% of its own height reads as a much bigger
           move than the same percentage does inside the wide desktop strip. */
        gsap.from(gsap.utils.toArray('.better__product', row.current), {
          yPercent: ctx.conditions.desktop ? 95 : 45,
          opacity: 0,
          duration: 1.25,
          stagger: 0.14,
          ease: 'expo.out',
          scrollTrigger: { trigger: row.current, start: 'top 80%' },
        })

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
          <BlurText play={headingIn} delay={85} stepDuration={0.27}>
            Make your
          </BlurText>
        </span>
        <span className="hl better__italic" ref={band}>
          <BlurText play={headingIn} delay={85} stepDuration={0.27} indexOffset={2}>
            better choice
          </BlurText>
        </span>
      </h2>

      {/* No backdrop at all: the grey studio cells and the seams between them
          are gone and the packs float on the section's white, which is why
          they were supplied as cut-outs. */}
      <div className="better__row" ref={row}>
        {PRODUCTS.map(({ key, x, y, w, amp, duration, delay, alt }) => (
          <FloatingProduct
            key={key}
            src={`/assets/products/${key}.png`}
            alt={alt}
            x={pc(x, ROW_W)}
            y={pc(y, ROW_H)}
            w={pc(w, ROW_W)}
            amp={amp}
            duration={duration}
            delay={delay}
          />
        ))}
      </div>
    </section>
  )
}
