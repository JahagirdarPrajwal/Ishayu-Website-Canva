import TactileButton from './originkit/ui/tactile-button.tsx'
import { useCanvasScale } from '../hooks/useCanvasScale.js'

/* ==================================================================
   Hero nav pill — the OriginKit tactile button, dressed as the approved
   pill and taught to scale.

   Two things had to be reconciled (CLAUDE.md §8.9, §10):

   1. The button sizes everything in literal px — padding, the base depth,
      the press offsets. Under this project's canvas (1rem === 100 artboard
      px) a px depth would stay 5px on a 4K monitor while the pill itself
      grew to twice its size. So the depth is computed from the live scale
      factor; the parts that *can* be expressed in rem (type size, border,
      the box itself) are, and the radius the component derives from its own
      measured box is already scale-proof.

   2. All five pills carry the green cap and its darker ledge, and the
      labels are set in caps — Prajwal's call, so the hero no longer matches
      the export's one-green-four-outlined nav. The pill boxes themselves
      are still the measured ones, so the nav sits exactly where it did.

   Colours are passed as literals rather than var(): the component animates
   them through Motion, which cannot interpolate a CSS custom property.
================================================================== */

const SINK = 5 // design px the cap travels on press

const GREEN = '#8acd01' // --green-pill
const GREEN_HOVER = '#9bdd17'
const GREEN_BASE = '#5f9000' // the ledge the cap sinks onto
const WHITE = '#ffffff'

export default function NavPill({ label, href = '#' }) {
  const scale = useCanvasScale()
  const sink = Math.max(1, Math.round(SINK * scale))

  return (
    <TactileButton
      label={label}
      link={href}
      rounded={100}
      padding="0px"
      fill={GREEN}
      textColor={WHITE}
      hover={{ fill: GREEN_HOVER, textColor: WHITE }}
      base={{ color: GREEN_BASE, offsetX: 0, offsetY: sink }}
      border={{ border: `0.014rem solid ${GREEN}` }}
      transition={{ type: 'spring', stiffness: 520, damping: 34, mass: 0.7 }}
      font={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontFamily: 'inherit',
        /* set down from 0.2rem so the longest label, GET IN TOUCH, still
           fits the pill width measured off the artboard once it is caps */
        fontSize: '0.165rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        textDecoration: 'none',
      }}
      /* display:flex overrides the component's own inline-block wrapper: it
         nests an inline-flex inside an inline-block, and the baseline of
         each would drop the cap below the slot the artboard measured. */
      style={{ padding: 0, width: '100%', height: '100%', display: 'flex' }}
    />
  )
}
