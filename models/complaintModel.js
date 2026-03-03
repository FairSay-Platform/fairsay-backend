const db = require("../config/db");

const complaintModel = {
  // whistleblower report submission
submitWhistleblowerReport: async (connection, userId, trackingId, data) => {
  const query = `
    INSERT INTO complaints (
      user_id, tracking_id, violation_category, title, description, 
      date_of_incident, location, status, current_step, 
      is_submitted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted', 5, NOW())
  `;
  const params = [
    userId,
    trackingId,
    data.violationType, 
    `Anonymous Report: ${data.violationType}`,
    data.description,
    data.dateOccurred || null,
    data.location || null
  ];
  const [result] = await connection.execute(query, params);
  return result.insertId;
},


  // STEP 1: Create Draft
  createDraft: async (userId, data) => {
    const query = `INSERT INTO complaints (user_id, violation_category, title, description, status, current_step) VALUES (?, ?, ?, ?, 'draft', 1)`;
    const [result] = await db.execute(query, [userId, data.violation_category, data.title, data.description]);
    return result;
  },

  // STEP 2: Update Details
  updateStep2Data: async (id, data) => {
    const query = `UPDATE complaints SET date_of_incident = ?, time_of_incident = ?, location = ?, current_step = 2 WHERE id = ?`;
    const [result] = await db.execute(query, [data.date_of_incident, data.time_of_incident, data.location, id]);
    return result;
  },

  // STEP 3: Add Parties
  addParties: async (complaintId, partiesArray) => {
    const values = partiesArray.map(p => [complaintId, p.name, p.job_title, p.department, p.is_witness || 0]);
    const query = `INSERT INTO complaint_parties (complaint_id, name, job_title, department, is_witness) VALUES ?`;
    const [result] = await db.query(query, [values]);
    return result;
  },

  addEvidence: async (executor, complaintId, fileUrl, fileType, description) => {
  const query = `
    INSERT INTO complaint_evidence
    (complaint_id, file_url, file_type, description)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await executor.execute(query, [
    complaintId,
    fileUrl,
    fileType,
    description
  ]);

  return result;
},

  // // STEP 4: Add Evidence URLs
  // addEvidence: async (complaintId, fileUrl, fileType, description) => {
  //   const query = `INSERT INTO complaint_evidence (complaint_id, file_url, file_type, description) VALUES (?, ?, ?, ?)`;
  //   const [result] = await db.execute(query, [complaintId, fileUrl, fileType, description]);
  //   return result;
  // },

  getComplaintById: async (id) => {
  const query = `SELECT * FROM complaints WHERE id = ?`;
  const [rows] = await db.execute(query, [id]);
  return rows[0];
},


  // STEP 5: Transactional Helpers (Using specific connection)
  getComplaintByIdForUpdate: async (connection, id) => {
    const [rows] = await connection.execute("SELECT * FROM complaints WHERE id = ? FOR UPDATE", [id]);
    return rows[0];
  },

  markComplaintSubmitted: async (connection, id, trackingId) => {
  await connection.execute(
    `
    UPDATE complaints
    SET 
      status = 'submitted',
      tracking_id = ?,
      current_step = 5,
      submitted_at = NOW()
    WHERE id = ?
    `,
    [trackingId, id]
  );
},


  

  // markComplaintSubmitted: async (connection, id, trackingId) => {
  //   await connection.execute(
  //     `UPDATE complaints 
  //      SET is_submitted = 1, tracking_id = ?, status = 'submitted', current_step = 5, submitted_at = NOW() 
  //      WHERE id = ?`,
  //     [trackingId, id]
  //   );
  // },

  insertStatusHistory: async (connection, complaintId, userId, status) => {
    await connection.execute(
      "INSERT INTO complaint_status_history (complaint_id, status, changed_by) VALUES (?, ?, ?)",
      [complaintId, status, userId]
    );
  }
};


module.exports = complaintModel;
