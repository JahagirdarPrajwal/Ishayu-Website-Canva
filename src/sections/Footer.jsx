import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurText from '../components/BlurText.jsx'
import {
  addBandWipe,
  addTypeReveal,
  armTypeReveal,
  clearTypeReveal,
} from '../anim/helpers.js'
import './Footer.css'

gsap.registerPlugin(ScrollTrigger)

function LinkedInIcon() {
  return (
    <svg className="footer__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.4 0H3.6A3.6 3.6 0 0 0 0 3.6v16.8A3.6 3.6 0 0 0 3.6 24h16.8a3.6 3.6 0 0 0 3.6-3.6V3.6A3.6 3.6 0 0 0 20.4 0ZM7.3 20.1H3.9V9h3.4v11.1ZM5.6 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm14.5 12.6h-3.4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.5H9.4V9h3.3v1.5h.1a3.6 3.6 0 0 1 3.2-1.8c3.5 0 4.1 2.3 4.1 5.2v6.2Z"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="footer__icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="5.4" fill="none" stroke="currentColor" strokeWidth="2.1" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="2.1" />
      <circle cx="17.6" cy="6.4" r="1.35" fill="currentColor" />
    </svg>
  )
}

/* The footer is the end of the page — "no more scrolling" (master spec) —
   so its text reveal runs quicker than the rest of the site's established
   0.023 s/char, and each run carries a short blur-to-sharp pull alongside
   the clip reveal ("that blur thing behind those texts"). Both are local
   overrides passed into the one shared addTypeReveal helper; nothing about
   how Parts 1-6 call it changes. */
const FAST_SPEED = 0.0093
const FAST_MIN = 0.147
const TEXT_BLUR = 0.1 // rem

const BODY = [
  'Whether you want to ask',
  'us something, work with',
  'us, stock ISHAYU, or',
  'simply say hi , we’d love to',
  'hear from you.',
]

const ADDRESS = ['No.66, 8th ‘A’ Main, BTM 1st', 'Stage, Bangalore – 560029,', 'Karnataka, India']
const PHONE = ['+91 80 35893150 / 35893151', '+91 9686623006']

export default function Footer() {
  const root = useRef(null)
  const refs = useRef({})
  const [headingIn, setHeadingIn] = useState(false)

  const set = (name) => (node) => {
    refs.current[name] = node
  }

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined

    const mm = gsap.matchMedia()

    mm.add(
      { motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        /* With reduced motion everything renders at rest (CLAUDE.md
           §8.12) — same convention as every other section. The type reveal
           itself is geometry-free (a clip-path wipe over real text), so it
           plays the same way at every width now. */
        if (!ctx.conditions.motionOK) {
          setHeadingIn(true)
          return undefined
        }

        const r = refs.current
        const runs = gsap.utils.toArray('.footer__run', el)
        runs.forEach((run) => armTypeReveal(run))

        /* One entry trigger, not a scrub — this is the last section and the
           master spec is explicit that nothing here waits on further
           scrolling. The words land, the marker is drawn through "with us"
           at the page's shared stroke rate, then every other block of text
           types on fast with the logo popping in alongside it. */
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 82%' },
          onStart: () => setHeadingIn(true),
        })
        tl.to({}, { duration: 0.95 })
        addBandWipe(tl, r.band, 0.95)

        let at = 1.7 // past the heading settle + the short "with us" band
        runs.forEach((run) => {
          at += addTypeReveal(
            tl,
            { run, position: at, speed: FAST_SPEED, minDuration: FAST_MIN, blur: TEXT_BLUR },
          ) + 0.05
        })

        return () => {
          runs.forEach((run) => clearTypeReveal(run))
          r.band?.style.removeProperty('--hl-w')
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <footer className="section footer" ref={root}>
      <img className="section__bg" src="/assets/footer/footer-bg.jpg" alt="" />

      {/* The band is the parent of its BlurText, not a child — BlurText
          remounts its subtree once it settles, which would drop the inline
          --hl-w the wipe is driving (the bug already fixed in Parts 2-3). */}
      <h2 className="footer__heading">
        <span className="footer__line1">
          <BlurText play={headingIn} delay={85} stepDuration={0.27}>
            talk snacks
          </BlurText>
        </span>
        <span className="hl footer__line2" ref={set('band')}>
          <BlurText play={headingIn} delay={85} stepDuration={0.27} indexOffset={2}>
            with us
          </BlurText>
        </span>
      </h2>

      <p className="footer__body">
        {BODY.map((line) => (
          <span className="footer__line" key={line}>
            <span className="footer__run">{line}</span>
          </span>
        ))}
      </p>

      {/* footer-bg.jpg carries the Ishayu wordmark baked into its bottom-left
          corner, but softened — reconstruction residue from when it was
          painted out and back in (CLAUDE.md §6). It is not CSS; confirmed by
          searching every filter/blur rule in the project and by an edge-
          sharpness measurement of the region (see the investigation notes).
          The clean transparent asset is laid exactly over it — position
          cross-checked by compositing the two and visually confirming the
          wordmark and the (R) mark land on top of their baked counterparts,
          not beside them — so what's underneath reads as a soft ambient
          shadow the logo is sitting on, not a second, misaligned logo. */}
      {/* .footer__bottom is a plain, unpositioned wrapper — it carries no
          layout of its own on desktop, so the logo and the contact column
          still position themselves against the section exactly as before.
          On mobile it becomes the flex row that puts them side by side:
          logo lower-left, contact lower-right (mobile-pass brief), instead
          of one long stacked column. */}
      <div className="footer__bottom">
        <img className="footer__logo" src="/assets/footer/ishayu-logo.png" alt="Ishayu" />

        <div className="footer__contact">
          <div className="footer__contact-col">
            <h3>
              <span className="footer__run">locate us</span>
            </h3>
            <p>
              {ADDRESS.map((line) => (
                <span className="footer__line" key={line}>
                  <span className="footer__run">{line}</span>
                </span>
              ))}
            </p>

            <h3>
              <span className="footer__run">give us a call</span>
            </h3>
            <p>
              {PHONE.map((line) => (
                <span className="footer__line" key={line}>
                  <span className="footer__run">{line}</span>
                </span>
              ))}
            </p>

            <h3>
              <span className="footer__run">mail</span>
            </h3>
            <p>
              <span className="footer__line">
                <a className="footer__run" href="mailto:reachus@ishayu.in">
                  reachus@ishayu.in
                </a>
              </span>
            </p>
          </div>

          <div className="footer__contact-col">
            <h3>
              <span className="footer__run">socials</span>
            </h3>
            <p>
              <span className="footer__line">
                <a
                  className="footer__run footer__social"
                  href="https://www.linkedin.com/company/ishayu/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ishayu on LinkedIn"
                >
                  @ishayu <LinkedInIcon />
                </a>
              </span>
              <span className="footer__line">
                <a
                  className="footer__run footer__social"
                  href="https://www.instagram.com/ishayu_vittarthaa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ishayu on Instagram"
                >
                  @ishayu_vittarthaa <InstagramIcon />
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
