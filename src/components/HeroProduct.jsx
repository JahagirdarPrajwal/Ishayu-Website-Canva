import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react'

/* ==================================================================
   One of the four products floating around the Hero's seated figure
   (plus the small Beetroot bar in his hand, which uses this same
   component with `showShadow={false}` and no `card` — see Hero.jsx).

   Division of labour, the same split as every other floating object on
   the site (ShelfObject in Part 2, FloatingProduct in Part 3): GSAP drives
   the one-time entrance on the *outer* element (Hero.jsx owns that
   timeline), and this component owns the *inner*, perpetual levitation
   with Motion, so the two never write to the same transform.

   The shadow is rendered as a SIBLING of the rotated `.hero__card`, not a
   descendant of it — it used to live inside the card and inherit its
   rotation, which pushed it visibly off to one side instead of sitting
   straight below the product (a rotated child's "straight down" offset
   traces an arc around the card's centre once the parent rotates). As a
   sibling, positioned directly from the product's own unrotated x/y/w/h,
   it stays exactly below regardless of how much the card itself tilts.

   It still isn't animated independently, though: it reads the same `y`
   motion value the product's image moves on, via useTransform — rising
   maps to a smaller/lighter shadow, falling back to rest maps to a
   bigger/softer one.
================================================================== */

const u = (n) => `${n / 100}rem`

export default function HeroProduct({
  src,
  alt,
  amp = 10,
  duration = 4.5,
  delay = 0,
  className = '',
  /* when set, this component owns the full `.hero__card` positioning
     (x/y/w/z/tilt, in design px) and renders the ground shadow as an
     independent sibling of it, per the note above. Omit it (the Beetroot
     bar's case) to get the older, simpler "just the stage" render with no
     separate card wrapper. */
  card,
  showShadow = true,
}) {
  const y = useMotionValue(0)
  const reduced = useReducedMotion()

  // y travels from 0 (resting) to -amp (risen). Shadow is driven off the
  // same value: tighter/smaller/lighter when risen, fuller/softer when down.
  const shadowScale = useTransform(y, [-amp, 0], [0.5, 1])
  const shadowOpacity = useTransform(y, [-amp, 0], [0.34, 0.64])

  useEffect(() => {
    if (reduced) return undefined
    let controls
    // staggered start so instances never breathe in sync, even when given
    // the same duration
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

  const image = <motion.img className="hero__product-img" src={src} alt={alt} draggable={false} style={{ y }} />

  if (!card) {
    // the Beetroot bar's path: no independent card, no shadow — just the
    // stage the caller already wraps in its own positioned/tilted div
    return <div className={`hero__product-stage ${className}`}>{image}</div>
  }

  const { x, w, h, z, tilt } = card
  const cardY = card.y

  return (
    <>
      <div
        className="hero__card"
        style={{ left: u(x), top: u(cardY), width: u(w), zIndex: z, '--tilt': `${tilt}deg` }}
      >
        <div className="hero__product-stage">{image}</div>
      </div>
      {showShadow && (
        <motion.div
          className="hero__product-shadow"
          style={{
            /* centred by baking the offset into `left` itself, not a
               translateX(-50%) — Motion owns this element's `transform`
               (it's composing scaleX/scaleY into one), and an inline
               style transform would silently overwrite any translateX a
               stylesheet rule tried to contribute */
            left: u(x + w * 0.23),
            top: u(cardY + h + 4),
            width: u(w * 0.54),
            scaleX: shadowScale,
            scaleY: shadowScale,
            opacity: shadowOpacity,
          }}
        />
      )}
    </>
  )
}
