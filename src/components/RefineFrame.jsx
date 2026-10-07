import { useEffect, useRef } from 'react'
import './RefineFrame.css'

/* ==================================================================
   RefineFrame — the React Bits component from docs/animation-spec.md.

   What is kept: the refinement itself. The image is pre-rendered at a ladder
   of mosaic block sizes and a resolving front sweeps down it, so the picture
   comes in coarse and sharpens behind a soft edge, with a glint riding the
   front.

   What is removed, deliberately: every part of the AI-generation interface.
   No status chip, no Queued/Generating/Refining/Ready/Failed label, no retry
   pill, no spinner — and so no @hugeicons dependency, which the original
   pulls in only to draw those. `showStatus` is accepted and ignored.

   Resilience — the reason this is structured the way it is:

   The real <img> is always in the DOM and always laid out. The canvas is an
   overlay that is transparent until it has successfully built and painted at
   least once, and fades back out when the resolve finishes. So the canvas is
   purely additive: if the image has not decoded, if the element has no box
   yet, if a context cannot be had, if anything at all goes wrong, the
   photograph is still on screen. Nothing in here can leave the frame empty
   or half-drawn — which is what the earlier version did on a cold load.
================================================================== */

const LEVELS = [44, 28, 18, 11, 7, 4, 2, 1]
const MIN_BOX = 8 // below this the frame has not been laid out yet
const EDGE = 34 // px of soft transition at the resolving front
const STRIPS = 14
const HANDOFF = 260 // ms the canvas takes to hand back to the <img>

export default function RefineFrame({
  src,
  alt = '',
  aspectRatio = '4 / 3',
  radius = 16,
  duration = 1100,
  sweep = true,
  play = false,
  reduced = false,
  className = '',
}) {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const state = useRef({ levels: [], key: '', w: 0, h: 0, glint: null, raf: 0, t0: 0, p: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return undefined
    const s = state.current
    let stopped = false

    const show = (on) => {
      canvas.style.opacity = on ? '1' : '0'
    }

    const build = () => {
      try {
        /* Bail until the frame actually has a box. Building at 0 and caching
           that under the key is what left the picture blank on some loads —
           the ladder was a single pixel and nothing ever asked for it again. */
        if (canvas.clientWidth < MIN_BOX || canvas.clientHeight < MIN_BOX) return false
        if (!img.naturalWidth) return false
        const dpr = Math.min(2, window.devicePixelRatio || 1)
        const W = Math.max(1, Math.round(canvas.clientWidth * dpr))
        const H = Math.max(1, Math.round(canvas.clientHeight * dpr))
        const key = `${img.currentSrc}|${W}x${H}`
        if (s.key === key) return true
        const probe = canvas.getContext('2d')
        if (!probe) return false
        s.key = key
        s.w = W
        s.h = H
        canvas.width = W
        canvas.height = H
        const iw = img.naturalWidth
        const ih = img.naturalHeight
        const cover = Math.max(W / iw, H / ih)
        const sw = W / cover
        const sh = H / cover
        const sx = (iw - sw) / 2
        const sy = (ih - sh) / 2
        const g = probe.createLinearGradient(0, 0, W, 0)
        for (const [at, a] of [[0, 0], [0.2, 0.7], [0.5, 1], [0.8, 0.7], [1, 0]]) {
          g.addColorStop(at, `rgba(255,255,255,${a})`)
        }
        s.glint = g
        s.levels = LEVELS.map((block) => {
          const b = block === 1 ? 1 : Math.max(2, Math.round(block * dpr))
          const full = document.createElement('canvas')
          full.width = W
          full.height = H
          const fc = full.getContext('2d')
          if (!fc) return full
          if (b === 1) {
            fc.imageSmoothingEnabled = true
            fc.imageSmoothingQuality = 'high'
            fc.drawImage(img, sx, sy, sw, sh, 0, 0, W, H)
            return full
          }
          const small = document.createElement('canvas')
          small.width = Math.max(1, Math.round(W / b))
          small.height = Math.max(1, Math.round(H / b))
          const sc = small.getContext('2d')
          if (sc) {
            sc.imageSmoothingEnabled = true
            sc.imageSmoothingQuality = 'high'
            sc.drawImage(img, sx, sy, sw, sh, 0, 0, small.width, small.height)
          }
          fc.imageSmoothingEnabled = false
          fc.drawImage(small, 0, 0, W, H)
          return full
        })
        return true
      } catch {
        // any failure here just means the <img> underneath stays visible
        s.key = ''
        return false
      }
    }

    /* p 0 → 1: the front travels down the frame, finer levels behind it */
    const paint = (p) => {
      s.p = p
      const ctx = canvas.getContext('2d')
      if (!ctx || !s.levels.length) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const n = s.levels.length - 1
      const L = p * n
      const i = Math.min(n, Math.floor(L + 1e-6))
      const frac = L - i
      ctx.globalAlpha = 1
      ctx.drawImage(s.levels[i], 0, 0)
      if (i < n && frac > 0) {
        const edge = EDGE * dpr
        const front = frac * (s.h + edge) - edge / 2
        const top = Math.max(0, Math.floor(front - edge / 2))
        if (top > 0) ctx.drawImage(s.levels[i + 1], 0, 0, s.w, top, 0, 0, s.w, top)
        const sh = edge / STRIPS
        for (let k = 0; k < STRIPS; k += 1) {
          const y = front - edge / 2 + k * sh
          if (y + sh <= 0 || y >= s.h) continue
          const t = 1 - (k + 0.5) / STRIPS
          ctx.globalAlpha = t * t * (3 - 2 * t)
          const y0 = Math.max(0, y)
          const h0 = Math.min(s.h, y + sh) - y0
          if (h0 > 0) ctx.drawImage(s.levels[i + 1], 0, y0, s.w, h0, 0, y0, s.w, h0)
        }
        ctx.globalAlpha = 1
        if (sweep && s.glint && front > 0 && front < s.h) {
          ctx.fillStyle = s.glint
          ctx.globalAlpha = 0.16
          ctx.fillRect(0, front - 2 * dpr, s.w, 4 * dpr)
          ctx.globalAlpha = 1
        }
      }
      show(true)
    }

    const frame = (now) => {
      if (stopped) return
      if (!s.t0) s.t0 = now
      const p = Math.min(1, (now - s.t0) / duration)
      paint(p)
      if (p < 1) s.raf = requestAnimationFrame(frame)
      else {
        s.raf = 0
        // resolved: hand back to the real image underneath
        show(false)
      }
    }

    const start = () => {
      if (stopped) return
      if (!build()) {
        show(false) // nothing to draw yet — the <img> carries the frame
        return
      }
      if (reduced || !play) {
        if (play) show(false)
        else paint(0) // held at the coarse state until its cue
        return
      }
      s.t0 = 0
      cancelAnimationFrame(s.raf)
      s.raf = requestAnimationFrame(frame)
    }

    /* Three things can make the frame paintable, in any order: the image
       decoding, the element getting a box, and `play` turning on. Watch all
       of them rather than assuming the first attempt succeeds. */
    const onLoad = () => start()
    img.addEventListener('load', onLoad)
    if (img.decode) img.decode().then(start, () => {})

    const ro = new ResizeObserver(() => {
      if (stopped) return
      const had = s.key
      if (!build()) return
      if (had !== s.key) paint(s.raf ? s.p : play ? 1 : 0)
    })
    ro.observe(canvas)

    start()

    return () => {
      stopped = true
      cancelAnimationFrame(s.raf)
      s.raf = 0
      img.removeEventListener('load', onLoad)
      ro.disconnect()
    }
  }, [play, reduced, duration, sweep])

  return (
    <div className={`refineframe ${className}`} style={{ aspectRatio, borderRadius: radius }}>
      <img ref={imgRef} className="refineframe__img" src={src} alt={alt} />
      <canvas
        ref={canvasRef}
        className="refineframe__canvas"
        aria-hidden="true"
        style={{ transitionDuration: `${HANDOFF}ms` }}
      />
    </div>
  )
}
