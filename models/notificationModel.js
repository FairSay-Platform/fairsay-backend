const db = require("../config/db");

const Notification = {

  getByUserId: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  },

  create: async (user_id, title, description) => {
    const [result] = await db.query(
      "INSERT INTO notifications (user_id, title, description) VALUES (?, ?, ?)",
      [user_id, title, description]
    );
    return result;
  },

  markAsRead: async (id) => {
    const [result] = await db.query(
      "UPDATE notifications SET is_read = true WHERE id = ?",
      [id]
    );
    return result;
  },

  markAllAsRead: async (userId) => {
    const [result] = await db.query(
      "UPDATE notifications SET is_read = true WHERE user_id = ?",
      [userId]
    );
    return result;
  }

};

module.exports = Notification;