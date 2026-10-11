import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from '../components/Header.jsx'
import BlurText from '../components/BlurText.jsx'
import Footer from '../sections/Footer.jsx'
import {
  addBandWipe,
  addTypeReveal,
  armTypeReveal,
  clearTypeReveal,
} from '../anim/helpers.js'
import './OurStoryPage.css'

gsap.registerPlugin(ScrollTrigger)

/* ==================================================================
   Our Story — static recreation of "3.png", now wired with the exact
   same animation language the homepage uses (animation-sync brief): the
   same BlurText word reveal, the same addTypeReveal clip-wipe for body
   copy, and the same addBandWipe for the yellow band, each gated by its
   own ScrollTrigger rather than one shared one — a long page like this
   reads as a single homepage section would if everything fired off one
   trigger, which is exactly what the brief says not to do.

   Nothing here is a new animation system: every call below is the same
   helper EverydayEdit.jsx / BetterChoice.jsx / Footer.jsx already call,
   with the same stepDuration/delay BlurText values (85ms / 0.27s) those
   files use. Paragraphs are revealed as one clip-wipe per <p> (not
   pre-split into hand-authored lines the way the homepage's short, fixed-
   width copy is) — these are reflowing prose blocks, splitting them into
   hardcoded lines would be the "new interpretation" the brief says not to
   invent, and would silently break if the content ever reflows
   differently. addTypeReveal doesn't care how many lines its target
   wraps to; the clip just sweeps left-to-right across the whole run.
================================================================== */

export default function OurStoryPage() {
  const refs = useRef({})
  const [headingsIn, setHeadingsIn] = useState(() => Array(7).fill(false))

  const set = (name) => (node) => {
    refs.current[name] = node
  }

  const markIn = (i) =>
    setHeadingsIn((prev) => {
      if (prev[i]) return prev
      const next = [...prev]
      next[i] = true
      return next
    })

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add({ motionOK: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      /* Rest state for everyone, same convention as every other section
         (CLAUDE.md §8.12) — the BlurText words and the type-reveal runs
         both need headingsIn true or they sit at opacity/clip 0 forever. */
      if (!ctx.conditions.motionOK) {
        setHeadingsIn(Array(7).fill(true))
        return undefined
      }

      const r = refs.current
      const cleanups = []

      /* ---- 0. "know us / better" — the page's own h1, BetterChoice's
         exact shape: words land, then the band wipes through the italic. */
      const headTl = gsap.timeline({
        scrollTrigger: { trigger: r.heading, start: 'top 85%' },
        onStart: () => markIn(0),
      })
      headTl.to({}, { duration: 0.95 })
      addBandWipe(headTl, r.band, 0.95)
      cleanups.push(() => r.band?.style.removeProperty('--hl-w'))

      /* ---- 1-5. the five copy blocks — each its own trigger, so the
         next one only animates once the user actually scrolls to it
         (brief §3.D), not all at once on load. */
      for (let i = 0; i < 5; i += 1) {
        const el = r[`block${i}`]
        if (!el) continue
        const runs = gsap.utils.toArray('.story__run', el)
        runs.forEach((run) => armTypeReveal(run))

        const idx = i + 1 // headingsIn[0] is the h1 above
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onStart: () => markIn(idx),
        })
        tl.to({}, { duration: 0.7 }) // let the heading words land first
        let at = 0.7
        runs.forEach((run) => {
          at += addTypeReveal(tl, { run, position: at }) + 0.12
        })

        cleanups.push(() => runs.forEach((run) => clearTypeReveal(run)))
      }

      /* ---- 6. sign-off: logo pops in, tagline types on ---- */
      const signRuns = gsap.utils.toArray('.story__run', r.sign)
      signRuns.forEach((run) => armTypeReveal(run))
      const signTl = gsap.timeline({
        scrollTrigger: { trigger: r.sign, start: 'top 90%' },
        onStart: () => markIn(6),
      })
      signTl.from(r.sign, {
        yPercent: 12,
        opacity: 0,
        scale: 0.96,
        duration: 0.65,
        ease: 'power3.out',
      })
      let signAt = 0.4
      signRuns.forEach((run) => {
        signAt += addTypeReveal(signTl, { run, position: signAt }) + 0.12
      })
      cleanups.push(() => signRuns.forEach((run) => clearTypeReveal(run)))

      return () => cleanups.forEach((fn) => fn())
    })

    return () => mm.revert()
  }, [])

  return (
    <>
      <main className="story">
        <header className="section story__header">
          <Header active="our story" />
        </header>

        {/* The band is the parent of its BlurText, not a child — same
            reason as every other banded heading: BlurText remounts its
            subtree once it settles, which would drop the inline --hl-w
            the wipe is driving if the band were inside it instead. */}
        <h1 className="story__heading" ref={set('heading')}>
          <span className="story__heading-line1">
            <BlurText play={headingsIn[0]} delay={85} stepDuration={0.27}>
              know us
            </BlurText>
          </span>
          <span className="hl story__heading-band" ref={set('band')}>
            <span className="story__heading-line2">
              <BlurText play={headingsIn[0]} delay={85} stepDuration={0.27} indexOffset={2}>
                better
              </BlurText>
            </span>
          </span>
        </h1>

        <div className="story__body">
          <section className="story__block story__block--left" ref={set('block0')}>
            <h2>
              <BlurText play={headingsIn[1]} delay={85} stepDuration={0.27}>
                Healthy made delicious.
              </BlurText>
            </h2>
            <p className="story__bold">
              <span className="story__run">And yes, we mean both.</span>
            </p>
            <p>
              <span className="story__run">
                <strong>ISHAYU</strong> is a wellness and nutrition brand from{' '}
                <strong>Vittarthaa Life Sciences</strong>, created to make better everyday choices
                simpler, more enjoyable and easier to fit into real life.
              </span>
            </p>
            <p className="story__bold">
              <span className="story__run">Because eating better shouldn&rsquo;t mean making life harder.</span>
            </p>
          </section>

          <section className="story__block story__block--right" ref={set('block1')}>
            <h2>
              <BlurText play={headingsIn[2]} delay={85} stepDuration={0.27}>
                Better choices shouldn&rsquo;t feel like a chore.
              </BlurText>
            </h2>
            <p>
              <span className="story__run">
                There&rsquo;s no shortage of advice telling us what to eat. More protein. Less
                sugar. More this. Less that.
              </span>
            </p>
            <p>
              <span className="story__run">Somewhere along the way, eating well started feeling complicated.</span>
            </p>
            <p>
              <span className="story__run">
                <strong>We wanted to make it simpler.</strong> ISHAYU brings together thoughtful
                ingredients, nutrition and everyday convenience to create food that fits real life
                — from busy mornings and long workdays to gym sessions, travel and those random
                4 PM hunger moments.
              </span>
            </p>
            <p className="story__bold">
              <span className="story__run">Real life, basically.</span>
            </p>
          </section>

          <section className="story__block story__block--left" ref={set('block2')}>
            <h2>
              <BlurText play={headingsIn[3]} delay={85} stepDuration={0.27}>
                Good food shouldn&rsquo;t be so serious.
              </BlurText>
            </h2>
            <p>
              <span className="story__run">
                We believe nutrition should be{' '}
                <strong>thoughtful, honest, convenient and delicious</strong>.
              </span>
            </p>
            <p className="story__bold">
              <span className="story__run">No perfection. Just better choices.</span>
            </p>
          </section>

          <section className="story__block story__block--right" ref={set('block3')}>
            <h2>
              <BlurText play={headingsIn[4]} delay={85} stepDuration={0.27}>
                The fun part has science behind it.
              </BlurText>
            </h2>
            <p>
              <span className="story__run">
                <strong>ISHAYU</strong> comes from <strong>Vittarthaa Life Sciences</strong>,
                established in <strong>Bangalore</strong> in <strong>2016</strong>, with expertise
                across pharmaceuticals, biologicals, nutraceuticals and product development.
              </span>
            </p>
            <p className="story__bold">
              <span className="story__run">Years of science. Everyday food.</span>
            </p>
          </section>

          <section className="story__block story__block--left" ref={set('block4')}>
            <h2>
              <BlurText play={headingsIn[5]} delay={85} stepDuration={0.27}>
                You don&rsquo;t need a perfect life
              </BlurText>
            </h2>
            <p className="story__bold story__caps">
              <span className="story__run">Just a few better choices.</span>
            </p>
            <p className="story__triplet">
              <span className="story__run">
                Good food.
                <br />
                Real life.
                <br />
                No overthinking.
              </span>
            </p>
          </section>

          <div className="story__sign" ref={set('sign')}>
            {/* the wordmark asset is cream (drawn for the hero/footer); the
                reference shows it dark green here, so it's recoloured with
                a CSS mask rather than swapping in a new asset — same trick
                as the brightness(0) recolour on the Products page header,
                just tinted to the logo's own measured green (#235f30)
                instead of black */}
            <div className="story__sign-logo" role="img" aria-label="Ishayu" />
            <p className="story__sign-tag">
              <span className="story__run">HEALTHY MADE DELICIOUS.</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer brief (correction pass): the old separate tree-crop strip
          above a second, unrelated green-photo Footer is gone — "3.png"
          shows one continuous landscape doing both jobs (the hill/tree
          transition AND the footer itself), which is what the
          "landscape" variant renders. */}
      <Footer variant="landscape" />
    </>
  )
}
