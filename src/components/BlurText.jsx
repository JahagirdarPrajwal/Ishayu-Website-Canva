import { Children, cloneElement, isValidElement, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/* ==================================================================
   BlurText — fork of the React Bits component in docs/animation-spec.md.

   Why it had to be forked (CLAUDE.md §8.2): the original takes a plain
   `text` string and renders it into
   `<p style={{display:'flex', flexWrap:'wrap'}}>`. Every heading in this
   project is absolutely positioned, `white-space: nowrap`, negatively
   tracked, and wraps a nested `<span class="hl">` that carries a measured
   yellow band. A flex root throws all of that away.

   What changed:
   - takes **children**, not a string. The React tree is walked and only
     text nodes are split, so nested elements (`.hl`, the squiggle span)
     come through untouched.
   - the root stays `display: inline`, so the heading keeps its own
     positioning, tracking and nowrap.
   - inter-word spaces stay as plain text nodes in the inline flow rather
     than becoming padding on a flex child, so the run measures exactly as
     it did before splitting — the §9 width check depends on this.
   - playback is driven by a `play` prop. Part 1 is the first viewport and
     is handed off by the loader, so an IntersectionObserver would be wrong;
     `observe` is still available for the scroll-triggered Parts.
   - once the reveal finishes the per-word spans are dropped entirely and
     the original children are rendered back. No filter, no will-change and
     no transform survive into the resting state, so the settled render is
     identical to the approved static build.
================================================================== */

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))])
  const keyframes = {}
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])]
  })
  return keyframes
}

/* Walk a React tree, handing every whitespace-delimited word to `wrap`.
   Whitespace itself is returned as-is so it stays in the inline flow. */
function splitTree(node, wrap, path = 'w') {
  if (node === null || node === undefined || typeof node === 'boolean') return node

  if (typeof node === 'string' || typeof node === 'number') {
    const tokens = String(node).split(/(\s+)/).filter(Boolean)
    return tokens.map((token, i) =>
      /^\s+$/.test(token) ? token : wrap(token, `${path}-${i}`),
    )
  }

  if (Array.isArray(node)) {
    return Children.map(node, (child, i) => splitTree(child, wrap, `${path}-${i}`))
  }

  if (isValidElement(node)) {
    if (node.props?.children === undefined) return node
    return cloneElement(node, {
      children: splitTree(node.props.children, wrap, `${path}-c`),
    })
  }

  return node
}

export default function BlurText({
  children,
  play = false,
  delay = 150,
  direction = 'top',
  stepDuration = 0.35,
  /* Lets a heading split across several instances keep one running word
     count, so the stagger does not restart at each one. */
  indexOffset = 0,
  easing = (t) => t,
  onComplete,
  reduced = false,
  className,
  style,
}) {
  const [settled, setSettled] = useState(false)
  /* Read the preference here rather than relying on the caller: a word held
     at opacity 0 waiting for a `play` that a reduced-motion session never
     sends would simply lose the heading. */
  const prefersReduced = useReducedMotion()

  const from = useMemo(
    () =>
      direction === 'top'
        ? { filter: 'blur(10px)', opacity: 0, y: '-45%' }
        : { filter: 'blur(10px)', opacity: 0, y: '45%' },
    [direction],
  )

  const to = useMemo(
    () => [
      { filter: 'blur(5px)', opacity: 0.5, y: direction === 'top' ? '5%' : '-5%' },
      { filter: 'blur(0px)', opacity: 1, y: '0%' },
    ],
    [direction],
  )

  const root = { display: 'inline', ...style }

  /* Resting render: the original children, no wrappers of our own beyond a
     layout-neutral inline span. This is what the fidelity check sees. */
  if (settled || reduced || prefersReduced) {
    return (
      <span className={className} style={root}>
        {children}
      </span>
    )
  }

  const keyframes = buildKeyframes(from, to)
  const stepCount = to.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => i / (stepCount - 1))

  /* Every word shares the same duration, so the last one to start is the
     last to finish — one completion callback is enough. Counting up front
     means the tree only has to be walked once. */
  const total = countWords(children)
  const finish = () => {
    setSettled(true)
    onComplete?.()
  }

  let index = 0
  const content = splitTree(children, (token, key) => {
    const i = index++
    return (
      <motion.span
        key={key}
        style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
        initial={from}
        animate={play ? keyframes : from}
        transition={{
          duration: totalDuration,
          times,
          ease: easing,
          delay: ((i + indexOffset) * delay) / 1000,
        }}
        onAnimationComplete={play && i === total - 1 ? finish : undefined}
      >
        {token}
      </motion.span>
    )
  })

  return (
    <span className={className} style={root}>
      {content}
    </span>
  )
}

/* How many whitespace-delimited words the tree holds. */
function countWords(node) {
  if (node === null || node === undefined || typeof node === 'boolean') return 0
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).split(/\s+/).filter(Boolean).length
  }
  if (Array.isArray(node)) return node.reduce((n, child) => n + countWords(child), 0)
  if (isValidElement(node)) return countWords(node.props?.children)
  return 0
}
