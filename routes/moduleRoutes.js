// // const express = require("express");
// // const router = express.Router();
// // const moduleController = require("../controllers/moduleController");
// // const { verifyToken } = require("../middleware/authMiddleware");
// // const { checkModuleAccess } = require("../middleware/enforcementMiddleware");

// // router.post("/", verifyToken, moduleController.createModule);

// // router.get("/:module_id",
// //   verifyToken,
// //   checkModuleAccess,
// //   (req, res) => {
// //     res.json({ message: "Module content accessible" });
// //   }
// // );

// // module.exports = router;

// // use the above for production

// const express = require("express");
// const router = express.Router();
// const moduleModel = require("../models/moduleModel");

// // GET modules by course ID (no auth for testing)
// router.get("/course/:courseId", async (req, res) => {
//   try {
//     const modules = await moduleModel.getModulesByCourse(req.params.courseId);
//     res.json(modules);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;