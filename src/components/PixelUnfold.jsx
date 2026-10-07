import { useEffect, useRef } from 'react'

/* ==================================================================
   PixelUnfold — the Internet Explorer mark resolving out of blocks.

   Spec: "the internet explorer icon should occur in a pixel unfold
   animation way ... make sure you replicate that image style and the
   background placement of it".

   So the asset is not redrawn: the existing aura/ie-logo.png is painted
   into a canvas at progressively finer block sizes, which reads as the mark
   unfolding from pixels into itself. The last level is the image at full
   resolution, so the settled frame is the artwork untouched.

   The canvas is sized from its own box each time it paints, so it follows
   the artboard scale and needs no px of its own. `play` is driven by the
   section's ScrollTrigger.
================================================================== */

const LEVELS = [40, 26, 16, 10, 6, 4, 2, 1]
const STEP_MS = 95

export default function PixelUnfold({ src, alt = '', className, play = false, reduced = false }) {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const done = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return undefined

    let timer
    let stopped = false

    const paint = (block) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      if (block <= 1) {
        ctx.imageSmoothingEnabled = true
        ctx.drawImage(img, 0, 0, w, h)
        return
      }
      const sw = Math.max(1, Math.round(w / block))
      const sh = Math.max(1, Math.round(h / block))
      const small = document.createElement('canvas')
      small.width = sw
      small.height = sh
      const sc = small.getContext('2d')
      if (!sc) return
      sc.imageSmoothingEnabled = true
      sc.drawImage(img, 0, 0, sw, sh)
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(small, 0, 0, w, h)
    }

    const run = () => {
      if (!img.complete || !img.naturalWidth) {
        img.addEventListener('load', run, { once: true })
        return
      }
      if (reduced || done.current) {
        paint(1)
        done.current = true
        return
      }
      let i = 0
      const tick = () => {
        if (stopped) return
        paint(LEVELS[i])
        i += 1
        if (i < LEVELS.length) timer = setTimeout(tick, STEP_MS)
        else done.current = true
      }
      tick()
    }

    if (play) run()
    else if (!done.current && img.complete && img.naturalWidth) paint(LEVELS[0])

    const onResize = () => paint(done.current ? 1 : LEVELS[0])
    window.addEventListener('resize', onResize)
    return () => {
      stopped = true
      clearTimeout(timer)
      window.removeEventListener('resize', onResize)
    }
  }, [play, reduced])

  return (
    <div className={className}>
      <img ref={imgRef} src={src} alt={alt} style={{ display: 'none' }} />
      <canvas ref={canvasRef} role="img" aria-label={alt} />
    </div>
  )
}
