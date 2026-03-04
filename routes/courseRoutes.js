// const express = require("express");
// const router = express.Router();
// const courseController = require("../controllers/courseController");
// const { verifyToken } = require("../middleware/authMiddleware");

// router.post("/", verifyToken, courseController.createCourse);
// router.get("/", verifyToken, courseController.getAllCourses);
// router.get("/:id", verifyToken, courseController.getCourse);
// // router.put("/:id", verifyToken, courseController.updateCourse);
// // router.delete("/:id", verifyToken, courseController.deleteCourse);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { getCourses } = require("../controllers/courseController");

router.get("/", getCourses);

module.exports = router;
