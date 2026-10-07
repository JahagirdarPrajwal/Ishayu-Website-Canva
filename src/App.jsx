import { useCallback, useState } from 'react'
import Loader from './components/Loader.jsx'
import Hero from './sections/Hero.jsx'
import EverydayEdit from './sections/EverydayEdit.jsx'
import BetterChoice from './sections/BetterChoice.jsx'
import ChaseTheAura from './sections/ChaseTheAura.jsx'
import SnackLikeYouMeanIt from './sections/SnackLikeYouMeanIt.jsx'
import Instagram from './sections/Instagram.jsx'
import Footer from './sections/Footer.jsx'

export default function App() {
  /* The loader panel starting to lift is what releases the hero entrance, so
     the two are one continuous move rather than a cover and then a start.
     The sections below are mounted from the first frame — the loader is an
     overlay, not a gate — so the browser lays the artboard out and decodes
     the images while the panel is still up. */
  const [entered, setEntered] = useState(false)
  const begin = useCallback(() => setEntered(true), [])

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
