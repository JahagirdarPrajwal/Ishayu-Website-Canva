import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurText from '../components/BlurText.jsx'
import FoldText from '../components/FoldText.jsx'
import Levitate from '../components/Levitate.jsx'
import RefineFrame from '../components/RefineFrame.jsx'
import SpringCheck from '../components/SpringCheck.jsx'
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
import './SnackLikeYouMeanIt.css'

gsap.registerPlugin(ScrollTrigger)

/* `lev` is the hover each folder settles into once it has popped in — a
   share of its own height, offset in duration and delay so the pair never
   bobs in step. */
const FOLDERS = [
  { name: 'slay', y: 199, lev: { amp: 8, duration: 4.3, delay: 0 } },
  { name: 'serve', y: 326, lev: { amp: 8, duration: 5.1, delay: 0.7 } },
]

const BODY = [
  'the right snack isn’t about what’s',
  'trending.',
  'it’s about what you reach for when you',
  'need it.',
]

/* Seconds per character for this section's type-on. Slower than the shared
   default (0.023) — this is the last long stretch of copy on the page and it
   was going past before it could be read. */
const TYPE_SPEED = 0.034

/* A quiet editorial aside explaining the checklist is interactive — sits
   below the photograph and left of the notes card, same spot and the same
   two-line wrap as the "little reminder.png" Canva reference. The bubble
   there has its tail pointing away from the note (down-left); this is
   mirrored so the tail points at it instead. */
const REMINDER_HEAD = 'A little reminder:'
const REMINDER_BODY = ['tick these off', 'as you go.']

/* The five rows on the notes card, read off the export. */
const CHECKS = [
  'Choosing better, not perfect.',
  'Trying something new.',
  'Making time for myself.',
  'Finding MY snack.',
  'Eating well, eating right.',
]

export default function SnackLikeYouMeanIt() {
  const root = useRef(null)
  const refs = useRef({})
  const [headingIn, setHeadingIn] = useState(false)
  const [ctaIn, setCtaIn] = useState(false)
  const [photoIn, setPhotoIn] = useState(false)
  const [checks, setChecks] = useState(() => CHECKS.map(() => false))
  const [reminderIn, setReminderIn] = useState(false)

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
          setCtaIn(true)
          setPhotoIn(true)
          setChecks(CHECKS.map(() => true))
          setReminderIn(true)
          return undefined
        }

        const r = refs.current
        const bodyRuns = gsap.utils.toArray('.snack__body-run', el)
        const noteRuns = gsap.utils.toArray('.snack__note-run', el)
        const reminderRuns = gsap.utils.toArray('.snack__reminder-run', el)
        bodyRuns.forEach((run) => armTypeReveal(run))
        noteRuns.forEach((run) => armTypeReveal(run))
        reminderRuns.forEach((run) => armTypeReveal(run))
        armSelection(r.noteMark)

        /* 1. the heading lands, then the marker goes through "mean it" */
        const head = gsap.timeline({
          scrollTrigger: { trigger: r.heading, start: 'top 82%' },
          onStart: () => setHeadingIn(true),
        })
        head.to({}, { duration: 1.15 })
        addBandWipe(head, r.band, 1.15)

        /* 2. the photograph resolves in its frame */
        ScrollTrigger.create({
          trigger: r.photo,
          start: 'top 78%',
          once: true,
          onEnter: () => setPhotoIn(true),
        })
        gsap.from(r.photo, {
          yPercent: 7,
          opacity: 0,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: r.photo, start: 'top 78%' },
        })

        /* 3. the body copy types on, then the call to action unfolds right
           behind it — the spec asks for them in sequence, not together */
        const copy = gsap.timeline({
          scrollTrigger: { trigger: r.body, start: 'top 84%' },
        })
        let at = 0
        bodyRuns.forEach((run) => {
          at += addTypeReveal(copy, { run, position: at, speed: TYPE_SPEED }) + 0.16
        })
        copy.call(() => setCtaIn(true), undefined, at + 0.2)

        /* 4. the two folders pop in, one from above and one from below, then
           settle into their own hover (see FOLDERS). The pop is on the outer
           box so it never collides with Levitate's transform on the inner. */
        gsap.from(gsap.utils.toArray('.snack__folder', el), {
          yPercent: (i) => (i === 0 ? -60 : 60),
          opacity: 0,
          scale: 0.6,
          duration: 0.9,
          stagger: 0.14,
          ease: 'back.out(2.2)',
          /* on a folder, not on .snack__folders: that wrapper is inset:0 over
             the whole section, so its box sits at the section top rather than
             where the folders are */
          scrollTrigger: { trigger: el.querySelector('.snack__folder'), start: 'top 85%' },
        })

        /* 4b. the reminder annotation — its own timeline, same trigger point
           as the folder pop above (left completely untouched), timed to
           start once that entrance has actually finished: two folders,
           0.14s apart, 0.9s each -> last one lands at 1.04s, plus a beat. */
        const reminder = gsap.timeline({
          scrollTrigger: { trigger: el.querySelector('.snack__folder'), start: 'top 85%' },
        })
        reminder.to({}, { duration: 1.3 })
        reminder.call(() => setReminderIn(true))
        let rat = 1.3 + 0.85 // let "A little reminder:" land before typing starts
        reminderRuns.forEach((run) => {
          rat += addTypeReveal(reminder, { run, position: rat }) + 0.06
        })

        /* 5. the notes card arrives, its title and rows type on, the title is
           then selected, and finally the five boxes tick themselves off */
        const note = gsap.timeline({
          scrollTrigger: { trigger: r.note, start: 'top 85%' },
        })
        note.from(r.note, {
          yPercent: 8,
          opacity: 0,
          scale: 0.96,
          duration: 0.9,
          ease: 'power3.out',
        })
        let nat = 0.6
        noteRuns.forEach((run) => {
          nat += addTypeReveal(note, { run, position: nat, speed: TYPE_SPEED }) + 0.14
        })
        addSelectionSweep(note, r.noteMark, nat + 0.2, { duration: 0.95 })
        CHECKS.forEach((_, i) => {
          note.call(
            () => setChecks((prev) => prev.map((v, n) => (n === i ? true : v))),
            undefined,
            nat + 1.35 + i * 0.3,
          )
        })

        return () => {
          bodyRuns.forEach((run) => clearTypeReveal(run))
          noteRuns.forEach((run) => clearTypeReveal(run))
          reminderRuns.forEach((run) => clearTypeReveal(run))
          clearSelection(r.noteMark)
          r.band?.style.removeProperty('--hl-w')
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="section snack" ref={root}>
      <h2 className="snack__heading" ref={set('heading')}>
        <span className="snack__line1">
          <BlurText play={headingIn} delay={130} stepDuration={0.4}>
            snack like
          </BlurText>
        </span>
        <span className="snack__line2">
          <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={2}>
            you
          </BlurText>
          <span className="hl snack__italic" ref={set('band')}>
            <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={3}>
              mean it
            </BlurText>
          </span>
        </span>
      </h2>

      <p className="snack__body" ref={set('body')}>
        {BODY.map((line) => (
          <span className="snack__body-line" key={line}>
            <span className="snack__body-run">{line}</span>
          </span>
        ))}
      </p>

      <p className="snack__cta">
        <span className="snack__cta-line">
          <FoldText
            text="choose your moment."
            splitBy="word"
            hinge="top"
            duration={0.7}
            stagger={0.14}
            play={ctaIn}
          />
        </span>
        <span className="snack__cta-line">
          {/* indexOffset picks up where the first line left off, so the six
              words unfold as one run rather than two lines starting together */}
          <FoldText
            text="choose your ISHAYU."
            splitBy="word"
            hinge="top"
            duration={0.7}
            stagger={0.14}
            indexOffset={3}
            play={ctaIn}
          />
        </span>
      </p>

      {/* The "slay.png" title bar was baked into the top of the photograph;
          RefineFrame wraps whatever it is given in its own frame, so the bar
          is a sibling and only the picture resolves (CLAUDE.md §8.13). */}
      <div className="snack__photo" ref={set('photo')}>
        <img className="snack__photo-bar" src="/assets/snack/slay-bar.png" alt="" />
        <RefineFrame
          className="snack__photo-frame"
          src="/assets/snack/card-lemons-photo.jpg"
          alt="Beet energy bar with lemons"
          aspectRatio="468 / 518"
          radius={0}
          /* long enough to watch the picture actually resolve — at ~1.1s the
             front crossed the frame before you could see it happen */
          duration={2600}
          play={photoIn}
        />
      </div>

      <div className="snack__folders" ref={set('folders')}>
        {FOLDERS.map(({ name, y, lev }) => (
          <div key={name} className="snack__folder" style={{ top: `${y / 100}rem` }}>
            <Levitate className="snack__folder-float" {...lev}>
              <img src="/assets/snack/folder.png" alt="" />
              <span>{name}</span>
            </Levitate>
          </div>
        ))}
      </div>

      <div className="snack__note" ref={set('note')}>
        <img className="snack__note-card" src="/assets/snack/note-card-year.png" alt="" />
        <p className="snack__note-title">
          <span className="snack__note-run">
            <span className="snack__note-mark" ref={set('noteMark')}>
              This year, it was...
              <i className="snack__note-handle snack__note-handle--start" />
              <i className="snack__note-handle snack__note-handle--end" />
            </span>
          </span>
        </p>
        <ul className="snack__note-list">
          {CHECKS.map((label, i) => (
            <li key={label}>
              <span className="snack__note-run">
                <SpringCheck
                  label={label}
                  checked={checks[i]}
                  onChange={(v) =>
                    setChecks((prev) => prev.map((p, n) => (n === i ? v : p)))
                  }
                  color="#e0a52a"
                  fillColor="#e0a52a"
                  checkColor="#ffffff"
                  boxSize="4.37cqw"
                  boxRadius="2.19cqw"
                  fontSize="4.13cqw"
                  bounce={0.28}
                  strike="none"
                  doneOpacity={1}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* The "little reminder.png" bubble, mirrored: in the reference its
          tail points down-left, away from the Notes card. This is flipped
          so the tail points at it instead (left-to-right scaleX(-1) on the
          tail only — the text stays unmirrored). Typography matches the
          note card's own title treatment (bold label, regular line under
          it) rather than a new style. */}
      <div className="snack__reminder">
        <p className="snack__reminder-head">
          <BlurText play={reminderIn} delay={120} stepDuration={0.35}>
            {REMINDER_HEAD}
          </BlurText>
        </p>
        <p className="snack__reminder-body">
          {REMINDER_BODY.map((line) => (
            <span className="snack__reminder-line" key={line}>
              <span className="snack__reminder-run">{line}</span>
            </span>
          ))}
        </p>
        <i className="snack__reminder-tail" aria-hidden="true" />
      </div>
    </section>
  )
}
