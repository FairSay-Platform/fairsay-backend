// // const db = require("../config/db");

// // const createModule = async (course_id, title, content, module_order) => {
// //   const [result] = await db.execute(
// //     "INSERT INTO modules (course_id, title, content, module_order) VALUES (?, ?, ?, ?)",
// //     [course_id, title, content, module_order]
// //   );
// //   return result.insertId;
// // };

// // const getModulesByCourse = async (course_id) => {
// //   const [rows] = await db.execute(
// //     "SELECT * FROM modules WHERE course_id = ? ORDER BY module_order ASC",
// //     [course_id]
// //   );
// //   return rows;
// // };

// // module.exports = { createModule, getModulesByCourse };


// const db = require("../config/db");

// const createModule = async (course_id, title, content, order) => {
//   const [result] = await db.execute(
//     "INSERT INTO modules (course_id, title, content, module_order) VALUES (?, ?, ?, ?)",
//     [course_id, title, content, order]
//   );
//   return result.insertId;
// };

// const getModulesByCourse = async (course_id) => {
//   const [rows] = await db.execute(
//     "SELECT * FROM modules WHERE course_id = ? ORDER BY module_order ASC",
//     [course_id]
//   );
//   return rows;
// };

// module.exports = { createModule, getModulesByCourse };


const db = require("../config/db");

const createModule = async (course_id, title, content, order) => {
  const [result] = await db.execute(
    "INSERT INTO modules (course_id, title, content, module_order) VALUES (?, ?, ?, ?)",
    [course_id, title, content, order]
  );
  return result.insertId;
};

const getModulesByCourse = async (course_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM modules WHERE course_id = ? ORDER BY module_order ASC",
    [course_id]
  );
  return rows;
};

module.exports = {
  createModule,
  getModulesByCourse
};