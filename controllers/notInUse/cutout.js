// from learningController




// // // controllers/lessonController.js
// // const db = require("../config/db");

// // // -------------------
// // // GET USER LEARNING STATE
// // // -------------------
// // const getLearningState = async (req, res) => {
// //   const userId = req.user.id;

// //   try {
// //     // Lessons completed
// //     const [lessons] = await db.query(
// //       "SELECT course_slug, lesson_number FROM user_lesson_progress WHERE user_id = ? AND completed = TRUE",
// //       [userId]
// //     );

// //     // Quiz status
// //     const [quizzes] = await db.query(
// //       "SELECT course_slug, best_score, is_passed, attempts_count FROM user_quiz_status WHERE user_id = ?",
// //       [userId]
// //     );

// //     res.json({ completedLessons: lessons, quizStatuses: quizzes });
// //   } catch (error) {
// //     console.error("Get learning state error:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // -------------------
// // // START / UPDATE LESSON PROGRESS (optional)
// // // -------------------
// // const updateLessonProgress = async (req, res) => {
// //   const { courseSlug, lessonNumber } = req.body;
// //   const userId = req.user.id;

// //   try {
// //     // Insert if not exists
// //     await db.query(
// //       `INSERT IGNORE INTO user_lesson_progress (user_id, course_slug, lesson_number)
// //        VALUES (?, ?, ?)`,
// //       [userId, courseSlug, lessonNumber]
// //     );

// //     res.json({ success: true });
// //   } catch (error) {
// //     console.error("Update lesson progress error:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // -------------------
// // // COMPLETE LESSON
// // // -------------------
// // const completeLesson = async (req, res) => {
// //   const userId = req.user.id;
// //   const { lessonId } = req.params;

// //   try {
// //     // Check if lesson already exists
// //     const [rows] = await db.execute(
// //       `SELECT id, completed FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?`,
// //       [userId, lessonId]
// //     );

// //     if (rows.length > 0) {
// //       if (!rows[0].completed) {
// //         await db.execute(
// //           `UPDATE user_lesson_progress SET completed = TRUE, completed_at = NOW() WHERE id = ?`,
// //           [rows[0].id]
// //         );
// //       }
// //     } else {
// //       await db.execute(
// //         `INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at)
// //          VALUES (?, ?, TRUE, NOW())`,
// //         [userId, lessonId]
// //       );
// //     }

// //     // Update total completed lessons in users table
// //     const [countRows] = await db.execute(
// //       `SELECT COUNT(*) AS completed_count
// //        FROM user_lesson_progress
// //        WHERE user_id = ? AND completed = TRUE`,
// //       [userId]
// //     );

// //     const lessonsCompleted = countRows[0].completed_count;

// //     await db.execute(
// //       `UPDATE users SET lessons_completed = ? WHERE id = ?`,
// //       [lessonsCompleted, userId]
// //     );

// //     res.json({
// //       message: "Lesson marked as completed",
// //       lessons_completed: lessonsCompleted,
// //       lesson_id: lessonId
// //     });
// //   } catch (error) {
// //     console.error("Complete lesson error:", error);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };

// // // -------------------
// // // SUBMIT QUIZ
// // // -------------------
// // const submitQuiz = async (req, res) => {
// //   const { courseSlug, score } = req.body;
// //   const userId = req.user.id;
// //   const PASS_MARK = 70;

// //   try {
// //     const isPassed = score >= PASS_MARK;

// //     await db.query(
// //       `INSERT INTO user_quiz_status 
// //         (user_id, course_slug, best_score, is_passed, attempts_count, last_attempt_at) 
// //        VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
// //        ON DUPLICATE KEY UPDATE 
// //          attempts_count = attempts_count + 1,
// //          best_score = GREATEST(best_score, ?),
// //          is_passed = IF(best_score >= ? OR ? >= ?, true, false),
// //          last_attempt_at = CURRENT_TIMESTAMP`,
// //       [userId, courseSlug, score, isPassed, score, PASS_MARK, score, PASS_MARK]
// //     );

// //     res.json({ success: true, isPassed });
// //   } catch (error) {
// //     console.error("Submit quiz error:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // module.exports = {
// //   getLearningState,
// //   updateLessonProgress,
// //   completeLesson,
// //   submitQuiz
// // };






// const db = require("../config/db");

// // -------------------
// // GET USER LEARNING STATE
// // -------------------
// const getLearningState = async (req, res) => {
//   const userId = req.user.id;
//   try {
//     const [lessons] = await db.query(
//       "SELECT course_slug, lesson_number FROM user_lesson_progress WHERE user_id = ? AND completed = TRUE",
//       [userId]
//     );

//     const [quizzes] = await db.query(
//       "SELECT course_slug, best_score, is_passed, attempts_count FROM user_quiz_status WHERE user_id = ?",
//       [userId]
//     );

//     res.json({ completedLessons: lessons, quizStatuses: quizzes });
//   } catch (error) {
//     console.error("Get learning state error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // -------------------
// // START / UPDATE LESSON PROGRESS (optional)
// // -------------------
// const updateLessonProgress = async (req, res) => {
//   const { courseSlug, lessonNumber } = req.body;
//   const userId = req.user.id;

//   try {
//     await db.query(
//       `INSERT IGNORE INTO user_lesson_progress (user_id, course_slug, lesson_number)
//        VALUES (?, ?, ?)`,
//       [userId, courseSlug, lessonNumber]
//     );

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Update lesson progress error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // -------------------
// // COMPLETE LESSON
// // -------------------
// const completeLesson = async (req, res) => {
//   const userId = req.user.id;
//   const { lessonId } = req.params;

//   try {
//     // Check if lesson exists
//     const [rows] = await db.execute(
//       `SELECT id, completed FROM user_lesson_progress WHERE user_id = ? AND lesson_id = ?`,
//       [userId, lessonId]
//     );

//     if (rows.length > 0) {
//       if (!rows[0].completed) {
//         await db.execute(
//           `UPDATE user_lesson_progress SET completed = TRUE, completed_at = NOW() WHERE id = ?`,
//           [rows[0].id]
//         );
//       }
//     } else {
//       await db.execute(
//         `INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at)
//          VALUES (?, ?, TRUE, NOW())`,
//         [userId, lessonId]
//       );
//     }

//     // Update lessons_completed in users table
//     const [countRows] = await db.execute(
//       `SELECT COUNT(*) AS completed_count FROM user_lesson_progress WHERE user_id = ? AND completed = TRUE`,
//       [userId]
//     );

//     const lessonsCompleted = countRows[0].completed_count;

//     await db.execute(
//       `UPDATE users SET lessons_completed = ? WHERE id = ?`,
//       [lessonsCompleted, userId]
//     );

//     res.json({
//       message: "Lesson marked as completed",
//       lessons_completed: lessonsCompleted,
//       lesson_id: lessonId
//     });
//   } catch (error) {
//     console.error("Complete lesson error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------
// // SUBMIT QUIZ
// // -------------------
// const submitQuiz = async (req, res) => {
//   const { courseSlug, score } = req.body;
//   const userId = req.user.id;
//   const PASS_MARK = 70;

//   try {
//     const isPassed = score >= PASS_MARK;

//     await db.query(
//       `INSERT INTO user_quiz_status 
//         (user_id, course_slug, best_score, is_passed, attempts_count, last_attempt_at) 
//        VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
//        ON DUPLICATE KEY UPDATE 
//          attempts_count = attempts_count + 1,
//          best_score = GREATEST(best_score, ?),
//          is_passed = IF(best_score >= ? OR ? >= ?, true, false),
//          last_attempt_at = CURRENT_TIMESTAMP`,
//       [userId, courseSlug, score, isPassed, score, PASS_MARK, score, PASS_MARK]
//     );

//     res.json({ success: true, isPassed });
//   } catch (error) {
//     console.error("Submit quiz error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   getLearningState,
//   updateLessonProgress,
//   completeLesson,
//   submitQuiz
// };






// from learningRoutes

// // // const express = require("express");
// // // const router = express.Router();
// // // const learningController = require("../controllers/learningController");

// // // // courses
// // // router.get("/courses", learningController.getCourses);

// // // // modules in a course
// // // router.get("/courses/:slug/modules", learningController.getModulesByCourse);

// // // // module content
// // // router.get("/modules/:id", learningController.getModuleContent);

// // // // module quiz
// // // router.get("/modules/:id/quiz", learningController.getQuiz);

// // // // submit quiz
// // // router.post("/quizzes/:id/submit", learningController.submitQuiz);

// // // // mark module complete
// // // router.post("/modules/:id/complete", learningController.completeModule);

// // // module.exports = router;


// // const express = require("express");
// // const router = express.Router();

// // const learningController = require("../controllers/learningController");

// // // ===============================
// // // COURSES
// // // ===============================

// // // Get all courses
// // router.get("/courses", learningController.getCourses);

// // // Get modules in a course
// // router.get("/courses/:slug/modules", learningController.getModulesByCourse);


// // // ===============================
// // // MODULES
// // // ===============================

// // // Get module content
// // router.get("/modules/:id", learningController.getModuleContent);

// // // Mark module complete
// // router.post("/modules/:id/complete", learningController.completeModule);


// // // ===============================
// // // QUIZ
// // // ===============================

// // // Get quiz for module
// // router.get("/modules/:id/quiz", learningController.getQuiz);

// // // Submit quiz answers
// // router.post("/quizzes/:id/submit", learningController.submitQuiz);


// // module.exports = router;




// // const express = require("express");
// // const router = express.Router();

// // const verifyToken = require("../middleware/authMiddleware");
// // const { getLearningState, updateLessonProgress, submitQuiz } = require("../controllers/learningController");

// // console.log("Lesson routes loaded");

// // router.post("/progress", verifyToken, updateLessonProgress); 
// // router.get("/state", verifyToken, getLearningState);
// // router.post("/quiz", verifyToken, submitQuiz);

// // module.exports = router;


// const express = require("express");
// const router = express.Router();
// const {
//   getLearningState,
//   updateLessonProgress,
//   completeLesson,
//   submitQuiz
// } = require("../controllers/learningController"); // ✅ match your file name

// const { authMiddleware } = require("../middleware/authMiddleware");
// const verifyToken = require("../middleware/authMiddleware");

// // Get all user learning info
// router.get("/state", verifyToken, getLearningState);

// // Track lesson started / in progress (optional)
// router.post("/progress", verifyToken, updateLessonProgress);

// // Mark lesson completed
// router.post("/:lessonId/complete", verifyToken, completeLesson);

// // Submit quiz
// router.post("/quiz", verifyToken, submitQuiz);

// module.exports = router;



// from AI AbortController

// const OpenAI = require("openai");
// require("dotenv").config();

// // Hugging Face / OpenAI client
// const client = new OpenAI({
//   baseURL: "https://router.huggingface.co/v1",
//   apiKey: process.env.HUGGINGFACE_API_KEY,
// });

// // FAIR SAY USER GUIDE knowledge base
// const fairsayUserGuide = `
// FAIR SAY USER GUIDE
// How to Use the FairSay Platform

// Welcome to FairSay.
// Where we help employees in small and medium-sized enterprise (SMEs) and startups safely escalate unresolved workplace issues.

// Below is a simple step-by-step guide to help you use our platform.

// 1. Create Your Account
// New User:
//   1. Click Sign Up
//   2. Enter your email address
//   3. Create a secure password
//   4. Verify your email
//   5. Complete your profile
// Returning User:
//   • Click Sign In
//   • Enter your email and password

// 2. How to Complete Your Profile & Employee Verification
// To protect the integrity of the platform, you will be asked to:
//   • Provide your job role and department
//   • Enter your company name
//   • Input your phone number (optional)
//   • Confirm your work Location (optional)
// Ensure all information is accurate before proceeding.

// 3. Employee Verification
// After completing your profile, proceed to verification:
//   • Submit a self-declaration confirming current employment
//   • Upload proof of employment (offer letter, staff ID, official email, or payslip)
// Why this matters:
//   Verification ensures complaints are genuine and prevents misuse

// 4. Learn About Your Workplace Rights (Education Hub)
// Before submitting a complaint, FairSay encourages you to understand your rights:
//   • Wage & Hours Rights
//   • Discrimination Laws and Protections
//   • Workplace Harassment Awareness
//   • Retaliation Protection
//   • Proper Complaint Filing procedures
// You may be required to complete a short educational module before submitting a complaint.

// 5. Decide: Internal Reporting First
// FairSay encourages internal reporting where safe and appropriate.
// You will be asked: "Have you reported this issue internally?"
// If Yes:
//   • Upload proof (email, screenshot, etc.)
// If No:
//   • System guides you on internal reporting first
// Exception:
//   • Where leadership is involved or you fear retaliation, you may escalate directly

// 6. Submit a Complaint
// When ready:
//   1. Select complaint type (or describe your issue)
//   2. Provide a detailed description
//   3. Upload supporting evidence
//   4. Choose:
//     • Identified submission
//     • Anonymous submission (Drop-and-Go)

// 7. For Whistleblowing: Anonymous Drop-and-Go Option
// If you choose anonymity:
//   • Your identity will not be visible
//   • You will receive a tracking ID
//   • Follow-up communication may be limited
// This protects users who fear retaliation.
// `;

// const chatWithAI = async (req, res) => {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ error: "Message is required" });

//     const response = await client.chat.completions.create({
//       model: "meta-llama/Meta-Llama-3-8B-Instruct",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are FairSay AI, a workplace assistant.

// STRICT RULES:
// - Only answer based on the FairSay User Guide provided below.
// - Keep answers concise, clear, and supportive.
// - Use bullet points if needed.
// - Never provide advice outside this guide.
// - Focus on helping users navigate FairSay safely.

// FAIR SAY USER GUIDE:
// ${fairsayUserGuide}
// `,
//         },
//         { role: "user", content: message },
//       ],
//       max_tokens: 400,
//     });

//     const reply = response.choices[0].message.content;
//     res.json({ reply });
//   } catch (error) {
//     console.error("AI Error:", error.message);
//     res.status(500).json({ error: "AI request failed" });
//   }
// };

// module.exports = { chatWithAI };
