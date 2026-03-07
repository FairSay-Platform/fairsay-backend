// exports.getModulesByCourse = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const [course] = await db.query(
//       "SELECT id FROM courses WHERE slug = ?",
//       [slug]
//     );

//     if (!course.length) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     const [modules] = await db.query(
//       "SELECT * FROM modules WHERE course_id = ? ORDER BY module_order",
//       [course[0].id]
//     );

//     res.json({
//       success: true,
//       data: modules
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const db = require("../config/db");


// GET COURSES
exports.getCourses = async () => {

  const [rows] = await db.query(`
    SELECT *
    FROM courses
    ORDER BY course_order
  `);

  return rows;
};



// GET MODULES BY COURSE
exports.getModulesByCourse = async (slug) => {

  const [course] = await db.query(
    "SELECT id FROM courses WHERE slug = ?",
    [slug]
  );

  if (!course.length) {
    throw new Error("Course not found");
  }

  const courseId = course[0].id;

  const [modules] = await db.query(
    `SELECT *
     FROM modules
     WHERE course_id = ?
     ORDER BY module_order`,
    [courseId]
  );

  return modules;
};



// GET MODULE CONTENT
exports.getModuleContent = async (moduleId) => {

  const [rows] = await db.query(
    `SELECT *
     FROM modules
     WHERE id = ?`,
    [moduleId]
  );

  return rows[0];
};



// GET QUIZ
exports.getQuiz = async (moduleId) => {

  const [quiz] = await db.query(
    "SELECT id FROM quizzes WHERE module_id = ?",
    [moduleId]
  );

  if (!quiz.length) {
    return null;
  }

  const quizId = quiz[0].id;

  const [questions] = await db.query(
    "SELECT * FROM quiz_questions WHERE quiz_id = ?",
    [quizId]
  );

  for (let q of questions) {

    const [options] = await db.query(
      `SELECT id, option_text
       FROM quiz_options
       WHERE question_id = ?`,
      [q.id]
    );

    q.options = options;
  }

  return questions;
};



// SUBMIT QUIZ
exports.submitQuiz = async (quizId, userId, answers) => {

  let score = 0;

  for (const questionId in answers) {

    const selectedOption = answers[questionId];

    const [correct] = await db.query(
      `SELECT id
       FROM quiz_options
       WHERE question_id = ?
       AND is_correct = 1`,
      [questionId]
    );

    if (correct.length && correct[0].id == selectedOption) {
      score++;
    }
  }

  return {
    score
  };
};



// COMPLETE MODULE
exports.completeModule = async (moduleId, userId) => {

  await db.query(
    `INSERT INTO module_progress
     (user_id, module_id, completed)
     VALUES (?, ?, 1)
     ON DUPLICATE KEY UPDATE completed = 1`,
    [userId, moduleId]
  );

};