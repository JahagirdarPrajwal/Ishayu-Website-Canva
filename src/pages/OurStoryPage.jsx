import Header from '../components/Header.jsx'
import Footer from '../sections/Footer.jsx'
import './OurStoryPage.css'

/* ==================================================================
   Our Story — static recreation of "3.png", same approach as the
   Product Page: no entrance animation yet, nav/footer reused unchanged.

   Copy transcribed directly from "3.png". The blue background is a CSS
   gradient, not a slice of the reference image (see OurStoryPage.css for
   the colour-sampling notes) — everything below the hill crest is real
   DOM/the reused Footer, matched against a cropped tree+hill strip that
   has the reference's own baked "talk snacks with us"/logo text excluded
   (that copy is already real DOM here and in Footer.jsx).
================================================================== */

export default function OurStoryPage() {
  return (
    <>
      <main className="story">
        <header className="section story__header">
          <Header active="our story" />
        </header>

        <h1 className="story__heading">
          <span className="story__heading-line1">know us</span>
          <span className="hl story__heading-band">
            <span className="story__heading-line2">better</span>
          </span>
        </h1>

        <div className="story__body">
          <section className="story__block story__block--left">
            <h2>Healthy made delicious.</h2>
            <p className="story__bold">And yes, we mean both.</p>
            <p>
              <strong>ISHAYU</strong> is a wellness and nutrition brand from{' '}
              <strong>Vittarthaa Life Sciences</strong>, created to make better everyday choices
              simpler, more enjoyable and easier to fit into real life.
            </p>
            <p className="story__bold">Because eating better shouldn&rsquo;t mean making life harder.</p>
          </section>

          <section className="story__block story__block--right">
            <h2>Better choices shouldn&rsquo;t feel like a chore.</h2>
            <p>There&rsquo;s no shortage of advice telling us what to eat. More protein. Less sugar. More this. Less that.</p>
            <p>Somewhere along the way, eating well started feeling complicated.</p>
            <p>
              <strong>We wanted to make it simpler.</strong> ISHAYU brings together thoughtful
              ingredients, nutrition and everyday convenience to create food that fits real life —
              from busy mornings and long workdays to gym sessions, travel and those random 4 PM
              hunger moments.
            </p>
            <p className="story__bold">Real life, basically.</p>
          </section>

          <section className="story__block story__block--left">
            <h2>Good food shouldn&rsquo;t be so serious.</h2>
            <p>
              We believe nutrition should be <strong>thoughtful, honest, convenient and delicious</strong>.
            </p>
            <p className="story__bold">No perfection. Just better choices.</p>
          </section>

          <section className="story__block story__block--right">
            <h2>The fun part has science behind it.</h2>
            <p>
              <strong>ISHAYU</strong> comes from <strong>Vittarthaa Life Sciences</strong>,
              established in <strong>Bangalore</strong> in <strong>2016</strong>, with expertise
              across pharmaceuticals, biologicals, nutraceuticals and product development.
            </p>
            <p className="story__bold">Years of science. Everyday food.</p>
          </section>

          <section className="story__block story__block--left">
            <h2>You don&rsquo;t need a perfect life</h2>
            <p className="story__bold story__caps">Just a few better choices.</p>
            <p className="story__triplet">
              Good food.
              <br />
              Real life.
              <br />
              No overthinking.
            </p>
          </section>

          <div className="story__sign">
            {/* the wordmark asset is cream (drawn for the hero/footer); the
                reference shows it dark green here, so it's recoloured with
                a CSS mask rather than swapping in a new asset — same trick
                as the brightness(0) recolour on the Products page header,
                just tinted to the logo's own measured green (#235f30)
                instead of black */}
            <div className="story__sign-logo" role="img" aria-label="Ishayu" />
            <p className="story__sign-tag">HEALTHY MADE DELICIOUS.</p>
          </div>
        </div>

        <div className="story__landscape">
          <img src="/assets/story/landscape.jpg" alt="" />
        </div>
      </main>

      <Footer />
    </>
  )
}
