const { validationResult } = require("express-validator");
let db = require("./../DB/mysql/db");

let convert = {
  lesson: "lessonresources",
  test: "questions",
  homework: "homeworksubmissions"
}

const addCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { title, description } = req.body;
    console.log(title, description);

    let query = "INSERT INTO courses ( title, description) VALUES (?, ?)";

    const [result] = await db.promise().query(query, [title, description]);

    const insertId = result.insertId;


    return res.status(201).json({ message: `course added and id is ${insertId}` });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCoursesContent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { course_id } = req.query;

    console.log(course_id);


    let query = `SELECT * FROM malath_task.content where course_id = ?`;

    const [rows] = await db.promise().query(query, [course_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No content found for the specified course." });
    }

    return res.status(200).json({ data: rows });

  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCoursesContentDetials = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { content_id } = req.query;

    let query = `SELECT * FROM malath_task.content where content_id = ?`;


    let [rows] = await db.promise().query(query, [content_id]);



    if (rows.length === 0) {
      return res.status(404).json({ message: "No lessons found for the specified course." });
    }
    console.log(rows);

    let content_type = convert[rows[0].content_type]
    let queryTogetContect = `SELECT * FROM ${content_type} where content_id = ?`;
    [rows] = await db.promise().query(queryTogetContect, [content_id]);
    console.log(rows);


    return res.status(200).json({ data: rows });

  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addUnit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { course_id, title, description, unit_id } = req.body;
    console.log(title, description);

    let query = "INSERT INTO units ( unit_id,course_id,title, description) VALUES (?,?,?, ?)";


    const [result] = await db.promise().query(query, [unit_id, course_id, title, description]);

    const insertId = result.insertId;

    return res.status(201).json({ message: `Unit Added ${insertId} for course ${course_id} ` });
  } catch (error) {
    res.status(400).send(error);
  }
};


module.exports = { addCourse, getCoursesContent, getCoursesContentDetials, addUnit };
