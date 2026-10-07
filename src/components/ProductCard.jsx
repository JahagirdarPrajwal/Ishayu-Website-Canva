import './ProductCard.css'

/* ==================================================================
   ProductCard — the product-grid card, now with a hover flip on the
   image area (product-detail brief, Part 2, §1/§13).

   The flip is scoped to .products__image itself, not the whole card —
   matching the reference ("Website aesthetics.png"): the category/name/
   description/price block below the image stays put in both states. It's
   a plain CSS 3D flip, gated by `@media (hover: hover) and (pointer: fine)`
   (see ProductCard.css) so touch devices never get stuck "hovering" — on
   touch the image never flips, and a tap goes straight to the modal
   (brief §14), which this component also triggers: the whole card,
   front or back, calls `onSelect` on click (§13 — "do not require
   clicking specifically on the green back side").
================================================================== */

export default function ProductCard({ product, onSelect }) {
  const { category, name, description, price, image } = product

  return (
    <article
      className="products__card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(product)
        }
      }}
    >
      <div className="products__image">
        <div className="products__flip">
          <div className="products__flip-face products__flip-front">
            <img src={image} alt={name} />
          </div>

          <div className="products__flip-face products__flip-back">
            <p className="products__flip-name">{name}</p>
            <p className="products__flip-price">{price}</p>
            <span className="products__flip-select">SELECT OPTION</span>
          </div>
        </div>
      </div>

      <p className="products__category">{category}</p>
      <h3 className="products__name">{name}</h3>
      <p className="products__desc">{description}</p>
      <p className="products__price">{price}</p>
    </article>
  )
}
