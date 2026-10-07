import { useState } from 'react'
import Header from '../components/Header.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductModal from '../components/ProductModal.jsx'
import Footer from '../sections/Footer.jsx'
import { CATEGORIES, PRODUCTS } from '../data/products.js'
import './ProductsPage.css'

/* ==================================================================
   Product Page — static 1:1 recreation of "2.png".

   This pass is deliberately static (product-page brief §11): the only
   carried-over behaviour is the shared Header (same component Hero.jsx
   uses, rendered at rest — it has no entrance here, there is nothing
   gating it the way the loader gates the homepage) and the Footer,
   reused completely unchanged, including its own BlurText/TextType
   entrance (§9–10) — ScrollTrigger measures the Footer element itself,
   so it works identically regardless of what page it is mounted in.

   The promotional strip from the reference ("20% ON SHOTS THIS WEEK…")
   is intentionally not reproduced (brief §2); the category sidebar has no
   filtering wired up yet (brief §6) — this is visual recreation only.
================================================================== */

export default function ProductsPage() {
  /* Exactly one product open at a time (product-detail brief §4) — a
     single piece of state, not per-card, so opening a second product
     always replaces the first rather than stacking. */
  const [selected, setSelected] = useState(null)

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

        <h1 className="products__heading">
          better, simple,
          <br />
          delicious.
        </h1>

        <div className="products__body">
          <aside className="products__sidebar">
            <ul>
              {CATEGORIES.map(({ label, count }) => (
                <li key={label}>
                  {label} {count}
                </li>
              ))}
            </ul>
          </aside>

          <div className="products__grid">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.key} product={product} onSelect={setSelected} />
            ))}
          </div>
        </div>
      </main>

      <ProductModal product={selected} onClose={() => setSelected(null)} />

      <Footer />
    </>
  )
}
