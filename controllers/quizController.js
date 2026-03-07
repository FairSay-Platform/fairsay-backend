// const quizModel = require("../models/quizModel");
// const questionModel = require("../models/questionModel");
// const db = require("../config/db");

// // Create Quiz for Module
// const createQuiz = async (req, res) => {
//   try {
//     const { module_id, pass_mark } = req.body;

//     const quizId = await quizModel.createQuiz(module_id, pass_mark);

//     res.status(201).json({
//       message: "Quiz created",
//       quiz_id: quizId,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Add Question
// const addQuestion = async (req, res) => {
//   try {
//     const { quiz_id } = req.params;

//     const {
//       question,
//       option_a,
//       option_b,
//       option_c,
//       option_d,
//       correct_option,
//     } = req.body;

//     const id = await questionModel.addQuestion(
//       quiz_id,
//       question,
//       option_a,
//       option_b,
//       option_c,
//       option_d,
//       correct_option
//     );

//     res.status(201).json({
//       message: "Question added",
//       question_id: id,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get Quiz Questions (For User)
// const getQuiz = async (req, res) => {
//   try {
//     const { module_id } = req.params;

//     const quiz = await quizModel.getQuizByModule(module_id);

//     if (!quiz)
//       return res.status(404).json({ message: "Quiz not found" });

//     const questions = await questionModel.getQuestionsByQuiz(quiz.id);

//     res.json({
//       quiz_id: quiz.id,
//       pass_mark: quiz.pass_mark,
//       questions,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Submit Quiz
// const submitQuiz = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { quiz_id } = req.params;
//     const { answers } = req.body;

//     const correctAnswers = await questionModel.getCorrectAnswers(quiz_id);

//     let score = 0;

//     correctAnswers.forEach((q) => {
//       const userAnswer = answers[q.id];
//       if (userAnswer === q.correct_option) score++;
//     });

//     const percentage = Math.round(
//       (score / correctAnswers.length) * 100
//     );

//     const [quizRow] = await db.execute(
//       "SELECT pass_mark FROM quizzes WHERE id = ?",
//       [quiz_id]
//     );

//     const pass_mark = quizRow[0].pass_mark;
//     const passed = percentage >= pass_mark;

//     await db.execute(
//       "INSERT INTO quiz_attempts (user_id, quiz_id, score, passed) VALUES (?, ?, ?, ?)",
//       [userId, quiz_id, percentage, passed]
//     );

//     res.json({
//       score: percentage,
//       passed,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   createQuiz,
//   addQuestion,
//   getQuiz,
//   submitQuiz,
// };