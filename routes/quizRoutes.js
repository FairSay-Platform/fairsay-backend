// const express = require("express");
// const router = express.Router();
// const quizController = require("../controllers/quizController");
// const { verifyToken } = require("../middleware/authMiddleware");

// // Admin
// router.post("/", verifyToken, quizController.createQuiz);
// router.post("/:quiz_id/questions", verifyToken, quizController.addQuestion);

// // User
// router.get("/module/:module_id", verifyToken, quizController.getQuiz);
// router.post("/:quiz_id/submit", verifyToken, quizController.submitQuiz);

// module.exports = router;