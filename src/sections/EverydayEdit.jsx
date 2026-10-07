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
  /* The Moringa bar sits on rail 0, in the gap between the headphones and
     the keys — always visually on the top rack. It used to also carry a
     drag-back-to-here behaviour; the whole shelf is no longer user-
     draggable (desktop client feedback), so it is now exactly like the six
     objects above it — same entrance, same drift, no special case. */
  { key: 'moringa', x: 280, y: 95, w: 180, z: 2, rail: 0, alt: 'Ishayu Moringa energy bar' },
]

/* ---- mobile rack ----
   The desktop shelf is a wide 700x660 box with objects clustered two to a
   rail. Shrunk to a phone's width that cluster would be unreadable, so this
   is a genuinely different, taller composition: the same three rails, now
   spanning the full width, with the seven objects spread out so none
   overlaps another and the Moringa bar reads clearly on the top rail — not
   the desktop layout proportionally squeezed (CLAUDE.md mobile pass brief).
   Rail y's keep the desktop's own fractional spacing (178/397/623 of 660 ≈
   0.270 / 0.602 / 0.944) so the rhythm of the rack stays the same shape;
   every object's bottom edge sits a fixed 18px past its rail, a simpler,
   uniform resting rule that this wider cast of objects can share without
   any one of them (the tall, narrow tumbler especially) overshooting the
   box — see the mobile-pass working notes. */
const MOBILE_SHELF_W = 380
const MOBILE_SHELF_H = 760
const MOBILE_RAILS = RAILS.map((y) => Math.round((y / SHELF_H) * MOBILE_SHELF_H))
const MOBILE_RAIL_W = 370
const OVERHANG = 18

const mobileY = (railIndex, h) => MOBILE_RAILS[railIndex] + OVERHANG - h
/* height implied by a chosen width and the object's own aspect ratio
   (measured off its asset, same ratios the desktop crop used) */
const hFromW = (w, ar) => w / ar

const MOBILE_OBJECTS = [
  { key: 'headphones', w: 130, ar: 378 / 404, x: 0, rail: 0, z: 2, alt: 'headphones' },
  { key: 'moringa', w: 110, ar: 408 / 194, x: 148, rail: 0, z: 2, alt: 'Ishayu Moringa energy bar' },
  { key: 'keys', w: 100, ar: 246 / 264, x: 272, rail: 0, z: 2, alt: 'car keys' },
  { key: 'watch', w: 95, ar: 188 / 310, x: 48, rail: 1, z: 3, alt: 'watch' },
  { key: 'wallet', w: 150, ar: 330 / 246, x: 183, rail: 1, z: 2, alt: 'wallet' },
  { key: 'tumbler', w: 100, ar: 218 / 480, x: 35, rail: 2, z: 2, alt: 'tumbler' },
  { key: 'laptop', w: 170, ar: 462 / 356, x: 175, rail: 2, z: 2, alt: 'laptop' },
].map((o) => ({ ...o, y: mobileY(o.rail, hFromW(o.w, o.ar)) }))

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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? !window.matchMedia(DESKTOP).matches : false,
  )

  const set = (name) => (node) => {
    refs.current[name] = node
  }

  /* Which rack is on screen — the rewiring below (coordinates, the rail
     cascade) depends on this, not on CSS alone, because the mobile rack is
     a different set of object positions rather than the desktop one
     squeezed narrower. */
  useLayoutEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const onChange = () => setIsMobile(!mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const activeObjects = isMobile ? MOBILE_OBJECTS : OBJECTS
  const activeRails = isMobile ? MOBILE_RAILS : RAILS
  const activeShelfW = isMobile ? MOBILE_SHELF_W : SHELF_W
  const activeShelfH = isMobile ? MOBILE_SHELF_H : SHELF_H
  const activeRailW = isMobile ? MOBILE_RAIL_W : RAIL_W

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined

    const mm = gsap.matchMedia()

    mm.add(
      { motionOK: '(prefers-reduced-motion: no-preference)' },
      (ctx) => {
        /* With reduced motion everything simply renders at rest
           (CLAUDE.md §8.12 / the mobile-pass brief). The heading still has
           to be released, or BlurText sits waiting at opacity 0 for a cue
           that never comes; the objects stay inert, which is the point. */
        if (!ctx.conditions.motionOK) {
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
        armSelection(r.noteMark)

        /* ---- 1 & 2. the three rails arrive from the left, one behind the
           other, then each one's objects drop onto it ----
           Scrolling into the section *triggers* the sequence; it does not
           scrub it. The cascade then plays at its own tempo, so the three
           racks read as one deliberate move — first, second, third — rather
           than being dragged in by the scroll wheel. Offsets are %, never
           px, so nothing drifts between screen widths. Runs at every width
           now — the rack is a real composition on mobile too, not a static
           fallback (mobile-pass brief). */
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
            objects.filter((_, n) => activeObjects[n].rail === i),
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

        /* ---- 3. heading, then the marker through "edit" ---- */
        const head = gsap.timeline({
          scrollTrigger: { trigger: r.heading, start: 'top 85%' },
          onStart: () => setHeadingIn(true),
        })
        head.to({}, { duration: 0.95 })        // let the words land first
        addBandWipe(head, r.band, 0.95)

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
          clearSelection(r.noteMark)
          r.band?.style.removeProperty('--hl-w')
        }
      },
    )

    return () => mm.revert()
  }, [isMobile])

  return (
    <section className="section edit" ref={root}>
      <div className="edit__shelf" ref={shelf}>
        {activeRails.map((y) => (
          <img
            key={y}
            className="edit__rail"
            src="/assets/edit/rail.png"
            alt=""
            style={{ '--x': '0%', '--y': pc(y, activeShelfH), '--w': pc(activeRailW, activeShelfW) }}
          />
        ))}
        {activeObjects.map(({ key, x, y, w, z, alt }) => (
          <ShelfObject
            key={key}
            src={`/assets/edit/obj-${key}.png`}
            alt={alt}
            x={pc(x, activeShelfW)}
            y={pc(y, activeShelfH)}
            w={pc(w, activeShelfW)}
            z={z}
            shelfRef={shelf}
            interactive={objectsIn}
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
        <BlurText play={headingIn} delay={85} stepDuration={0.27}>
          the everyday
        </BlurText>
        <span className="hl" ref={set('band')}>
          <BlurText play={headingIn} delay={85} stepDuration={0.27} indexOffset={2}>
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
    </section>
  )
}
