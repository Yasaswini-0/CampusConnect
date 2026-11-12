
import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <main className="form-page">
      <div className="form-panel">
        <div className="eyebrow dark-eye">GET IN TOUCH</div>
        <h1>Let's <em>connect.</em></h1>
        <p className="muted">
          Have a question or suggestion? Send us a message.
        </p>

        {submitted ? (
          <div className="success-box">
            <div className="success-icon">✓</div>
            <h3>Thank you!</h3>
            <p>Your message has been received in this demo.</p>
            <button className="button button-dark" onClick={() => setSubmitted(false)}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="stack-form" onSubmit={handleSubmit}>
            <label>
              Your name
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Enter your name"
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              Your message
              <textarea
                rows="4"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                placeholder="How can we help?"
              />
            </label>
            <button className="button button-dark full">Send message →</button>
          </form>
        )}
      </div>
    </main>
  )
}
