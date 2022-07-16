require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, required: true }
}, { collection: "user" });

const UserModel = mongoose.model("user", userSchema);

const addNewUSer = (username, done) => {
  UserModel.findOne({ username: username }, (err1, data1) => {
    if (err1) done(err1.message);
    if (data1 == null) {
      let user = new UserModel({ username: username });
      user.save((err2, data2) => {
        if (err2) done(err2.message);
        else done(null, { username: data2.username, _id: data2._id });
      });
    } else done(null, data1);
  });
}

const findAllUsers = done => {
  UserModel.find({}, (err, data) => {
    if (err) done(err.message);
    else done(null, data);
  });
}


const exerciseSchema = new Schema({
  user_id: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  date: { type: String }
}, { collection: "exercise" });

const ExerciseModel = mongoose.model("exercise", exerciseSchema);


const addExercise = (_id, body, done) => {
  UserModel.findOne({_id: _id}, (err1, data1) => {
    if (err1) done(err1);
    else {
      try {
        let username = data1.username;

        if (body.date == "") {
          let d = new Date();
          body.date = dateToSqlDate(d);
        }

        let exercise = new ExerciseModel(body);
        exercise.user_id = _id;

        exercise.save((err1, data1) => {
          if (err1) done(err1);
          else {
            done(null, {
              _id: exercise.user_id,
              username: username,
              description: exercise.description,
              duration: exercise.duration,
              date: dateToStringDate(new Date(exercise.date))
            });
          }
        });
      } catch (error) {
        done(error);
      }
    };
  });
}


const dateToSqlDate = date => {
  let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
  let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  return year + "-" + month + "-" + day;
}

const dateToStringDate = date => {
  let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  let dayOfWeek = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date);
  return dayOfWeek + " " + month + " " + day + " " + year;
}




const fillDummyData = done => {
  const users = [
    { username: "aaaaaaaaaa" },
    { username: "bbbbbbbbbb" },
    { username: "cccccccccc" }
  ];
  let result = UserModel.insertMany(users);
  done(null, result);
}

const deleteAllUsers = done => {
  UserModel.deleteMany({}, (err, data) => {
    if (err) done(err.message);
    else done(null, data);
  });
}

const deleteAllExercises = done => {
  ExerciseModel.deleteMany({}, (err, data) => {
    if (err) done(err.message);
    else done(null, data);
  });
}

exports.UserModel = UserModel;
exports.addNewUSer = addNewUSer;
exports.findAllUsers = findAllUsers;
exports.addExercise = addExercise;

exports.deleteAllUsers = deleteAllUsers;
exports.deleteAllExercises = deleteAllExercises;
exports.fillDummyData = fillDummyData;