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
// const findUserByEmail = async (email) => {
//   const [rows] = await db.execute(
//     "SELECT * FROM users WHERE email = ?",
//     [email]
//   );
//   return rows[0];
// };

const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    `
    SELECT 
      u.*,
      ev.status AS verification_status
    FROM users u
    LEFT JOIN employee_verifications ev
      ON ev.user_id = u.id
    WHERE u.email = ?
    `,
    [email]
  );

  return rows[0];
};


const findUserById = async (id) => {
  const [rows] = await db.execute(
    `
    SELECT 
      u.*,
      ev.status AS verification_status
    FROM users u
    LEFT JOIN employee_verifications ev
      ON ev.user_id = u.id
    WHERE u.id = ?
    `,
    [id]
  );

  return rows[0];
};



// VERIFY EMAIL
const verifyUserEmail = async (token) => {
  const [rows] = await db.execute(
    "SELECT id FROM users WHERE email_verification_token = ? AND email_verification_expires > NOW()",
    // "SELECT id, email_verification_expires FROM users WHERE email_verification_token = ?",
    [token]
  );

  if (!rows[0]) return null;

  // const user = rows[0].id;
  const userId = rows[0].id

  // if (new Date(user.email_verification_expires) < new Date()) {
  //   return null;
  // }

  await db.execute(
    `UPDATE users 
     SET email_verified = TRUE, 
         email_verification_token = NULL,
         email_verification_expires = NULL 
     WHERE id = ?`,
    //  [user.id]
    [userId]
    // [rows[0].id]
  );

  // return rows[0];
  // return user;
  return { id: userId }
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
  updatePassword,
  verifyUserEmailById
};
