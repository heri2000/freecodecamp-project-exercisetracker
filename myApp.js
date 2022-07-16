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

const getAllUsers = done => {
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

        exercise.save((err2, data2) => {
          if (err2) done(err2);
          else {
            let date = new Date();
            if (exercise.date) {
              date = new Date(exercise.date);
            }
            done(null, {
              _id: exercise.user_id,
              username: username,
              description: exercise.description,
              duration: exercise.duration,
              date: dateToStringDate(date)
            });
          }
        });
      } catch (error) {
        done(error);
      }
    };
  });
}

const getUserLogs = (_id, from, to, limit, done) => {
  UserModel.findOne({_id: _id}, (err1, userData) => {
    if (err1) done(err1);
    else {
      try {
        let filter = { user_id: _id };
        if (from != null) filter.date = { $gte: from };
        if (to != null) filter.date = { $lte: to };
        if (limit == null) limit = 0;
        else limit = Number.parseInt(limit);

        ExerciseModel.find(filter, (err3, exerciseData) => {
          if (err3) done(err3);
          else {
            let logData = Array();
            for (i=0; i < exerciseData.length; i++) {
              let date = new Date();
              if (exerciseData[i].date) {
                date = new Date(exerciseData[i].date);
              }
              logData[i] = {
                description: exerciseData[i].description,
                duration: exerciseData[i].duration,
                date: dateToStringDate(date)
              };
            }

            let responseData = {
              _id: userData._id,
              username: userData.username,
              count: exerciseData.length,
              log: logData
            };

            done(null, responseData);
          }
        }).limit(limit);
      } catch (err2) {
        done(err2);
      }
    }
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

const getAllExercises = done => {
  ExerciseModel.find({}, (err, data) => {
    if (err) done(err.message);
    else done(null, data);
  });
}



exports.UserModel = UserModel;
exports.addNewUSer = addNewUSer;
exports.getAllUsers = getAllUsers;
exports.addExercise = addExercise;
exports.getUserLogs = getUserLogs;

exports.deleteAllUsers = deleteAllUsers;
exports.deleteAllExercises = deleteAllExercises;
exports.fillDummyData = fillDummyData;
exports.getAllExercises = getAllExercises;