const db = require('../config/db');

// USER SUBMIT VERIFICATION
const saveEmployeeVerification = async ({ userId, declaration, proofUrl, consentData, consentPrivacy }) => {
  await db.execute(
    `INSERT INTO employee_verifications
      (user_id, declaration, document_path, consent_data, consent_privacy, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())
     ON DUPLICATE KEY UPDATE
       declaration = VALUES(declaration),
       document_path = VALUES(document_path),
       consent_data = VALUES(consent_data),
       consent_privacy = VALUES(consent_privacy),
       status = 'pending',
       updated_at = NOW()`,
    [userId, declaration, proofUrl, consentData, consentPrivacy]
  );

  // Update users table to flag as submitted
  await db.execute(
    `UPDATE users
     SET verification_submitted = TRUE
     WHERE id = ?`,
    [userId]
  );

  return true;
};

// ADMIN APPROVE USER
const approveUser = async (userId, superAdminId, notes = null) => {

  await db.execute(
    `UPDATE employee_verifications
     SET status = 'approved',
         reviewed_by = ?,
         reviewed_at = NOW(),
         notes = ?
     WHERE user_id = ?`,
    [superAdminId, notes, userId]
  );

  // flag user as verified
  await db.execute(
    `UPDATE users
     SET is_verified = TRUE
     WHERE id = ?`,
    [userId]
  );

};


// ADMIN REJECT USER
const rejectUser = async (userId, superAdminId, notes = null) => {

  await db.execute(
    `UPDATE employee_verifications
     SET status = 'rejected',
         reviewed_by = ?,
         reviewed_at = NOW(),
         notes = ?
     WHERE user_id = ?`,
    [superAdminId, notes, userId]
  );

  // ensure user is NOT verified
  await db.execute(
    `UPDATE users
     SET is_verified = FALSE
     WHERE id = ?`,
    [userId]
  );

};

module.exports = {
  saveEmployeeVerification,
  approveUser,
  rejectUser
};