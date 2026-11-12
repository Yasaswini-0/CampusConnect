
import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import api from './api'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function Header({ organizer, onLogout }) {
  return <header className="topbar">
    <Link className="brand" to="/"><span className="brand-mark">C</span> CampusConnect</Link>
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/events">Events</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      {organizer ? <NavLink to="/dashboard">Dashboard</NavLink> : <NavLink to="/organizer">Organizer</NavLink>}
      {organizer && <button className="nav-logout" onClick={onLogout}>Log out</button>}
    </nav>
  </header>
}

function Footer() {
  return <footer><span>CampusConnect</span> · College Event Registration and Management System</footer>
}

function Events({ events, onRegister }) {
  const [filter, setFilter] = useState('All')
  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Other']
  const filtered = filter === 'All' ? events : events.filter(e => e.category === filter)
  return <main className="page-wrap">
    <div className="page-intro">
      <div className="eyebrow dark-eye">DISCOVER & PARTICIPATE</div>
      <h1>Upcoming <em>events.</em></h1>
      <p>There’s always something happening. Pick an event and save your spot.</p>
    </div>
    <div className="filters">
      {categories.map(c => <button key={c} className={filter === c ? 'filter active' : 'filter'} onClick={() => setFilter(c)}>{c}</button>)}
    </div>
    {filtered.length ? <div className="event-grid">
      {filtered.map(e => <article className="event-card" key={e._id}>
        <div className="event-art"><span>{e.category || 'CAMPUS EVENT'}</span><div className="art-symbol">{(e.eventName || 'E').slice(0, 1).toUpperCase()}</div></div>
        <div className="event-content">
          <div className="event-meta">{new Date(e.date).toLocaleDateString()} · {e.venue}</div>
          <h3>{e.eventName}</h3>
          <p>{e.description}</p>
          <button className="button button-dark full" onClick={() => onRegister(e)}>Register for event ↗</button>
        </div>
      </article>)}
    </div> : <div className="empty-state">No events in this category right now.</div>}
  </main>
}

function Register({ event, onBack }) {
  const [form, setForm] = useState({ studentName: '', rollNumber: '', email: '', department: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const { data } = await api.post('/registrations', { ...form, eventId: event._id })
      setMessage(data.message || 'Registration successful!')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete registration. Please try again.')
    } finally {
      setBusy(false)
    }
  }
  return <main className="form-page">
    <button className="back-link" onClick={onBack}>← Back to events</button>
    <div className="form-panel">
      <div className="eyebrow dark-eye">SAVE YOUR SPOT</div>
      <h1>Event <em>registration.</em></h1>
      <div className="selected-event">
        <span>YOU’RE REGISTERING FOR</span>
        <strong>{event.eventName}</strong>
        <small>{new Date(event.date).toLocaleDateString()} · {event.venue}</small>
      </div>
      {message ? <div className="success-box">
        <div className="success-icon">✓</div>
        <h3>You’re on the list!</h3>
        <p>{message}</p>
        <button className="button button-dark" onClick={onBack}>Back to events</button>
      </div> : <form onSubmit={submit} className="stack-form">
        <label>Full name<input name="studentName" value={form.studentName} onChange={change} required placeholder="Enter your name" /></label>
        <label>Roll number<input name="rollNumber" value={form.rollNumber} onChange={change} required placeholder="e.g. 24KT1A05E2" /></label>
        <label>Email address<input name="email" type="email" value={form.email} onChange={change} required placeholder="you@example.com" /></label>
        <label>Department<input name="department" value={form.department} onChange={change} required placeholder="e.g. CSE" /></label>
        {error && <div className="error-box">{error}</div>}
        <button className="button button-dark full" disabled={busy}>{busy ? 'Submitting…' : 'Confirm registration →'}</button>
      </form>}
    </div>
  </main>
}

function OrganizerLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onLogin(username, password)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your details.')
    } finally {
      setBusy(false)
    }
  }
  return <main className="form-page login-page">
    <div className="form-panel">
      <div className="login-icon">✳</div>
      <div className="eyebrow dark-eye">ORGANIZER PORTAL</div>
      <h1>Welcome <em>back.</em></h1>
      <p className="muted">Sign in to manage campus events and registrations.</p>
      <form onSubmit={submit} className="stack-form">
        <label>Username<input value={username} onChange={e => setUsername(e.target.value)} required placeholder="Organizer username" /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" /></label>
        {error && <div className="error-box">{error}</div>}
        <button className="button button-dark full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in →'}</button>
      </form>
      <p className="tiny-note">Organizer accounts are created by the project administrator.</p>
    </div>
  </main>
}

function Dashboard() {
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  const blank = { eventName: '', date: '', venue: '', category: 'Technical', description: '' }
  const [form, setForm] = useState(blank)

  async function load() {
    const [e, r] = await Promise.all([api.get('/events'), api.get('/registrations')])
    setEvents(e.data)
    setRegistrations(r.data)
  }

  useEffect(() => { load().catch(() => setNotice('Could not load dashboard data.')) }, [])

  function startEdit(event) {
    setEditing(event._id)
    setForm({ ...event, date: new Date(event.date).toISOString().slice(0, 10) })
    setShowForm(true)
  }

  function startNew() {
    setEditing(null)
    setForm(blank)
    setShowForm(true)
  }

  async function save(e) {
    e.preventDefault()
    try {
      if (editing) await api.put(`/events/${editing}`, form)
      else await api.post('/events', form)
      setNotice('Event saved successfully.')
      setShowForm(false)
      await load()
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to save event.')
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this event? Its registrations will also be deleted.')) return
    try {
      await api.delete(`/events/${id}`)
      setNotice('Event deleted.')
      await load()
    } catch {
      setNotice('Unable to delete event.')
    }
  }

  return <main className="page-wrap dashboard">
    <div className="dashboard-head">
      <div>
        <div className="eyebrow dark-eye">ORGANIZER WORKSPACE</div>
        <h1>Event <em>dashboard.</em></h1>
        <p className="muted">Manage your events and keep track of participants.</p>
      </div>
      <button className="button button-dark" onClick={startNew}>＋ Create event</button>
    </div>
    {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}
    <div className="stats-grid">
      <div className="stat-card"><span>ACTIVE EVENTS</span><strong>{events.length}</strong></div>
      <div className="stat-card"><span>TOTAL REGISTRATIONS</span><strong>{registrations.length}</strong></div>
      <div className="stat-card"><span>EVENT CATEGORIES</span><strong>{new Set(events.map(e => e.category)).size}</strong></div>
    </div>
    {showForm && <section className="admin-panel">
      <div className="panel-title"><h2>{editing ? 'Edit event' : 'Create an event'}</h2><button className="icon-button" onClick={() => setShowForm(false)}>×</button></div>
      <form className="admin-form" onSubmit={save}>
        <label>Event name<input value={form.eventName} onChange={e => setForm({ ...form, eventName: e.target.value })} required /></label>
        <label>Date<input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></label>
        <label>Venue<input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} required /></label>
        <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Technical</option><option>Cultural</option><option>Sports</option><option>Other</option></select></label>
        <label className="wide">Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows="3" /></label>
        <div className="wide"><button className="button button-dark">{editing ? 'Update event' : 'Publish event'} →</button></div>
      </form>
    </section>}
    <section className="admin-panel">
      <div className="panel-title"><h2>Your events</h2><span className="count-pill">{events.length} total</span></div>
      {events.length ? <div className="table-scroll"><table>
        <thead><tr><th>EVENT</th><th>DATE</th><th>VENUE</th><th>REGISTERED</th><th>ACTIONS</th></tr></thead>
        <tbody>{events.map(e => <tr key={e._id}>
          <td><strong>{e.eventName}</strong><small>{e.category}</small></td>
          <td>{new Date(e.date).toLocaleDateString()}</td>
          <td>{e.venue}</td>
          <td>{registrations.filter(r => r.eventId?._id === e._id || r.eventId === e._id).length}</td>
          <td><button className="table-action" onClick={() => startEdit(e)}>Edit</button><button className="table-action danger" onClick={() => remove(e._id)}>Delete</button></td>
        </tr>)}</tbody>
      </table></div> : <div className="empty-state compact">No events yet. Create your first event.</div>}
    </section>
    <section className="admin-panel">
      <div className="panel-title"><h2>Student registrations</h2><span className="count-pill">{registrations.length} total</span></div>
      {registrations.length ? <div className="table-scroll"><table>
        <thead><tr><th>STUDENT</th><th>ROLL NUMBER</th><th>EMAIL</th><th>DEPARTMENT</th><th>EVENT</th></tr></thead>
        <tbody>{registrations.map(r => <tr key={r._id}>
          <td><strong>{r.studentName}</strong></td><td>{r.rollNumber}</td><td>{r.email}</td><td>{r.department}</td><td>{r.eventId?.eventName || 'Event removed'}</td>
        </tr>)}</tbody>
      </table></div> : <div className="empty-state compact">Student registrations will appear here.</div>}
    </section>
  </main>
}

export default function App() {
  const [events, setEvents] = useState([])
  const [organizer, setOrganizer] = useState(false)
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  async function loadEvents() {
    try {
      const { data } = await api.get('/events')
      setEvents(data)
    } catch {
      setEvents([])
    }
  }

  useEffect(() => {
    loadEvents()
    api.get('/auth/me').then(() => setOrganizer(true)).catch(() => setOrganizer(false))
  }, [])

  async function login(username, password) {
    await api.post('/auth/login', { username, password })
    setOrganizer(true)
    navigate('/dashboard')
  }

  async function logout() {
    await api.post('/auth/logout')
    setOrganizer(false)
    navigate('/')
  }

  function register(event) {
    setSelected(event)
    navigate('/register')
  }

  return <>
    <Header organizer={organizer} onLogout={logout} />
    <Routes>
      <Route path="/" element={<Home events={events} onRegister={register} />} />
      <Route path="/events" element={<Events events={events} onRegister={register} />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={selected ? <Register event={selected} onBack={() => navigate('/events')} /> : <Events events={events} onRegister={register} />} />
      <Route path="/organizer" element={<OrganizerLogin onLogin={login} />} />
      <Route path="/dashboard" element={organizer ? <Dashboard /> : <OrganizerLogin onLogin={login} />} />
      <Route path="*" element={<Home events={events} onRegister={register} />} />
    </Routes>
    <Footer />
  </>
}
