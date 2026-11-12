
import { Link } from 'react-router-dom'

function EventCard({ event, onRegister }) {
  return (
    <article className="event-card">
      <div className="event-art">
        <span>{event.category || 'CAMPUS EVENT'}</span>
        <div className="art-symbol">
          {(event.eventName || 'E').slice(0, 1).toUpperCase()}
        </div>
      </div>
      <div className="event-content">
        <div className="event-meta">
          {new Date(event.date).toLocaleDateString()} · {event.venue}
        </div>
        <h3>{event.eventName}</h3>
        <p>{event.description}</p>
        <button className="button button-dark full" onClick={() => onRegister(event)}>
          Register for event ↗
        </button>
      </div>
    </article>
  )
}

export default function Home({ events, onRegister }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse"></span> YOUR CAMPUS, YOUR MOMENT
          </div>
          <h1>Make your college days <em>count.</em></h1>
          <p>
            Discover what's happening on campus. Find your people,
            explore your interests and sign up for experiences you'll remember.
          </p>
          <div className="hero-actions">
            <Link className="button button-lime" to="/events">
              Explore events ↗
            </Link>
            <Link className="text-link" to="/organizer">
              Organizer sign in →
            </Link>
          </div>
          <div className="hero-note">
            <span>✦　◎　✳</span> One campus. Many possibilities.
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-orbit orbit-one"></div>
          <div className="visual-orbit orbit-two"></div>
          <div className="visual-center">
            <span>CC</span>
            <small>CREATE · CONNECT · CELEBRATE</small>
          </div>
          <div className="float-card card-top">✦ <span>TECH</span></div>
          <div className="float-card card-right">♫ <span>CULTURE</span></div>
          <div className="float-card card-bottom">⚡ <span>SPORTS</span></div>
          <div className="visual-caption">WHAT'S YOUR NEXT BIG THING?</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow dark-eye">THE CAMPUS CALENDAR</div>
            <h2>Find your next <em>something.</em></h2>
          </div>
          <Link className="text-link dark-link" to="/events">All events ↗</Link>
        </div>

        {events.length ? (
          <div className="event-grid">
            {events.slice(0, 3).map(event => (
              <EventCard key={event._id} event={event} onRegister={onRegister} />
            ))}
          </div>
        ) : (
          <div className="empty-state">No events published yet. Check back soon!</div>
        )}
      </section>
    </>
  )
}
