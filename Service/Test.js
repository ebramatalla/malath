const { validationResult } = require("express-validator");
let db = require("./../DB/mysql/db");
const { insertIntoContent } = require("./shared");


const addTest = async (req, res) => {
  try {

    let { content_title, course_id, unit_id, questions } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let insertId = await insertIntoContent("test", content_title, course_id, unit_id)

    const file = req.file;
    let query = "INSERT INTO tests (content_id ) VALUES (?)";

    const [result] = await db.promise().query(query, [insertId]);
    let testId = result.insertId;
    console.log("hhhhhhhhhhhhhh", testId);


    for (let index = 0; index < questions.length; index++) {
      const element = questions[index];
      let query = "INSERT INTO questions (test_id ,question_text,question_type) VALUES (?,?,?)";
      const [result] = await db.promise().query(query, [testId, element.question_text, element.question_type]);

    }
    return res.status(201).json({ message: `Test added And Content ID is ${insertId} ` });
  } catch (error) {
    res.status(400).send(error);
  }
};



const getTestDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { content_id } = req.query;

    let query = `
      SELECT 
          c.content_id,
          c.content_title,
          t.test_id,
          q.question_id,
          q.question_text,
          q.question_type
      FROM 
          Content c
      JOIN 
          Tests t ON c.content_id = t.content_id
      JOIN 
          Questions q ON t.test_id = q.test_id
      WHERE 
          c.content_id = ? AND c.content_type = 'test'
    `;

    const [rows] = await db.promise().query(query, [content_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No test details found for the specified content." });
    }

    return res.status(200).json({ data: rows });

  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addTest, getTestDetails };
