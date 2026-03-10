const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

// get notifications
router.get("/", verifyToken, notificationController.getNotifications);

// create notification
router.post("/", verifyToken, notificationController.createNotification);

// mark one as read
router.patch("/:id/read", verifyToken, notificationController.markAsRead);

// mark all as read
router.patch("/read-all", verifyToken, notificationController.markAllAsRead);

module.exports = router;