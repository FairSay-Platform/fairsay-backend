const express = require("express");
const router = express.Router();
const {
  getLearningState,
  updateLessonProgress,
  completeLesson,
  submitQuiz
} = require("../controllers/learningController");
const { authMiddleware } = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/authMiddleware");
// Get all user learning info
router.get("/state", verifyToken, getLearningState);

// Track lesson started / in progress 
router.post("/progress", verifyToken, updateLessonProgress);

// Mark lesson completed
router.post("/:lessonId/complete", verifyToken, completeLesson);

// Submit quiz
router.post("/quiz", verifyToken, submitQuiz);

module.exports = router;