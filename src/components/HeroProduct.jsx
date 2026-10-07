import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react'

/* ==================================================================
   One of the four products floating around the Hero's seated figure.

   Division of labour, the same split as every other floating object on
   the site (ShelfObject in Part 2, FloatingProduct in Part 3): GSAP drives
   the one-time entrance on the *outer* element (Hero.jsx owns that
   timeline — it needs to interleave with the fall/rotate choreography
   already there), and this component owns the *inner*, perpetual
   levitation with Motion, so the two never write to the same transform.

   The shadow is not animated independently — it reads the same `y`
   motion value the product itself moves on, via useTransform. Rising
   (more negative y) maps to a smaller, lighter shadow; falling back
   toward rest maps to a bigger, softer one. That coupling is what makes
   it read as "the product is physically above the ground" rather than a
   decorative pulse.
================================================================== */

export default function HeroProduct({ src, alt, amp = 10, duration = 4.5, delay = 0, className = '' }) {
  const y = useMotionValue(0)
  const reduced = useReducedMotion()

  // y travels from 0 (resting) to -amp (risen). Shadow is driven off the
  // same value: tighter/smaller/lighter when risen, fuller/softer when down.
  // (Was 0.62–1 / 0.16–0.3 — far too faint to actually read against the
  // grass, per direct comparison with "Screenshot 1"'s own clearly visible
  // cast shadow; this range is tuned to be unmistakably there at rest.)
  const shadowScale = useTransform(y, [-amp, 0], [0.5, 1])
  const shadowOpacity = useTransform(y, [-amp, 0], [0.45, 0.85])

  useEffect(() => {
    if (reduced) return undefined
    let controls
    // staggered start so four instances never breathe in sync, even when
    // given the same duration
    const kick = setTimeout(() => {
      controls = animate(y, [0, -amp, 0], {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      })
    }, delay * 1000)
    return () => {
      clearTimeout(kick)
      controls?.stop()
    }
  }, [y, amp, duration, delay, reduced])

  return (
    <div className={`hero__product-stage ${className}`}>
      <motion.div
        className="hero__product-shadow"
        style={{ scaleX: shadowScale, scaleY: shadowScale, opacity: shadowOpacity }}
      />
      <motion.img className="hero__product-img" src={src} alt={alt} draggable={false} style={{ y }} />
    </div>
  )
}
