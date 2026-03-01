const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, updateProfile, forgotPassword, resetPassword, } = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
// const { verifyUser } = require("../controllers/authController"); 

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);

router.put("/profile", verifyToken, updateProfile);

// // Super Admin only example
// router.put(
//   "/admin/verify-user/:userId",
//   verifyToken,                        // JWT middleware
//   roleMiddleware("super_admin"),    // Only super admin can access
//   verifyUser                          // Controller function to verify user
// );

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);




module.exports = router;