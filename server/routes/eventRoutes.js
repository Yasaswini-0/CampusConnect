const router = require('express').Router()
const mongoose = require('mongoose')
const Event = require('../models/Event')
const Registration = require('../models/Registration')
const requireOrganizer = require('../middleware/auth')

router.get('/', async (req, res, next) => {
  try { const events = await Event.find().sort({ date: 1 }); res.json(events) } catch (err) { next(err) }
})
router.post('/', requireOrganizer, async (req, res, next) => {
  try { const event = await Event.create(req.body); res.status(201).json(event) } catch (err) { next(err) }
})
router.put('/:id', requireOrganizer, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid event ID.' })
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!event) return res.status(404).json({ message: 'Event not found.' })
    res.json(event)
  } catch (err) { next(err) }
})
router.delete('/:id', requireOrganizer, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid event ID.' })
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })
    await Registration.deleteMany({ eventId: event._id })
    res.json({ message: 'Event and its registrations deleted.' })
  } catch (err) { next(err) }
})
module.exports = router
