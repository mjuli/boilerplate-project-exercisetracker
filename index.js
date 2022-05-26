const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
require('dotenv').config()

const User = require('./database/User')
const Exercise = require('./database/Exercise')

const port = process.env.PORT || 3000
const mongoURI = process.env.MONGO_URI
const Schema = mongoose.Schema;

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

mongoose.connect(mongoURI, { useNewUrlParser: true })

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// POST /api/users
app.post('/api/users', (req, res) => {
  const username = req.body.username

  new User({ username })
    .save()
    .then(user => {
      res.json({
        username,
        _id: user._id
      })
    })
    .catch(err => {
      res.json(err)
    })
})

//POST /api/users/:_id/exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  const exercise = {
    _id: mongoose.Types.ObjectId(req.params._id),
    description: req.body.description,
    duration: req.body.duration,
    date: new Date(req.body.date)
  }

  new Exercise( exercise )
    .save()
    .then(() => {
      exercise.date = exercise.date.toDateString()

      res.json(exercise)
    })
    .catch(err => {
      res.json(err)
    })
})

//GET /api/users/:_id/logs?[from][&to][&limit]

const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
