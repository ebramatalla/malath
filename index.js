const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./DB/mysql/db')
const Course = require("./Controllers/Course");
const Lesson = require("./Controllers/Lesson");
const Test = require("./Controllers/Test");
const HomeWork = require("./Controllers/HomeWork");

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log("Connected To Data Base ");

});


const app = express();
app.use(express.json());
app.use(Course)
app.use(Lesson)
app.use(Test)
app.use(HomeWork)
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
