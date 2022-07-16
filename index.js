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
    if (err) res.json({ error: err })
    else res.send(data);
  })
});

const findAllUsers = require("./myApp.js").findAllUsers;
app.get('/api/users', (req, res) => {
  findAllUsers((err, data) => {
    res.send(data);
  });
});

const addExercise = require("./myApp.js").addExercise;
app.post('/api/users/:_id/exercises', (req, res) => {
  addExercise(req.params._id, req.body, (err, data) => {
    if (err) res.json({ error: err })
    else res.send(data);
  });
});



const fillDummyData = require("./myApp.js").fillDummyData;
app.post('/api/filldummydata', (req, res) => {
  fillDummyData((err, data) => {
    if (err) res.json({ error: err })
    else res.send(data);
  });
});

const deleteAllUsers = require("./myApp.js").deleteAllUsers;
app.post('/api/deleteallusers', (req, res) => {
  deleteAllUsers((err, data) => {
    if (err) res.json({ error: err })
    else res.send(data);
  })
});

const deleteAllExercises = require("./myApp.js").deleteAllExercises;
app.post('/api/deleteallexercises', (req, res) => {
  deleteAllExercises((err, data) => {
    if (err) res.json({ error: err })
    else res.send(data);
  })
});


const listener = app.listen(process.env.PORT || 80, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
