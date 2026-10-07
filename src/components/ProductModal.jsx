import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import './ProductModal.css'

/* ==================================================================
   ProductModal — the single-product detail overlay.

   Structure rebuilt against "Screenshot ref.png" (the HAAN "Apple a Day"
   product page) — a bordered, connected editorial grid, not a card-style
   popup: a full-height image on the left, and the right half split by
   thin rules into a name/price cell on top and two cells below it
   (ingredients | purchase actions). See ProductModal.css for exactly how
   that grid is built. Content is deliberately short so nothing scrolls
   (modal-refinement brief §13) — if more product copy arrives later,
   that's a reason to revisit this, not something to design around now.

   Opens over the existing Product Page, which stays mounted and visible
   behind it. Built with `motion/react` + AnimatePresence, the same
   primitive Loader.jsx already uses for its own show/hide overlay.

   One product at a time: the content is keyed on `product.key`, so every
   field (quantity, purchase option, gallery index) resets the instant a
   different product opens.
================================================================== */

const PLACEHOLDER_BLURB = 'Made the Ishayu way — simple, honest ingredients.'

function QuantityStepper({ value, onChange }) {
  return (
    <div className="modal__qty">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))}>
        −
      </button>
      <span>{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  )
}

function ModalBody({ product, onClose }) {
  const [qty, setQty] = useState(1)
  const [subscribe, setSubscribe] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(false)

  /* Gallery-ready: today every product has exactly one shot, so the
     arrows render but have nothing to cycle to — brief §7/§4 (this pass)
     is explicit that this is not a cue to invent extra images. */
  const images = [product.image]
  const hasMultiple = images.length > 1

  return (
    <motion.div
      className="modal__panel"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 4 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="modal__close" type="button" aria-label="Close" onClick={onClose}>
        ×
      </button>

      <div className="modal__grid">
        {/* ---- left: full-height image ---- */}
        <div className="modal__image">
          <img src={images[imgIndex]} alt={product.name} />
          <div className="modal__arrows">
            <button
              type="button"
              aria-label="Previous image"
              disabled={!hasMultiple}
              onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next image"
              disabled={!hasMultiple}
              onClick={() => setImgIndex((i) => (i + 1) % images.length)}
            >
              →
            </button>
          </div>
        </div>

        {/* ---- right: editorial grid of cells ---- */}
        <div className="modal__right">
          <div className="modal__cell modal__cell--top">
            <p className="modal__category">{product.category}</p>
            <h2 className="modal__name">{product.name}</h2>
            <div className="modal__qty-price">
              <QuantityStepper value={qty} onChange={setQty} />
              <span className="modal__price">{product.price}</span>
            </div>
          </div>

          <div className="modal__cell modal__cell--info">
            <p className="modal__blurb">{PLACEHOLDER_BLURB}</p>
            <p className="modal__detail-label">Ingredients</p>
            <p className="modal__detail-text">{product.description}</p>
            <p className="modal__coming-soon">Full product details coming soon.</p>
          </div>

          <div className="modal__cell modal__cell--actions">
            <button
              type="button"
              className={`modal__subscribe${subscribe ? ' is-active' : ''}`}
              onClick={() => setSubscribe((v) => !v)}
            >
              Subscribe &amp; Save
            </button>
            <button
              type="button"
              className="modal__add"
              onClick={() => {
                setAdded(true)
                setTimeout(() => setAdded(false), 1600)
              }}
            >
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProductModal({ product, onClose }) {
  useEffect(() => {
    if (!product) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [product, onClose])

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="modal__backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ModalBody key={product.key} product={product} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
