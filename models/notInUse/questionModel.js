const db = require("../../config/db");

// Add Question to Quiz
const addQuestion = async (
  quiz_id,
  question,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option
) => {
  const [result] = await db.execute(
    `INSERT INTO questions 
    (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      quiz_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
    ]
  );

  return result.insertId;
};

// Get Questions by Quiz
const getQuestionsByQuiz = async (quiz_id) => {
  const [rows] = await db.execute(
    "SELECT id, question, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?",
    [quiz_id]
  );

  return rows;
};

// Get Correct Answers (for grading)
const getCorrectAnswers = async (quiz_id) => {
  const [rows] = await db.execute(
    "SELECT id, correct_option FROM questions WHERE quiz_id = ?",
    [quiz_id]
  );

  return rows;
};

module.exports = {
  addQuestion,
  getQuestionsByQuiz,
  getCorrectAnswers,
};