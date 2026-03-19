const db = require("../../config/db"); // adjust if your path is different

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.execute(
      `SELECT module_id, completed 
       FROM module_progress 
       WHERE user_id = ?`,
      [userId]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching progress"
    });
  }
};
