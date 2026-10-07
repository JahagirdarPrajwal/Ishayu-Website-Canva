import './Instagram.css'

/* five post slots, 304 design px apart; the outer two bleed off-canvas */
const CARD_X = [-56, 248, 552, 856, 1160]

export default function Instagram() {
  return (
    <section className="section insta">
      <h2 className="insta__heading">
        stalk us on <span className="hl insta__word">Instagram</span> or just stock up
      </h2>

      <img className="insta__band" src="/assets/insta/band.jpg" alt="" />

      <div className="insta__rail">
        {CARD_X.map((x) => (
          <a key={x} className="insta__card" href="#" style={{ left: `${x / 100}rem` }}>
            <img src="/assets/insta/card.png" alt="" />
          </a>
        ))}
      </div>
    </section>
  )
}
