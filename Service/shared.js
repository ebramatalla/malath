
let db = require("./../DB/mysql/db");

let convert = {
  lesson: "lessonresources",
  test: "tests",
  homework: "homeworksubmissions"
}




const uploadFile = async (file, data) => {
  try {
    if (!file) {
      throw new Error('No file uploaded.');
    }
    console.log("gg");

    const fileType = file.mimetype;
    let { content_id, resource_type } = data;
    console.log(content_id, resource_type);


    const query = "INSERT INTO lessonresources (content_id, resource_type, resource_value, upload_path) VALUES (?, ?, ?, ?)";
    const [result] = await db.promise().query(query, [content_id, resource_type, file.filename, file.path]);
    console.log(result);




    return {
      message: 'File uploaded successfully.',
      file: {
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
      },
    };

  } catch (error) {
    throw new Error(error.message);
  }
};

const insertIntoContent = async (content_type, content_title, course_id, unit_id,) => {

  console.log(content_title, course_id);

  let query = "INSERT INTO content (content_type, content_title,course_id,unit_id) VALUES (?, ?,?,?)";

  const [result] = await db.promise().query(query, [content_type, content_title, course_id, unit_id]);
  const insertId = result.insertId;

  return insertId

}



function Insert(table, columns, values) {
  if (columns.length !== values.length) {
    console.log('Error: Columns and values length must match');
    return;
  }

  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT INTO ?? (${columns.join(', ')}) VALUES (${placeholders})`;

  return sql
}

module.exports = { uploadFile, insertIntoContent }