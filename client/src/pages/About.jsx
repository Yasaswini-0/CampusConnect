
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main className="page-wrap">
      <div className="page-intro">
        <div className="eyebrow dark-eye">ABOUT CAMPUSCONNECT</div>
        <h1>More than just <em>events.</em></h1>
        <p>
          CampusConnect brings students and college event organizers together
          through one simple platform.
        </p>
      </div>

      <section className="about-content">
        <div className="about-card">
          <span className="about-icon">✦</span>
          <h2>Our purpose</h2>
          <p>
            We make it easier for students to discover campus activities,
            participate in events and make their college experience memorable.
          </p>
        </div>
        <div className="about-card">
          <span className="about-icon">◎</span>
          <h2>For students</h2>
          <p>
            Explore technical, cultural and sports events, view event details
            and register online with ease.
          </p>
        </div>
        <div className="about-card">
          <span className="about-icon">⚡</span>
          <h2>For organizers</h2>
          <p>
            Publish events, update event information, manage registrations
            and keep everything organized in one place.
          </p>
        </div>
      </section>

      <div className="about-cta">
        <h2>Ready to be part of something?</h2>
        <Link to="/events" className="button button-lime">Explore events ↗</Link>
      </div>
    </main>
  )
}
