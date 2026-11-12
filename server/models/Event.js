const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Technical', 'Cultural', 'Sports', 'Other'], default: 'Other' },
  description: { type: String, required: true, trim: true }
}, { timestamps: true })
module.exports = mongoose.model('Event', eventSchema)
