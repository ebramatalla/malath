const express = require("express");
const route = express.Router();
const { body, query } = require("express-validator");


const mangerRoute = require("./../Service/Course.js");

route.post(
  "/addCourse",
  body("title").isString().withMessage("Name Of Course Is Required and must be String"),
  body("description").isString().withMessage("description Of Course Is Required and must be String"),
  mangerRoute.addCourse
);

route.post(
  "/addUnit",
  body("title").isString().withMessage("Name Of Course Is Required and must be String"),
  body("description").isString().withMessage("description Of Course Is Required and must be String"),
  body("course_id").isInt({ gt: 0 }).withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.addUnit
);
route.get(
  "/getCoursesContent",
  query("course_id")
    .isInt({ gt: 0 })
    .withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.getCoursesContent
);


module.exports = route