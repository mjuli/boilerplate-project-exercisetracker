const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  _id: { type: mongoose.ObjectId, required: true },
  description: { type: String },
  duration: { type: Number },
  date: { type: Date}
})

const Exercise = mongoose.model("Exercise", exerciseSchema)

module.exports = Exercise