// const express = require("express");
// const router = express.Router();
// const { courseProgress } = require("../controllers/userController");
// const verifyToken = require("../middleware/authMiddleware");


// router.patch("/progress",verifyToken, courseProgress);
// module.exports = router;


const express = require("express");
const router = express.Router();

const {getUserProgress} = require("../controllers/progressController");
const verifyToken = require("../../middleware/authMiddleware");

router.get("/", verifyToken, getUserProgress);

module.exports = router;