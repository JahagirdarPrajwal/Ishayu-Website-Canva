import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from '../components/Header.jsx'
import BlurText from '../components/BlurText.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'
import Footer from '../sections/Footer.jsx'
import { CATEGORIES, PRODUCTS } from '../data/products.js'
import './ProductsPage.css'

gsap.registerPlugin(ScrollTrigger)

/* ==================================================================
   Product Page — static 1:1 recreation of "2.png".

   The only carried-over behaviour is the shared Header (same component
   Hero.jsx uses, rendered at rest) and the Footer, reused completely
   unchanged, including its own BlurText/TextType entrance — ScrollTrigger
   measures the Footer element itself, so it works identically regardless
   of what page it is mounted in.

   The promotional strip from the reference ("20% ON SHOTS THIS WEEK…")
   is intentionally not reproduced.

   Category sidebar → first-matching-product map (footer/nav brief §6–10):
   each sidebar label resolves to the PRODUCTS category it corresponds to,
   and at render time that's turned into an actual DOM ref on the first
   card in that category, not a computed scroll offset — the brief is
   explicit that this must survive layout/viewport changes, which a
   hardcoded pixel figure wouldn't. */
const CATEGORY_TO_PRODUCT_CATEGORY = {
  'ENERGY BARS': 'ENERGY BAR',
  COATZ: 'COATZ',
  NUTRIBITES: 'NUTRI BITE',
  SPRINKLES: 'SPRINKLE',
}

export default function ProductsPage() {
  /* Exactly one product open at a time (product-detail brief §4) — a
     single piece of state, not per-card, so opening a second product
     always replaces the first rather than stacking. */
  const [selected, setSelected] = useState(null)
  const [headingIn, setHeadingIn] = useState(false)
  const heading = useRef(null)

  const cardRefs = useRef({})

  /* Same BlurText reveal + trigger shape every homepage section uses
     (EverydayEdit.jsx / BetterChoice.jsx): a ScrollTrigger at 'top 85%'
     flips one state flag that gates play — no new animation system, this
     is the established one applied to a page that didn't have it yet.
     The heading sits in the first viewport on load, so the trigger fires
     almost immediately, which is the intended "page opens, heading
     reveals" feel with no dedicated loader on this page. */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add({ motionOK: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      if (!ctx.conditions.motionOK) {
        setHeadingIn(true)
        return undefined
      }
      /* a timeline with no actual tween in it doesn't reliably fire
         onStart — every other section's trigger-only timeline (e.g.
         BetterChoice.jsx) carries a dummy tl.to({}, {duration}) for
         exactly this reason */
      gsap
        .timeline({
          scrollTrigger: { trigger: heading.current, start: 'top 85%' },
          onStart: () => setHeadingIn(true),
        })
        .to({}, { duration: 0.1 })
      return undefined
    })
    return () => mm.revert()
  }, [])

  const scrollToCategory = (label) => {
    const wantCategory = CATEGORY_TO_PRODUCT_CATEGORY[label]
    // "ALL" (and any unrecognised label) just goes to the first product —
    // there's no earlier product to land on anyway
    const target = wantCategory
      ? PRODUCTS.find((p) => p.category === wantCategory)
      : PRODUCTS[0]
    const node = target && cardRefs.current[target.key]
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <main className="products">
        {/* .section (not just .products__header) so the existing mobile
            nav reflow in responsive.css applies here exactly as it does on
            .hero — that reflow depends on the blanket .section rule to
            neutralise the pills' inline desktop left-offsets. */}
        <header className="section products__header">
          <Header active="products" />
        </header>

        <h1 className="products__heading" ref={heading}>
          <BlurText play={headingIn} delay={85} stepDuration={0.27}>
            better, simple,
            <br />
            delicious.
          </BlurText>
        </h1>

        <div className="products__body">
          <aside className="products__sidebar">
            <ul>
              {CATEGORIES.map(({ label, count }) => (
                <li key={label}>
                  <button type="button" onClick={() => scrollToCategory(label)}>
                    {label} {count}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="products__grid">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.key}
                product={product}
                onSelect={setSelected}
                cardRef={(node) => {
                  cardRefs.current[product.key] = node
                }}
              />
            ))}
          </div>
        </div>
      </main>

      <ProductModal product={selected} onClose={() => setSelected(null)} />

      {/* Footer brief (correction pass): "2.png" is a clean solid-green
          block, not the homepage's grass-photo treatment — the earlier
          hill-transition experiment above the footer has been removed
          entirely along with it. Content/behaviour are the shared
          <Footer>, unchanged; only its background differs here. */}
      <Footer variant="solid" />
    </>
  )
}
