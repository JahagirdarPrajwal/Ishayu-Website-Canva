import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/fonts.css'
import './styles/tokens.css'
/* mobile/tablet reflow — see the header comment in that file */
import './styles/responsive.css'

/* ------------------------------------------------------------------
   The Canva artboard is 1366 px wide. Everything in the stylesheets is
   authored in "design pixels" where 1rem === 100 design px, so setting
   the root font-size from the real content width reproduces the
   artboard proportionally at any viewport width.
   clientWidth is used (not 100vw) so the scrollbar never shifts things.
------------------------------------------------------------------ */
const DESIGN_WIDTH = 1366 // the Canva artboard
const MOBILE_WIDTH = 430 // the stacked mobile canvas
const MOBILE_BREAKPOINT = 860 // must match responsive.css
const MAX_SCALE = 1.25 // stop the artboard ballooning on very wide screens

function applyScale() {
  const w = document.documentElement.clientWidth
  const base = w < MOBILE_BREAKPOINT ? MOBILE_WIDTH : DESIGN_WIDTH
  const scale = Math.min(w / base, w < MOBILE_BREAKPOINT ? 1 : MAX_SCALE)
  document.documentElement.style.fontSize = `${scale * 100}px`
}

applyScale()
window.addEventListener('resize', applyScale)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
