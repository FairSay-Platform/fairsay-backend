// const db = require("../config/db");

// const createQuiz = async (module_id, pass_mark) => {
//   const [result] = await db.execute(
//     "INSERT INTO quizzes (module_id, pass_mark) VALUES (?, ?)",
//     [module_id, pass_mark]
//   );
//   return result.insertId;
// };

// const getQuizByModule = async (module_id) => {
//   const [rows] = await db.execute(
//     "SELECT * FROM quizzes WHERE module_id = ?",
//     [module_id]
//   );
//   return rows[0];
// };

// module.exports = { createQuiz, getQuizByModule };



const db = require("../../config/db");
const createQuizAttempt = async (userId, moduleId, score, passed) => {
  const query = `
    INSERT INTO quiz_attempts (user_id, quiz_id, score, passed)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    userId,
    moduleId,
    score,
    passed
  ]);

  return result;
};

module.exports = {
  createQuizAttempt
};