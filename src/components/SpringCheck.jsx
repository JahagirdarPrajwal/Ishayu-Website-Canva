import { useEffect, useRef, useState } from 'react'
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import './SpringCheck.css'

/* ==================================================================
   SpringCheck — the React Bits component from docs/animation-spec.md.

   Two adaptations:

   1. The original imports `Tick02Icon` from @hugeicons/core-free-icons for
      one glyph. That dependency is not in the project and is not being added
      for a single tick, so the tick is drawn inline as an SVG path and
      stroke-dashoffset animates it on. Same mark, no package.
   2. `boxSize` / `fontSize` accept a CSS length as well as a number. The
      note card sizes everything in cqw against its own width (CLAUDE.md §2),
      and a px number there would stop scaling with the artboard.

   Everything else is as specified: the fill swells out of the box centre on
   a spring, the tick is drawn over it, and the rule wipes the label a beat
   later (`strikeLag`).
================================================================== */

const len = (v) => (typeof v === 'number' ? `${v}px` : v)

export default function SpringCheck({
  label = 'Ship the build',
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  color = '#ffffff',
  fillColor = '#ffffff',
  checkColor = '#0b0b0f',
  boxSize = 28,
  boxRadius = 9,
  fontSize = 18,
  bounce = 0.2,
  strikeLag = 0.12,
  doneOpacity = 0.42,
  strike = 'left',
  ariaLabel,
  className = '',
}) {
  const controlled = checked !== undefined
  const [inner, setInner] = useState(defaultChecked)
  const on = controlled ? checked : inner

  const fill = useMotionValue(on ? 1 : 0)
  const rule = useMotionValue(on ? 1 : 0)
  const fillRef = useRef(null)
  const tickRef = useRef(null)
  const ruleRef = useRef(null)
  const reduced = useReducedMotion()

  useMotionValueEvent(fill, 'change', (v) => {
    if (fillRef.current) fillRef.current.style.transform = `scale(${v})`
    if (tickRef.current) {
      const p = Math.max(0, Math.min(1, (v - 0.45) / 0.55))
      tickRef.current.style.strokeDashoffset = String(1 - p)
      tickRef.current.style.opacity = String(p)
    }
  })
  useMotionValueEvent(rule, 'change', (v) => {
    if (ruleRef.current) ruleRef.current.style.transform = `scaleX(${v})`
  })

  useEffect(() => {
    const to = on ? 1 : 0
    if (reduced) {
      fill.set(to)
      rule.set(to)
      return undefined
    }
    const a = animate(fill, to, { type: 'spring', bounce, duration: 0.65 })
    const b = animate(rule, to, {
      type: 'spring',
      bounce: 0.1,
      duration: 0.55,
      delay: on ? strikeLag : 0,
    })
    return () => {
      a.stop()
      b.stop()
    }
  }, [on, bounce, strikeLag, reduced, fill, rule])

  const toggle = () => {
    if (disabled) return
    const next = !on
    if (!controlled) setInner(next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={toggle}
      className={`springcheck ${on ? 'is-on' : ''} ${className}`}
      style={{
        '--sc-color': color,
        '--sc-fill': fillColor,
        '--sc-check': checkColor,
        '--sc-box': len(boxSize),
        '--sc-radius': len(boxRadius),
        '--sc-font': len(fontSize),
        '--sc-done': doneOpacity,
      }}
    >
      <span className="springcheck__box">
        <span className="springcheck__fill" ref={fillRef} />
        <svg className="springcheck__tick" viewBox="0 0 24 24" aria-hidden="true">
          <path
            ref={tickRef}
            d="M5 12.5 L10 17.5 L19 7"
            fill="none"
            stroke="var(--sc-check)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
      </span>
      <span className="springcheck__label">
        {label}
        {strike !== 'none' && (
          <span className={`springcheck__rule springcheck__rule--${strike}`} ref={ruleRef} />
        )}
      </span>
    </button>
  )
}
