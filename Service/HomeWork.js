const { validationResult } = require("express-validator");
let db = require("./../DB/mysql/db");
const { uploadFile, insertIntoContent } = require("./shared");


const addhomeWork = async (req, res) => {
  try {
    let { content_title, course_id, unit_id, homeWork_value } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("gg");

    let insertId = await insertIntoContent("homeWork", content_title, course_id, unit_id)
    console.log("ins", insertId);

    const query = "INSERT INTO homework (content_id, homeWork_value ) VALUES (?, ?)";
    const [result] = await db.promise().query(query, [insertId, homeWork_value]);
    console.log(result);
    return res.status(201).json({ message: `HomeWork added And Content ID is ${insertId} ` });



  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
};

const gethomeWorkSources = async (req, res) => {
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
          lr.homeWork_id,
          lr.homeWork_value,
          lr.submitted_at AS resource_created_at
      FROM 
          Content c
      JOIN 
          homework lr ON c.content_id = lr.content_id
      WHERE 
          c.content_id = ? AND c.content_type = 'homeWork'
    `;

    const [rows, fields] = await db.promise().query(query, [content_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No resources found for the specified content." });
    }

    // Return the result in the response
    return res.status(200).json({ data: rows });

  } catch (error) {
    // Handle any unexpected errors
    console.error("Error executing query:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};




module.exports = { addhomeWork, gethomeWorkSources, };
