require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Organizer = require('../models/Organizer')

async function seed() {
  const username = process.env.ORGANIZER_USERNAME || 'organizer'
  const password = process.env.ORGANIZER_PASSWORD
  if (!password || password.length < 8) {
    console.error('Set ORGANIZER_PASSWORD in server/.env (at least 8 characters) before seeding.')
    process.exit(1)
  }
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegeEventDB')
  const passwordHash = await bcrypt.hash(password, 12)
  await Organizer.findOneAndUpdate({ username }, { username, passwordHash }, { upsert: true, new: true, setDefaultsOnInsert: true })
  console.log(`Organizer account ready for username: ${username}`)
  await mongoose.disconnect()
}
seed().catch(err => { console.error(err); process.exit(1) })
