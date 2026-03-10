const Notification = require("../models/notificationModel");

exports.getNotifications = async (req, res) => {
  try {

    const userId = req.user.id;

    const notifications = await Notification.getByUserId(userId);

    res.json(notifications);

  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createNotification = async (req, res) => {
  try {

    const { user_id, title, description } = req.body;

    await Notification.create(user_id, title, description);

    res.status(201).json({
      message: "Notification created"
    });

  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.markAsRead = async (req, res) => {
  try {

    const { id } = req.params;

    await Notification.markAsRead(id);

    res.json({
      message: "Notification marked as read"
    });

  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.markAllAsRead = async (req, res) => {
  try {

    const userId = req.user.id;

    await Notification.markAllAsRead(userId);

    res.json({
      message: "All notifications marked as read"
    });

  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};