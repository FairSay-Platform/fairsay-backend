// const db = require("../config/db");

// const saveEmployeeVerification = async ({ userId, declaration, proofUrl, consentData, consentPrivacy }) => {
//   return await db.execute(
//     `INSERT INTO employee_verifications
//       (user_id, declaration, document_path, consent_data, consent_privacy, status, created_at, updated_at)
//      VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())
//      ON DUPLICATE KEY UPDATE
//        declaration = VALUES(declaration),
//        document_path = VALUES(document_path),
//        consent_data = VALUES(consent_data),
//        consent_privacy = VALUES(consent_privacy),
//        status = 'pending',
//        updated_at = NOW()`,
//     [userId, declaration, proofUrl, consentData, consentPrivacy]
//   );
// };


// const approveUser = async (userId, superAdminId, notes = null) => {
//   return await db.execute(
//     `INSERT INTO employee_verifications
//       (user_id, status, reviewed_by, reviewed_at, notes)
//      VALUES (?, 'approved', ?, NOW(), ?)
//      ON DUPLICATE KEY UPDATE
//        status = 'approved',
//        reviewed_by = VALUES(reviewed_by),
//        reviewed_at = NOW(),
//        notes = VALUES(notes)`,
//     [userId, superAdminId, notes]
//   );
// };

// const rejectUser = async (userId, superAdminId, notes = null) => {
//   return await db.execute(
//     `INSERT INTO employee_verifications
//       (user_id, status, reviewed_by, reviewed_at, notes)
//      VALUES (?, 'rejected', ?, NOW(), ?)
//      ON DUPLICATE KEY UPDATE
//        status = 'rejected',
//        reviewed_by = VALUES(reviewed_by),
//        reviewed_at = NOW(),
//        notes = VALUES(notes)`,
//     [userId, superAdminId, notes]
//   );
// };

// module.exports = { saveEmployeeVerification, approveUser, rejectUser };
