const { validationResult } = require("express-validator");
let db = require("./../DB/mysql/db");
const { uploadFile, insertIntoContent } = require("./shared");


const addLesson = async (req, res) => {
  try {
    let { content_title, course_id, unit_id, resource_value, resource_type } = req.body;

    // add lessin to content
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let insertId = await insertIntoContent("lesson", content_title, course_id, unit_id)
    // attach file to leesson 
    const file = req.file;
    console.log(file);


    if (file) {

      let data = {
        content_id: insertId,
        course_id, unit_id, resource_type
      }

      await uploadFile(file, data)
      return res.status(201).json({ message: "Inserted " });
    }
    else {

      const query = "INSERT INTO lessonresources (content_id, resource_type, resource_value ) VALUES (?, ?, ?)";
      const [result] = await db.promise().query(query, [insertId, resource_type, resource_value]);
      console.log(result);
      return res.status(201).json({ message: `Lesson added And Content ID is ${insertId} ` });

    }

  } catch (error) {
    res.status(400).send(error);
  }
};

const getLessonSources = async (req, res) => {
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
          lr.resource_id,
          lr.resource_type,
          lr.resource_value,
          lr.upload_path,
          lr.created_at AS resource_created_at
      FROM 
          Content c
      JOIN 
          LessonResources lr ON c.content_id = lr.content_id
      WHERE 
          c.content_id = ? AND c.content_type = 'lesson'
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




module.exports = { addLesson, getLessonSources, };
