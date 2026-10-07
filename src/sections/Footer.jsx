import './Footer.css'

function LinkedInIcon() {
  return (
    <svg className="footer__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.4 0H3.6A3.6 3.6 0 0 0 0 3.6v16.8A3.6 3.6 0 0 0 3.6 24h16.8a3.6 3.6 0 0 0 3.6-3.6V3.6A3.6 3.6 0 0 0 20.4 0ZM7.3 20.1H3.9V9h3.4v11.1ZM5.6 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm14.5 12.6h-3.4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.5H9.4V9h3.3v1.5h.1a3.6 3.6 0 0 1 3.2-1.8c3.5 0 4.1 2.3 4.1 5.2v6.2Z"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="footer__icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="5.4" fill="none" stroke="currentColor" strokeWidth="2.1" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="2.1" />
      <circle cx="17.6" cy="6.4" r="1.35" fill="currentColor" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="section footer">
      <img className="section__bg" src="/assets/footer/footer-bg.jpg" alt="" />

      <h2 className="footer__heading">
        <span className="footer__line1">talk snacks</span>
        <span className="hl footer__line2">with us</span>
      </h2>

      <p className="footer__body">
        Whether you want to ask
        <br />
        us something, work with
        <br />
        us, stock ISHAYU, or
        <br />
        simply say hi , we’d love to
        <br />
        hear from you.
      </p>

      <img className="footer__logo" src="/assets/footer/logo.png" alt="Ishayu" />

      <div className="footer__contact">
        <h3>locate us</h3>
        <p>
          No.66, 8th ‘A’ Main, BTM 1st
          <br />
          Stage, Bangalore – 560029,
          <br />
          Karnataka, India
        </p>

        <h3>give us a call</h3>
        <p>
          +91 80 35893150 / 35893151
          <br />
          +91 9686623006
        </p>

        <h3>mail</h3>
        <p>reachus@ishayu.in</p>

        <h3>socials</h3>
        <p>
          <span className="footer__social">
            @ishayu <LinkedInIcon />
          </span>
          <br />
          <span className="footer__social">
            @ishayu_vittarthaa <InstagramIcon />
          </span>
        </p>
      </div>
    </footer>
  )
}
