import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurText from '../components/BlurText.jsx'
import ReelCarousel from '../components/ReelCarousel.jsx'
import { DESKTOP, addBandWipe } from '../anim/helpers.js'
import './Instagram.css'

gsap.registerPlugin(ScrollTrigger)

/* The six reels, in the order Prajwal listed them. The share tokens on the
   original links are personal, so only the permalink is kept. */
const REELS = [
  { title: 'Coatz blueprint', src: '/assets/insta/reels/coatz-blueprint.mp4', href: 'https://www.instagram.com/reel/DbQQiLWvhz6/' },
  { title: "What's in my bag", src: '/assets/insta/reels/whats-in-my-bag.mp4', href: 'https://www.instagram.com/reel/DbnTNyvPFjT/' },
  { title: 'Conveyor belt', src: '/assets/insta/reels/conveyor-belt.mp4', href: 'https://www.instagram.com/reel/DcGyEwcPpkf/' },
  { title: 'Desk arrange', src: '/assets/insta/reels/desk-arrange.mp4', href: 'https://www.instagram.com/reel/DcofLtLvkcu/' },
  { title: 'Your breakfast looks like', src: '/assets/insta/reels/your-breakfast.mp4', href: 'https://www.instagram.com/reel/DdCN1B-vY_B/' },
  { title: 'A mind too full', src: '/assets/insta/reels/a-mind-too-full.mp4', href: 'https://www.instagram.com/reel/DdnlMhGtfhS/' },
]

export default function Instagram() {
  const root = useRef(null)
  const band = useRef(null)
  const heading = useRef(null)
  const [headingIn, setHeadingIn] = useState(false)
  const [reduced, setReduced] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined

    const mm = gsap.matchMedia()

    mm.add(
      { desktop: DESKTOP, motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        if (!ctx.conditions.motionOK) setReduced(true)
        /* Below the breakpoint responsive.css reflows the artboard into a
           column; with reduced motion everything renders at rest. The
           heading still has to be released either way, or BlurText waits at
           opacity 0 for a cue that never comes. */
        if (!ctx.conditions.desktop || !ctx.conditions.motionOK) {
          setHeadingIn(true)
          return undefined
        }
        setReduced(false)

        /* One timeline for the section: the words land, then the marker is
           drawn through "Instagram" at the page's shared stroke rate. */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: heading.current, start: 'top 84%' },
          onStart: () => setHeadingIn(true),
        })
        tl.to({}, { duration: 1.2 })
        addBandWipe(tl, band.current, 1.2)

        return () => band.current?.style.removeProperty('--hl-w')
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="section insta" ref={root}>
      {/* The band is the backdrop the reels sit on; the placeholder cards
          were already painted out of it when it was rebuilt, so it needs no
          further work (CLAUDE.md §8.7 is stale on this). */}
      <img className="insta__band" src="/assets/insta/band.jpg" alt="" />

      <h2 className="insta__heading" ref={heading}>
        <BlurText play={headingIn} delay={130} stepDuration={0.4}>
          stalk us on{' '}
        </BlurText>
        <span className="hl insta__word" ref={band}>
          <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={3}>
            Instagram
          </BlurText>
        </span>
        <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={4}>
          {' '}
          or just stock up
        </BlurText>
      </h2>

      <div className="insta__rail">
        <ReelCarousel items={REELS} reduced={reduced} />
      </div>
    </section>
  )
}
