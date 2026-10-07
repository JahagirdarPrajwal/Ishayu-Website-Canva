import { useCallback, useEffect, useRef } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'

/* ==================================================================
   One object on the shelf.

   Spec (docs/animation-spec.md): the objects "move around the rack lines
   like slow hovering over like as if its in space and how astronaut floats
   around", can be picked up and moved "but just like over the racks part",
   and when released "it starts with its original free motion" — while the
   other objects keep drifting throughout.

   Division of labour, per CLAUDE.md §7:
   - GSAP drives the entrance, on the *outer* wrapper.
   - Motion owns the drift and the drag, on the *inner* element.
   Keeping them on separate elements means the two libraries never write to
   the same transform.

   The drift is a random walk: each axis eases to a fresh target near the
   object's home and then picks another, with its own duration, so x and y
   fall out of phase and the path never repeats. Every object owns its own
   pair of tweens, so holding one has no effect on any other — there is no
   shared ticker to stall.
================================================================== */

/* how far from home an object may drift, as a share of the shelf's width.
   14 design px of a 700 px shelf — a hover, not a wander. */
const DRIFT = 14 / 700
const LEG_MIN = 2.9
const LEG_VAR = 2.6

export default function ShelfObject({
  src, alt = '', x, y, w, z, shelfRef, interactive = true,
}) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const home = useRef({ x: 0, y: 0 })
  const legs = useRef({ x: null, y: null })
  const held = useRef(false)

  /* How far the motion value may travel before the object leaves the shelf.
     Taken from layout (offsetLeft/Top against the shelf, which is the
     offset parent) rather than from getBoundingClientRect: the rect carries
     whatever transform an ancestor currently has, so while GSAP is still
     playing the entrance it would report the object as hanging out of the
     shelf and shove the drift hard the other way. Layout is the resting
     geometry, which is what the bounds are actually about. It stays
     scale-correct because every value is read in the same live px. */
  const room = useCallback(
    (axis) => {
      const el = ref.current
      const box = shelfRef.current
      const wrap = el?.parentElement
      if (!el || !box || !wrap) return null
      return axis === 'x'
        ? [-wrap.offsetLeft, box.clientWidth - el.offsetWidth - wrap.offsetLeft]
        : [-wrap.offsetTop, box.clientHeight - el.offsetHeight - wrap.offsetTop]
    },
    [shelfRef],
  )

  const leg = useCallback(
    (axis) => {
      const mv = axis === 'x' ? mx : my
      const box = shelfRef.current
      if (!box) return
      const amp = box.getBoundingClientRect().width * DRIFT
      let target = home.current[axis] + (Math.random() * 2 - 1) * amp
      const lim = room(axis)
      if (lim) target = Math.min(lim[1], Math.max(lim[0], target))
      legs.current[axis] = animate(mv, target, {
        duration: LEG_MIN + Math.random() * LEG_VAR,
        ease: 'easeInOut',
        onComplete: () => {
          if (!held.current) leg(axis)
        },
      })
    },
    [mx, my, room, shelfRef],
  )

  useEffect(() => {
    if (!interactive) return undefined
    // stagger the start so six objects never breathe in unison
    const kick = setTimeout(() => {
      leg('x')
      leg('y')
    }, Math.random() * 900)
    return () => {
      clearTimeout(kick)
      legs.current.x?.stop()
      legs.current.y?.stop()
      legs.current = { x: null, y: null }
    }
  }, [interactive, leg])

  const onGrab = () => {
    held.current = true
    legs.current.x?.stop()
    legs.current.y?.stop()
  }

  const onRelease = () => {
    held.current = false
    // resume drifting around wherever it was put down
    home.current = { x: mx.get(), y: my.get() }
    leg('x')
    leg('y')
  }

  return (
    <div className="edit__obj" style={{ '--x': x, '--y': y, '--w': w, zIndex: z }}>
      <motion.div
        ref={ref}
        className="edit__obj-float"
        style={{ x: mx, y: my }}
        drag={interactive}
        dragConstraints={shelfRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={onGrab}
        onDragEnd={onRelease}
      >
        <img src={src} alt={alt} draggable={false} />
      </motion.div>
    </div>
  )
}
