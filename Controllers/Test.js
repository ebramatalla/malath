const express = require("express");
const route = express.Router();
const { body, query } = require("express-validator");


const mangerRoute = require("./../Service/Test.js");

route.post(
  "/addTest",
  body("content_title").isString().withMessage("Name Of Test Is Required and must be String"),
  body("course_id").isInt({ gt: 0 })
    .withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.addTest
);

route.get(
  "/getTestContent",
  query("content_id")
    .isInt({ gt: 0 })
    .withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.getTestDetails
);




module.exports = route