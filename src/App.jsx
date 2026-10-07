import { useCallback, useState } from 'react'
import Loader from './components/Loader.jsx'
import Hero from './sections/Hero.jsx'
import EverydayEdit from './sections/EverydayEdit.jsx'
import BetterChoice from './sections/BetterChoice.jsx'
import ChaseTheAura from './sections/ChaseTheAura.jsx'
import SnackLikeYouMeanIt from './sections/SnackLikeYouMeanIt.jsx'
import Instagram from './sections/Instagram.jsx'
import Footer from './sections/Footer.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import OurStoryPage from './pages/OurStoryPage.jsx'

export default function App() {
  /* The loader panel starting to lift is what releases the hero entrance, so
     the two are one continuous move rather than a cover and then a start.
     The sections below are mounted from the first frame — the loader is an
     overlay, not a gate — so the browser lays the artboard out and decodes
     the images while the panel is still up. Declared before the /products
     check below so the hook order never depends on the current path. */
  const [entered, setEntered] = useState(false)
  const begin = useCallback(() => setEntered(true), [])

  /* No router dependency for one extra static page — a plain path check.
     Every nav link to /products is a real <a href>, so this is a full
     browser navigation (not a pushState SPA switch); Vite's dev server and
     `vite preview` both already serve index.html for unknown paths, which
     is all this needs. The homepage keeps its own loader/entrance exactly
     as before; the Products page below never touches it. */
  if (typeof window !== 'undefined' && window.location.pathname === '/products') {
    return <ProductsPage />
  }
  if (typeof window !== 'undefined' && window.location.pathname === '/our-story') {
    return <OurStoryPage />
  }

  return (
    <>
      <Loader onExitStart={begin} />
      <main>
        <Hero started={entered} />
        <EverydayEdit />
        <BetterChoice />
        <ChaseTheAura />
        <SnackLikeYouMeanIt />
        <Instagram />
        <Footer />
      </main>
    </>
  )
}
