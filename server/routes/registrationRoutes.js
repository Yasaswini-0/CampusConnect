const router = require('express').Router()
const mongoose = require('mongoose')
const Event = require('../models/Event')
const Registration = require('../models/Registration')
const requireOrganizer = require('../middleware/auth')

router.post('/', async (req, res, next) => {
  try {
    const { studentName, rollNumber, email, department, eventId } = req.body
    if (!studentName || !rollNumber || !email || !department || !eventId) return res.status(400).json({ message: 'Please fill in all required fields.' })
    if (!mongoose.isValidObjectId(eventId)) return res.status(400).json({ message: 'Invalid event selected.' })
    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'This event is no longer available.' })
    const registration = await Registration.create({ studentName, rollNumber, email, department, eventId })
    res.status(201).json({ message: `Your registration for ${event.eventName} is confirmed.`, registration })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'This roll number is already registered for this event.' })
    next(err)
  }
})
router.get('/', requireOrganizer, async (req, res, next) => {
  try { const registrations = await Registration.find().populate('eventId', 'eventName date').sort({ createdAt: -1 }); res.json(registrations) } catch (err) { next(err) }
})
module.exports = router
