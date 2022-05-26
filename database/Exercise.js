const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  date: { type: Date}
})

const Exercise = mongoose.model("Exercise", exerciseSchema)

module.exports = Exercise