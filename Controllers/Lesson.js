const express = require("express");
const route = express.Router();
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});
const { body, query } = require("express-validator");
const contentTypes = [
  'video_url',
  'video_iframe',
  'video_upload',
  'audio_url',
  'audio_upload',
  'text'
];
const mangerRoute = require("./../Service/Lesson.js");

route.post(
  "/addLesson",
  upload.single('file'),
  body("unit_id").isInt({ gt: 0 }).withMessage("unit_id ID is required and must be a positive integer"),
  body("course_id").isInt({ gt: 0 }).withMessage("Course ID is required and must be a positive integer"),
  body("content_title").isString().withMessage("description is required"),
  body("resource_type").isIn(contentTypes).withMessage(`Invalid content must be in ${contentTypes} `),
  mangerRoute.addLesson
);

route.get(
  "/getLessonContent",
  query("content_id")
    .isInt({ gt: 0 })
    .withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.getLessonSources
);


module.exports = route