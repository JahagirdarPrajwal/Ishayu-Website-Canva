import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'motion/react'
import './OrbitImages.css'

/* ==================================================================
   OrbitImages — the React Bits component from docs/animation-spec.md,
   trimmed to the one shape this project uses and taught about depth.

   Original by Dominik Koch (https://x.com/dominikkoch). Kept intact: the
   technique (an SVG path fed to `offsetPath`, one shared progress motion
   value, items spaced by `offsetDistance`) and the responsive mode, which is
   what makes it survive this project's canvas — it lays out in a fixed
   `baseWidth` coordinate space and scales the whole thing to the container,
   so the px inside never fight the root font-size (CLAUDE.md §2).

   Changed, so the ring can pass behind the subject and then in front of it:

   - The tilt is baked into the arc's x-axis-rotation rather than applied by
     a wrapper. A `transform` creates a stacking context, so a rotating
     wrapper sealed every tile into one layer — the subject could only sit
     wholly above or wholly below the lot. With the rotation in the path,
     the tiles and the subject are siblings and z-index can interleave them.
   - `subject` renders inside that same context at a fixed z-index; each tile
     takes a z-index either side of it, swapped at the half-way point of its
     trip round the ellipse.
   - The ring line is drawn as two arcs for the same reason: the far half
     behind the subject, the near half in front.
   - Separate item width and height, because the game tiles are landscape
     and the original assumes square items.
================================================================== */

const SUBJECT_Z = 10
const BEHIND_Z = 4
const FRONT_Z = 16

/* An ellipse as two arcs, tilted by `deg` about its own centre. Returned
   separately so each half can sit on its own side of the subject. */
function arcs(cx, cy, rx, ry, deg) {
  const t = (deg * Math.PI) / 180
  const dx = rx * Math.cos(t)
  const dy = rx * Math.sin(t)
  const a = [cx - dx, cy - dy]
  const b = [cx + dx, cy + dy]
  return {
    full: `M ${a[0]} ${a[1]} A ${rx} ${ry} ${deg} 1 0 ${b[0]} ${b[1]} A ${rx} ${ry} ${deg} 1 0 ${a[0]} ${a[1]}`,
    first: `M ${a[0]} ${a[1]} A ${rx} ${ry} ${deg} 1 0 ${b[0]} ${b[1]}`,
    second: `M ${b[0]} ${b[1]} A ${rx} ${ry} ${deg} 1 0 ${a[0]} ${a[1]}`,
  }
}

function OrbitItem({ item, index, total, path, itemW, itemH, progress, frontHalf }) {
  const offset = (index / total) * 100
  const phase = useTransform(progress, (p) => (((p + offset) % 100) + 100) % 100)
  const offsetDistance = useTransform(phase, (v) => `${v}%`)
  /* behind the subject on the far half of the ring, in front on the near
     half — this is what makes it read as an orbit rather than a backdrop */
  const zIndex = useTransform(phase, (v) =>
    (v >= 50) === frontHalf ? FRONT_Z : BEHIND_Z,
  )

  return (
    <motion.div
      className="orbit-item"
      style={{
        width: itemW,
        height: itemH,
        offsetPath: `path("${path}")`,
        offsetRotate: '0deg',
        offsetAnchor: 'center center',
        offsetDistance,
        zIndex,
      }}
    >
      <div className="orbit-item__inner">{item}</div>
    </motion.div>
  )
}

export default function OrbitImages({
  images = [],
  alts = [],
  baseWidth = 1000,
  radiusX = 430,
  radiusY = 150,
  rotation = -8,
  duration = 40,
  itemW = 150,
  itemH = 107,
  className = '',
  paused = false,
  showPath = false,
  pathColor = 'rgba(255, 255, 255, 0.45)',
  pathWidth = 3,
  pathDash,
  /* { src, alt, x, y, w } in baseWidth coordinates — the thing the ring
     goes around, rendered between the two halves of the orbit */
  subject,
  /* Which half of the trip round the path is the near side. For the arc
     pair built above the first half (phase < 50) runs along the bottom of
     the ellipse, i.e. nearest the viewer — verified by reading the tiles'
     screen y against their z-index. */
  frontHalf = false,
}) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(null)

  const c = baseWidth / 2
  const path = arcs(c, c, radiusX, radiusY, rotation)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return undefined
    const update = () => setScale(el.clientWidth / baseWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [baseWidth])

  const progress = useMotionValue(0)
  /* the ring turns forever, so it has to stop itself when motion is off —
     nothing else in the section is driving it */
  const reduced = useReducedMotion()

  useEffect(() => {
    if (paused || reduced) return undefined
    const controls = animate(progress, 100, {
      duration,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    })
    return () => controls.stop()
  }, [progress, duration, paused, reduced])

  const line = (d, z) => (
    <svg
      className="orbit-path"
      style={{ zIndex: z }}
      width="100%"
      height="100%"
      viewBox={`0 0 ${baseWidth} ${baseWidth}`}
    >
      <path
        d={d}
        fill="none"
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeDasharray={pathDash}
        strokeLinecap="round"
      />
    </svg>
  )

  return (
    <div ref={containerRef} className={`orbit-container ${className}`}>
      <div
        className="orbit-scaling"
        style={{
          width: baseWidth,
          height: baseWidth,
          transform: scale !== null ? `translate(-50%, -50%) scale(${scale})` : undefined,
          visibility: scale === null ? 'hidden' : undefined,
        }}
      >
        {showPath && line(frontHalf ? path.first : path.second, BEHIND_Z)}

        {subject && (
          <img
            className="orbit-subject"
            src={subject.src}
            alt={subject.alt || ''}
            draggable={false}
            style={{
              left: subject.x,
              top: subject.y,
              width: subject.w,
              zIndex: SUBJECT_Z,
            }}
          />
        )}

        {showPath && line(frontHalf ? path.second : path.first, FRONT_Z)}

        {images.map((src, i) => (
          <OrbitItem
            key={src}
            index={i}
            total={images.length}
            path={path.full}
            itemW={itemW}
            itemH={itemH}
            progress={progress}
            frontHalf={frontHalf}
            item={<img src={src} alt={alts[i] || ''} draggable={false} className="orbit-image" />}
          />
        ))}
      </div>
    </div>
  )
}
