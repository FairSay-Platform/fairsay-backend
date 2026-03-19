const db = require("../../config/db");

const completeModule = async (userId, moduleId) => {

  const query = `
    INSERT INTO module_progress (user_id, module_id, completed, completed_at)
    VALUES (?, ?, 1, NOW())
    ON DUPLICATE KEY UPDATE
    completed = 1,
    completed_at = NOW()
  `;

  const [result] = await db.execute(query, [
    userId,
    moduleId
  ]);

  return result;
};

module.exports = {
  completeModule
};