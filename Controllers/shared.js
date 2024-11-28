const express = require("express");
const route = express.Router();
const { body, query } = require("express-validator");


const mangerRoute = require("./../Service/shared.js");
const contentTypes = [
  'video_url',
  'video_iframe',
  'video_upload',
  'audio_url',
  'audio_upload',
  'text'
];

route.post(
  "/addCourseContent",
  upload.single('file'),

  body("unit").isString().withMessage("unit Of Course Is Required and must be String"),
  body("course_id").isString().withMessage("description is required"),
  body("content_title").isString().withMessage("description is required"),
  body("resource_type").isIn(contentTypes).withMessage("Invalid content"), mangerRoute.addCourse
);
route.get(
  "/getCoursesContent",
  query("course_id")
    .isInt({ gt: 0 })
    .withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.getCoursesContent
);

route.get(
  "/getCoursesContentDetials",
  query("content_id")
    .isInt({ gt: 0 })
    .withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.getCoursesContentDetials
);

module.exports = route