import './SnackLikeYouMeanIt.css'

const FOLDERS = [
  { name: 'slay', y: 199 },
  { name: 'serve', y: 326 },
]

export default function SnackLikeYouMeanIt() {
  return (
    <section className="section snack">
      <h2 className="snack__heading">
        <span className="snack__line1">snack like</span>
        <span className="snack__line2">
          you<span className="hl snack__italic">mean it</span>
        </span>
      </h2>

      <p className="snack__body">
        the right snack isn’t about what’s
        <br />
        trending.
        <br />
        it’s about what you reach for when you
        <br />
        need it.
      </p>

      <p className="snack__cta">
        choose your moment.
        <br />
        choose your ISHAYU.
      </p>

      <img className="snack__photo" src="/assets/snack/card-lemons.jpg" alt="" />

      <div className="snack__folders">
        {FOLDERS.map(({ name, y }) => (
          <div key={name} className="snack__folder" style={{ top: `${y / 100}rem` }}>
            <img src="/assets/snack/folder.png" alt="" />
            <span>{name}</span>
          </div>
        ))}
      </div>

      <img className="snack__note" src="/assets/snack/note-year.png" alt="This year, it was…" />
    </section>
  )
}
