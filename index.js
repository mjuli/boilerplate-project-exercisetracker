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

//GET /api/users
app.get('/api/users', (req, res) => {
  User.find()
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.json(err)
    })
})

//POST /api/users/:_id/exercises
app.post('/api/users/:_id/exercises', (req, res) => {
  let date = new Date()

  if(req.body.date)
    date = new Date(req.body.date)

  const userId = req.params._id

  const exercise = {
    date,
    userId,
    description: req.body.description,
    duration: Number(req.body.duration)
  }

  User.findById(userId)
    .then(user => {
      new Exercise(exercise)
        .save()
        .then(() => {
          const userExercise = {
            username: user.username,
            date: new Date(exercise.date).toDateString(),
            duration: exercise.duration,
            description: exercise.description,
            _id: user._id,
          }

          res.json(userExercise)
        })
        .catch(err => {
          res.json(err)
        })
    })
    .catch(err => {
      res.json(err)
    })

})

//GET /api/users/:_id/logs?[from][&to][&limit]
app.get(`/api/users/:_id/logs`, (req, res) => {
  const userId = req.params._id
  const from = req.query.from
  const to = req.query.to
  const limit = req.query.limit

  let fromDate = new Date(0)
  let toDate = new Date()

  if(from)
    fromDate = new Date(from)

  if(to)
    toDate = new Date(to)

  User.findById(userId)
    .then(user => {
      Exercise.find({ userId })
        .then(exercises => {
          const userExercises = exercises
            .map(exercise => {
              const exerc = {
                description: exercise.description,
                duration: exercise.duration,
                date: new Date(exercise.date).toDateString()
              }

              return exerc
            })
            .filter(exerc => new Date(exerc.date) >= fromDate && new Date(exerc.date) <= toDate)

          if(limit && limit < userExercises.length)
            userExercises.length = limit

          const logs = {
            _id: userId,
            username: user.username,
            count: userExercises.length,
            log: userExercises
          }

          res.json(logs)
        })
        .catch(err => {
          res.json(err)
        })
    })
    .catch(err => {
      res.json(err)
    })
})

const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
