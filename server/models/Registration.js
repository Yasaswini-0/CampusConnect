const mongoose = require('mongoose')
const registrationSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, trim: true, uppercase: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  department: { type: String, required: true, trim: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true })
registrationSchema.index({ rollNumber: 1, eventId: 1 }, { unique: true })
module.exports = mongoose.model('Registration', registrationSchema)
