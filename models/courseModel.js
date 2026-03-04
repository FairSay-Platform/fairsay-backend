// const db = require("../config/db");

// const createCourse = async (title, description, created_by) => {
//   const [result] = await db.execute(
//     "INSERT INTO courses (title, description, created_by) VALUES (?, ?, ?)",
//     [title, description, created_by]
//   );
//   return result.insertId;
// };

// const getAllCourses = async () => {
//   const [rows] = await db.execute("SELECT * FROM courses");
//   return rows;
// };

// module.exports = { createCourse, getAllCourses };

const db = require("../config/db");

const createCourse = async (title, description) => {
  const [result] = await db.execute(
    "INSERT INTO courses (title, description) VALUES (?, ?)",
    [title, description]
  );
  return result.insertId;
};

const getAllCourses = async () => {
  const [rows] = await db.execute("SELECT * FROM courses");
  return rows;
};

module.exports = { createCourse, getAllCourses };
