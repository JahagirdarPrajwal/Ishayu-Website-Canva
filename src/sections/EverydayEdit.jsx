import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurText from '../components/BlurText.jsx'
import ShelfObject from '../components/ShelfObject.jsx'
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
import './EverydayEdit.css'

gsap.registerPlugin(ScrollTrigger)

/* The shelf is the 700 x 660 design-px block the composite occupied.
   Everything inside is placed as a share of that box rather than in rem, so
   one set of coordinates serves both the artboard and the mobile reflow,
   where the block is simply narrower. */
const SHELF_W = 700
const SHELF_H = 660
const pc = (v, total) => `${((v / total) * 100).toFixed(4)}%`

/* y of each rail inside the shelf. The rails are pixel-identical to each
   other in the export, so one asset is used three times. */
const RAILS = [178, 397, 623]
const RAIL_W = 683
const RAIL_H = 22

/* The slot each object occupied in the export. The art comes from
   elements.png, which already carries a real alpha channel and keeps the
   watch clear of the wallet, so each piece is fitted to its slot width and
   bottom-aligned — these rest on rails, so the bottom edge is what has to
   stay put. y is the bottom-aligned value; it differs from the export by a
   px or two wherever the supplied art is proportioned slightly differently
   (the tumbler carries a little more straw). The watch still paints over
   the wallet, as it did in the export. */
const OBJECTS = [
  { key: 'headphones', x: 48, y: 48, w: 189, z: 2, rail: 0, alt: 'headphones' },
  { key: 'keys', x: 499, y: 73, w: 123, z: 2, rail: 0, alt: 'car keys' },
  { key: 'wallet', x: 333, y: 293, w: 165, z: 2, rail: 1, alt: 'wallet' },
  { key: 'watch', x: 271, y: 268, w: 94, z: 3, rail: 1, alt: 'watch' },
  { key: 'tumbler', x: 91, y: 391, w: 109, z: 2, rail: 2, alt: 'tumbler' },
  { key: 'laptop', x: 439, y: 482, w: 231, z: 2, rail: 2, alt: 'laptop' },
  /* The Moringa bar: the one object on the shelf that is always your top
     priority. It sits on rail 0 in the gap between the headphones and the
     keys, and carries `priority` — the only thing that makes it behave
     differently from the six objects above (see ShelfObject's `returnBelow`
     prop). Everything else about it — entrance, drift, drag — is the exact
     same mechanism, unchanged. */
  {
    key: 'moringa',
    x: 280,
    y: 95,
    w: 180,
    z: 2,
    rail: 0,
    alt: 'Ishayu Moringa energy bar',
    priority: true,
  },
]

/* How far below its home position (as a share of the shelf's live height)
   the priority object can be dropped before it is no longer "on the top
   rail". Set to the midpoint between rail 0 and rail 1 in the same design-px
   space the rest of this file uses (RAILS / SHELF_H), measured from the
   object's own home y rather than from the rail itself, since that is what
   ShelfObject actually compares against a live drag offset. */
const PRIORITY_RETURN_BELOW = (() => {
  const midRail01 = (RAILS[0] + RAILS[1]) / 2
  const home = OBJECTS.find((o) => o.priority).y
  return (midRail01 - home) / SHELF_H
})()

const BODY = [
  'phone. keys. headphones. ishayu.',
  'consider your bag officially sorted.',
  'throw it in your bag and get on with',
  'your day.',
]

/* The notes card is 412 x 325 design px; these are card-relative, measured
   off the export before the type was cleared out of it. */
const NOTE = [
  'you don’t need to have',
  'it all figured out.',
  'you just need enough',
  'energy to keep going.',
]

export default function EverydayEdit() {
  const root = useRef(null)
  const shelf = useRef(null)
  const refs = useRef({})
  const [headingIn, setHeadingIn] = useState(false)
  const [objectsIn, setObjectsIn] = useState(false)

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
        /* Below the breakpoint responsive.css reflows the artboard into a
           column, and with reduced motion everything simply renders at rest
           (CLAUDE.md §8.12). The heading still has to be released, or
           BlurText sits waiting at opacity 0 for a cue that never comes;
           the objects stay inert, which is the point. */
        if (!ctx.conditions.desktop || !ctx.conditions.motionOK) {
          setHeadingIn(true)
          return undefined
        }

        const r = refs.current
        const rails = gsap.utils.toArray('.edit__rail', el)
        const objects = gsap.utils.toArray('.edit__obj', el)
        const bodyRuns = gsap.utils.toArray('.edit__body-run', el)
        const noteRuns = gsap.utils.toArray('.edit__note-run', el)

        /* ---- arm everything that is revealed rather than tweened ---- */
        bodyRuns.forEach((run) => armTypeReveal(run))
        noteRuns.forEach((run) => armTypeReveal(run))
        armTypeReveal(r.priorityRun)
        armSelection(r.noteMark)

        /* ---- 1 & 2. the three rails arrive from the left, one behind the
           other, then each one's objects drop onto it ----
           Scrolling into the section *triggers* the sequence; it does not
           scrub it. The cascade then plays at its own tempo, so the three
           racks read as one deliberate move — first, second, third — rather
           than being dragged in by the scroll wheel. Offsets are %, never
           px, so nothing drifts between screen widths. */
        const shelfTl = gsap.timeline({
          scrollTrigger: { trigger: shelf.current, start: 'top 78%' },
        })

        rails.forEach((rail, i) => {
          const at = i * 0.3
          shelfTl.from(
            rail,
            { xPercent: -112, opacity: 0, duration: 0.8, ease: 'power3.out' },
            at,
          )
          shelfTl.from(
            objects.filter((_, n) => OBJECTS[n].rail === i),
            {
              yPercent: 42,
              opacity: 0,
              scale: 0.88,
              duration: 0.72,
              stagger: 0.11,
              ease: 'back.out(1.5)',
            },
            at + 0.46, // just as that rail settles
          )
        })
        shelfTl.call(() => setObjectsIn(true))

        /* ---- 3. heading, then the marker through "edit" ----
           "REARRANGE Your Day! Protein stays a priority." rides the exact
           same timeline and the exact same `headingIn` flag as "the everyday
           edit" — it is not a separate entrance, it is the same one. Both
           BlurText headings play together, both bands wipe together, then
           the Moringa line types on right after. */
        const head = gsap.timeline({
          scrollTrigger: { trigger: r.heading, start: 'top 85%' },
          onStart: () => setHeadingIn(true),
        })
        head.to({}, { duration: 0.95 })        // let the words land first
        addBandWipe(head, r.band, 0.95)
        addBandWipe(head, r.priorityBand, 0.95)
        addTypeReveal(head, { run: r.priorityRun, position: 1.55 })

        /* ---- 4. body copy, a line at a time ---- */
        const body = gsap.timeline({
          scrollTrigger: { trigger: r.body, start: 'top 86%' },
        })
        let at = 0
        bodyRuns.forEach((run) => {
          at += addTypeReveal(body, { run, position: at }) + 0.12
        })

        /* ---- 5. the notes card, then its type, then the selection ----
           Order is from the spec: "first reminder will come and then next
           sentence first word and similarly all the part and when the last
           word is typed out the highlighting ... should come and select". */
        const note = gsap.timeline({
          scrollTrigger: { trigger: r.note, start: 'top 84%' },
        })
        note.from(r.note, {
          yPercent: 9,
          opacity: 0,
          scale: 0.96,
          duration: 0.75,
          ease: 'power3.out',
        })
        let nat = 0.5
        noteRuns.forEach((run) => {
          nat += addTypeReveal(note, { run, position: nat }) + 0.1
        })
        addSelectionSweep(note, r.noteMark, nat + 0.15, { duration: 0.75 })

        return () => {
          bodyRuns.forEach((run) => clearTypeReveal(run))
          noteRuns.forEach((run) => clearTypeReveal(run))
          clearTypeReveal(r.priorityRun)
          clearSelection(r.noteMark)
          r.band?.style.removeProperty('--hl-w')
          r.priorityBand?.style.removeProperty('--hl-w')
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="section edit" ref={root}>
      <div className="edit__shelf" ref={shelf}>
        {RAILS.map((y) => (
          <img
            key={y}
            className="edit__rail"
            src="/assets/edit/rail.png"
            alt=""
            style={{ '--x': '0%', '--y': pc(y, SHELF_H), '--w': pc(RAIL_W, SHELF_W) }}
          />
        ))}
        {OBJECTS.map(({ key, x, y, w, z, alt, priority }) => (
          <ShelfObject
            key={key}
            src={`/assets/edit/obj-${key}.png`}
            alt={alt}
            x={pc(x, SHELF_W)}
            y={pc(y, SHELF_H)}
            w={pc(w, SHELF_W)}
            z={z}
            shelfRef={shelf}
            interactive={objectsIn}
            returnBelow={priority ? PRIORITY_RETURN_BELOW : undefined}
          />
        ))}
      </div>

      {/* The band sits *outside* BlurText, as it does in the hero. When
          BlurText settles it swaps its walked tree back for the original
          children, and React remounts the band node in the process — which
          silently drops the inline --hl-w the wipe is driving and makes the
          marker snap. Keeping the band as the parent takes it out of that
          reconciliation entirely. */}
      <h2 className="edit__heading" ref={set('heading')}>
        <BlurText play={headingIn} delay={130} stepDuration={0.4}>
          the everyday
        </BlurText>
        <span className="hl" ref={set('band')}>
          <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={2}>
            edit
          </BlurText>
        </span>
      </h2>

      <p className="edit__body" ref={set('body')}>
        {BODY.map((line) => (
          <span className="edit__body-line" key={line}>
            <span className="edit__body-run">{line}</span>
          </span>
        ))}
      </p>

      <div className="edit__note" ref={set('note')}>
        <img className="edit__note-card" src="/assets/edit/note-card.png" alt="" />
        <p className="edit__note-title">
          <span className="edit__note-run">
            <span className="edit__note-mark" ref={set('noteMark')}>
              reminder
              <i className="edit__note-handle edit__note-handle--start" />
              <i className="edit__note-handle edit__note-handle--end" />
            </span>
          </span>
        </p>
        <p className="edit__note-body">
          {NOTE.map((line) => (
            <span className="edit__note-line" key={line}>
              <span className="edit__note-run">{line}</span>
            </span>
          ))}
        </p>
      </div>

      {/* The Moringa callout — the Canva reference ("rearrange your
          day.png") has this as one continuous line sitting above the shelf,
          at the same moment "the everyday edit" lands: REARRANGE / Your
          Day! (BlurText, same play flag, band wipes alongside the "edit"
          band) then Protein stays a priority. (type-on, same line, right
          after). The band sits outside its BlurText for the usual remount
          reason. */}
      <h3 className="edit__priority-line">
        <BlurText play={headingIn} delay={130} stepDuration={0.4}>
          REARRANGE{' '}
        </BlurText>
        <span className="hl edit__priority-band" ref={set('priorityBand')}>
          <BlurText play={headingIn} delay={130} stepDuration={0.4} indexOffset={1}>
            Your Day!
          </BlurText>
        </span>{' '}
        <span className="edit__priority-run" ref={set('priorityRun')}>
          Protein stays a priority.
        </span>
      </h3>
    </section>
  )
}
