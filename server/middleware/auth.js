module.exports = function requireOrganizer(req, res, next) {
  if (!req.session || !req.session.organizerId) {
    return res.status(401).json({ message: 'Please sign in as an organizer.' })
  }
  next()
}
