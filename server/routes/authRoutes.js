const router = require('express').Router()
const bcrypt = require('bcryptjs')
const Organizer = require('../models/Organizer')

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Enter username and password.' })
    const organizer = await Organizer.findOne({ username: username.trim() })
    if (!organizer || !(await bcrypt.compare(password, organizer.passwordHash))) return res.status(401).json({ message: 'Invalid username or password.' })
    req.session.organizerId = organizer._id.toString()
    req.session.username = organizer.username
    res.json({ message: 'Login successful.', username: organizer.username })
  } catch (err) { next(err) }
})
router.get('/me', (req, res) => {
  if (!req.session.organizerId) return res.status(401).json({ message: 'Not signed in.' })
  res.json({ username: req.session.username })
})
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Could not log out.' })
    res.clearCookie('campusconnect.sid')
    res.json({ message: 'Logged out.' })
  })
})
module.exports = router
