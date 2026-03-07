const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, updateProfile, forgotPassword, resetPassword, resendVerificationEmail, } = require("../controllers/authController");

const verifyToken = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);


router.put("/profile", verifyToken, updateProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);




module.exports = router;