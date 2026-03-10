const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");

// get notifications
router.get("/", notificationController.getNotifications);

// create notification
router.post("/", notificationController.createNotification);

// mark one as read
router.patch("/:id/read", notificationController.markAsRead);

// mark all as read
router.patch("/read-all", notificationController.markAllAsRead);

module.exports = router;