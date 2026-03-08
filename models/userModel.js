const db = require("../config/db");

// Create user
const createUser = async (
  first_name,
  last_name,
  email,
  hashedPassword,
  role = "user",
  emailToken = null,
  tokenExpiry = null
) => {
  const [result] = await db.execute(
    `INSERT INTO users 
     (first_name, last_name, email, password_hash, role, email_verification_token, email_verification_expires) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, hashedPassword, role, emailToken, tokenExpiry]
  );

  return result;
};

// Find user by email
const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

// FIND USER BY ID
const findUserById = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};


// VERIFY EMAIL
const verifyUserEmail = async (token) => {
  const [rows] = await db.execute(
    "SELECT id, email_verification_expires FROM users WHERE email_verification_token = ?",
    [token]
  );

  if (!rows[0]) return null;

  const user = rows[0];

  if (new Date(user.email_verification_expires) < new Date()) {
    return null;
  }

  await db.execute(
    `UPDATE users 
     SET email_verified = TRUE, 
         email_verification_token = NULL,
         email_verification_expires = NULL 
     WHERE id = ?`,
     [user.id]
    // [rows[0].id]
  );

  // return rows[0];
  return user;
};


const updateVerificationToken = async (userId, token, expiry) => {

  await db.execute(
    `UPDATE users
     SET email_verification_token = ?,
         email_verification_expires = ?
     WHERE id = ?`,
    [token, expiry, userId]
  );

};




// Update last login
const updateLastLogin = async (userId) => {
  await db.execute(
    "UPDATE users SET last_login_at = NOW() WHERE id = ?",
    [userId]
  );
};


// Update user profile
const updateUserProfile = async (userId, profileData) => {
  const { job_title, department, company_name, phone, location } = profileData;

  await db.execute(
    `UPDATE users SET
      job_title = ?, 
      department = ?, 
      company_name = ?, 
      phone = ?, 
      location = ?, 
      profile_completed = TRUE
    WHERE id = ?`,
    [job_title, department, company_name, phone, location, userId]
  );
};

const upsertUserProfile = async (userId, profileData) => {
  const { job_title, department, company_name, phone, location } = profileData;

  await db.execute(
    `INSERT INTO user_profiles 
      (user_id, job_title, department, company_name, phone, location)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       job_title = VALUES(job_title),
       department = VALUES(department),
       company_name = VALUES(company_name),
       phone = VALUES(phone),
       location = VALUES(location)`,
    [userId, job_title, department, company_name, phone, location]
  );
};



// // Approve user (Super Admin)
// const approveUser = async (userId, superAdminId) => {
//   // Check if a verification record already exists
//   const [existing] = await db.execute(
//     "SELECT id FROM admin_user_verifications WHERE user_id = ?",
//     [userId]
//   );

//   if (existing.length > 0) {
//     // Update existing record
//     await db.execute(
//       `UPDATE admin_user_verifications
//        SET status = 'approved',
//            reviewed_at = NOW(),
//            reviewed_by = ?
//        WHERE user_id = ?`,
//       [superAdminId, userId]
//     );
//   } else {
//     // Insert new record
//     await db.execute(
//       `INSERT INTO admin_user_verifications
//          (user_id, status, reviewed_at, reviewed_by)
//        VALUES (?, 'approved', NOW(), ?)`,
//       [userId, superAdminId]
//     );
//   }
// };


const updatePassword = async (userId, hashedPassword) => {
  await db.execute(
    "UPDATE users SET password_hash = ? WHERE id = ?",
    [hashedPassword, userId]
  );
};

// Auto verify email by userId (for password reset)
const verifyUserEmailById = async (userId) => {
  await db.execute(
    `UPDATE users 
     SET email_verified = TRUE, 
         email_verification_token = NULL 
     WHERE id = ?`,
    [userId]
  );
};



module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  verifyUserEmail,
  updateVerificationToken,
  updateLastLogin,
  updateUserProfile,
  updatePassword,
  verifyUserEmailById
};
