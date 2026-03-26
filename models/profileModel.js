
// const db = require("../config/db");

// const updateUserProfile = async (userId, data) => {

//   const {
//     job_title,
//     department,
//     company_name,
//     phone,
//     location
//   } = data;

//   const [rows] = await db.execute(
//     "SELECT id FROM user_profiles WHERE user_id = ?",
//     [userId]
//   );

//   if (rows.length > 0) {

//     await db.execute(
//       `UPDATE user_profiles 
//        SET job_title=?, department=?, company_name=?, phone=?, location=? 
//        WHERE user_id=?`,
//       [job_title, department, company_name, phone, location, userId]
//     );

//   } else {

//     await db.execute(
//       `INSERT INTO user_profiles 
//        (user_id, job_title, department, company_name, phone, location) 
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [userId, job_title, department, company_name, phone, location]
//     );

//   }

//   // flag profile completed
//   await db.execute(
//     `UPDATE users
//      SET profile_completed = TRUE
//      WHERE id = ?`,
//     [userId]
//   );

// };

// module.exports = { updateUserProfile };



// models/userModel.js
const db = require("../config/db");

const updateUserProfile = async (userId, data) => {
  const { job_title, department, company_name, phone, location } = data;

  // Check if a profile already exists
  const [rows] = await db.execute(
    "SELECT id FROM user_profiles WHERE user_id = ?",
    [userId]
  );

  if (rows.length > 0) {
    // Update existing profile
    await db.execute(
      `UPDATE user_profiles 
       SET job_title=?, department=?, company_name=?, phone=?, location=? 
       WHERE user_id=?`,
      [job_title, department, company_name, phone, location, userId]
    );
  } else {
    // Insert new profile
    await db.execute(
      `INSERT INTO user_profiles 
       (user_id, job_title, department, company_name, phone, location) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, job_title, department, company_name, phone, location]
    );
  }

  // Update profile_completed flag in users table
  await db.execute(
    `UPDATE users
     SET profile_completed = TRUE
     WHERE id = ?`,
    [userId]
  );

  // Return the full updated user object
  const [userRows] = await db.execute(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.email_verified,
            u.profile_completed, u.verification_submitted, u.verification_status,
            u.course_completed, u.lessons_completed,
            up.job_title, up.department, up.company_name, up.phone, up.location
     FROM users u
     LEFT JOIN user_profiles up ON up.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );

  return userRows[0];
};

module.exports = { updateUserProfile };