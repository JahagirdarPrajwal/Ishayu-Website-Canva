import { motion } from 'motion/react'

/* ==================================================================
   A slow hover, repeating forever.

   Pulled out of the Better Choice product row so the snack folders can use
   the same motion. The travel is a share of the element's own height, not a
   px figure, so it scales with the artboard and reads the same on a short
   element as on a tall one once `amp` is picked for it.

   GSAP drives whatever entrance the element has, on a *parent*; this owns
   the perpetual drift on its own box, so the two never write to the same
   transform.
================================================================== */
export default function Levitate({
  amp = 4,
  duration = 4.5,
  delay = 0,
  className = '',
  children,
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: ['0%', `-${amp}%`, '0%'] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
