import { useCallback, useEffect, useRef } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'

/* ==================================================================
   One object on the shelf.

   Originally also user-draggable (spec: "can be picked up and moved...
   released it starts with its original free motion"); desktop client
   feedback removed that — the objects should read as naturally floating on
   their shelves, not as interactive, repositionable pieces. What remains is
   exactly the ambient half of that: each object settles into its designed
   position and then drifts in a small, slow, never-repeating loop around
   it, forever, with no user interaction at all.

   The drift is a random walk: each axis eases to a fresh target near the
   object's home and then picks another, with its own duration, so x and y
   fall out of phase and the path never repeats. Every object owns its own
   pair of tweens, so they never fall into sync.
================================================================== */

/* how far from home an object may drift, as a share of the shelf's width.
   14 design px of a 700 px shelf — a hover, not a wander. */
const DRIFT = 14 / 700
const LEG_MIN = 2.9
const LEG_VAR = 2.6

export default function ShelfObject({ src, alt = '', x, y, w, z, shelfRef, interactive = true }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const home = useRef({ x: 0, y: 0 })
  const legs = useRef({ x: null, y: null })

  const leg = useCallback(
    (axis) => {
      const mv = axis === 'x' ? mx : my
      const box = shelfRef.current
      if (!box) return
      const amp = box.getBoundingClientRect().width * DRIFT
      const target = home.current[axis] + (Math.random() * 2 - 1) * amp
      legs.current[axis] = animate(mv, target, {
        duration: LEG_MIN + Math.random() * LEG_VAR,
        ease: 'easeInOut',
        onComplete: () => leg(axis),
      })
    },
    [mx, my, shelfRef],
  )

  useEffect(() => {
    if (!interactive) return undefined
    // stagger the start so seven objects never breathe in unison
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

  return (
    <div className="edit__obj" style={{ '--x': x, '--y': y, '--w': w, zIndex: z }}>
      <motion.div className="edit__obj-float" style={{ x: mx, y: my }}>
        <img src={src} alt={alt} draggable={false} />
      </motion.div>
    </div>
  )
}
