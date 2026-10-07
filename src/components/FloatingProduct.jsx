import Levitate from './Levitate.jsx'

/* ==================================================================
   One pack shot in the Better Choice row.

   Spec: the packs "come from below or pop up and should be on screen
   levitating up and down slowly and normal levitation and not very big".

   GSAP drives the rise on the outer wrapper when the row scrolls in;
   Levitate owns the perpetual hover on the inner one, so the two libraries
   never write to the same transform (the same split as the shelf objects in
   Part 2).

   The amplitude is a share of each pack's own height, picked so all four
   travel roughly the same 13 design px however tall or wide they are — the
   wide bar would barely move on a percentage that suits the tall pouches.
   Durations are deliberately uneven so the row never breathes in unison.
================================================================== */
export default function FloatingProduct({ src, alt, x, y, w, amp, duration, delay }) {
  return (
    <div className="better__product" style={{ '--x': x, '--y': y, '--w': w }}>
      <Levitate className="better__product-float" amp={amp} duration={duration} delay={delay}>
        <img src={src} alt={alt} draggable={false} />
      </Levitate>
    </div>
  )
}
