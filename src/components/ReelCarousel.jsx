import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ReelCarousel.css'

gsap.registerPlugin(ScrollTrigger)

/* ==================================================================
   ReelCarousel — the panorama fork of React Bits' CircularCarousel.

   Each card is an <a> linking to its Instagram reel. A speaker button
   in the top-left corner toggles audio on/off for that individual
   video (stopPropagation prevents it from following the link). A
   translucent play icon sits in the centre as a visual cue that the
   card is tappable / clickable.

   Movement is a continuous drift on its own clock, deliberately not
   linked to page scroll. The rail carries two copies of the reel list
   and wraps seamlessly. All visible videos auto-play muted; only the
   speaker button can unmute a specific card.
================================================================== */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/* Inline SVG icons — Instagram style speaker with crisp rounded cone and cross / waves */
const SpeakerOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    <line x1="21" y1="9.5" x2="16" y2="14.5" />
    <line x1="16" y1="9.5" x2="21" y2="14.5" />
  </svg>
)

const SpeakerOnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M19 5.5a9.5 9.5 0 0 1 0 13" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
)

export default function ReelCarousel({
  items = [],
  cardWidth = 270,
  aspectRatio = 270 / 464,
  gap = 34,
  speed = 60,
  curve = 0.055,
  depth = 0.42,
  frontScale = 1,
  sideScale = 0.86,
  fade = 0.45,
  perspective = 1800,
  cornerRadius = 12,
  onItemClick,
  reduced = false,
  className = '',
}) {
  const root = useRef(null)
  const railRef = useRef(null)
  const cardRefs = useRef([])
  const videoRefs = useRef([])
  const visible = useRef(true)
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced
  const driftRef = useRef(null)

  /* Track which slot is currently unmuted (at most one at a time).
     null means all muted. */
  const [unmutedSlot, setUnmutedSlot] = useState(null)
  const unmutedSlotRef = useRef(unmutedSlot)
  unmutedSlotRef.current = unmutedSlot

  const pitch = cardWidth + gap
  const slots = items.length * 2
  const loop = slots * pitch

  /* Sync audio muted property directly on video elements whenever unmutedSlot changes */
  useEffect(() => {
    for (let i = 0; i < slots; i += 1) {
      const v = videoRefs.current[i]
      if (!v) continue
      if (i === unmutedSlot) {
        v.muted = false
        v.volume = 1
        if (v.paused) v.play().catch(() => {})
      } else {
        v.muted = true
      }
    }
  }, [unmutedSlot, slots])

  /* ---- layout (runs every frame) ---- */
  const layout = useCallback(
    (offset) => {
      const rail = railRef.current
      if (!rail) return
      const half = rail.clientWidth / 2
      const unit = rail.clientWidth / 1366
      const span = 1366 / 2 + cardWidth
      for (let i = 0; i < slots; i += 1) {
        const el = cardRefs.current[i]
        if (!el) continue
        let x = (i * pitch - offset) % loop
        if (x < 0) x += loop
        if (x > loop / 2) x -= loop
        const centre = x * unit + half
        const d = centre - half
        const dd = d / unit
        const t = clamp(Math.abs(dd) / (loop / 2), 0, 1)
        el.style.transform =
          `translate3d(${centre - (cardWidth * unit) / 2}px,0,${-Math.abs(dd) * depth * unit}px)` +
          ` rotateY(${-dd * curve}deg)` +
          ` scale(${frontScale + (sideScale - frontScale) * t})`
        el.style.opacity = String(1 - fade * t)
        el.style.zIndex = String(1000 - Math.round(Math.abs(dd)))

        const v = videoRefs.current[i]
        if (v) {
          const want = Math.abs(dd) < span && visible.current && !reducedRef.current
          if (want && v.paused) v.play().catch(() => {})
          else if (!want && !v.paused) {
            v.pause()
            if (unmutedSlotRef.current === i) {
              setUnmutedSlot(null)
            }
          }
        }
      }
    },
    [slots, pitch, loop, cardWidth, curve, depth, frontScale, sideScale, fade],
  )

  /* ---- GSAP drift + visibility ---- */
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined
    const state = { offset: 0 }
    let drift

    const render = () => layout(state.offset)

    const ctx = gsap.context(() => {
      render()
      if (!reduced) {
        drift = gsap.to(state, {
          offset: loop,
          duration: loop / speed,
          ease: 'none',
          repeat: -1,
          onUpdate: render,
        })
        driftRef.current = drift
      }
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          visible.current = self.isActive
          if (!self.isActive) {
            videoRefs.current.forEach((v) => {
              if (v) {
                v.pause()
                v.muted = true
              }
            })
            setUnmutedSlot(null)
          }
          if (drift) (self.isActive ? drift.play() : drift.pause())
          render()
        },
      })
    }, el)

    const onResize = () => render()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
      driftRef.current = null
      videoRefs.current.forEach((v) => v && v.pause())
    }
  }, [layout, loop, speed, reduced])

  /* ---- speaker toggle handler ---- */
  const handleSpeaker = (e, slotIdx) => {
    /* Stop the click from following the <a> link or triggering parent handlers */
    e.preventDefault()
    e.stopPropagation()

    const next = unmutedSlot === slotIdx ? null : slotIdx
    setUnmutedSlot(next)

    for (let i = 0; i < slots; i += 1) {
      const v = videoRefs.current[i]
      if (!v) continue
      if (i === next) {
        v.muted = false
        v.volume = 1
        if (v.paused) v.play().catch(() => {})
      } else {
        v.muted = true
      }
    }
  }

  /* ---- render ---- */
  return (
    <div
      className={`reels ${className}`}
      ref={root}
      style={{ perspective: `${perspective}px` }}
    >
      <div className="reels__rail" ref={railRef}>
        {Array.from({ length: slots }, (_, i) => {
          const originalIdx = i % items.length
          const item = items[originalIdx]
          const isUnmuted = unmutedSlot === i
          return (
            <a
              key={`${item.href}-${i}`}
              className="reels__card"
              ref={(n) => {
                cardRefs.current[i] = n
              }}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title} — open this reel on Instagram`}
              onClick={(e) => onItemClick?.(item, originalIdx, e)}
              onMouseEnter={() => {
                if (driftRef.current && !driftRef.current.paused()) {
                  driftRef.current.pause()
                }
              }}
              onMouseLeave={() => {
                if (driftRef.current && visible.current) {
                  driftRef.current.play()
                }
              }}
              style={{
                width: `${(cardWidth / 1366) * 100}%`,
                aspectRatio: String(aspectRatio),
                borderRadius: `${(cornerRadius / 1366) * 100 * (1366 / cardWidth)}%`,
              }}
            >
              <video
                ref={(n) => {
                  videoRefs.current[i] = n
                }}
                src={item.src}
                muted={!isUnmuted}
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  if (e.currentTarget.currentTime === 0) e.currentTarget.currentTime = 0.04
                }}
                aria-label={item.title}
                tabIndex={-1}
              />

              {/* Speaker toggle — top-left corner */}
              <button
                type="button"
                className={`reels__speaker ${isUnmuted ? 'reels__speaker--active' : ''}`}
                aria-label={isUnmuted ? 'Mute audio' : 'Unmute audio'}
                onClick={(e) => handleSpeaker(e, i)}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {isUnmuted ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
              </button>

              {/* Translucent play icon — centre of card */}
              <span className="reels__play" aria-hidden="true">
                <PlayIcon />
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

