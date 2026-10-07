import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import './Loader.css'

/* ==================================================================
   Loading screen.

   Spec (docs/animation-spec.md): "a beige offwhite page will come first as
   everything loads in the background and on that beige off white huge
   ishayu in green font ... and as soon as it loads up this page will go up
   in a smooth motion".

   Notes on the implementation:
   - This is an *overlay*, not a gate. App renders the whole site underneath
     from the first frame, so the browser is decoding images and laying the
     artboard out while the panel is still up, and the hero is never shown
     half-dressed.
   - Readiness is `window.load` (every image decoded) plus `document.fonts.
     ready`, because the recreation's line breaks depend on Archivo being
     resident. Both are raced against MAX_WAIT so one stalled or missing
     asset can never trap the loader — it is a cover for a slow network, not
     a substitute for fixing an asset (hence the console warning).
   - MIN_VISIBLE stops the panel strobing on a warm cache.
   - The panel leaves upward on a long ease-in-out; the wordmark leaves
     faster than the panel so the two separate slightly. That parallax is
     what keeps it from reading as a plain CSS fade.
   - onExitStart fires as the panel begins to move, which is what hands the
     entrance over to the hero.
================================================================== */

const MIN_VISIBLE = 1100 // ms — long enough to actually read the wordmark
const MAX_WAIT = 5000 // ms — hard cap; a failed asset must not trap us

const WORD = 'ISHAYU'

const PANEL_EASE = [0.76, 0, 0.24, 1]

export default function Loader({ onExitStart }) {
  const [done, setDone] = useState(false)
  const startedAt = useRef(typeof performance !== 'undefined' ? performance.now() : 0)
  const reduced = useReducedMotion()

  useEffect(() => {
    let settled = false
    let capTimer
    let holdTimer

    const finish = (reason) => {
      if (settled) return
      settled = true
      if (reason === 'timeout') {
        console.warn(
          '[loader] assets still pending after %dms — dismissing anyway',
          MAX_WAIT,
        )
      }
      const elapsed = performance.now() - startedAt.current
      holdTimer = setTimeout(
        () => setDone(true),
        Math.max(0, MIN_VISIBLE - elapsed),
      )
    }

    const loaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', resolve, { once: true })
    })
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve()

    Promise.all([loaded, fonts]).then(() => finish('ready'), () => finish('ready'))
    capTimer = setTimeout(() => finish('timeout'), MAX_WAIT)

    return () => {
      clearTimeout(capTimer)
      clearTimeout(holdTimer)
    }
  }, [])

  /* The panel starting to move *is* the handoff. */
  useEffect(() => {
    if (done) onExitStart?.()
  }, [done, onExitStart])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          aria-hidden="true"
          initial={false}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.25, ease: 'linear' } }
              : { y: '-100%', transition: { duration: 0.95, ease: PANEL_EASE } }
          }
        >
          <motion.div
            className="loader__word"
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0.2 } }
                : {
                    y: '-55%',
                    opacity: 0,
                    transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
                  }
            }
          >
            {WORD.split('').map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                className="loader__letter"
                initial={reduced ? false : { y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: 0.06 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
