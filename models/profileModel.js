
const db = require("../config/db");

const updateUserProfile = async (userId, data) => {

  const {
    job_title,
    department,
    company_name,
    phone,
    location
  } = data;

  const [rows] = await db.execute(
    "SELECT id FROM user_profiles WHERE user_id = ?",
    [userId]
  );

  if (rows.length > 0) {

    await db.execute(
      `UPDATE user_profiles 
       SET job_title=?, department=?, company_name=?, phone=?, location=? 
       WHERE user_id=?`,
      [job_title, department, company_name, phone, location, userId]
    );

  } else {

    await db.execute(
      `INSERT INTO user_profiles 
       (user_id, job_title, department, company_name, phone, location) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, job_title, department, company_name, phone, location]
    );

  }

  // flag profile completed
  await db.execute(
    `UPDATE users
     SET profile_completed = TRUE
     WHERE id = ?`,
    [userId]
  );

};

module.exports = { updateUserProfile };