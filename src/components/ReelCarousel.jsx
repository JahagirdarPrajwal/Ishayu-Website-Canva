import { useCallback, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ReelCarousel.css'

gsap.registerPlugin(ScrollTrigger)

/* ==================================================================
   ReelCarousel — the panorama fork of React Bits' CircularCarousel.

   CLAUDE.md §7 lists CircularCarousel as fork-required: it builds `<img>`
   cards and these are reels. The fork keeps the one preset this design uses
   — panorama, the camera inside the ring — and drops the other three
   (cylinder, orbit, wheel) along with the props that only serve them.

   How the panorama is built: the reels sit on a rail at the pitch the Canva
   row used, and each card's 3D transform is derived every frame from how far
   its centre is from the frame's centre — turned away, pushed back and faded
   with distance. The front card is therefore flat, full size and in the same
   place the static row put it, and the composition only curves as cards
   travel out to the sides.

   Movement is a continuous drift plus a scroll-linked offset, so the ring
   turns on its own but also responds to the page. The rail carries two
   copies of the reel list and the offset wraps on one copy's width, so there
   is no seam and no snap.

   Playback: only the front reel plays. Everything else is paused, and the
   whole rail pauses when the section leaves the viewport, so six videos are
   never decoding at once.
================================================================== */

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export default function ReelCarousel({
  items = [],
  cardWidth = 270,
  aspectRatio = 270 / 464,
  gap = 34,
  /* design px the rail drifts per second. The ring turns on its own clock —
     it is deliberately NOT linked to page scroll, so it keeps going at the
     same rate whether you are moving or sitting still. */
  speed = 34,
  curve = 0.055, // degrees of turn per design px off centre
  depth = 0.42, // px pushed back per design px off centre
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

  const pitch = cardWidth + gap
  const loop = items.length * pitch
  const slots = items.length * 2 // two copies, so the wrap has no seam

  /* Lay every card out from the rail offset. Transform and opacity only — no
     layout property is touched, so this is cheap enough to run per frame. */
  const layout = useCallback(
    (offset) => {
      const rail = railRef.current
      if (!rail) return
      const half = rail.clientWidth / 2
      const unit = rail.clientWidth / 1366 // design px -> live px
      /* anything within this of the middle is on screen and worth playing */
      const span = 1366 / 2 + cardWidth
      for (let i = 0; i < slots; i += 1) {
        const el = cardRefs.current[i]
        if (!el) continue
        // wrap into a window centred on the frame
        let x = (i * pitch - offset) % loop
        if (x < 0) x += loop
        if (x > loop / 2) x -= loop
        const centre = x * unit + half
        const d = centre - half // live px from the middle
        const dd = d / unit // back to design px
        const t = clamp(Math.abs(dd) / (loop / 2), 0, 1)
        el.style.transform =
          `translate3d(${centre - (cardWidth * unit) / 2}px,0,${-Math.abs(dd) * depth * unit}px)` +
          ` rotateY(${-dd * curve}deg)` +
          ` scale(${frontScale + (sideScale - frontScale) * t})`
        el.style.opacity = String(1 - fade * t)
        el.style.zIndex = String(1000 - Math.round(Math.abs(dd)))

        /* Every reel you can see keeps playing, not just the one at the
           front — the ring should look alive all the way across. Only the
           copies that have wrapped off screen are paused, so the decoder
           count stays at what is actually visible. Driven straight off the
           element rather than through state, so this costs no re-renders. */
        const v = videoRefs.current[i]
        if (v) {
          const want = Math.abs(dd) < span && visible.current && !reducedRef.current
          if (want && v.paused) v.play().catch(() => {})
          else if (!want && !v.paused) v.pause()
        }
      }
    },
    [slots, pitch, loop, cardWidth, curve, depth, frontScale, sideScale, fade],
  )

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return undefined
    const state = { offset: 0 }
    let drift

    const render = () => layout(state.offset)

    const ctx = gsap.context(() => {
      render()
      if (!reduced) {
        /* the ring's own clock — nothing here reads scroll position */
        drift = gsap.to(state, {
          offset: loop,
          duration: loop / speed,
          ease: 'none',
          repeat: -1,
          onUpdate: render,
        })
      }
      /* The only thing scroll decides is whether the section is on screen,
         so the rail and its videos can rest while it is not. */
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          visible.current = self.isActive
          if (!self.isActive) videoRefs.current.forEach((v) => v && v.pause())
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
      videoRefs.current.forEach((v) => v && v.pause())
    }
  }, [layout, loop, speed, reduced])

  return (
    <div
      className={`reels ${className}`}
      ref={root}
      style={{ perspective: `${perspective}px` }}
    >
      <div className="reels__rail" ref={railRef}>
        {Array.from({ length: slots }, (_, i) => {
          const item = items[i % items.length]
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
              onClick={(e) => onItemClick?.(item, i % items.length, e)}
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
                muted
                loop
                playsInline
                preload="metadata"
                /* nudge off zero so a frame is actually decoded — a paused
                   video that has never been seeked paints as a black card */
                onLoadedMetadata={(e) => {
                  if (e.currentTarget.currentTime === 0) e.currentTarget.currentTime = 0.04
                }}
                aria-label={item.title}
                tabIndex={-1}
              />
            </a>
          )
        })}
      </div>
    </div>
  )
}
