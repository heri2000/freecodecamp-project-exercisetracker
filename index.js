const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



const addNewUSer = require("./myApp.js").addNewUSer;
app.post('/api/users', (req, res) => {
  let username = req.body.username;
  addNewUSer(username, (err, data) => {
    if (err) res.send({ error: err })
    else res.send(data);
  })
});

const getAllUsers = require("./myApp.js").getAllUsers;
app.get('/api/users', (req, res) => {
  getAllUsers((err, data) => {
    res.send(data);
  });
});

const addExercise = require("./myApp.js").addExercise;
app.post('/api/users/:_id/exercises', (req, res) => {
  addExercise(req.params._id, req.body, (err, data) => {
    if (err) res.send({ error: err })
    else res.send(data);
  });
});

const getUserLogs = require("./myApp.js").getUserLogs;
app.get('/api/users/:_id/logs', (req, res) => {
  getUserLogs(
    req.params._id,
    req.query.from,
    req.query.to,
    req.query.limit,
    (err, data) => {
    if (err) res.send({ error: err })
    else res.send(data);
  });
});



const fillDummyData = require("./myApp.js").fillDummyData;
app.get('/api/filldummydata', (req, res) => {
  fillDummyData((err, data) => {
    if (err) res.json({ error: err })
    else res.send(data);
  });
});

const deleteAllUsers = require("./myApp.js").deleteAllUsers;
app.get('/api/deleteallusers', (req, res) => {
  deleteAllUsers((err, data) => {
    if (err) res.json({ error: err })
    else res.send(data);
  })
});

const deleteAllExercises = require("./myApp.js").deleteAllExercises;
app.get('/api/deleteallexercises', (req, res) => {
  deleteAllExercises((err, data) => {
    if (err) res.json({ error: err })
    else res.send(data);
  })
});

const getAllExercises = require("./myApp.js").getAllExercises;
app.get('/api/exercises', (req, res) => {
  getAllExercises((err, data) => {
    res.send(data);
  });
});



const listener = app.listen(process.env.PORT || 80, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
