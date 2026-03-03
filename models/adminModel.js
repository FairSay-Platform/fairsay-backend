const db = require("../config/db");

// Get complaint by ID
exports.getComplaintById = async (complaintId) => {
  const [rows] = await db.execute(
    "SELECT * FROM complaints WHERE id = ?",
    [complaintId]
  );
  return rows[0];
};

// Update assignment + status
exports.assignComplaint = async (complaintId, assignedTo) => {
  await db.execute(
    `UPDATE complaints
     SET assigned_to = ?, status = 'under_review', updated_at = NOW()
     WHERE id = ?`,
    [assignedTo, complaintId]
  );
};

// Update complaint status
exports.updateStatus = async (complaintId, newStatus) => {
  await db.execute(
    `UPDATE complaints
     SET status = ?, updated_at = NOW()
     WHERE id = ?`,
    [newStatus, complaintId]
  );
};

// Insert report
exports.insertReport = async (complaintId, userId, report) => {
  await db.execute(
    `INSERT INTO complaint_reports
     (complaint_id, investigator_id, report)
     VALUES (?, ?, ?)`,
    [complaintId, userId, report]
  );
};

// Get assigned complaints
exports.getAssignedComplaints = async (userId) => {
  const [rows] = await db.execute(
    `SELECT * FROM complaints
     WHERE assigned_to = ?
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

// Get all complaints (Super Admin)
exports.getAllComplaints = async () => {
  const [rows] = await db.execute(
    `SELECT * FROM complaints
     ORDER BY created_at DESC`
  );
  return rows;
};

// Dashboard stats
exports.getDashboardStats = async (role, userId) => {
  let query = `
    SELECT 
      COUNT(*) as total,
      SUM(status = 'submitted') as submitted,
      SUM(status = 'under_review') as under_review,
      SUM(status = 'investigation') as investigation,
      SUM(status = 'resolved') as resolved,
      SUM(status = 'rejected') as rejected
    FROM complaints
  `;

  let params = [];

  if (role !== "super_admin") {
    query += " WHERE assigned_to = ?";
    params.push(userId);
  }

  const [rows] = await db.execute(query, params);
  return rows[0];
};

