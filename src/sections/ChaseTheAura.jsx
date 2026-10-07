import './ChaseTheAura.css'

const GAMES = [
  { name: 'SnackSlash', src: '/assets/aura/game-snackslash.jpg', x: 80 },
  { name: 'AstroFuel', src: '/assets/aura/game-astrofuel.jpg', x: 312 },
  { name: 'FuelRally', src: '/assets/aura/game-fuelrally.jpg', x: 879 },
  { name: 'SnackRush', src: '/assets/aura/game-snackrush.jpg', x: 1106 },
]

export default function ChaseTheAura() {
  return (
    <section className="section aura">
      <img className="section__bg" src="/assets/aura/aura-bg.jpg" alt="" />

      <img className="aura__ie" src="/assets/aura/ie-logo.png" alt="" />

      <div className="aura__headline">
        <span className="aura__chase">chase the</span>
        <span className="hl aura__aura">aura</span>
        <span className="aura__energy">(and the energy...)</span>
      </div>

      <p className="aura__find">
        find your game,
        <br />
        you might find your
        <br />
        energy along the way.
      </p>

      <div className="aura__games">
        {GAMES.map(({ name, src, x }) => (
          <figure key={name} className="aura__game" style={{ left: `${x / 100}rem` }}>
            <img src={src} alt={name} />
            <figcaption>{name}</figcaption>
          </figure>
        ))}
      </div>

      <div className="aura__closing">
        <span className="aura__closing-line1">find your</span>
        <span className="hl aura__closing-line2">better choice</span>
        <p className="aura__closing-body">
          it’s not about following a perfect routine.
          <br />
          it’s about finding what works for you,
          <br />
          one choice, one moment, one day at a time.
        </p>
      </div>
    </section>
  )
}
