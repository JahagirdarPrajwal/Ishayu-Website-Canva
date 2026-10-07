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

  /* ---- touch / pointer drag ----
     The rail has no native scroll — position is just `state.offset` fed
     through `layout()` — so dragging it means pausing the auto-drift,
     moving `state.offset` by hand while the pointer is down, then handing
     it back to a fresh infinite tween that continues from wherever the
     drag left off. `touch-action: pan-y` on the rail (see the .css) is
     what lets the browser keep vertical page scroll while this owns the
     horizontal gesture — a swipe never scrolls the page sideways and never
     fights a vertical scroll either. */
  const dragRef = useRef(null)
  const draggedRef = useRef(false)

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
    const rail = railRef.current
    if (!el || !rail) return undefined
    const state = { offset: 0 }
    let drift

    const render = () => layout(state.offset)

    const startDrift = (from) => {
      drift?.kill()
      if (reduced || !visible.current) return undefined
      drift = gsap.to(state, {
        offset: from + loop,
        duration: loop / speed,
        ease: 'none',
        repeat: -1,
        onUpdate: render,
      })
      driftRef.current = drift
      return drift
    }

    const ctx = gsap.context(() => {
      render()
      startDrift(state.offset)

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
          if (self.isActive) startDrift(state.offset)
          else drift?.pause()
          render()
        },
      })

      /* a swipe drags the rail directly; it never touches page scroll
         because touch-action: pan-y (see the .css) tells the browser this
         element only claims the horizontal axis.

         Critical: nothing here may run on a plain pointerdown. Calling
         setPointerCapture (or pausing the drift) unconditionally on down —
         the previous bug — retargets the *click* the browser synthesizes
         on pointerup to the capturing element (the rail) instead of
         whatever was actually under the finger, so the card's <a href>
         never navigates and the speaker button's own onClick never fires,
         no matter what stopPropagation it calls: that native capture is
         set (and that retargeting decided) before React's synthetic
         dispatch ever runs. So a gesture starts in a "pending" state that
         touches nothing, and only becomes a real drag — pausing the drift,
         capturing the pointer, marking draggedRef so the click that
         follows is suppressed — once the pointer has actually moved past a
         small threshold. A plain tap/click never crosses that threshold,
         so it reaches its target exactly as if this listener did not
         exist. */
      const unit = () => rail.clientWidth / 1366
      let pending = null // { pointerId, startX, startOffset, committed }

      const onDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        pending = { pointerId: e.pointerId, startX: e.clientX, startOffset: state.offset, committed: false }
      }
      const onMove = (e) => {
        if (!pending || pending.pointerId !== e.pointerId) return
        const dx = pending.startX - e.clientX
        if (!pending.committed) {
          if (Math.abs(dx) < 6) return
          pending.committed = true
          draggedRef.current = true
          drift?.pause()
          rail.setPointerCapture?.(e.pointerId)
        }
        state.offset = pending.startOffset + dx / unit()
        render()
      }
      const endDrag = (e) => {
        if (!pending || (e.pointerId !== undefined && pending.pointerId !== e.pointerId)) return
        if (pending.committed && visible.current) startDrift(state.offset)
        pending = null
      }

      rail.addEventListener('pointerdown', onDown)
      rail.addEventListener('pointermove', onMove)
      rail.addEventListener('pointerup', endDrag)
      rail.addEventListener('pointercancel', endDrag)
      dragRef.current = { onDown, onMove, endDrag }
    }, el)

    const onResize = () => render()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (dragRef.current) {
        rail.removeEventListener('pointerdown', dragRef.current.onDown)
        rail.removeEventListener('pointermove', dragRef.current.onMove)
        rail.removeEventListener('pointerup', dragRef.current.endDrag)
        rail.removeEventListener('pointercancel', dragRef.current.endDrag)
      }
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
              onClick={(e) => {
                /* a swipe that ended on top of a card should not also
                   follow its link — only a genuine tap/click does */
                if (draggedRef.current) {
                  e.preventDefault()
                  draggedRef.current = false
                  return
                }
                onItemClick?.(item, originalIdx, e)
              }}
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

