// const express = require("express");
// const router = express.Router();
// const learningController = require("../controllers/learningController");

// // courses
// router.get("/courses", learningController.getCourses);

// // modules in a course
// router.get("/courses/:slug/modules", learningController.getModulesByCourse);

// // module content
// router.get("/modules/:id", learningController.getModuleContent);

// // module quiz
// router.get("/modules/:id/quiz", learningController.getQuiz);

// // submit quiz
// router.post("/quizzes/:id/submit", learningController.submitQuiz);

// // mark module complete
// router.post("/modules/:id/complete", learningController.completeModule);

// module.exports = router;


const express = require("express");
const router = express.Router();

const learningController = require("../controllers/learningController");

// ===============================
// COURSES
// ===============================

// Get all courses
router.get("/courses", learningController.getCourses);

// Get modules in a course
router.get("/courses/:slug/modules", learningController.getModulesByCourse);


// ===============================
// MODULES
// ===============================

// Get module content
router.get("/modules/:id", learningController.getModuleContent);

// Mark module complete
router.post("/modules/:id/complete", learningController.completeModule);


// ===============================
// QUIZ
// ===============================

// Get quiz for module
router.get("/modules/:id/quiz", learningController.getQuiz);

// Submit quiz answers
router.post("/quizzes/:id/submit", learningController.submitQuiz);


module.exports = router;