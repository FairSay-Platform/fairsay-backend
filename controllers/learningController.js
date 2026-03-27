const db = require("../config/db");

// -------------------
// GET USER LEARNING STATE
// -------------------
const getLearningState = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get completed lessons
    const [lessons] = await db.query(
      "SELECT lesson_id, course_slug, lesson_number, completed_at FROM user_lesson_progress WHERE user_id = ? AND completed = TRUE",
      [userId]
    );

    // Get quiz status
    const [quizzes] = await db.query(
      "SELECT course_slug, best_score, is_passed, attempts_count, last_attempt_at FROM user_quiz_status WHERE user_id = ?",
      [userId]
    );

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    res.json({ completedLessons: lessons, quizStatuses: quizzes });
  } catch (error) {
    console.error("Get learning state error:", error);
    res.status(500).json({ error: error.message });
  }
};

// -------------------
// START / UPDATE LESSON PROGRESS 
// -------------------
const updateLessonProgress = async (req, res) => {
  const { courseSlug, lessonNumber, lessonId } = req.body;
  const userId = req.user.id;

  try {
    if (!lessonId || !courseSlug || !lessonNumber) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    await db.query(
      `INSERT IGNORE INTO user_lesson_progress (user_id, course_slug, lesson_number, lesson_id)
       VALUES (?, ?, ?, ?)`,
      [userId, courseSlug, lessonNumber, lessonId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Update lesson progress error:", error);
    res.status(500).json({ error: error.message });
  }
};

// -------------------
// COMPLETE LESSON
// -------------------
const completeLesson = async (req, res) => {
  const userId = req.user.id;
  // const lessonId = parseInt(req.params.lessonId);
  const lessonId = req.params.lessonId; // KEEP AS STRING

  const { courseSlug, lessonNumber } = req.body; 
  console.log("BODY:", req.body);

  try {
    const [rows] = await db.execute(
      `SELECT id, completed FROM user_lesson_progress 
       WHERE user_id = ? AND lesson_id = ?`,
      [userId, lessonId]
    );

    if (rows.length > 0) {
      if (!rows[0].completed) {
        await db.execute(
          `UPDATE user_lesson_progress 
           SET completed = TRUE, completed_at = NOW() 
           WHERE id = ?`,
          [rows[0].id]
        );
      }
    } else {
      await db.execute(
        `INSERT INTO user_lesson_progress 
        (user_id, lesson_id, course_slug, lesson_number, completed, completed_at)
         VALUES (?, ?, ?, ?, TRUE, NOW())`,
        [userId, lessonId, courseSlug, lessonNumber]
      );
    }

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS completed_count
       FROM user_lesson_progress
       WHERE user_id = ? AND completed = TRUE`,
      [userId]
    );

    const lessonsCompleted = countRows[0].completed_count;

    await db.execute(
      `UPDATE users SET lessons_completed = ? WHERE id = ?`,
      [lessonsCompleted, userId]
    );

    res.json({
      message: "Lesson marked as completed",
      lessons_completed: lessonsCompleted,
      lesson_id: lessonId
    });

  } catch (error) {
    console.error("Complete lesson error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------
// SUBMIT QUIZ
// -------------------
const submitQuiz = async (req, res) => {
  const { courseSlug, score } = req.body;
  const userId = req.user.id;
  const PASS_MARK = 70;

  try {
    console.log("QUIZ BODY:", req.body); // 👈 debug

    if (!courseSlug || score === undefined) {
      return res.status(400).json({
        message: "Missing courseSlug or score"
      });
    }

    const isPassed = score >= PASS_MARK;

    await db.query(
      `INSERT INTO user_quiz_status 
        (user_id, course_slug, best_score, is_passed, attempts_count, last_attempt_at) 
       VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE 
         attempts_count = attempts_count + 1,
         best_score = GREATEST(best_score, ?),
         is_passed = IF(best_score >= ? OR ? >= ?, true, false),
         last_attempt_at = CURRENT_TIMESTAMP`,
      [userId, courseSlug, score, isPassed, score, PASS_MARK, score, PASS_MARK]
    );

    res.json({ success: true, isPassed });

  } catch (error) {
    console.error("Submit quiz error:", error);

    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  getLearningState,
  updateLessonProgress,
  completeLesson,
  submitQuiz
};