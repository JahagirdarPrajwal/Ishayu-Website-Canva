import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import './FoldText.css'

/* ==================================================================
   FoldText — the React Bits component from docs/animation-spec.md.

   Each panel hangs from a hinge edge, folded back in 3D with a crease
   shadow across it, and swings flat in a staggered cascade.

   Adapted in three places:

   - The original hard-sets fontSize / fontWeight / color on its root, which
     would override the type this project has already measured. Those props
     still work but default to `inherit`, so it sits inside the existing
     typography rather than replacing it.
   - `play` replaces the component's own scroll trigger, so the section's
     GSAP timeline stays the single source of *when* (CLAUDE.md §7). The
     panels are folded away on mount rather than when `play` arrives —
     otherwise the text sits there in plain view and then animates, which
     reads as it appearing twice.
   - `indexOffset` continues one cascade across several instances, so two
     lines run as one sequence of words instead of both starting at once.

   Whitespace is rendered as plain text, never as a panel, so the stagger
   counts words and not the gaps between them.
================================================================== */

const HINGE = {
  top: { origin: 'center top', from: { rotateX: -92 } },
  bottom: { origin: 'center bottom', from: { rotateX: 92 } },
  left: { origin: 'left center', from: { rotateY: 92 } },
  right: { origin: 'right center', from: { rotateY: -92 } },
}

export default function FoldText({
  text = 'Design unfolds',
  splitBy = 'char',
  hinge = 'top',
  duration = 0.65,
  stagger = 0.045,
  ease = 'power3.out',
  perspective = 700,
  creaseShading = 0.55,
  play = false,
  reduced = false,
  indexOffset = 0,
  fontSize = 'inherit',
  fontWeight = 'inherit',
  color = 'inherit',
  className = '',
  style = {},
}) {
  const root = useRef(null)
  const cfg = HINGE[hinge] || HINGE.top

  /* tokens: strings render as-is, arrays are panels */
  const tokens = useMemo(() => {
    if (splitBy === 'line') return [[text]]
    if (splitBy === 'word') {
      return text.split(/(\s+)/).filter(Boolean).map((t) => (/^\s+$/.test(t) ? t : [t]))
    }
    return [...text].map((ch) => (/\s/.test(ch) ? ' ' : [ch]))
  }, [text, splitBy])

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('.foldtext__panel')
      const shades = el.querySelectorAll('.foldtext__crease')
      if (reduced) {
        gsap.set(items, { clearProps: 'all' })
        gsap.set(shades, { opacity: 0 })
        return
      }
      if (!play) {
        // folded away and waiting — not visible until its cue
        gsap.set(items, { ...cfg.from, opacity: 0 })
        gsap.set(shades, { opacity: creaseShading })
        return
      }
      /* fromTo, not to: the previous run's context revert undoes the armed
         folded state just before this effect runs, so a `to` would tween
         from flat to flat and every panel would simply appear at once. */
      gsap.fromTo(items, { ...cfg.from, opacity: 0 }, {
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
        delay: indexOffset * stagger,
        /* clear the 3D transform once flat, so the resting text is plain
           text again and nothing stays on its own composited layer */
        onComplete() {
          gsap.set(this.targets(), { clearProps: 'transform,opacity' })
        },
      })
      gsap.fromTo(
        shades,
        { opacity: creaseShading },
        { opacity: 0, duration, stagger, ease, delay: indexOffset * stagger },
      )
    }, el)
    return () => ctx.revert()
  }, [play, hinge, duration, stagger, ease, reduced, indexOffset, creaseShading])

  let n = 0
  return (
    <span
      ref={root}
      className={`foldtext ${className}`}
      style={{ perspective: `${perspective}px`, fontSize, fontWeight, color, ...style }}
    >
      {tokens.map((tok, i) =>
        Array.isArray(tok) ? (
          <span
            key={`p-${i}`}
            className="foldtext__panel"
            style={{ transformOrigin: cfg.origin }}
            data-i={n++}
          >
            {tok[0]}
            <span className="foldtext__crease" />
          </span>
        ) : (
          <span key={`s-${i}`}>{tok}</span>
        ),
      )}
    </span>
  )
}
