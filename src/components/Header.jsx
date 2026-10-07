import NavPill from './NavPill.jsx'
import './Header.css'

/* ==================================================================
   Header — the Ishayu wordmark + the five nav pills, extracted out of
   Hero.jsx so a second page (the Product Page) can reuse the exact same
   navigation instead of recreating it (product-page brief §3).

   Geometry, classes and markup are byte-for-byte what Hero.jsx used to
   render inline — Hero's own GSAP entrance timeline finds these elements
   by class (`gsap.utils.toArray('.hero__pill', el)`), not by a ref it owns
   itself, so moving the JSX into a child component changes nothing about
   how that timeline locates or animates them. `logoRef` is the one thing
   Hero still needs a handle on, for its own entrance; the Product Page
   simply doesn't pass it; and renders this at rest, no animation — it has
   none yet (brief §11).

   This needs a positioned ancestor with a real height to sit inside
   (`.hero` provides that on the homepage); the Product Page's own
   `.products__header` plays that same role.
================================================================== */

const NAV = [
  { label: 'home', x: 335, w: 85, href: '/' },
  { label: 'products', x: 431, w: 161, href: '/products' },
  { label: 'our story', x: 604, w: 141, href: '/our-story' },
  { label: 'get in touch', x: 757, w: 139, href: '#' },
  { label: 'login', x: 907, w: 124, href: '#' },
]

const u = (n) => `${n / 100}rem`

export default function Header({ active = 'home', logoRef }) {
  return (
    <>
      <img className="hero__logo" src="/assets/footer/ishayu-logo.png" alt="Ishayu" ref={logoRef} />

      <nav className="hero__nav">
        {NAV.map(({ label, x, w, href }) => (
          <div
            key={label}
            className={`hero__pill${label === active ? ' hero__pill--active' : ''}`}
            style={{ left: u(x), width: u(w) }}
          >
            <NavPill label={label} href={href} />
          </div>
        ))}
      </nav>
    </>
  )
}
