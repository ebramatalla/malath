const express = require("express");
const route = express.Router();
const { body, query } = require("express-validator");


const mangerRoute = require("./../Service/HomeWork.js");

route.post(
  "/addHomeWork",
  mangerRoute.addhomeWork
);


route.get(
  "/gethomeWorkSources",
  query("content_id")
    .isInt({ gt: 0 })
    .withMessage("Course ID is required and must be a positive integer"),
  mangerRoute.gethomeWorkSources
);

module.exports = route