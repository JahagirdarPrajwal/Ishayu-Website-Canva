import { useEffect, useState } from 'react'

/* ------------------------------------------------------------------
   Live px-per-design-px factor.

   main.jsx keeps the root font-size at (contentWidth / 1366) * 100px, so
   1rem === 100 artboard px. Anything that has to be handed to a component
   in *real* px — the OriginKit tactile button sizes its padding, depth and
   offsets that way — must be multiplied by this, otherwise it stops
   growing with the artboard (CLAUDE.md §8.9).
------------------------------------------------------------------ */
const read = () =>
  parseFloat(getComputedStyle(document.documentElement).fontSize) / 100

export function useCanvasScale() {
  const [scale, setScale] = useState(read)

  useEffect(() => {
    const update = () => setScale(read())
    update() // the root size is set before mount, but re-read in case
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}
